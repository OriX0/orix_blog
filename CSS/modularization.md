# css模块化

### 作用

1. 防止全局污染，样式被覆盖（由于权重）
2. 避免由于没有统一规范和css模块化导致的命名混乱
3. 解决css代码冗余，体积庞大  （各个独立的组件的css文件中有大量重复的css代码）

## css module

### 前置配置

> webpack  css loader

```js
{
     test: /\.css$/,/* 对于 css 文件的处理 */
     use:[
        {
            loader: 'css-loader',
            options:{
              modules: {
                localIdentName: "[path][name]__[local]--[hash:base64:5]", /* 命名规则  [path][name]__[local] 开发环境 - 便于调试   */
              },
            }
        },
     ],
}
```

命名规则

- `[path][name]__[local] ` ---  便于调试  显示路径名
- `[hash:base64:5] ` --- 随机hash值 便于生产环境压缩类名

### 语法

#### 全局变量

`:global(.className)` 这样声明的class，**不会被**编译成hash字符串

#### 局部作用域写法

`:local(.className)` 等同于正常声明

```css
.text{
    color: blue;
}
/* 等价于 */
:local(.text_bg) {
    background-color: pink;
}
```

#### 组合样式

`composes:要继承的className`

```css
.base{ /* 基础样式 */
    color: blue;
}
.text { /* 继承基础样式 ，增加额外的样式 backgroundColor */
    composes:base;
    background-color: pink;
}
```

### 具体使用 css+less/sass组合

#### webpack 配置less

```css
{
     test: /\.less$/,
     use:[
        {
          loader: 'css-loader',
          options:{
                modules: {
                    localIdentName:'[path][name]---[local]---[hash:base64:5]'
                },
          },
        },
        {
            // 可能是其他 loader, 不过不重要。
        },
        'less-loader'
     ]
}
```

#### 组合方案

- 约定 **.css** 文件 存放 **全局样式或公共组件样式**
- 约定 less/sass  做 **css module**  存放**页面和业务组件的样式**

```jsx
import  React from 'react'

import Style from './index.less' /*  less css module */

export default ()=><div>
     {/* 公共样式 */}
    <button className="searchbtn" >公共按钮组件</button> 
    <div className={ Style.text } >验证 less + css modules </div>
</div>
```

#### 配合classNames 更灵活

> 通过引入使用classNames 动态的修改样式

#### 优缺点

优点

- 可以避免类名重复/覆盖，全局污染问题
- 模块之间可以互相结合
- 类名可以通过生成规则配置，也便于压缩

缺点

- 单css module 无法进行嵌套使用
- 一般仅使用类名定义css

## css in js

> 一般使用 style-components 库 

### 插件

因为是在js中写css 要配置相关插件

vscode  --- vscode-styled-components

### 语法 

[官方文档][https://styled-components.com/docs]

#### props动态添加样式

```js
const Button = styled.button`
    background: ${ props => props.theme ? props.theme : '#6a8bad'  };
    color: #fff;
    min-width: 96px;
    height :36px;
    border :none;
    border-radius: 18px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    margin-left: 20px !important;
`
export default function Index(){
    return <div>
        <Button theme={'#fc4838'}  >props传递颜色</Button>
    </div>
}
```

#### 样式继承

```js
const NewButton = styled(Button)`
    background: orange;
    color: pink;
`
export default function Index(){
    return <div>
       <NewButton > 继承按钮</NewButton>
    </div>
}
```

### 优缺点

优点

- css in js 本质上是 css in line的形式  从根本上解决了全局污染的问题
- 运用起来更灵活   可以运用js特性
- 编译器支持度更高

缺点

- 写样式不如css灵活

