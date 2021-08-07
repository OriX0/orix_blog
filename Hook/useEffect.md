
## 整体前置概念

### react 源码分块

1. 调度器：调度更新
2. 协调器：决定更新的内容---**给需要更新的内容对应的 fiber（虚拟 dom）打上标记**
3. 渲染器：将更新的内容渲染到视图中---**执行渲染视图操作**

### 协调器的工作流程

基于遍历实现的递归-- 分为 递和归

- **递**---根节点向下一直到叶子节点
- **归**---叶子节点一路向上到根节点

### 渲染相关工作原理--页面渲染后异步执行

1. 构建 `effectList`
2. 遍历 `effectList` 找到**所有**包含 更新标记的 `fiber`
3. 依次执行 对应的 useEffect 的`destroy`
4. **所有**`destroy`执行完后，再依次执行**所有**`create`

## useEffect

### 工作原理

1. **协调器** ---触发更新时，函数组件`FunctionComponent`执行
2. 执行到 `useEffect`时 判断他 依赖项`deps` 是否有变化
3. 如果 依赖项`deps` 有变化，则对应的 函数组件的`fiber` 打上 需要执行 useEffect 的标记（`passive`）,被打上标记的`fiber`会**形成一条链表** `effectList`
4. **渲染器**---遍历 `effectList`，遍历到 该`fiber`，发现了需要执行的 useEffect 的标记（`passive`）
   1. 执行 该 useEffect 的 destroy （就是 useEffect 回调函数的返回的函数）
   2. 执行 该 useEffect 的 create 函数 （就是 useEffect 回调函数）

### 关于`effectList`

#### 构建阶段

发生在递归的 **归**阶段，所以`effectList`的顺序也是从叶子节点一路向上。

#### useLayoutEffect

和`useEffect`的区别 渲染完成后同步执行

