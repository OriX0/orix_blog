## useContext更佳实践

### 错误前置处理

> 处理 未包裹在provider内部 直接使用context的情况

#### :chestnut:栗子

createContext 没有默认值  所以为 `undefined`

```js
const demoConetxt = React.createContext()

function useDemo(){
  const context = React.useContext(demoConetxt);
    if(context ===undefined){
		throw new Error('必须在Provider中使用useDemo')
    }
   return context;
}
```

### 基本使用
#### :chestnut:栗子

[**实例代码**](https://codesandbox.io/s/wizardly-carson-m93is?file=/src/Count/index.js)

> /Count/count-context.js
>
> - 创建provider
> - 创建useXXX

```jsx
const CountContext = React.createContext();

functon CountProvider({children}){
  const [counter, setCounter] = useState(0);
  const value = {
    counter,
    setCounter,
    increment: () => setCounter(counter + 1),
    decrement: () => setCounter(counter - 1)
  } 
  return <CountContext.provider value={value}>{childern}</CountContext.provider>
}

function useCount(){
const context = React.useContext(CountContext);
  if (context === undefined) {
    throw new Error('必须在CountProvider内使用useCount');
  }
  return context;
}
```

> Count/index.js

```jsx
import { CountPorvider, useCount } from "./count-context";

export function CountDemo() {
  const { counter, increment, decrement } = useCount();
  // 页面部分
  return (
    <div style={{ width: "200px", margin: "auto" }}>
      <div style={{ width: "40px", margin: "100px auto", fontSize: "40px" }}>
        {counter}
      </div>
      <button onClick={increment}>递增</button>
      <button onClick={decrement}>递减</button>
    </div>
  );
}
export default () => (
  <CountPorvider>
    <CountDemo />
  </CountPorvider>
);
```

#### 该实例不足点

- counter的值变化后 让 `Counter`（显示值的） 和 负责触发 组件变化的 递增递减 都重新渲染了
- 其实 只负责触发 组件变化的 （递增递减） 不需要重新渲染

### state和dispatch分离

#### 好处

- 减少了不必要的渲染
- 拓展更灵活
  - 需要更多state  可以拓展为 useReducer
  - 需要更多的dispatch   拓展dispatch方法

#### :chestnut:栗子

[**实例代码**](https://codesandbox.io/s/wizardly-carson-m93is?file=/src/CountSeparation/index.js)

- 将 储存state值的 和更改state值的dispatch方法分离成两个context

> CountSeparation/context.js
>
> - 分别创建context
> - 创建provider
> - 创建useXxx

```jsx
import { useContext, createContext, useState } from "react";

const CountStateContext = createContext();
const CountDispatchContext = createContext();

export function CountProvider({ children }) {
  const [counter, setCounter] = useState(0);
  const dispatchValue = {
    increment: () => setCounter(counter + 1),
    decrement: () => setCounter(counter - 1)
  };
  return (
    <CountStateContext.Provider value={counter}>
      <CountDispatchContext.Provider value={dispatchValue}>
        {children}
      </CountDispatchContext.Provider>
    </CountStateContext.Provider>
  );
}
export function useCountState() {
  const context = useContext(CountStateContext);
  if (context === undefined) {
    throw new Error("必须在CountProvider内使用useCountState");
  }
  return context;
}
export function useCountDispatch() {
  const context = useContext(CountDispatchContext);
  if (context === undefined) {
    throw new Error("必须在CountProvider内使用useCountDispatch");
  }
  return context;
}

```

>CountSeparation/index.js

```jsx
import { CountProvider, useCountDispatch, useCountState } from "./context";

function CountDisplay() {
  const counter = useCountState();
  return (
    <div style={{ width: "40px", margin: "100px auto", fontSize: "40px" }}>
      {counter}
    </div>
  );
}

function CountChange() {
  const { increment, decrement } = useCountDispatch();
  return (
    <>
      <button onClick={increment}>递增</button>
      <button onClick={decrement}>递减</button>
    </>
  );
}

export default () => (
  <CountProvider>
    <CountDisplay />
    <CountChange />
  </CountProvider>
);
```

