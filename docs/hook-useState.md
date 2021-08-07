---
id: useState
title: useState核心
---

## 相关hook的完整数据结构

**这里先写出来 后面可以对照着看**

```js
const hook = {
  // hook保存的数据
  memoizedState: null,
  // 指向下一个hook
  next: hookForB
  // 本次更新以baseState为基础计算新的state
  baseState: null,
  // 本次更新开始时已有的update队列
  baseQueue: null,
  // 本次更新需要增加的update队列
  queue: null,
};
```



## fiber节点保存数据

### 每个组件都有对应的用于保存组件信息的 fiber节点

### 获取流程

- 有一个全局变量 `currentlyRenderingFiber`保存着当前处理的fiber节点
- 每次 `FunctionCompoent render`（函数组件render）时,`currentlyRenderingFiber`就变成了当前 `FunctionComponent`对应的 `fiber`节点
- hook 从 `currentlyRenderingFiber`中获取状态信息

## 单向链表让多个hook获取数据

### 多hook的保存（hook调用顺序不能变的原因）

`currentlyRenderingFiber`的`memoizedState`属性保存着`hook `和对应数据的单向链表

- 一个hook的`next`属性 指向下一个hook
- hook的数据保存在`memoizedState`
- 所有的hook 以链表形式保存 连接

### 实例
**code**

```js
function App() {
  // hookA
  const [a, updateA] = useState(0);
  // hookB
  const [b, updateB] = useState(0);
  // hookC
  const ref = useRef(0);
  return <p></p>;
}
```
**内部实现**

```js
const hookA = {
  // hook保存的数据
  memoizedState: null,
  // 指向下一个hook
  next: hookB
  // ...省略其他字段
};

hookB.next = hookC;
currentlyRenderingFiber.memoizedState = hookA;
```

**实例图**

![image-20210806193642045](https://i.loli.net/2021/08/06/N1ZpmSrBVcxgets.png)

## useState

### `dispatchAction`(改变state的方法) 执行解析

`useState`返回值数组第二个参数为**改变state的方法**  源码中叫 `dispatchAction`

#### 每次调用 产生更新对象

```js
const update = {
  // 更新的数据
  action: action,
  // 指向下一个更新
  next: null
};
```

#### 多次调用 连接起来 和多个hook一样

```js
const update = {
  // 更新的数据
  action: 1,
  // 指向下一个更新
  next: update2
  // ...省略其他字段
};
update2.next = update3
```

#### update链表保存在 hook 的 `queue`中

#### 图

![image-20210806195023049](https://i.loli.net/2021/08/06/fhJWwouRvyeFDjP.png)

### 更新流程

#### **在看一眼hook的全部数据结构**

```js
const hook = {
  // hook保存的数据
  memoizedState: null,
  // 指向下一个hook
  next: hookForB
  // 本次更新以baseState为基础计算新的state
  baseState: null,
  // 本次更新开始时已有的update队列
  baseQueue: null,
  // 本次更新需要增加的update队列
  queue: null,
};
```
#### 具体流程
1. 将 要增加的队列（`queue `）   后面的`update`链表剪开
2. 挂载到 已有的队列`baseQueue`的最后面
3. 已有队列`baseQueue`  基于 `baseState`计算 新的state
4. 新的`state` 成为  `memoizedState`

## Tips

### 更新方法`dispatchAction`可以在外部使用

#### 实例

```
const [count,setCount] = useState(0)
```

#### 内部具体实现 通过bind

```js
setCount = dispatchAction.bind(null, currentlyRenderingFiber, queue);
```

## [参考文章]([关于useState的一切 (qq.com)](https://mp.weixin.qq.com/s/TKPcuU3vDlkeZ-LfdZZJJQ))