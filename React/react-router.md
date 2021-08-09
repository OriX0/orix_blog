### 路由历史背景

出现原因---SPA初期 内容切换后 url不改变 无法定位到

### 路由做了什么事情

1. 拦截用户的刷新操作，避免服务端盲目响应、返回不符合预期的资源内容
2. 感知URL的变化

### 核心组件

#### 1-路由器 

> BrowserRouter   HashRouter

##### 作用

感受路由的变化并作出反应，它是整个路由系统中最为重要的一环。

#### 2-路由

>Router    Switch

#### 3-导航

>Link NavLink  Redirect

### 解析两种路由器

#### BrowserRouter

**基于html5 的histroy的 以下API来控制** （html4的 go back api并不能实现）

- API---pushState
- API---replaceState

- 监听popstate方法

#### HashRouter

-  URL 的 hash 属性来控制
-  js的localtion.hash属性 可以获取到   通过监听 hashChange事件