## CSS设计模式

### OOCSS设计模式

- 容器与内容分离 --- 在无权重问题的情况下  **外部的容器和内部内容的css应该分离开写** 减少对 HTML 结构的依赖

- 结构与皮肤分离 --- 基于基础对象（不修改原css） 拓展皮肤/新增对象 （新增一个类 去处理 比如 fix 或者 theme）
- 面向设计开发   

> 比如栅格系统，现有组件的拓展

### BEM

#### 命名组成 -- 命名规范 让页面结构清晰

> 进阶版的 OOCSS

- 块  Block
- 元素 Element  _           
- 修饰符  Modifier  --     不能单独存在  必须伴随块或元素 两个极为相似的元素的差异 微调

```css
<div class='menu'>
	<div class='menu_tab menu_tab--style1'>tab1</div>
	<div class='menu_tab menu_tab--style2'>tab2</div>
</div>
```

### SMACSS -- 一套规范

#### 分类--- 可修改可删除 分类的思想

- Base  
  - 浏览器默认样式的重置 （normalize.css）
  - 某些标签默认样式的定制
- Layout
  - 布局相关
  - `.layout-header {} .layout-container {} .layout-sidebar {} .layout-content {} .layout-footer {}`
- Modules
  - 可复用的样式  多页面复用
  - `.todolist{} .todolist-title{} .todolist-image{}  `
- State
  - 状态样式  如展示和隐藏   
  - `.is-hidden{    display: none; }`
- Theme
  - 皮肤样式
  - `theme-a-background、.theme-a-shadow`



![image-20211029153326019](http://image.ori8.cn/img/202111091935885.png)

#### 好处 --主要是因为做了分类

- 易维护
- 易复用
- 易拓展

#### 命名规范

 ```
  Layout ---   .I-header
  State  ---    .is-hidden
  Theme ---  .theme-nav
 ```

####  例子

##### 无框架 单布局的例子

> 复用的5个引入
> 该页面定制的独立写

![image-20211029153838682](http://image.ori8.cn/img/202111091935662.png)

##### Vue或React 中使用

- Layout  和module 以组件的形式存在
- 其余正常分布在目录中



### ITCSS -- 分层 倒金字塔



#### 层次划分 

>  3 4层是 SMACSS  Base层的拆分
>
>  5 6 层是 SMACSS  Modules的拆分 本质可做为一层

1. Setting   ---  维护整个网站样式的变量
2. Tools      ---   维护一些样式的工具库 （省略号 清除浮动工具样式）
3. Generic  --- 浏览器样式的重置
4. Base     --- 标签的定制化
5. Object   --- 通用组件
6. Components   --- 通用组件
7. Trumps   --- 只维护 最高权重的 部分  !import

![ITCSS](http://image.ori8.cn/img/202111091935381.png)

#### 特点

1. 下一层永远继承上面所有层次的样式
2. 层次越上面的 样式权重越低  复用性越强

#### 例子

##### Vue或React 中使用

- Generic  这层不需要写  直接安装
- Object   和  Components     不需要  以组件的形式出现



### ACSS

> 一个样式属性一个类

#### 优缺点

- 优点：极强的复用性、维护成本低
- 缺点：破坏了css命名的语义化  
  - 功能性的类名加了之后 
  - 类名中可能就没有关于该块的描述了 语义化效果就无了

#### ACSS贯穿的框架  tailwindcss



## 最终选型css架构方案

### 选型---ITCSS+BEM+ACSS

1. Setting   ---  维护整个网站样式的变量
2. Tools      ---   维护一些样式的工具库 （省略号 清除浮动工具样式）
3. Generic  --- 浏览器样式的重置
4. Base     --- 标签的定制化
5. 组件部分   --- 使用BEM的设计模式
6. ACSS --- 放入常用的样式
7. Theme

> 项目中的ACSS 将该常用的样式放入
>
> 如 背景颜色  浮动 字体大小  fz-12 :font-size:12px    f-l:float-left


