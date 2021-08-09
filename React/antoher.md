
## UI = Fn(state) 核心公式

#### state 计算状态变化---在react中就是  reconcile（diff）算法

#### fn  渲染器 ---常用的就是 react DOM渲染器

### 状态更新流程：

- （diff算法）计算出状态变化【render阶段  render函数这个时候调用】
- 将状态变化渲染到视图中 【commit函数 只是类比为 git commit 】

## 性能优化

##### react默认   父组件有更新 子组件则无条件也更新

### shouldComponentUpdate   （SCU）

#### 参数

- nextProps
- nextState

#### 特点

- 需要的时候才使用 才进行优化
- 必须配合不可变值使用
- 设计时 state的层级不宜过深  然后SCU的时候 进行浅层比较 节约性能

### PureComponent（类组件）和React.memo（函数组件）

相当于重写了SCU ，在SCU中实现了浅比较

### immutable

基于共享数据（不是深拷贝） 速度比较好

## jsx 

##### 1.降低了学习成本（用html标签语法构建虚拟dom），也提升了研发效率和体验

##### 2.通过Babel 编译 从而在js中生效

##### 3.本质是 React.createElement这个 JavaScript 调用的语法糖

##### createElement做了什么----对数据进行格式化

##### 拓展问题：为什么不直接使用React.createElement

- 当元素稍微多一些后 JSX代码更为简洁，而且代码结构层次更为清晰

## fiber

### 打补丁过程

- reconciliation 阶段---执行diff算法 纯js计算
- commit阶段---将diff结果渲染DOM

### fiber优化部分

- 将reconciliation 部分做一个切片拆分  将大的更新任务拆分成许多个小任务 （比如V8垃圾回收的增量回收也是如此）

	- 执行完一个小任务 就把主线程交回去给到渲染
	- 实现了可打断

- DOM渲染时暂停 空闲时恢复 （ window.requestIdleCallback该api可以告知是否需要渲染）

## react 其他常见面试题

### 问react是什么

#### 概念

- 是一个网页UI框架 本质是一个组件化框架 （通过组件化的方式解决视图层开发复用的问题）

#### 用途

#### 核心技术思路

1. 声明式 编程  ---直观，方便组合
2. 组件化  ---视图的拆分和模块复用
3. 通用性 ---适用范围广   React Native，React 360

#### 一些缺点

- 没有提供一揽子解决方案 需要自己进行相应的选型及学习，学习成本相对高一些

### 组件之间如何通讯

1. 父子组件  props
2. 自定义事件
3. context   父--->子孙
4. 其他状态管理组件

### react和vue的区别

#### 相同

- 组件化
- 数据驱动视图
- 都使用虚拟DOM

#### 区别

- React 使用JSX   Vue使用模板
- React 函数式编程  Vue声明式



## 杂-比较容易的部分

### 类组件中  this关键字的处理

1.  事先绑定this  通过bind函数  this.xxxFn = this.xxxFn.bind(this)
2.  静态方法   箭头函数的方式  fn=()=>{}
3.  render函数中绑定this  不推荐（每次刷新都会生成一个函数）
4.  箭头函数调用  不推荐 () => this.handleClick1()(每次都会生成新的箭头函数)

### 组件公共逻辑的抽离--比较

#### HOC （模式简单 会增加组件层级）

- 概念  和高阶函数一样  给组件赋予新的功能
- 传入一个组件  进行业务或者赋予功能后 返回一个新的组件 （透传并通过props将处理后的值或者函数传给子组件）
- react-redux 的connect也是高阶组件  react router 也采用HOC的模式

#### render props  （灵活  但是难以阅读）

- 在props中传递一个函数 （这个函数返回一个 组件）  并将要传递的数据放在参数中传递过去 在子组件需要调用该组件的时候 调用该函数

#### custom hook

- 原理 闭包
- 优点

  - 逻辑容易提取
  - 易于组合
  - 可读性强
  - 没有名字冲突

- 缺点

  - 只能在组件顶层使用  只能在组件中使用

### 函数组件

- 纯函数  输入prps  输出JSX
- 没有实例  没有生命周期 没有state   不能扩展其他方法

### 非受控组件

#### 实际操作特点

- 设置值    state做默认初始值   （defalutValue   defalutChecked）
- 取值    ref + 手动操作DOM

####   使用场景

1. 文件上传
2. 手动操作DOM
3. 富文本编辑器

#### 受控组件

- 自行监听onChange 更新state

### Prortals--将组件渲染到父组件以外

#### 使用

`ReactDOM.createPortal(渲染的jsx元素,要渲染到哪里去)`

#### 场景

1. 父组件 z-index太小
2. fixed 放到body第一层级
3. overflow:hidden

#### 组件懒加载(异步组件)

#### 1.lazy

lazy方法包装需要进行lazy操作的组件

- 一般包装 import  导入的语句 从而实现懒加载

  - const componentName = React.lazy(()=>import(path))

#### 2.Suspense

Suspense组件 指定如果懒加载失败或者懒加载中的 展示的组件 并对路由进行包裹

- 参数fallback里面设置一个用于加载时候的组件 可以导入 也可以直接写  如果是外部组件 切记不能用懒加载导入

  ```
    <Suspense fallback={<h1>loading.....</h1>}>
    <Route>....（需要懒加载的组件）</Route>
    </Suspense> 
  ```


#### 场景

- 路由懒加载