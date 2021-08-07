## 三大特性

### 1.不可变值

**更新值的时候 不能影响原来的值**

-   state为数组的时候

    - 使用不改变原数组的方案进行操作   （concat   slice map等）

-   state为对象

    - Object.assign() 或  ...操作符

-   如果不遵守不可变值    那 shouldComponentUpdate 可能无法正常运行（即nextProps 和props一直相等）

### 2.可能是异步更新

#### 异步更新

##### 原因-避免频繁的 re-render

###### 原理

联想Event-loop  有一个队列 （专门用来储存setState）  每碰到一个setState，就把它塞进一个队列里攒起来。
等到时机成熟，再把攒起来的state结果做合并，最后只针对最新的state值走一次更新流程。

##### 场景

直接使用

#### 同步更新

##### 原因

setTimeout 让setState 逃离了 React对其的管控

##### 同步更新场景

1. setTimeout、setInterval  等函数
2. 自定义DOM事件

### 可能会被合并

- 对象式更新 被合并（类比用 Object.assign ）
- 函数式更新 不会被合并

## 源码角度

### 前置概念

##### batchingStrategy 对象  用于管控批量更新的对象

可以类比理解为**线程锁**

有一个全局唯一 变量  即 **isBatchingUpdates**  用于保存当前是否处于批量更新过程

  - 该变量初始值为false  当react去执行更新动作时候 设置为true（表明“现在正处于批量更新过程中）
  - 当该变量为 true时，任何需要更新的组件要先暂停进入队列等待 而且不能插队

##### React中的 事务（Transaction）机制

- Transaction 是一个壳子

  1.对目标函数用 wrapper（一组initialize方法+close方法）封装起来  ---- 初始化封装

  2.使用perform 方法去执行他  ----调用方法执行得到相应结果

  3.再执行wrapper   close方法  ---- 关闭封装

- tips

  debug 过程中  看到 initialize、perform、close、closeAll 或者 notifyAll 这样的方法名 说明当前正在一个事务中

## setState工作流

### 1.setState

根据setState（对象式 函数式）的不同方式  分发到不同的功能函数中

- 对象式  enqueueSetState     
- 函数式  enqueueCallback

### 2.enqueueSetState （队列设置状态）

做了什么

- 将新的state放进组件的状态队列里
- 调用  enqueueUpdate 处理将要更新的实例对象

### 3.enquueUpdate（队列更新）

主要判断 核心对象  batchingStrategy  的**isBatchingUpdates**属性是否为false

- 4.若有该属性 直接走更新
- 4.若没有 先把组件塞入队列里面 等待

## 出现同步现象的本质

### isBatchingUpdates  是在同步代码中变化的  

- 在同步代码执行完后该isBatchingUpdates 就变为false（联想 event loop）

- setTimeout 是异步执行的  等到 异步里的 setState  真正发起调用时候 isBatchingUpdates 已经变为false   所以可以立即执行

### batchedUpdates  方法 调用的几个地方

**为了确保每次setState有效** 所以基于开发者的角度去推断那些地方会用到

1. 手动 setState
2. isBatchingUpdates   在 生命周期函数及合成事件执行前  已经被改为true  只有 事务的 close 才能把该属性改为false
   - 当首次渲染（内部调用 batchedUpdates）-- 因为组件在渲染的过程中 会调用生命周期函数（其中可能含有setState 所以提前调用 将值改为true 可以把其他setState推入队列 以便后续调用）
3. 当组件绑定事件后（内部调用 batchedUpdates）---因为事件也有可能触发setState