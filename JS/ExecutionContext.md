## 整体导图
**右键保存本地更清晰**
![执行上下文和调用堆栈](https://i.loli.net/2021/08/04/uR8FkMr5gjGnSC2.png)
- 导图加载可能有点慢
- 因为之前笔记都是幕布的不好转markdown  后续会对格式进行逐一修正

## 执行上下文的创建及执行

### 创建阶段

- 做三件事

	- this值的决定   This绑定
	- 创建词法环境组件
	- 创建变量环境组件

- This绑定

	- 全局执行上下文

		- this值指向全局变量

			- 浏览器中是window对象

	- 函数执行上下文

		- this的值取决该函数是如何被调用的

			- 被对象调用

				- this＝对象

			- 否则

				- this=全局对象
				- this=undefined

- 词法环境

	- 定义

		- 一种持有 标识符--变量  映射的结构

			- 标识符

				- 变量/函数的名字

			- 变量

				- 对实际对象或原始数据的引用

	- 两个组件

		- 环境记录器

			- 作用

				- 存储变量和函数声明的实际位置

			- 类型

				- 声明式环境记录器（函数环境）

					- 存储变量、函数和参数

						- 同名情况下  函数优先级>变量

					- 变量

						- 变量名:value

							- let创建的为 未初始化
							- var创建的为 undefined

					- 函数

						- reference to  function functionName(){}

					- arguments对象

						- 存储形式

							- index:value的形式

						- 参数length

				- 对象环境记录器（全局环境）

					- 出现在全局上下文中的变量和函数的关系

		- 外部环境的引用

			- 可以访问父级的词法环境

	- 两种类型

		- 全局环境

			- 外部引用

				- null

			- this指向全局对象

		- 函数环境

			- 内部变量  储存在环境记录器

	- 储存let和const

		- 创建阶段 为未初始化

- 变量环境

	- 也是词法环境
	- 与词法环境的区别

		- 变量环境

			- 储存 var变量

		- 词法环境

			- 储存let和const

	- var定义的变量 初始值为undefined

- 函数（诞生时  创建）

	- 所有函数都有名为 [[Environment]] 的隐藏属性

		- 该属性保存了对创建该函数的词法环境的引用

### 执行阶段

- 完成对所有这些变量的分配，最后执行代码。

### 实例

- code

  - ```js
    let a = 20;
        const b = 30;
        var c;
    
    function multiply(e, f) {
     var g = 20;
     return e * f * g;
    }
    
    c = multiply(20, 30);
    ```

- 创建阶段

  - ```js
    // 全局执行上下文
    GlobalExectionContext = {
    // this绑定
    ThisBinding: <Global Object>,
    // 词法环境
    LexicalEnvironment: {
    //对象环境记录器 看type
    EnvironmentRecord: {
      Type: "Object",
      // 在这里绑定标识符
      a: < uninitialized >,
      b: < uninitialized >,
      multiply: < func >
    }
    // 外部引用
    outer: <null>
    },
    // 变量环境
    VariableEnvironment: {
    // 对象环境记录器  看type
    EnvironmentRecord: {
      Type: "Object",
      // 在这里绑定标识符
      c: undefined,
    }
    outer: <null>
    }
    }
    // 函数执行上下文
    FunctionExectionContext = {
    // this绑定
    ThisBinding: <Global Object>,
    // 词法环境
    LexicalEnvironment: {
    // 声明式环境记录器
    EnvironmentRecord: {
      //声明式
      Type: "Declarative",
      // 在这里绑定标识符
      Arguments: {0: 20, 1: 30, length: 2},
    },
    //外部引用
    outer: <GlobalLexicalEnvironment>
    },
    // 变量环境
    VariableEnvironment: {
    // 声明式环境记录器
    EnvironmentRecord: {
      Type: "Declarative",
      // 在这里绑定标识符
      g: undefined
    },
    outer: <GlobalLexicalEnvironment>
    }
    }
    ```

    


## 类型

### 全局执行上下文

- 一个程序中只会有一个全局执行上下文
- 创建全局window对象（浏览器情况下）
- 设置this的值等于 window对象

### 函数执行上下文

- 一个函数一个执行上下文
- 函数调用时创建

### Eval函数执行上下文

## 执行栈

### 后进先出

- 理解为羽毛球盒子

### 实例

- 浏览器创建的时候 

	- JS引擎创建一个全局执行上下文 压入栈

- 自上而下 运行函数 1 

	- 碰到函数1的 时候  创建一个新的执行上下文 压入栈

- 函数1中调用函数2 

	- 碰到函数2 的时候 创建新的执行上下文 压入栈

- 函数2 运行完毕

	- 从执行栈中弹出  控制流程到达下一个执行上下文

- 函数1 运行完毕

	- 从执行栈中弹出  控制流程到达全局执行上下文

- 一旦所有代码执行完毕

	- 引擎会移除全局执行上下文

## 几个代码结构

### for语句

- for 循环在每次迭代中，都会生成一个带有自己的变量 index的新词法环境

## VO/AO

### vo 变量对象

- 是在规范上或者js引擎中实现的 并不能在js环境中直接访问

### AO 活动对象

- 进入执行上下文 变量对象被激活 

	- 各个属性才能被访问

## 栈与堆

### 栈内存

- 基本类型

	- 固定大小空间

### 堆内存

- 引用类型

	- 大小不固定的值

- 引用访问

	- 从栈中读取内存地址

		- 通过地址找到堆中的值

