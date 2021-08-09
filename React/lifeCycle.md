##   新生命周期图

![react生命周期](https://api2.mubu.com/v3/document_image/9e7eb701-226b-4c53-b13a-12f2892d8567-6942699.jpg)

## 生命周期的两个阶段

#### commit阶段

>componentDidXXX  系列生命周期 + getSnapshotBeforeUpdate

#### render阶段

> 除去commit阶段的  其他生命周期都是【render阶段】的

## 生命周期实例 源码角度

#### 树实例（参考 后面两个实例基于这个）---[参考卡颂老师视频](https://www.bilibili.com/video/BV16t4y1r7oJ?from=search&seid=6602041391613664064)

![image-20210806204252977](https://i.loli.net/2021/08/06/7zLnw6bljDMCrkd.png)

### 首次渲染生命函数的调用过程

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
