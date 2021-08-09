### React中的事件

不是原生的event（MouseEvent）  是React封装的 合成事件（SyntheticEvent ）

### 特点

- 可以 阻止默认和冒泡行为
- 所有事件 都被挂在到 document（react 17后挂载到app根节点）上  和原生及vue都不同

### 合成事件处理流程

#### 原生DOM层

1. 元素 触发事件
2. 事件冒泡到 document（react 17后挂载到app根节点）

#### 合成事件层

3. Syntheic Event  实例化成统一的react event

#### 事件处理函数

4. dispatchEvent  处理  将event事件给到对应的处理器质性

#### 实例图

![实例处理流程图](https://api2.mubu.com/v3/document_image/497b0427-eca7-4160-b468-8f2069aa8d2f-6942699.jpg)


### 问：为什么需要合成事件机制

1. 更好的兼容和跨平台  （脱离原生 自己实现一套逻辑）
2. 全部挂在到document上  减少内存消耗 避免频繁解绑 （事件指派原理）
3. 方便事件的统一管理  （如事件机制）