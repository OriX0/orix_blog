## 前言

该文章是基于 legacy模式写的

文中的源码已经给到相应的注释了， 如果不愿意看或者产生厌倦心理也没有关系，我总结了相应的中文，重点是能看懂到底做了什么即可，理解实现的机制即可。

## 触发setState后React做了什么

### 流程图

![image-20210815214459154](https://i.loli.net/2021/08/15/UcpGwAYgnuWOiE1.png)

## setState特性

> 在起底源码之前，先来盘点一下setState的几个特性

#### 更新可能是异步

##### 为什么要设计成异步的形式：避免频繁的 re-render

##### 同步更新的场景

1. setTimeout、setInterval ，promise 等异步函数
2. 自定义DOM事件

### 更新可能会被合并

## 起底setState相关源码

### setState工作流

#### 流程图
> 为了几个特性的理解 这里的判断部分先卖个关子

![image-20210815221119760](https://i.loli.net/2021/08/15/jRclIDF36PAgrnQ.png)

> 流程图总结出来了，让我们看看各个函数到底干了啥吧

#### setState做了啥

**充当一个分发器的角色**,根据入参的不同，将其分发到不同的功能函数中去

- 对象式  `enqueueSetState     `
- 函数式  `enqueueCallback`

##### 源码

```js
ReactComponent.prototype.setState = function (partialState, callback) {
  this.updater.enqueueSetState(this, partialState);
  if (callback) {
    this.updater.enqueueCallback(this, callback, 'setState');
  }
};
```

#### enqueueSetState做了啥

1. 将新的state放进组件的状态队列里
2. 调用  `enqueueUpdate `处理将要更新的实例对象

##### 源码

```js
enqueueSetState: function (publicInstance, partialState) {
  // 根据 this 拿到对应的组件实例
  var internalInstance = getInternalInstanceReadyForUpdate(publicInstance, 'setState');
  // 这个 queue 对应的就是一个组件实例的 state 数组
  var queue = internalInstance._pendingStateQueue || (internalInstance._pendingStateQueue = []);
  queue.push(partialState);
  //  enqueueUpdate 用来处理当前的组件实例
  enqueueUpdate(internalInstance);
}
```

目前还没找到关键信息,继续往下

#### enqueueUpdate做了啥

主要判断 核心对象 ` batchingStrategy`  的`isBatchingUpdates`属性是否为false

- 若该属性为false 直接走更新
- 若该属性为true 先把组件塞入队列里面 等待

##### 源码

```js
function enqueueUpdate(component) {
  ensureInjected();
  // 注意这一句是问题的关键，isBatchingUpdates标识着当前是否处于批量创建/更新组件的阶段
  if (!batchingStrategy.isBatchingUpdates) {
    // 若当前没有处于批量创建/更新组件的阶段，则立即更新组件
    batchingStrategy.batchedUpdates(enqueueUpdate, component);
    return;
  }
  // 否则，先把组件塞入 dirtyComponents 队列里，让它“再等等”
  dirtyComponents.push(component);
  if (component._updateBatchNumber == null) {
    component._updateBatchNumber = updateBatchNumber + 1;
  }
}
```

这段源码看完，上面流程图中空缺的一个判断也可以填入了，那么`batchingStrategy `到底是什么呢，我们来一起看看源码

##### 源码

```js
var ReactDefaultBatchingStrategy = {
  // 全局唯一的锁标识
  isBatchingUpdates: false,

  // 发起更新动作的方法
  batchedUpdates: function(callback, a, b, c, d, e) {
    // 缓存锁变量
    var alreadyBatchingStrategy = ReactDefaultBatchingStrategy. isBatchingUpdates
    // 把锁“锁上”
    ReactDefaultBatchingStrategy. isBatchingUpdates = true
    if (alreadyBatchingStrategy) {
      callback(a, b, c, d, e)
    } else {
      // 启动事务，将 callback 放进事务里执行
      transaction.perform(callback, null, a, b, c, d, e)
    }
  }
}
```

恩~这里提到了事务机制，不太了解，我们先不管，我们先看上面的，总结一下`batchingStrategy `

#### batchingStrategy 对象  用于管控批量更新的对象

有一个全局唯一 变量  即 **isBatchingUpdates**  用于保存当前是否处于批量更新过程(可以理解为线程锁)

  - 该变量初始值为false,当react去执行更新动作时候。设置为true（表明“现在正处于批量更新过程中）

  - 当该变量为 true时，任何需要更新的组件要先暂停进入队列等待 而且不能插队

####  **`isBatchingUpdates`是在同步代码中变化的**



## 实例+图 再理解一遍

俗话说 纸上得来终觉浅，我们在上代码和相关分析图再整一遍

### 同步

#### 实例代码

```js
export default class index extends React.Component{
  state = { number:0 }
  handleClick= () => {
        this.setState({ number:this.state.number + 1 },()=>{   console.log( '回调函数1，现在的num是', this.state.number)  })
        console.log('第一个输出:',this.state.number)
        this.setState({ number:this.state.number + 1 },()=>{   console.log( '回调函数2，现在的num是', this.state.number)  })
        console.log('第二个输出:',this.state.number)
        this.setState({ number:this.state.number + 1 },()=>{   console.log( '回调函数3，现在的num是', this.state.number)  })
        console.log('第三个输出:',this.state.number)
  }
  render(){
      return <div>
          { this.state.number }
          <button onClick={ this.handleClick }  >number++</button>
      </div>
  }
} 
```

#### 控制台输出

```shell
第一个输出: 0
第二个输出: 0
第三个输出: 0
回调函数1，现在的num是 1
回调函数2，现在的num是 1
回调函数3，现在的num是 1
```

#### 流程图

![image-20210815230427589](https://i.loli.net/2021/08/15/jdYxWVKcO6foip1.png)

### 异步

#### 更换代码

为了体现特性 我们修改一下代码

> 修改handleClick

```js
  handleClick= () => {
    setTimeout(()=>{
      this.setState({ number:this.state.number + 1 },()=>{   console.log( '回调函数1，现在的num是', this.state.number)  })
      console.log('第一个输出:',this.state.number)
      this.setState({ number:this.state.number + 1 },()=>{   console.log( '回调函数2，现在的num是', this.state.number)  })
      console.log('第二个输出:',this.state.number)
      this.setState({ number:this.state.number + 1 },()=>{   console.log( '回调函数3，现在的num是', this.state.number)  })
      console.log('第三个输出:',this.state.number)
    },0)
  }
```

#### 控制台输出

```shell
回调函数1，现在的num是 1
第一个输出: 1
回调函数2，现在的num是 2
第二个输出: 2
回调函数3，现在的num是 3
第三个输出: 3
```

#### 流程图

![image-20210815232006633](https://i.loli.net/2021/08/15/yILpFYfVMPwn1l3.png)

> setTimeout等方法 让setState 逃离了 React对其的管控

## 总结

#### 内部批量更新的优化机制原理

联想Event-loop  有一个队列 （专门用来储存setState）  每碰到一个setState，就把它塞进一个队列里攒起来。
等到时机成熟，再把攒起来的state结果做合并，最后只针对最新的state值走一次更新流程。

#### 核心的两句话

- 核心对象  batchingStrategy  的**isBatchingUpdates**属性为基准来判断是否要批量更新

- **`isBatchingUpdates`是在同步代码中变化的**

  
