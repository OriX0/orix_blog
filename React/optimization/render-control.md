## 前置知识

> 关于 jsx的转换 请配合 [JSX章节](React/basic/1-jsx.md)食用
>
> 关于 为什么render  配合  [何时render章节](React/render.md)食用

### render阶段干了什么

- render函数 
  - 根据一次更新中产生的**新的状态值**，通过`React.createElement`,得到了新的`React element`对象， **新的对象**上 保存着**新的状态值**
  - `React.createElement `产生了**全新**的**props**
- 调和
  - 调和 render函数产生的 `children`，将子代的 `element`转换为`fiber`
  - 将props 变成 `pendingProps `

> 如果 children 是组件 会重复调和这个步骤 直到fiber调和完毕

## 控制render的方案及原理

> 两大类
>
> 1. 从父组件阻隔子组件渲染   
>    - memo  useMemo （缓存组件）
> 2. 从组件自身去控制
>    - PureComponent  （纯组件标识）
>    - shouldComponentUpdate （生命周期控制）

###  shallowEqual 浅比较流程

- 判断新老**props**或 **state**是否**相等**，不相等则不更新组件
- 判断新老**props**或 **state**，是否有 **不是对象**或者为**null**的，如果有 则更新
- 通过 Object.key 获得 新老**props**或 **state**的key属性数组，对比**数组长度** ，不相等就更新
- 遍历新老**props**或 **state**，进行**浅比**较。不相等或者不对应就更新



### useMemo

#### 语法

```jsx
const cacheSomething = useMemo(create,deps)
```

- create   函数
  - 函数的返回值作为缓存值（cacheSomething）
- deps  依赖项数组 
  - 发生变化则重新执行create

#### 原理

useMemo 记录上一次 执行create的返回值，并将返回值绑定在函数组件对应的`fiber`对象上 ,只要组件不销毁，缓存值一直存在。

当在fiber更新调和的阶段，React比对fiber上的新老props，如果相等则跳过本次更新。（用useMemo做了缓存所以相等）

#### 场景

- 缓存 element对象
- 缓存 不想重复计算的一些只
- 缓存  函数和属性 作为 其他hooks的依赖项 或者 PureComponent 的绑定方法

### shouldComponentUpdate 

- shouldComponentUpdate  接收三个参数 
  - newProp
  - newState
  - newContext 
- 配合 `immutable.js`可解决 props是引用类型 无法直接比较是否相等的问题

### PureComponet

#### 浅比较规则 参考shallowEqual 



#### 原理

- 当组件继承于pureComponent的时候，原型链上会有`isPureReactComponent`属性

  - ```jsx
    // react/src/ReactBaseClasses.js
    
    pureComponentPrototype.isPureReactComponent = true;
    ```

- 在更新组件的 `updateClassInstance`函数中的 `checkShouldComponentUpdate`(专门用于检查是否更新的函数) 会用到 `isPureReactComponent `属性

  - ```jsx
    // react/react-reconciler/ReactFiberClassComponent.js
    function checkShouldComponentUpdate(){
         if (typeof instance.shouldComponentUpdate === 'function') {
             return instance.shouldComponentUpdate(newProps,newState,nextContext)  /* shouldComponentUpdate 逻辑 */
         } 
        if (ctor.prototype && ctor.prototype.isPureReactComponent) {
            return  !shallowEqual(oldProps, newProps) || !shallowEqual(oldState, newState)
        }
    }
    ```

  - isPureReactComponent  判断当前是否为纯组件，如果是纯组件就进行浅比较

#### 注意事项

##### 权重

shouldComponentUpdate 的权重大于 PureComponent

##### 关于组件的props

如果props中有非基本类型，应避免**每次都是新生成的**(比如callback函数用行内的箭头行数)。如果每次都是新生成的，那么，PureComponent会失效。

###### 类组件例子

> 将值提出行内，在外部声明

```jsx
class Index extends React.PureComponent{}

export default class Father extends React.Component{
    render=()=> <Index callback={()=>{}}   />
}
  
```

###### 函数组件例子

> 使用useCallback 或者useMemo 解决这个问题

```jsx
class Index extends React.PureComponent{}
export default function (){
    const callback = function handerCallback(){};
    return <Index callback={callback}  />
}
```

### memo

#### 语法

```
React.memo(Component,compare)
```

- component  --- 组件
- compare
  - 比较函数  返回**true则组件不渲染** 返回false则组件重新渲染
  - 如果该参数不存在，就用 **浅比较** 处理props（相当于 只处理 props 版的 shallowEqual ）

#### 主要逻辑

- 通过memo的第二个参数，判断是否执行更新
  - 如果没有则浅比较
- 如果判断相等 则当前fiber完成工作，停止向下调和节点，被包裹的组件不在更新

#### 原理

- 被memo包裹的组件，会被打上 `REACT_MEMO_TYPE`的标签

- 在 element 变成 fiber的时候，会标记成 **MemoComponent** 的类型

  - ```jsx
    // react/src/ReactMemo.js
    function memo(type,compare){
      const elementType = {
        $$typeof: REACT_MEMO_TYPE, 
        type,  // 我们的组件
        compare: compare === undefined ? null : compare,  //第二个参数，一个函数用于判断prop，控制更新方向。
      };
      return elementType
    }
    // react-reconciler/src/ReactFiber.js
      case REACT_MEMO_TYPE:
      fiberTag = MemoComponent;
    ```

- 如果是**MemoComponent**类型的fiber，会有单独的`updateMemoComponent `进行处理

  - ```js
    // react-reconciler/src/ReactFiberBeginWork.js
    function updateMemoComponent(){
        if (updateExpirationTime < renderExpirationTime) {
             let compare = Component.compare;
             compare = compare !== null ? compare : shallowEqual //如果 memo 有第二个参数，则用二个参数判定，没有则浅比较props是否相等。
            if (compare(prevProps, nextProps) && current.ref === workInProgress.ref) {
                return bailoutOnAlreadyFinishedWork(current,workInProgress,renderExpirationTime); //已经完成工作停止向下调和节点。
            }
        }
        // 返回将要更新组件,memo包装的组件对应的fiber，继续向下调和更新。
    }
    ```

    



## 关于渲染控制的思考

### 需要控制的场景

> 在正常情况下，无须过分在乎 React 没有必要的渲染

- 含有大量表单的页面
  - 受控组件的形式去管理表单数据层，用户操作表单往往是频繁的，需要频繁的更改数据层
- 靠近 根组件的组件
  - 根组件的渲染会波及整个组件树重新render（浪费性能）
  - 可能会执行 useEffect 或者其他不确定的生命周期（不可控）
- 数据可视化的模块组件（本身承载了大量数据）

### 当使用了context

一旦使用了context，无法阻断context改变带来的渲染穿透。

选择了context就要承担context改变带来的更新作用。

