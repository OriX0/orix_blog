# 生命周期
## UI = Fn(state) 核心公式

#### state 计算状态变化---在react中就是  reconcile（diff）算法

#### fn  渲染器 ---常用的就是 react DOM渲染器

### 状态更新流程：

- （diff算法）计算出状态变化【render阶段  render函数这个时候调用】
- 将状态变化渲染到视图中 【commit函数 只是类比为 git commit 】

#### commit阶段

>componentDidXXX  系列生命周期 + getSnapshotBeforeUpdate

#### render阶段

> 除去commit阶段的  其他生命周期都是【render阶段】的

##   新生命周期图

![img](https://i.loli.net/2021/09/10/YnzjgkhOZGiAXVw.png)

### 初始化

![image-20211111182710952](http://image.ori8.cn/img/202111111827537.png)

### 更新

![lifecycle5.jpg](http://image.ori8.cn/img/202111111828824.webp)

### 卸载

![image-20211111182911915](http://image.ori8.cn/img/202111111829756.png)

## 各个生命周期的常见使用场景

- constructor
  -  **初始化**state  ---比如截取路由中的参数进行赋值
  - 对类组件**事件**进行**处理**（绑定this 防抖 节流）
  - 对类组件进行生命周期劫持，渲染劫持
- getDerivedStateFromProps （从props中获得派生的state）
  - 组件初始化或更新时候 将props**映射到state**中
  - 返回的值和s**tate进行合并**  传入shouldComponentUpdate作为第二个参数 用于判断是否渲染组件
- render
  - **createElement创建元素** , **cloneElement 克隆元素** ，**React.children 遍历 children** 
- getSnapshotBeforeUpdate（获得更新前的快照）
  - 配合componentDidUpdate，保存一次更新前的信息
- componentDidUpdate （**同步执行**）
  - 获取最新DOM状态
  - 接受getSnapshotBeforeUpdate 保存的快照信息
  - 避免设置state，可能会引起无限循环
- componentDidMount  （**同步执行**）
  - 关于DOM的操作，比如事件监听
  - 初始化向服务器请求数据
- shouldComponentUpdate
  - 性能优化
- componentWillUnmount
  - 清除延时器，定时器

## 函数组件中的生命周期

> 函数组件中基本使用useEffect来模拟生命周期



### useLayoutEffect

> 修改DOM 更改布局就用useLayoutEffect

- 不同
  - useLayoutEffect 是在DOM绘制之前  
  - useLayoutEffect 的回调执行会阻塞浏览器绘制
  - useEffect是在DOM绘制之后 ，如果操作了dom 会导致 回流和重绘
  - useEffect是异步执行 

## 实例 源码角度

#### 树实例（参考 后面两个实例基于这个）

![image-20210806204252977](https://i.loli.net/2021/08/06/7zLnw6bljDMCrkd.png)

### （初始化）首次渲染生命函数的调用过程

#### 1-调用ReactDOM.render方法

#### 2-进入render阶段

#### 3-深度优先遍历 创建 fiber树

- 实例过程  执行挂载的【render阶段】生命周期

- 从根节点ROOT出发 ---先调用根节点的【render阶段】生命周期函数 ` constructor GetDerivedStateFormPorps/CWM render`

- 查找子节点  发现第一个子节点P1

> 调用P1的【render阶段】生命周期函数（constructor GDSFP/CWM render）

  - 查找子节点   发现 P1第一个子节点  C1

> 调用C1 相应的【render阶段】生命周期函数

  - 查找C1的子节点 没有找到  找C1的兄弟节点  C2

> 调用C2的相应【render阶段】生命周期函数

  - 查找C2的子节点 没有找到  查找C2的 兄弟节点 没有找到  返回父节点P1

  - 找到 P1的兄弟节点  P2

> 调用P2的相应【render阶段】生命周期函数

 - 查找P2的兄弟节点和子节点 没找到  那么 创建结束

#### 4-进入commit 阶段

  - 子节点往上（c1->c2->p1->p2->root） 执行挂载的【commit阶段】生命周期 （componentDidMount）

### 更新声明函数调用过程 （此次更新了C2节点的值）

#### 1-调用 setState 对C2进行修改 并标记

#### 2-进入Render阶段

#### 3-采用深度优先遍历 创建一个fiber树  （每次调用this.setState都会创建一棵树）

  - 跟 首次渲染过程一样  从APP开始--->p1--->C1 (都没有发现相关的更新操作 )  故不执行生命周期函数
  - 找C1的兄弟节点  找到了C2 发现C2有更新

#### 4-标记 找到的变化（reconcile算法）

#### 5-执行C2的生命周期函数

#### 6-进入 Commit 阶段

#### 7-执行  找到的变化  对应的视图操作

## react16更新生命周期的原因

#### Fiber机制下 render阶段是允许暂停、终止和重启的

这就导致render阶段生命周期可能会被**重复**执行，废弃的生命周期都在render阶段

- 比如说，这件商品单价只要 10 块钱，用户也只点击了一次付款。但实际却可能因为 componentWillxxx 被打断 + 重启多次而多次调用付款接口，最终付了 50 块钱

#### 让生命周期更纯粹可控
