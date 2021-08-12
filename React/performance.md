### 贯彻思路

1. 编码之前思考
2. 编码中代码思考，以及借用工具分析
3. 打包再次处理

### 性能分析工具

1. 开发者工具 Performance
2. React (Profiler)[https://zh-hans.reactjs.org/docs/profiler.html] 

### 性能改进方案

#### PureComponents/React.memo

详细原理可以参考 [react 什么时候render](React/render?id=_1-oldpropsnewprops)

#### ShouldComponentUpdate

#### 善用React.useMemo

1. 缓存耗时计算的结果
2. 由于返回或者新建的是 对象类型导致的render

#### 合理使用 React.useCallback

1. 返回或新建的是    函数类型 导致的render  
2. 调用某个函数的 组件本身比较昂贵

#### 谨慎使用context

1. Context 完全没有任何方案可以避免无用的渲染
2. Context 只放置必要的，关键的，被大多数组件所共享的状态。
3. 对非常昂贵的组件，建议在父级获取 Context 数据，通过 props 传递进来。

#### 小心使用Redux等方案

##### 精细化依赖

##### 源数据不可变

避免直接操作redux源数据

