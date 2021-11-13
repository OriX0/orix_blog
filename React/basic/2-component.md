## 2-component

### 组件和常规函数和类的关系

> UI + update + 常规的类和函数 = React 组件 

- 组件本质上就是类和函数。（所以函数和类的特性在react组件上同样具有，比如原型链，继承，静态属性等）

- 组件还承载了 渲染识图的UI和更新视图的setState、useState等方法。

  

### 类组件和函数组件的本质区别

- 对于类组件来说，底层**只需**要实例化**一次**，实例中保存了组件的 state 等状态。对于每一次更新**只需要**调用 **render 方法**以及**对应**的**生命周期**就可以了。

- 在函数组件中，**每一次**更新都是一次新的函数执行，一次函数组件的更新，里面的**变量会重新声明**。

### 类组件


#### 定义

- 继承于  `React.Component`
  - 执行构造函数的过程中在实例上绑定 `props`和`context`
  - 初始化 置空 `refs`属性
  - 绑定update对象 （实例化后）
- 加入 `update`对象 （组件调用setState和forceUpdate本质就是调用该对象的上的方法）
  - 原型链上绑定 `setState 和forceUpdate`方法

##### 相关源码

```jsx
function Component(props, context, updater) {
  this.props = props;      //绑定props
  this.context = context;  //绑定context
  this.refs = emptyObject; //绑定ref
  this.updater = updater || ReactNoopUpdateQueue; //上面所属的updater 对象
}
/* 绑定setState 方法 */
Component.prototype.setState = function(partialState, callback) {
  this.updater.enqueueSetState(this, partialState, callback, 'setState');
}
/* 绑定forceupdate 方法 */
Component.prototype.forceUpdate = function(callback) {
  this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');
}
```

> 如果没有在constructor的super传递props，接下来的constructor执行上下文中就获取不到props

```jsx
constructor(){
    super()
    console.log(this.props) // 打印 undefined 
}
```

### 组件通信方式

1. props 和 callback 方式
2. ref 方式。
3. React-redux 或 React-mobx 状态管理方式。
4. context 上下文方式。
5. event bus 事件总线。

#### props和callback

父组件 -> 通过自身 state 改变，重新渲染，传递 props -> 通知子组件

子组件 -> 通过调用父组件 props 方法 -> 通知父组件。

#### Ref方式

##### 类组件

- 子-->父
  - 父组件传递callback，子组件调用

- 父---> 子
  - 通过ref获取子组件实例，并调用实例上的方法对子组件的值进行更改

##### 函数组件

- 父--->子
  - forwarRef处理子组件
  - 子组件接收ref，调用 `useImperativeHandle `，生成相应的ref
  - 父组件调用ref中的方法
- 子--->父
  - 父组件传递callback，子组件调用

#### event bus 事件总线

- 优点： 能跨层级
- 缺点：
  - 需要手动解绑
  - 中大型项目使用时，难以维护
  - 违背react数据流向原则



### 组件强化方式

- 类组件继承
  - 可以控制父类render，还可以添加其他的渲染内容
  - 共享父类方法，可以添加额外的方法和属性
  - 问题：state和生命周期会被继承后的组件修改（父类的对应生命周期不执行）
- 自定义hooks
- hoc高阶组件

