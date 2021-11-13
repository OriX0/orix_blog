# 3-State

> 本小节请配合 setState核心解析 及  useState核心解析一起食用

## 类组件的state--setState

#### 基本语法

```js
setState(obj,callback)
```

##### 参数

1. obj
   - 为一个对象，则为即将合并的 state 
   - 是一个函数，那么当前组件的 state 和 props 将作为参数，返回值用于合并新的 state
2. callback
   - 函数执行上下文中可以获取当前 setState 更新后的最新 state 的值

#### 一次setState底层做了啥

render阶段

1. 产生当前的优先级（expirationTime 或lane） 并计算
2. 从fiber Root向下调和子节点
   1. 对比优先级
   2. 找到发生的更新的组件
   3. 合并state
   4. **触发render，得到新的UI视图** 

**commit阶段**  

1. 替换真实DOM
2. 执行setState的callback函数

#### 限制state更新视图

- 用pureComponment 对state和props进行浅比较
- shouldComponmentUpdate 手动返回是否更新



## 函数组件中的state--useState

#### 基本语法

```jsx
 [ state , dispatch ] = useState(initData)
```

##### 值说明

- state    提供给UI，作为渲染视图的数据源
- dispatch   改变state的函数  推动函数组件渲染的渲染函数
- initData
  - 函数     函数执行返回值作为初始化值
  - 非函数   作为初始化值

#### dispatch

##### 调用

1. 非函数
2. 函数 --- 能拿到最新的state值

#### 更新特点

> 在本次函数执行上下文中 获取不到最新的state值

```jsx
const [ number , setNumber ] = React.useState(0)
const handleClick = ()=>{
    ReactDOM.flushSync(()=>{
        setNumber(2) 
        console.log(number) 
    })
    setNumber(1) 
    console.log(number)
    setTimeout(()=>{
        setNumber(3) 
        console.log(number)
    })   
}
// 0 0 0 
```

#### 关于更新值的处理

会浅比较两次 state ，发现 state 相同，不会开启更新调度任务。



## 更新中的优先级

> flushSync 中的 setState **>** 正常执行上下文中 setState **>** setTimeout ，Promise 中的 setState

### 关于flushSync

- React-dom 提供
- flushSync 可以将**回调函数**中的更新任务，放在一个较高的优先级中。
- flushSync 在同步条件下，会**合并之前**的 setState | useState

### 实例

```jsx
handerClick=()=>{
    /*第三次打印*/
    setTimeout(()=>{
        this.setState({ number: 1  })
    })
    /**第一次优先执行 flushSync 合并上面的2  所以打印3 */
    this.setState({ number: 2  })
    ReactDOM.flushSync(()=>{
        this.setState({ number: 3  })
    })
    /* 第二次执行  所以打印4*/
    this.setState({ number: 4  })
}
render(){
   console.log(this.state.number)
   return ...
}
// 打印  3 4 1   
```



## setState和useState的异同

- 相同点
  - 底层都调用了相同的方法（ scheduleUpdateOnFiber 方法）
  - 都有批量更新的规则
- 不同点
  - 更新值的比较
    -  useState的dispatch会默认比较两次state是否相同。setState不会
  - state值变化的监听
    - setState有callback函数可以监听state变化，useState 只能通过useEffect
  - 底层倾向
    - setState更多的是和老的state进行合并处理
    - useState更倾向于重新赋值

