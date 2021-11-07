# Sass

## 变量

### 声明

- $变量名:属性值

### 作用域

- 最近的一个{}

### 引用

- 直接用$变量名代替属性值即可
- 变量中也可引入其他变量

### 变量名连接符

- 中划线
- 下划线

### 变量重复声明 采用就近原则

### 默认变量值

- 声明

	- 在变量的值的最后加入

		- !default

- 作用

	- 如果后续没有赋值而直接引用则是默认值

## 嵌套CSS规则

### 子代

- 在现有的{}中写入中间的规则 即可实现嵌套

### 父代

- &

	- 常用于伪类选择

### 群组选择器

- father {son1,son2,son3{子代规则}}

### 兄弟选择器

- borther{~borther2{兄弟规则}}

### 嵌套属性

- 属性{各项属性选项：值}

	- border{style:solid,width:1px,color:#ccc}
	- nav {
  border: 1px solid #ccc {
  left: 0px;
  right: 0px;
  }
}

## 导入规则

### @import  文件名

- 可省略后缀

### 可导入到头部

### 可直接导入到一个css规则内

- .className{@import '导入名'}

### 导入css

- 将css文件改名为scss 再次导入

### 不可导入

- 被导入文件的名字以.css结尾；
- 被导入文件的名字是一个 URL 地址
- 被导入文件的名字是CSS的 url() 值

## 静默注释

### 语法

- //注释

	- 不会出现在生成的css文件中

- /*注释*/

	- 会出现在生成的css文件中

## 混合器

### 无参数使用  固定样式

- 声明

	- @mixin 混合器名  {
   规则
 }

		- @mixin no-bullets {
   list-style: none;
   li {
    list-style-image: none;
    list-style-type: none;
    margin-left: 0px;
   }
 }

- 使用

	- @include 混合器名

		- ul.plain {
  color: #444;
  @include no-bullets;
}

### 带参数使用

- 声明

	- 和js中的function 语法类似

		- @mixin link-colors($normal, $hover, $visited) {
  color: $normal;
  &:hover { color: $hover; }
  &:visited { color: $visited; }
}

	- 可设置默认参数

		- @mixin  混合器名 （参数名：值，参数名：变量）

			- @mixin link-colors(
    $normal,
    $hover: $normal,
    $visited: $normal
  )
{
  color: $normal;
  &:hover { color: $hover; }
  &:visited { color: $visited; }
}

- 使用

	- @include (参数1，参数2...)

		- a {
  @include link-colors(blue, red, green);
}


	- @include (参名:参值，参名：参值...)

## 选择器继承

### 一个选择器继承另一个选择器的所有样式

### 语法

- @extend  选择器

### 使用规范

- 何时使用

	- 子类是父类的细化
	- 有大量重复的代码

### 高级用法

- 继承html自身元素

	- @extend a

### 细节

- 跟混合器相比，继承生成的css代码相对更少
- 继承遵从css层叠的规则。

### 不要在css规则中使用后代选择器 去继承css规则

### 配合%

- %类名

	- 以%占位的类 不会出现在最终生成的css中

## 模块

### 将css拆分成多个模块

### 语法

- @use “模块名”
- 被引入的模块名最前面加上 _ 短下划线 就不会被编译

### 可减少http请求  只会请求最终模块

## Built-In Function

### color

#### lighten 让颜色更浅

```scss
lighten($color, $amount) //=> color 
$amount ---> 比color颜色浅 百分之多少  1-100
```

## 杂 常用

### 条件判断

- @if  条件==值 {}

### 插值

- #{}

	- 可以在选择器或者属性名中使用变量

### !default

- 当用户自己定义过这个变量后就会覆盖 

