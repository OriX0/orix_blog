# HOC

![image-20211112214713416](http://image.ori8.cn/img/202111122147298.png)

## 两种高阶组件

### 属性代理

> 外层包裹一个代理组件，在代理组件上对源组件进行强化操作。

#### 优点

- 和业务组件的耦合度很低，无需知道源组件干了什么
- 类组件和函数组件都适用
- 是一个新的组件，可以完全控制内部的源组件是否渲染
- 可以嵌套使用

#### 缺点

- 需要通过ref获取组件实例，否则无法直接获取原始组件状态
- 无法直接继承静态属性
- 如果外界需要获取到内部的ref，需要通过forwardRef来转发ref

### 反向继承

> 通过类的继承，继承原始组件本身

#### 优点

- 方便获取组件内部的状态（state，props，生命周期等）
- es6继承可以继承静态属性‘

#### 缺点

- 函数组件无法使用
- 和源组件耦合度高
- 如果嵌套使用，副作用很大。当前状态会覆盖上一个HOC的状态，包括生命周期等

## 应用场景

### 强化props

> 在原始组件props的基础上，加入一些其他的props，强化原始组件的功能

> React-router 中的withRouter

```jsx
import React from "react";
function withRouter(Component) {
  // 修改displayName 用于辨识
  const displayName = `withRouter(${Component.displayName || Component.name})`;
  const C = (props) => {
    // 剥离props  ref+剩余props
    const { wrappedComponentRef, ...restProps } = props;
    return (
      <RouterContext.Consumer>
        {
          // context中保存着路由对象的上下文 history location
          (context) => {
            return (
              <Component
                {...restProps}
                {...context}
                ref={wrappedComponentRef}
              />
            );
          }
        }
      </RouterContext.Consumer>
    );
  };
  C.displayName = displayName;
  C.WrappedComponent = Component;
  /** 继承静态属性 */
  return hoistStatics(C, Component);
}
export default withRouter;
```

### 控制渲染

#### 渲染劫持

> 反向继承模式，通过 super.render控制原组件渲染

例子：

```jsx
const HOC = (WrapComponent) =>
  class Index  extends WrapComponent {
    render() {
      if (this.props.visible) {
        return super.render()
      } else {
        return <div>暂无数据</div>
      }
    }
  }
```

#### 修改渲染树

> 反向继承模式，通过重写render+React.Children.map/forEach的方式修改渲染树

例子：

```jsx
class Index extends React.Component{
  render(){
    return <div>
       <ul>
         <li>react</li>
         <li>vue</li>
         <li>Angular</li>
       </ul>
    </div>
  }
}
function HOC (Component){
  return class Advance extends Component {
    render() {
      const element = super.render()
      const otherProps = {
        name:'niannian'
      }
      /* 替换 Angular 元素节点 */
      const appendElement = React.createElement('li' ,{} , `hello ,world , my name  is ${ otherProps.name }` )
      const newchild =  React.Children.map(element.props.children.props.children,(child,index)=>{
           if(index === 2) return appendElement
           return  child
      }) 
      return  React.cloneElement(element, element.props, newchild)
    }
  }
}
export  default HOC(Index)
```

### 动态加载

> 配合生命周期使用

> dva - dynamic 动态加载大致思路
>
> - 使用state保存得到的component
> - 配合cdm生命周期去判断，如果在切换路由或者没有加载完毕的时候 显示loading状态

```jsx
import React from "react";

function dynamicHoc(loadRouter) {
  return class HOC extends React.Component {
    state = {
      gotComponent: null,
    };
    componentDidMount() {
      // 如果组件已经挂载了 则不做处理
      if (this.state.gotComponent) return;
      // 如果没有挂载 则进行引用挂载
      loadRouter()
        .then((module) => module.default)
        .then((component) => this.setState({ gotComponent: component }));
    }
    render() {
      const { gotComponent } = state;
      return gotComponent ? <gotComponent {...this.props} /> : <Loading />;
    }
  };
}

```

### 组件拓展赋能

#### ref获取实例

> 通过ref获取实例，进行其他操作（类组件才存在实例）

```jsx
function Hoc(Component){
  return class WrapComponent extends React.Component{
      constructor(){
        super()
        this.node = null /* 获取实例，可以做一些其他的操作。 */
      }
      render(){
        return <Component {...this.props}  ref={(node) => this.node = node }  />
      }
  }
}
```

#### 事件监控

> - ref 获取dom
> - 添加dom监听

```jsx
import React, { useEffect, useRef } from "react";

function ClickHoc(Component) {
  return function Wrap(props) {
    const dom = useRef(null);
    useEffect(() => {
      const handleClick = () => console.log("点了一下");
      dom.current.addEventListener("click", handleClick);
      return () => dom.current.removeEventListener("click", handleClick);
    }, []);
    return (
      <div ref={dom}>
        <Component {...props} />
      </div>
    );
  };
}

@ClickHoc
class Index extends React.Component {
  render() {
    return (
      <div>
        <p>hello，world</p>
        <button>组件内部点击</button>
      </div>
    );
  }
}
export default () => {
  return (
    <div>
      <Index />
      <button>组件外部点击</button>
    </div>
  );
};
```

## 注意事项

### hoc嵌套顺序

> 越是靠近 原组件的，就是越内层的HOC
>
> 如果HOC互相有依赖关系，HOC1依赖HOC2，那么HOC1应该在HOC2内部

```jsx
@HOC1(styles)
@HOC2
@HOC3
class Index extends React.Componen{
    /* ... */
}
```

![image-20211112230316402](http://image.ori8.cn/img/202111122303605.png)

### 静态属性的的继承

使用属性代理的情况下，如果不做处理，默认会丢失静态属性

#### 手动继承

> 知道要拷贝那些静态属性且不是特别多的情况下可以手动拷贝

```jsx
function HOC(Component) {
  class WrappedComponent extends React.Component {
      /*...*/
  }
  // 必须准确知道应该拷贝哪些方法 
  WrappedComponent.staticMethod = Component.staticMethod
  return WrappedComponent
}
```

#### 引入第三方库

引入 [`hoist-non-react-statics`][https://github.com/mridgway/hoist-non-react-statics]

```jsx
import hoistNonReactStatic from 'hoist-non-react-statics'
function HOC(Component) {
  class WrappedComponent extends React.Component {
      /*...*/
  }
  hoistNonReactStatic(WrappedComponent,Component)
  return WrappedComponent
}
```

#### 不在render函数中使用hoc

> 在render函数或者函数组件内部返回 HOC ，每次生成的都是新的组件 所以会造成性能浪费

#### 配合forwardRef做ref的处理