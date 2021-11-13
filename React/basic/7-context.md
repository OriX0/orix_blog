# 7-context

## 基本语法

### 创建

`React.createContext`

### 提供者

```jsx
const xxxContext = React.createConetxt(null);
// 方式1
const xxxProvider = xxxContext.Provider;
// 方式2
<xxxContext.Provider value={?}>
</xxxContext.Provider>
```

### 消费者

##### 1-contextType -类组件

> 组件上静态属性 contextType 指向要获取的context

```jsx
const ThemeContext = React.createContext(null)
// 类组件 - contextType 方式
class ConsumerDemo extends React.Component{
   render(){
       const { color,background } = this.context
       return <div style={{ color,background } } >消费者</div> 
   }
}
ConsumerDemo.contextType = ThemeContext

const Son = ()=> <ConsumerDemo />
```

##### 2-useContext - 函数组件

> useContext(想要获取的context)

```jsx
const ThemeContext = React.createContext(null)
// 函数组件 - useContext方式
function ConsumerDemo(){
    const  contextValue = React.useContext(ThemeContext) /*  */
    const { color,background } = contextValue
    return <div style={{ color,background } } >消费者</div> 
}
const Son = ()=> <ConsumerDemo />
```

##### 3-Consumer

> xxxContext.Cousumer + render props的形式

```jsx
const ThemeConsumer = ThemeContext.Consumer // 订阅消费者

function ConsumerDemo(props){
    const { color,background } = props
    return <div style={{ color,background } } >消费者</div> 
}
const Son = () => (
    <ThemeConsumer>
       { /* 将 context 内容转化成 props  */ }
       { (contextValue)=> <ConsumerDemo  {...contextValue}  /> }
    </ThemeConsumer>
) 
```

### 其他api

#### displayName

> 便于 React DevTools 来确定context显示的内容

```jsx
const MyContext = React.createContext(/*  */);
MyContext.displayName = 'MyDisplayName';

<MyContext.Provider> // 在 DevTools 中 "MyDisplayName.Provider" 
<MyContext.Consumer> // 在 DevTools 中 "MyDisplayName.Consumer" 
```

## 常见使用

### 动态context

- 使context为可变的 （比如使用state和setState进行变更和传递）

```jsx
import React, { useContext, useState } from "react";

const ThemeContext = React.createContext(null);

function ConsumerDemo() {
  const { color, background } = useContext(ThemeContext);
  return <div style={{ color, background }}>消费者</div>;
}
const Son = React.memo(() => <ConsumerDemo />);

function ProviderDemo() {
  const [contextValue, setContextValue] = useState({
    color: "#fff",
    background: "pink",
  });
  return (
    <div>
      <ThemeContext.Provider value={contextValue}>
        <Son />
      </ThemeContext.Provider>
      <button
        onClick={() => setContextValue({ color: "#fff", background: "blue" })}
      >
        切换主题
      </button>
    </div>
  );
}

```

#### 渲染相关

provider模式下，value改变，所有消费value的组件都会重新渲染

为了**避免中间层渲染** （上面实例中的son）

  1. 利用 memo，pureComponent 对子组件 props 进行浅比较处理。

       - `const Son = React.memo(()=> <ConsumerDemo />)  `

  2. 利用useMemo 把React element对象缓存下来

       - ```jsx
         <ThemeProvider value={ contextValue } >    { React.useMemo(()=>  <Son /> ,[]) } </ThemeProvider>
         ```

### 嵌套provider

> 场景
>
> - 做 state和 dispatch的分离
> - 多全局数据的传递

```jsx
import React, { useState, useContext } from "react";

const countStateContext = React.createContext();
const countDispatchContext = React.createContext();

function CountProvider({ children }) {
  const [count, setCount] = useState(0);
  const dispatch = {
    increment: () => setCount(count + 1),
    decrement: () => setCount(count - 1),
  };
  return (
    <countStateContext.Provider value={count}>
      <countDispatchContext.Provider value={dispatch}>
        {children}
      </countDispatchContext.Provider>
    </countStateContext.Provider>
  );
}

function useCountState() {
  const context = useContext(countStateContext);
  if (context === undefined) {
    throw new Error("必须在provider中使用context");
  }
  return context;
}
function useCountDispatch() {
  const context = useContext(countDispatchContext);
  if (context === undefined) {
    throw new Error("必须在provider中使用context");
  }
  return context;
}

/** 展示count */
function CountDisplay() {
  const counter = useCountState();
  return <div>{counter}</div>;
}
/**修改count */
function CounterChange() {
  const { increment, decrement } = useCountDispatch();
  return (
    <>
      <button onClick={increment}>递增</button>
      <button onClick={decrement}>递减</button>
    </>
  );
}

export default function () {
  return (
    <CountProvider>
      <CountDisplay />
      <CounterChange />
    </CountProvider>
  );
}

```

### 逐层传递Provider

> context value 可在中间层进行修改，下一层的provider会覆盖上一层的
>
> React-redux 中 connect 就是用这个良好特性传递订阅器的

```jsx
import React, { createContext, useContext, useState } from "react";

const ThemeContext = createContext(null);

function Demo() {
  const { color, background } = useContext(ThemeContext);
  return (
    <div style={{ color, background }}>
      <h3>第二层provider</h3>
      <p>第二层 我是蓝色背景+白色字</p>
    </div>
  );
}

function Son() {
  const { color, background } = useContext(ThemeContext);
  const [themeContext2] = useState({ color: "white", background: "blue" });
  return (
    <div style={{ color, background }}>
      <h3>第一层provider</h3>
      <ThemeContext.Provider value={themeContext2}>
        <Demo />
      </ThemeContext.Provider>
    </div>
  );
}

export default function ProviderDemo() {
  const [themeContext] = useState({ color: "orange", background: "pink" });
  return (
    <ThemeContext.Provider value={themeContext}>
      <Son />
    </ThemeContext.Provider>
  );
}
```

