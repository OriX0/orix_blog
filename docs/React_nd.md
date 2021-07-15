---
id: React_orix
title: React 重难点
---


## UI = Fn(state) 核心公式

#### state 计算状态变化---在react中就是  reconcile（diff）算法

#### fn  渲染器 ---常用的就是 react DOM渲染器

### 状态更新流程：

- （diff算法）计算出状态变化【render阶段  render函数这个时候调用】
- 将状态变化渲染到视图中 【commit函数 只是类比为 git commit 】

## React事件

### React中的event

- 不是原生的event（MouseEvent）  是React封装的 合成事件（SyntheticEvent ）

### 特点

- 可以 阻止默认和冒泡行为
- 所有事件 都被挂在到 document上  和原生及vue都不同

### 合成事件处理流程
#### 原生DOM层

1. 元素 触发事件
2. 事件冒泡到 document

#### 合成事件层
3. Syntheic Event  实例化成统一的react event

#### 事件处理函数

4. dispatchEvent  处理  将event事件给到对应的处理器质性

#### 实例图
![实例处理流程图](https://api2.mubu.com/v3/document_image/497b0427-eca7-4160-b468-8f2069aa8d2f-6942699.jpg)


### 问：为什么需要合成事件机制

- 更好的兼容和跨平台  （脱离原生 自己实现一套逻辑）
- 全部挂在到document上  减少内存消耗 避免频繁解绑 （事件指派原理）
- 方便事件的统一管理  （如事件机制）

## setState （重点）

### 三大特性

#### 不可变值

**更新值的时候 不能影响原来的值**
-   state为数组的时候
	
  - 使用不改变原数组的方案进行操作   （concat   slice map等）
	
- state为对象
	
	- Object.assign() 或  ...操作符
	
- 如果不遵守不可变值    那 shouldComponentUpdate 可能无法正常运行（即nextProps 和props一直相等）

#### 可能是异步更新

##### 为什么异步更新---避免频繁的 re-render
- 更新场景
	- 直接使用
##### 为什么能同步更新  ----setTimeout 让setState 逃离了 React对其的管控
- 更新场景
    - setTimeout、setInterval  等函数
    - 自定义DOM事件
#### 可能会被合并

- 对象式更新 被合并（类比用 Object.assign ）
- 函数式更新 不会被合并

##### 原因  ----避免频繁的 re-render
##### 原理
联想Event-loop  有一个队列 （专门用来储存setState）  每碰到一个setState，就把它塞进一个队列里攒起来。
等到时机成熟，再把攒起来的state结果做合并，最后只针对最新的state值走一次更新流程。

### 理解源码

#### 前置概念

##### batchingStrategy 对象  用于管控批量更新的对象

可以类比理解为线程锁

- 有一个全局唯一 变量  即 **isBatchingUpdates**  用于保存当前是否处于批量更新过程

	- 该变量初始值为false  当react去执行更新动作时候 设置为true（表明“现在正处于批量更新过程中）
	- 当该变量为 true时，任何需要更新的组件要先暂停进入队列等待 而且不能插队

##### React中的 事务（Transaction）机制

- Transaction 是一个壳子

  1.对目标函数用 wrapper（一组initialize方法+close方法）封装起来  ---- 初始化封装

  2.使用perform 方法去执行他  ----调用方法执行得到相应结果

  3.再执行wrapper   close方法  ---- 关闭封装

- tips

  debug 过程中  看到 initialize、perform、close、closeAll 或者 notifyAll 这样的方法名 说明当前正在一个事务中

### setState工作流

#### 1.setState

根据setState（对象式 函数式）的不同方式  分发到不同的功能函数中

- 对象式  enqueueSetState     
- 函数式  enqueueCallback

#### 2.enqueueSetState （队列设置状态）

做了什么

- 将新的state放进组件的状态队列里
- 调用  enqueueUpdate 处理将要更新的实例对象

#### 3.enquueUpdate（队列更新）

主要判断 核心对象  batchingStrategy  的**isBatchingUpdates**属性是否为false

- 4.若有该属性 直接走更新
- 4.若没有 先把组件塞入队列里面 等待

### 出现同步现象的本质

#### isBatchingUpdates  是在同步代码中变化的  

- 在同步代码执行完后该isBatchingUpdates 就变为false（拓展立即 event loop）

- setTimeout 是异步执行的  等到 异步里的 setState  真正发起调用时候 isBatchingUpdates 已经变为false   所以可以立即执行

#### batchedUpdates  方法 调用的几个地方

**为了确保每次setState有效** 所以基于开发者的角度去推断那些地方会用到

1. 手动 setState
2. isBatchingUpdates   在 生命周期函数及合成事件执行前  已经被改为true  只有 事务的 close 才能把该属性改为false
   - 当首次渲染（内部调用 batchedUpdates）-- 因为组件在渲染的过程中 会调用生命周期函数（其中可能含有setState 所以提前调用 将值改为true 可以把其他setState推入队列 以便后续调用）
3. 当组件绑定事件后（内部调用 batchedUpdates）---因为事件也有可能触发setState

## 生命周期（重点）

### 手画  新生命周期

![react生命周期](https://api2.mubu.com/v3/document_image/9e7eb701-226b-4c53-b13a-12f2892d8567-6942699.jpg)

### 生命周期的两个阶段

- componentDidXXX  系列生命周期 + getSnapshotBeforeUpdate
- 其他生命周期都是【render阶段】的

### 生命周期实例 源码角度

#### 树实例（参考 后面两个实例基于这个）---[参考卡颂老师视频](https://www.bilibili.com/video/BV16t4y1r7oJ?from=search&seid=6602041391613664064)

![树实例](https://api2.mubu.com/v3/document_image/78b56103-f3f9-47a7-a015-78714deecdbf-6942699.jpg))

#### 首次渲染生命函数的调用过程

- 调用ReactDOM.render方法
- 进入render阶段
- 深度优先遍历 创建 fiber树

	- 实例过程  执行挂载的【render阶段】生命周期

		- 从根节点ROOT出发 ---先调用根节点的声明周期函数 constructor GDSFP/CWM render
		- 查找子节点  发现第一个子节点P1

			- 调用P1的生命周期函数（constructor GDSFP/CWM render）

		- 查找子节点   发现 P1第一个子节点  C1

			- 调用C1 相应的生命周期函数

		- 查找C1的子节点 没有找到  找C1的兄弟节点  C2

			- 调用C2的相应生命周期函数

		- 查找C2的子节点 没有找到  查找C2的 兄弟节点 没有找到  返回父节点P1
		- 找到 P1的兄弟节点  P2

			- 调用P2的相应生命周期函数

		- 查找P2的兄弟节点和子节点 没找到  那么 创建结束

- 进入commit 阶段

	- 子节点往上（c1->c2->p1->p2->root） 执行挂载的【commit阶段】生命周期 （componentDidMount）

#### 更新声明函数调用过程 （此次更新了C2节点的值）

- 调用 setState 对C2进行修改 并标记
- 进入Render阶段
- 采用深度优先遍历 创建一个fiber树  （每次调用this.setState都会创建一棵树）

	- 跟 首次渲染过程一样  从APP开始--->p1--->C1 (都没有发现相关的更新操作 )  故不执行生命周期函数
	- 找C1的兄弟节点  找到了C2 发现C2有更新

- 标记 找到的变化（reconcile算法）
- 执行C2的生命周期函数
- 进入 Commit 阶段
- 执行  找到的变化  对应的视图操作

### react16更新生命周期的原因

#### Fiber机制下 render阶段是允许暂停、终止和重启的。

这就导致render阶段生命周期可能会被**重复**执行，废弃的生命周期都在render阶段

- 比如说，这件商品单价只要 10 块钱，用户也只点击了一次付款。但实际却可能因为 componentWillxxx 被打断 + 重启多次而多次调用付款接口，最终付了 50 块钱

#### 让生命周期更纯粹可控

## 性能优化（重点）

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

## jsx （重点）

##### 1.降低了学习成本（用html标签语法构建虚拟dom），也提升了研发效率和体验

##### 2.通过Babel 编译 从而在js中生效

##### 3.本质是 React.createElement这个 JavaScript 调用的语法糖

##### createElement做了什么----对数据进行格式化

##### 拓展问题：为什么不直接使用React.createElement

- 当元素稍微多一些后 JSX代码更为简洁，而且代码结构层次更为清晰

## 虚拟dom（重点）

##### 虚拟DOM 本质是 JS和DOM之间的一个映射缓存，是对真实DOM的描述（重点）

### 虚拟DOM的工作流程

#### 挂载阶段

- React结合JSX的描述  构建虚拟DOM树，然后通过ReactDOM.render 实现虚拟DOM到真实DOM的映射

#### 更新阶段

- 虚拟DOM借助算法 对比具体有哪些真实DOM需要被改变，然后根据这些改变作用于（render出）真实DOM

### 为什么需要虚拟DOM

#### 基于历史背景

1. 前端页面重展示阶段 ----js只做辅助交互
2. jquery 时代---dom操作时代  （手动吸尘器）
3. 模板引擎时代（扫地机器人）--- 自动化渲染 基于模板  在性能上表现不尽人意，而且更新的方式是先注销整体再重新渲染
   - 模板引擎处理流程

   	- 数据+模板--->构建真实DOM--->挂载到界面里
4. 虚拟DOM

   - 处理流程

   	- 数据+“模板”（不一定是模板 如JSX）---> 虚拟DOM--->真实DOM--->挂载到界面里

   - 虚拟DOM作为了**缓存层** 实现了**精准**的**差量**更新

### React选择虚拟DOM的原因（重点）

1. 提供更爽、更高效的研发模式（函数式编程的UI编程方式），还有一个不错的性能
2. 容易实现跨平台 成本更低
3. 降低了代码抽象能力，避免人为操作DOM，降低代码风险

### 虚拟DOM 的劣势

1. 更大的JS计算  （它不可避免地涉及递归、遍历等耗时操作）

  - 如果DOM的更新量并不大时，可能性能反而不如其他方案

2. 内存占用较高

## diff算法（重点）

### 核心的过程  

**触发更新--->生成补丁--->应用补丁**

### React的diff算法的优化策略---分治方式

1. 树对比

  - 两株（新旧）虚拟DOM树只对用一层次的节点进行比较，如果发现节点不存在了，不会进一步比较，直接删除该节点几子节点

2. 组件对比

  - 如果组件是同一类型，进行树对比，如果不是 直接放入补丁

3. 元素对比

  - 同层级中，通过标记（tag）或节点（key）操作生成补丁，对比key

### 基于原理开发中的应用

1. 尽量避免跨层级节点移动
2. 设置唯一key进行优化，尽量减少组件层级深度
3. 使用SCU和pureComponment 等手段减少 diff次数

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

## react-redux

### flux框架

#### 严格的单向数据流，变化是可预测且可追溯的

#### 正常流程流

1. 用户与 View 层交互，通过 View发起 一个action，
2. dispatch把这个action派发给store，
3. store处理完毕后通知view

### redux工作流 工作流  （核心---发布与订阅）

### 源码解析

- #### createStore内部逻辑

	1. 参数处理---处理没有传入初始状态的情况
	2. 处理中间件---当有中间件的时候  用中间件对createStore进行包裹
	3. 定义内部变量
	4. 定义方法

	  - 定义一个方法  保证 当前监听和 下一次监听不指向同一个引用
	  - 定义 getState 方法  获取当前状态
	  - 定义subScribe方法  注册listeners（订阅监听函数）
	  - 定义dispatch方法   用于派发action、调用reducer 并出发订阅
	  - 定义 replaceReducer方法    用于替换reducer

	5. 状态初始化---执行dispatch
	6. 定义observable方法
	7. 返回带下划线的方法

- #### dispatch动作---核心  将 action和reducer store串联起来

	1. 接收action对象  并对action进行检查验证
	2. 上锁--- 将**isDispacthing** 设置为true
	3. 调用reducer  计算出新的state
	4. 解锁   设置**isDispacthing**设置为false
	5. 更新完毕  出发订阅
	6. 返回action

- #### redux中subscribe的工作流

	1. subscribe接收一个函数 对函数进行前置验证
	2. 调用在createStore中创建的方法  确保nextListeners 与currentListeners 不指向同一个引用
	3. 注册监听函数  将接收的listener函数 推入nextListeners数组中
	4. 返回取消当前订阅的方法
	5. 有趣的点

	  - 实际工作流中都是nextListeners在工作 ，需要currentListeners是因为他能和正在改变的next数组区分开 保证运行的稳定性 也就是可预测

## react-router

### 路由历史背景

- SPA初期 内容切换后 url不改变 无法定位到

### 路由做了什么事情

1. 拦截用户的刷新操作，避免服务端盲目响应、返回不符合预期的资源内容
2. 感知URL的变化

### 核心组件

1. 路由器   BrowserRouter 和HashRouter  最重要

  - 感受路由的变化并作出反应，它是整个路由系统中最为重要的一环。

2. 路由     Router和Switch
3. 导航      Link NavLink  Redirect

### 路由器

#### BrowserRouter

- html5 的histroy API来控制 （html4的 go back api并不能实现）

	- pushState
	- replaceState

- 监听popstate方法

#### HashRouter

-  URL 的 hash 属性来控制
- js的localtion.hash属性 可以获取到   通过监听 hashChange事件

## react-hook常见面试题

### 问 ：hook设计的初衷

#### 改进React 组件的开发模式（即类组件开发的问题）

1. 组件之间难以复用状态逻辑

  - 不是很复杂的时候 上HOC 或者render pops
  - 如多级组件共享状态 只能上redux或者mobx等相关状态管理的库了

2. 复杂的组件变得难以理解

  - 对于一个事件要在多个生命周期中处理，分散不集中 （比如订阅和取消订阅  添加监听事件和取消监听事件）
  - 一个生命周期里 要处理多个事件

3. this指向问题
4. 类难以做编译优化

### 问：React hook使用的限制是什么？ 为什么有这样的限制

#### 不要在循环、条件或嵌套函数中调用 Hook

- 只要 Hook 的调用顺序在多次渲染之间保持一致，React 就能正确地将内部 state 和对应的 Hook 进行关联
- hook是基于链表实现的  要确保 Hooks 在每次渲染时都保持同样的执行顺序  如果在循环、条件或者嵌套中调用hook会导致取值错位 执行错误的hook
- 实例

	- 在条件语句中使用hook

		- 第一次渲染true 执行
		- 第二次渲染 false 不执行
		- 两次的顺序完全不同

#### 在 React 的函数组件中调用 Hook

- 基于类组件中的this指向问题 所以只能在函数组件中使用

### 问：如何规避错误的使用 hook

使用ESLint  （ESLint 中引入 eslint-plugin-react-hooks）

### 问：谈谈hook的设计模式

- 降低了用户的心智负担 ，以useEffect的方式替代生命周期的方式，一个effect集中处理事件的订阅取消等全套动作，更多聚焦于依赖项

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