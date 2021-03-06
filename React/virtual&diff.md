## 虚拟dom

##### 虚拟DOM 本质是 JS和DOM之间的一个映射缓存，是对真实DOM的描述（重点）

### 虚拟DOM的工作流程

#### 挂载阶段

React结合JSX的描述,构建虚拟DOM树

然后通过**ReactDOM.render** 实现虚拟DOM到真实DOM的**映射**

#### 更新阶段

虚拟DOM借助算法，**对比**具体有哪些真实DOM**需要被改变**，然后根据这些改变作用于（render出）真实DOM

### 为什么需要虚拟DOM

#### 基于历史背景

##### 1-前端页面重展示阶段 ----js只做辅助交互

##### 2-jquery 时代---dom操作时代  （手动吸尘器）

##### 3-模板引擎时代（扫地机器人）--- 自动化渲染 基于模板  在性能上表现不尽人意，而且更新的方式是先注销整体再重新渲染

- 模板引擎处理流程

  - 数据+模板--->构建真实DOM--->挂载到界面里

##### 4-虚拟DOM

- 处理流程

  - 数据+“模板”（不一定是模板 如JSX）---> 虚拟DOM--->真实DOM--->挂载到界面里

- 虚拟DOM作为了**缓存层** 实现了**精准**的**差量**更新

### React选择虚拟DOM的原因（重点）

1. 提供更爽、更高效的研发模式（函数式编程的UI编程方式），还有一个不错的性能
2. 容易实现跨平台 成本更低
3. 降低了代码抽象能力，避免人为操作DOM，降低代码风险

### 虚拟DOM 的劣势

1. 更大的JS计算  （它不可避免地涉及递归、遍历等耗时操作）

> 如果DOM的更新量并不大时，可能性能反而不如其他方案

2. 内存占用较高

## diff算法（重点）

### 核心的过程  

**触发更新--->生成补丁--->应用补丁**

### React的diff算法的优化策略---分治方式

#### 树对比

> 两株（新旧）虚拟DOM树只对用一层次的节点进行比较，如果发现节点不存在了，不会进一步比较，直接删除该节点几子节点

#### 组件对比

> 如果组件是同一类型，进行树对比，如果不是 直接放入补丁

#### 元素对比

> 同层级中，通过标记（tag）或节点（key）操作生成补丁，对比key

### 基于原理开发中的应用

1. 尽量避免跨层级节点移动
2. 设置唯一key进行优化，尽量减少组件层级深度
3. 使用SCU和pureComponment 等手段减少 diff次数