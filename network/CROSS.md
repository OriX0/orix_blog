## 整体导图 
**右键保存本地更清晰**

![跨域](https://i.loli.net/2021/08/05/aVMoivIur7efAUq.png)

- 导图加载可能有点慢
- 因为之前笔记都是幕布的不好转markdown  后续会对格式进行逐一修正

## WHAT 什么是跨域

### 同源策略

- 三个属性相同 为同源

	- URL= 协议+域名+端口

### 两个页面 不同源 则 为跨域

- 限制的内容

	- 储存性内容

		- Cookie、LocalStorage、IndexedDB 等存储性内容

	- DOM节点
	- ajax请求

## WHY  为什么要设置跨域

### 限制过于开放的浏览器

- 跨域值存在于浏览器端

### 保护用户信息安全

- ajax 同源策略

	- 使不同源的页面不能获取 Cookie 且不能发起 Ajax 请求

- DOM同源策略

	- 不同源页面不能获取 DOM

		- 防止一些恶意网站在自己的网站中利用 iframe 嵌入正规的网站从而迷惑用户

## HOW  如何解决跨域

### JSONP（常考）

- 优点

	- 简单 
	- 兼容性好

- 缺点

	- 仅仅支持 get方法
	- 不安全  会遭受 xss化工局

### 服务器层面

- CROS（常用）

	- 实现

		- 服务端

			- 设置 Access-Control-Allow-Origin

	- 特点

		- 支持所有类型的 HTTP 请求
		- 跨域 HTTP 请求的根本解决方案

	- 分为两种请求

		- 简单请求

			- 方法

				- GET
				- HEAD
				- POST

			- Content-Type

				- text/plain
				- multipart/form-data
				- application/x-www-form-urlencoded

		- 【复杂请求】

			- 定义

				- 不符合简单请求的就是

			- 处理区别

				- 不止发送一个请求。其中最先发送的是一种 “预请求”，而服务端也需要返回 “预回应” 作为相应

- Nginx返代理（常用）

  - 特点

  	- 最简单的跨域方式
  	- 支持所有浏览器
  	- 支持 session

  - 原理

  	- 和node中间件差不多

  - 处理方式

    - 修改 nginx 的配置

      - 常用配置

        ```shell
        server {
        listen       80;
        server_name  www.domain1.com;
        location / {
        proxy_pass   http://www.domain2.com:8080;  #反向代理
        proxy_cookie_domain www.domain2.com www.domain1.com; #修改cookie里域名
        index  index.html index.htm;
        #当用webpack-dev-server等中间件代理接口访问nignx时，此时无浏览器参与，故没有同源限制，下面的跨域配置可不启用
        add_header Access-Control-Allow-Origin http://www.domain1.com;  #当前端只跨域不带cookie时，可为*
        add_header Access-Control-Allow-Credentials true;
        	}
        }
        ```

        

- Node中间件代理

	- 实现原理图

		- ![image-20210805181544082](https://i.loli.net/2021/08/05/9ui5ekPYWNTEXvG.png)

### HTML5特性

- websocket

	- WebSocket 是一种双向通信协议，在建立连接之后，WebSocket 的 server 与 client 都能主动向对方发送或接收数据

- postMessage（不常用）

	- 基于【HTML5】的api

		- HTML5 XMLHttpRequest Level 2 

	- 特点

		- 允许 不同源的脚本 采用 异步的方式 进行【有限】的通信

	- 可处理问题

		- 页面和其打开的新窗口的数据传递
		- 多窗口之间消息传递
		- 页面与嵌套的 iframe 消息传递
		- 上面三个场景的跨域数据传递

### 基于 iframe（不常用）

- window.name + iframe

	- 原理

		- window.name

			- window.name 值在不同的页面 加载后依旧存在 且支持最大2mb的值

		- iframe

			- 通过 iframe 的 src 属性由外域转向本地域

				- 跨域数据 由iframe的window.name 传递出去

- location.hash + iframe

	- 原理

		- 中间页转发

			- a.html 欲与 c.html 跨域相互通信，通过中间页 b.html 来实现。

		- 不同页面传值

			- 利用 iframe 的 location.hash 传值，相同域之间直接 js 访问来通信

- document.domain + iframe

	- 限制性

		- 仅适用于二级域名相同的情况下

	- 原理

		- 两个页面通过 js 强制设置 document.domain 为基础主域

## 手写实现JSONP

### 整体流程

- 声明一个回调函数 Fn

	- 函数名作为参数

		-  传递给跨域请求数据的服务器

	- 函数参数

		- 要获取的目标数据

- 创建script 标签

	- 跨域API接口 赋值给 标签的scr属性
	- 传递函数名

		- ?callback=Fn

- 服务器接收请求后的处理

	- 传递进来的函数和数据拼接

- 返回数据
- 客户端调用声明的回调函数 处理返回数据

### 实例代码

- ```js
  function jsonp ({ url, params, callback }) {
    return new Promise((resolve, reject) => {
      let script = document.createElement('script')
      window[callback] = function (data) {
        resolve(data)
        document.body.removeChild(script)
      }
      params = { ...params, callback } // 拼接参数和callback
      let arrArg = []
      for (let key in params) {
        arrArg.push(`${key}=${params[key]}`)
      }
      script.src = `${url}?${arrArg.join('&')}`
      document.body.appendChild(script)
    })
  }
  ```

  

