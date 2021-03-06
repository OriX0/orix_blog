## 整体导图
**右键保存本地更清晰**
![类型转换](https://i.loli.net/2021/08/04/xHPmVn68MlJDI43.png)
- 导图加载可能有点慢
- 因为之前笔记都是幕布的不好转markdown  后续会对格式进行逐一修正
## typeof

- 对于原始类型来说(也就是number、string这种)，除了null都可以显示正确的类型
- null因为历史版本的原因被错误的判断为了"object"
- 对于引用类型来说(也就是object、array这种)，除了函数都会显示为"object"
- 函数会被显示为function

## 原始类型转换

### 布尔类型

- 原始值--->布尔值

	- true
	- false

		- false
		- undefined
		- null
		- +0
		- -0
		- NaN
		- "" (空字符串)
		- 空参
		- document.all

			- 非IE下用type 转换为undefined 故为false

### 字符串

- 原始值--->字符串

	- undefined

		- "undefined"

	- null

		- "null"

	- Boolean

		- "true"
		- "false"

	- Symbol

		- “Symbol()”

	- 数字类型

		- 正常数字 返回 双引号+数字
		- NaN 返回引号+NaN

	- 字符类型

		- 返回与之相等的值

### 数字类型

- 原始值--->数字

	- undefined

		- NaN

	- Null

		- +0

	- 布尔值

		- ture

			- 1

		- false

			- +0

	- Symbol

		- 报错

	- 字符串

		- 纯数字能转换
		- 其余为NaN

- 转换函数

	- parseInt(parseFolat)

		- 如果字符串以0x或者0X开头的话

			- parseInt 先将其以16进制的规则转换为十进制
			- 0

		- 会尽可能多的解析数字字符 
		- 跳过开头任意数量的空格

### 转换对象

- 基本类型包装类

	- 使用typeof检测它，结果是object，说明它是一个对象
	- 使用toString()调用的时候返回的是原始值的字符串

- 能用new调用

	- 用new调用后创建 一个基本类型包装类

		- console.log(new Number(1)); // Number{1}

	- String
	- Number
	- Boolean

- 不能用new调用

	- Symbol
	- BigInt

- 更推荐 new Object来创建

	- undefined

		- 返回为空

	- null

		- 返回为空

## 三大方法

### toString

- 特性

	- 其他数据类型（除了null、undefined）外 构造函数的原型对象上都有toString（）方法
	- 基本数据类型构造函数原型对象上的toString()方法会覆盖Object 原型上的方法

- 调用

	- 除了null、undefined外的类型均可调用
	- 数字调用中的有趣现象

		- n.toString

			- 系统会把n和点看做一个整体 从而导致调用错误 
			- 多加一个点即可避免

	- call调用

		- Object.prototype.toString

			- 返回字符串

				- "[object " 和 class 和 "]"

					- object
					- class

						- 类

			- 获取内部属性[[class]]

- 基本类型调用toString方法原理

	- 把原始值转换为字符串
	- 创建Object实例  讲 值变为基本类型包装对象
	- 调用实例方法toString
	- 用后销毁

- 引用类型调用toString

	- 数组

		- 先转换

			- 再相连

				- [{ name: 'obj' },1]="[object,object],1"

			- 将每一项转换为字符串然后再用","连接  

				- 空数组返回空字符串

			- 相连部分隐式调用 数组join函数 可重写

				- 如果同时重写了toString及join  优先采用toString

	- 普通的对象(比如{name: 'obj'}这种)

		- "[object Object]"

	- 函数(class)、正则

		- 源代码字符串

	- 日期

		- 本地时区的日期字符串

	- 原始值的包装对象（Boolean{true}

		- 返回原始值的字符串

	- weak/Map、Set、Promise

		- 返回 object+类型

			- console.log(new Map().toString()) // "[object Map]"
			- console.log(new Set().toString()) // "[object Set]"
			- console.log(Promise.resolve().toString()) // "[object Promise]"

- instanceof 增强版

	- Object.prototype.toString 

		- 对于各个类型的输出为 object+类型

			- 对于 number 类型，结果是 [object Number]
			- 对于 boolean 类型，结果是 [object Boolean]
			- 对于 null：[object Null]
			- 对于 undefined：[object Undefined]
			- 对于数组：[object Array]

- 自定义toString的方法的输出

  - 特殊对象属性[Symbol.toStringTag]

  	 ```js
  	 let user = {
  	 [Symbol.toStringTag]: "User"
  	 };
  	 alert( {}.toString.call(user) ); // [object User]
  	```

### valueOf

- 把对象转换成一个基本数据的值。
- 基本类型调用valueOf

	- 返回调用者本身的值

- 引用类型调用

	- 日期对象

		- 时间戳

	- 非日期对象

		- 对象本身

### toPrimitive

- 最高优先级

	- 重写了它的话，那么甚至都不会执行重写的toString()和valueOf()了

- 语法

	- ToPrimitive(input,preferredType?)
	- 参数

		- input

			- 要处理的值

		- PreferredType（非必填)

			- 期望转换的类型 
			- 可选值

				- Number
				- String

- 处理特性

	- 不传PreferredType

		- 传入值是日期类型

			- 用string方式去处理

		- 非日期形式

			- Number

	- 处理值的值为对象

		- preferred为Number

			- 先调用valueOf

				- 如果结果是原始值就返回

			- 再调用 toString

				- 如果是原始值就返回

			- 抛出类型错误的异常

		- preferred为 String

			- 调用 toString

				- 如果是原始值就返回

			- 调用valueOf

				- 如果结果是原始值就返回

			- 抛出类型错误的异常

## 处理流程总结

### 流程图

- 

### 对象-->字符串

- 判断对象是否有toString方法

	- 调用方法

		- 返回原始值泽转换为字符串返回
		- 不返回原始值

	- 无toString方法

- 调用valueOf

	- 返回原始值泽转换为字符串返回
	- 无法获得原始值

- 抛出类型错误异常

### 对象--->数字

- 是否有valueOf方法

	- 调用方法

		- 返回原始值转换为数字 最终结果
		- 非原始值

	- 无方法

- 调用toString方法

	- 返回原始值  转换为数字类型返回
	- 非原始值

- 抛出类型错误异常

## == 比较

### 类型相等 比较值

### 类型均为基本数据类型

- null和undefined

	- undefined派生于null
	- null==null
	- null==undefined

- 一方为String

	- String转为Number比较

- 一方为Boolean

	- Boolean转为Number比较

### 有引用类型

- 两方都是引用类型

	- 判断是否指向同一个地址

- 一方是

	- ToNumber的形式转换 进行比较

### 特殊

- NaN

	- Object.is(NaN, NaN)=ture
	- 其他情况均为false

### 加上运算符

- !

	- 最先把!后面的值转换为布尔值来运算

		- 再把布尔值转换为number

### 整合图

- 

## 运算符（+ - * / %）的类型转换

### - * / %

- 把符号两边转成数字来进行运算

### +

- 两端都是数字则进行数字运算
- 有一端是字符串 会把另一端转换为字符串

### 对象的+号类型转换

- toPrimitive的参数hint为default

	- 先判断有没有valueOf
	- 如果没有或者返回值非原始值 则进行toString

- 日期在进行+号字符串连接的时候 优先调用toString()方法
- +变量名

	- 是转换其他对象到数值的最快方法

