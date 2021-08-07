## 整体导图
**右键保存本地更清晰**
![Promise](https://i.loli.net/2021/08/05/hI2J6FOgjc4rYit.png)

- 导图加载可能有点慢
- 因为之前笔记都是幕布的不好转markdown  后续会对格式进行逐一修正


## 前置知识

### 啥是微任务 宏任务

- 宏

	- script
	- setTimeOut
	- setInterval
	- setImmediate
	- I/O 操作
	- UI线程渲染

- 微

	- MutationObserver

		- DOM变动观察器

	- Promise.then()/catch()
	- 基于Promise 开发的其他技术（如fetch）
	- V8垃圾回收
	- process.nextTick（Node）

### Event Loop 执行顺序

- 开始执行
- 以 整个脚本【script】 作为 【第一个】宏任务执行

	- 【同步代码】 直接执行  
	- 其他（宏  微）任务进入相应的 队列

		- 微任务 进入 微任务队列
		- 宏任务 进入  宏任务队列

- 当前宏任务【script】执行完毕  

	- 检查当前的微任务队列  依次执行

- 根据队列 进入下一轮宏任务

	- 【同步代码】 直接执行  
	- 其他（宏  微）任务进入相应的 队列

		- 微任务 进入 微任务队列
		- 宏任务 进入  宏任务队列

- 当前宏任务执行完毕

	- 检查当前的微任务队列  依次执行

## 需要记录的点

### Promise的状态只能改变一次

### .then 和 .catch

- 参数

	- 非函数的参数传入 会发生值穿透

- 返回值

	- 一个新的Promise

		- 非promise的值 会被包装成 promise对象

			-   即使是Error对象 也是包裹在 Promise.resolve() 后续用then捕获

	- 不能是promise 本身

		- return  promise

- 可以被调用多次

	- 拿到的值 == 第一次状态改变时候的结果值

### 概念性的题

- 怎么理解Promise

	- Promise 是将“生产者代码”和“消费者代码”连接在一起的一个特殊的 JavaScript 对象。

		- 可以理解成 B站订阅up 主  

- Promise构造函数是同步执行的

- Promise 解决的痛点

	- 回调地域

		- 其他的解决方案

			- ES7的 【async/await】

		- 回调地域的问题

			- 代码可读性差 且很臃肿
			- 容易 滋生bug  但是又只能在回调里处理异常
			- 耦合度太高 不易维护 也不易复用

	
	```js
	请求1(function (请求结果1)){
	  请求2(function (请求结果2)){
	    请求3(function (请求结果3)){
	      请求4(function (请求结果4)){
	        请求5(function (请求结果5)){
	          请求6(function(请求结果6)){
	            // todo
	          }
	        }
	      }
	    }
	  }
	}
	```

## 特殊的点

### setTimeouter 是按照 【优先队列】的方式入队

- 简单理解  参数2 time越小 优先级越高

## 微宏  题型及解题思路

### 只有promise 和同步代码

- 从上到下的执行
- 执行同步代码
- 碰到promise.then/catch  且该微任务（promise）的状态不为pending

	- 放入微任务队列

- 执行剩下的同步代码
- 执行微任务 

### Promise+setTimeout

- 参考
- 实例题分析

	- 题目

	  - ```js
    const promise1 = new Promise((resolve, reject) => {
	      setTimeout(() => {
        resolve('success')
	      }, 0)
    })
	    const promise2 = promise1.then(() => {
      throw new Error('error')
	    })
	    console.log('promise1-1', promise1)
    console.log('promise2-1', promise2)
	    setTimeout(() => {
      console.log('promise1-2', promise1)
	      console.log('promise2-2', promise2)
    }, 0)
	    ```

	- 解析

		- 先执行宏任务 【script】

			- 碰到 promise1 

				- 先执行 new Promise里面的内容
			- 带resolve的 setTimeout 推入【宏任务队列】
	
		- 碰到promise2
	
				- 还没有进入 resolve 状态

					- 不处理

			- 输出 promise1-1和promise 2-1

				- 两个promise 都尚未处理 所以都是`<pending>`

			- 碰到第二个 setTimeout
	
				- 推入宏任务队列
	
		- 执行宏任务 【第一个setTimeout】
	
			- promise1的状态改为resolve
			- 执行promise2 
	
				- promise2的状态改为 reject
	
		- 执行宏任务 【第二个 setTimeout】
	
			- 输出promise1-2 promise2-2
	
				- `promise2-1 <resolve>:'success'`
				- `promise2-2  <reject>:Error:error!`

### Promise+SetTimeOut+【async】

- 碰到 【await】直接运行

- 如果 functio() 里 await 还有其他代码

  - await 下面的代码被视为 【微任务】

  	- 可以将其当做 Promise.then
  	
  	```js
  	async function async1 () {
  	  console.log(1);
  	  await async2()
  	  // await 下面为微任务
  	  console.log('我是最后输出的')
  	  async function async2(){
  	    console.log(3)
  	  }
  	}
  	async1()
  	console.log(4)
  	```

- 如果 await 后面的 【 Promise】 【没有】返回值 

  - await 会一直等待  后面的代码不会执行

  - ```js
    async function async1() {
      console.log('async1 开始运行')
      await new Promise((resolve)=>{
        console.log('就输出一下 没有返回值')
      })
      console.log('我不会运行')
      return '我也不能返回'
    }
    ```

    

- 如果 await 后面的内容是 错误或者异常  终止错误结果 不会继续向下执行

	实例
	
	 ```js
	  async function async1 () {
	    await async2()
	    console.log('async1')
	    return 'async1 success'
	  }
	  async function async2 () {
	    return new Promise((resolve, reject) => {
	      console.log('只会输出这一句')
	      reject('结束运行 抛出这个错误')
	    })
	  }
	  async1.then(res=>console.log(res))
	 ```
	
	  

