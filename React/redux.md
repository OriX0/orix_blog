# flux框架

#### 严格的单向数据流，变化是可预测且可追溯的

#### 正常流程流

1. 用户与 View 层交互，通过 View发起 一个action，
2. dispatch把这个action派发给store，
3. store处理完毕后通知view

# redux工作流（核心---发布与订阅）

## flow 图

![Store](https://i.loli.net/2021/08/09/4MIEWjAYOGkhPxe.png)

## 源码解析

### 1-createStore内部逻辑

  1. 参数处理---处理没有传入初始状态的情况
  2. 处理中间件---当有中间件的时候  用中间件对createStore进行包裹
  3. 定义内部变量
  4. 定义方法
     1. 定义一个方法  保证 当前监听和 下一次监听不指向同一个引用
     2. 定义 `getState` 方法  获取当前状态
     3. 定义`subScribe`方法  注册listeners（订阅监听函数）
     4. 定义`dispatch`方法   用于派发action、调用reducer 并出发订阅
     5. 定义` replaceReducer`方法    用于替换reducer
  5. 状态初始化---执行dispatch
  6. 定义`observable`方法
  7. 返回带下划线的方法

### 2-dispatch动作---核心  

 ##### 功能-将 action和reducer store串联起来

##### 流程

  1. 接收action对象  并对action进行检查验证
  2. 上锁--- 将**isDispacthing** 设置为true
  3. 调用**reducer**  计算出新的**state**
  4. 解锁   设置**isDispacthing**设置为false
  5. 更新完毕  出发订阅
  6. 返回action



 ### 3-redux中subscribe的工作流

  1. subscribe接收一个函数 对函数进行前置验证
  2. 调用在createStore中创建的方法  确保`nextListeners` 与`currentListeners` 不指向同一个引用
  3. 注册监听函数  将接收的`listener`函数 推入`nextListeners`数组中
  4. 返回取消当前订阅的方法



#### 有趣的点

实际工作流中**都是nextListeners**在工作 ，需要currentListeners是因为他能和正在改变的next数组区分开 。保证运行的稳定性 也就是可预测
