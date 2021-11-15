## 动态加载（懒加载）

`Suspense`+ `React.lazy`

### Suspense

#### 语法

```jsx
<Suspense fallback={处于loading状态时加载的组件}>
        <要加载的异步组件/>
</Suspense>
```

#### 异步渲染的好处

>传统模式：挂载组件-> 请求数据 -> 再渲染组件。
>异步模式：请求数据-> 渲染组件。

- 不需要生命周期或useEffect配合做数据交互
- 代码更清晰

### React.lazy

#### 语法

```jsx
React.lazy(动态调用import的函数 需返回一个promise)
```

### 配合使用好处

- **这样很利于代码分割，不会让初始化的时候加载大量的文件。**
- 允许 **调用 Render => 发现异步请求 => 悬停，等待异步请求完毕 => 再次渲染展示数据**。

### 原理

> Suspense 可以接收Promise，执行Promise并进行渲染
>
> React.lazy利用了这个特性 把绑定好的Promise抛出给到了 Suspense

#### Suspense原理

![image-20211114002938715](http://image.ori8.cn/img/202111140029215.png)

- 为了处理异常，suspense内部用 try catch去捕获。一般异常是一个promise
- suspense 会在内部处理这个promise， promise**结束后** suspense还会**再一次重新render**，把数据渲染出来

#### React.lazy

![image-20211114003303922](http://image.ori8.cn/img/202111140033246.png)

> React.lazy包裹的组件 会被打上 `REACT_LAZY_TYPE`的标记。在调和阶段变成 `LazyComponent`类型的fiber，然后React对于这个类型的fiber进行单独的处理

```jsx
// react/src/ReactLazy.js
function lazy(ctor){
    return {
         $$typeof: REACT_LAZY_TYPE,
         _payload:{
            _status: -1,  //初始化状态
            _result: ctor,
         },
         _init:function(payload){
             if(payload._status===-1){ /* 第一次执行会走这里  */
                const ctor = payload._result;
                const thenable = ctor();
                payload._status = Pending;
                payload._result = thenable;
                thenable.then((moduleObject)=>{
                    const defaultExport = moduleObject.default;
                    resolved._status = Resolved; // 1 成功状态
                    resolved._result = defaultExport;/* defaultExport 为我们动态加载的组件本身  */ 
                })
             }
            if(payload._status === Resolved){ // 成功状态
                return payload._result;
            }
            else {  //第一次会抛出Promise异常给Suspense
                throw payload._result; 
            }
         }
    }
}
```

- 第一次渲染,执行init。
  - 执行lazy的第一个函数，返回一个promise，且该promise的**成功回调**已经**绑定**。**回调里是要渲染的组件**
  - 走下面的判断，由于then是异步的，所以此时state还没改变，所以就**抛出了异常 是一个Promise**（该Promise正是上面处理好的promise）
- 异常被 suspense 捕获
  - suspense处理Promise
    - Promise 执行成功回调得到 defaultExport（将想要渲染组件）
    - suspense发起二次渲染
- 第二次渲染 
  - init 方法已经是 Resolved 成功状态，返回真正渲染的组件

