## 整体导图

**右键保存本地更清晰**
![原型](https://i.loli.net/2021/08/04/KmGbIOQo3SE8ZcF.png)

- 导图加载可能有点慢
- 因为之前笔记都是幕布的不好转 markdown 后续会对格式进行逐一修正

## 一句话

### js 中万物皆对象，对象皆出自构造函数

### 分类

- 函数对象

  - Function 的实例

- 普通对象

## 三个属性

### 对象独有

- **proto**
- constructor

### 函数

- prototype
- **proto**
- constructor

### **proto**（原型的 getter 和 setter）

- 是开发者工具（浏览器） 渲染出来的虚拟节点

  - ES5 纳入规范

- 定义

  - 一个对象指向另一个对象（原型对象）

- 操作方式

  - 访问

    - obj.**proto**

  - 设置

    - obj.**proto** = anotherObj

  - 相当于 走了 Obj.get/set 方法

- 实例**proto** =实例的构造函数的 prototype

  - 构造函数.**proto**

    - Function.prototype

  - 构造函数.prototype.**proto**

    - Object.prototype

  - Function.prototype.**proto** === Object.prototype

    - 万物皆对象，函数对象也是对象

  - Object.prototype.**proto** === null
  - 所有函数对象的 **proto** 都指向 Function.prototype，它是一个空函数（Empty function）

### prototype（构造函数的一个属性）

- 定义

  - 是构造函数的一个属性

    - 指向原型对象

      - 给其他对象提供共享属性的对象

        - 自身也是对象
        - 承担一定职能

      - 作用

        - 包含可以给特定类型的所有实例提供共享的属性和方法

      - 相当于构造函数的一个实例

- 通过属性赋值

  - obj.prototype = antoherObj

    - 仅仅在 new F 被调用时候使用 为新对象[[prototype]] （原型)赋值
    - 当创建了一个 new Obj 时 把他的[[prototype]] 赋值为 anotherObj

- 特性

  - 函数独有

    - 函数创建的时候 就在该函添加 prototype 属性

  - 会自动获得一个 constructor 属性 指向构造函数

    - Person.prototype.constructor == Person

- 特殊情况理解

  - Function.prototype 是函数对象

    - Function.prototype 是构造函数的一个实例

      - Function.prototype= new Function

### [[Prototype]]（原型）

- 修改对象的[[Prototype]]会对性能造成非常严重的影响
- 值

  - 一个对象
  - null

- 操作

  - 访问

    - Object.getPrototypeOf(Obj)

  - 设置

    - Object.setPrototypeOf(Obj,anotherObj)

  - 创建(继承另一个对象）

    - Object.create()

###

## 构造函数

### constructor

- 定义

  - 返回创建实例对象时构造函数的引用

- JavaScript 自身并不能确保正确的 constructor 函数值

  - 设置构造函数的 prototype 属性 让其变为非默认 则该属性随之变化

### 特性

- 本身是一个函数 只是是用 new 生成实例
- 是否只读

  - 引用类型

    - 可修改

  - 基本类型

    - 只读
    - 不包括（null 和 undefined

### 知识点

- Symbol 不是构造函数

  - 无法用 new 调用
