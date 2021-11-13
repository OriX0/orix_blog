## props

### props可以是什么

1. 作为数据源，传递给子组件
2. 回调函数，子组件调用通知父组件
3. 一个组件，传递给子组件直接使用
4. 渲染函数
5. render props  放在children属性上
6. 插槽组件 即直接以jsx的形式嵌套于其中

### props的角色

#### 组件层级

- 组件通信
  - 父--->子   作为数据源   子--->父  调用回调
- 传递识图容器

#### 更新机制

- 做为组件是否更新的重要准则
  - PureComponent和memo 是为了优化变化即更新这一机制

#### 插槽

-  React 可以把组件的闭合标签里的插槽，转化成 chidren 属性

### 操作props

- 抽象传入   如直接传入props，不需要指出props中某个属性
- 混入props
- 剥离props    先解构出不需要的吧剩下的restProps传入
- 注入props
  - 显式
  - 隐式    React.cloneElement的方式



