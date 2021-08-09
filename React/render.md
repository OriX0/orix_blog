## react的render

### 前置知识

1. 了解[更新时候的生命周期](React/lifeCycle.md?id=生命周期实例-源码角度)
2. 了解[diff算法的分治原则](React/virtual&diff.md?id=react的diff算法的优化策略-分治方式)
3. 了解[ jsx 到底是什么](React/antoher?id=jsx)

### 组件创建fiber两种逻辑

#### 1-render

调用render函数 ，根据返回的`JSX`创建新的`fiber`

#### 2- bailout

**当满足一定条件时，react判断该组件更新前后没有发生变化，复用该组件在上一次更新的`fiber `为本次`fiber `**,当不能进行bailout，就进行render

### bailout的4个条件（同时满足）

#### 1-oldProps===newProps

- 这里进行的是全等比较

- 如果返回的是`JSX` 则一定会触发更新   因为JSX本质是React.createElement 会返回一个对象

> 如果用了`PureComponent`或`Memo`，不会判断`oldProps`与`newProps`是否全等，而是会对`props`内每个属性进行浅比较。

#### 2- context没有变化

如果嵌套与context中，`context`的`value`没有变化

#### 3- 更新前后的fiber 类型没有变化

- 比如 `div`是否变为`p`标签（这里要先明确 fiber的 分治原则）
- 源码中的判断 ` workInProgress.type === current.type `

#### 4- 当前`fiber`上不存在更新

- 前置理解  更新时候的生命周期

### 实例

> code

```jsx
function Son() {
  console.log('child render!');
  return <div>Son</div>;
}


function Parent(props) {
  const [count, setCount] = React.useState(0);

  return (
    <div onClick={() => {setCount(count + 1)}}>
      count:{count}
      {props.children}
    </div>
  );
}


function App() {
  return (
    <Parent>
      <Son/>
    </Parent>
  );
}

const rootEl = document.querySelector("#root");
ReactDOM.render(<App/>, rootEl);
```

> 结果： Parent会render   son不会render

#### 分析

>FiberRootNode---整个应用的根节点  
>
>RootFiber--调用ReactDOM.render创建的fiber
>
>App fiber

##### 更新开始-处理根节点  深度优先遍历

- `FiberRootNode`和`RootFilber` 这两个节点 都符合 **bailout的4个条件** 
-  `App fiber`走的也是  `bailout`逻辑 

##### 遍历到-Parent 部分

- App fiber 先返回了 Parent fiber,然后`props`也是走的bailout逻辑给到parent fiber的
- 但是由于 parent上有更新   不满足 bailout的 第四个条件 
- 所以parent 走render逻辑

##### 遍历到-Son部分 ---关键

这里注意 `Son`的调用形式为 `Parent`组件的  `{props.children}`,是直接从props中去获取

props又是 `App fiber`走`bailout`逻辑后传入的

那么 Son 满足了`bailout`的所有条件，所以不会`render`。

#### 什么情况下 son也会render呢

> parent改成如下代码

```jsx
function Parent() {
  const [count, setCount] = React.useState(0);

  return (
    <div onClick={() => {setCount(count + 1)}}>
      count:{count}
    </div>
  );
}
```

##### 那么再按照刚刚的分析 走到Son的时候

Son 是 `<Son/>` 会被编译成`React.createElement(Son, null)`然后执行返回JSX,props改变，那么 bailout 的第一个条件也就不满足了

