## 整体导图

**右键保存本地更清晰**
![this](https://i.loli.net/2021/08/05/BUqIKl7zWh4JDFc.png)

- 导图加载可能有点慢
- 因为之前笔记都是幕布的不好转 markdown 后续会对格式进行逐一修正

## 默认绑定

### 非严格模式

- this 指向全局对象

### 严格模式

- 函数内的 this 指向 undefined
- 全局中的 this 不改变
- 【不会阻止】对象绑定到 window 对象上

## 隐式绑定

### this 永远指向最后调用它的那个对象

### 隐式丢失

- 概念

  - 被隐式绑定的函数在【特定的情况】会丢失绑定对象

- 场景

  - 使用另一个变量来给函数去别名
  - 将函数作为参数传递时 会被隐式赋值 回调函数丢失 this 绑定

### 把一个函数当成参数传递到另一个函数

- this 指向

  - 非严格 window
  - 严格 undefined

- 实例

  - 相当于把 obj.foo 赋值给了一个变量 再传入 故发生隐式丢失
  -

## 显式绑定

### 概念

- 通过某些方法 强行改变函数内 this 的指向
- 特殊的点

  - call、apply、bind

    - 如果接收到的参数是空 或者 null 或者 undefined 忽略这个参数

  - setTimeout 的调用者为 window
  - forEach、map、filter

    - 第二个参数 可以传入 this 进行绑定

  - fun().call(obj)

    - 思路

      - 根据 fun()的返回值 来决定

        - 如果无返回值 则报错

          - undefined 无法调用 call

## new 绑定

### new 调用一个函数，会构造一个新对象并把这个新对象绑定到调用函数中的 this

- 相当于构造函数中 隐式的 return this

## 箭头函数绑定

### this 指向 【函数定义】时的【外层作用域】的 this

- 包裹箭头函数的函数

  - 指向最近一层的非箭头函数的 this

    - 如果无 非箭头函数 则为 this 为 undefined（严格模式）

## 题型

### 解题技巧

- 找（） 以括号为断点
- 看是否是绑定

  - 绑定

    - 将（）里面的对象替换 调用对象

- 看调用的函数体

  - 是否为箭头函数

- 运行

  - 判断调用对象

- 按 1-4 重复执行判断

### 对象方法返回函数

- 对象方法 fn（非箭头）返回一个匿名函数（非箭头）

  - obj.fn.call(antoherObj)()
  - obj.fn()()

- 对象方法 fn（非箭头）返回一个匿名函数（箭头）

  - 结果中的 this 指向等于匿名函数外层 fn 的 this 指向
  - 当 fn 被外部调用时 this 指向调用他的最后一个对象

- 对象方法 fn（箭头）返回一个匿名函数(非箭头)

  - 单层对象

    - 如果对象是通过 new 绑定的 则 this 指向该对象
    - 如果对象是通过字面量创建的 则 this 指向全局对象

      - 非严格 window
      - 严格 undefined

  - 多层对象

    - this 指向最近的一层对象
