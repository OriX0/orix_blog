## 错误边界

> React为了防止渲染异常的情况，增加了两个额外的生命周期
>
> - componentDidCatch 
> - static getDerivedStateFromError()

### static getDerivedStateFromError()

> 由于getDerivedStateFromError 是静态方法，内部不能调用setState，**返回的值**可以**合并到state**，官方更推荐用该api进行错误处理

#### 例子-- 可自定义传入渲染组件的错误边界

```tsx
type FallbackRender = (props: {error: Error | null}) => React.ReactElement;

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{fallbackRender: FallbackRender}>,
  {error: Error | null}
> {
  state = {error: null};

  // 当子组件抛出异常，这里会接收到并且调用
  static getDerivedStateFromError(error: Error) {
    console.log('捕获到子组件异常', error);
    return {error};
  }

  render() {
    const {error} = this.state;
    const {fallbackRender, children} = this.props;
    if (error) {
      return fallbackRender({error});
    }
    return children;
  }
}
```

### componentDidCatch

> 该生命周期会在**commit**阶段被调用，因此允许执行副作用

#### 语法

```
componentDidCatch(error抛出的错误,info 组件引发错误的栈信息）
```

#### 例子--降级ui渲染

```jsx
 class Index extends React.Component{
   state={
       hasError:false
   }  
   componentDidCatch(...arg){
       uploadErrorLog(arg)  /* 上传错误日志 */
       this.setState({  /* 降级UI */
           hasError:true
       })
   }
   render(){  
      const { hasError } =this.state
      return <div>
          {  hasError ? <div>组件出现错误</div> : <ErrorTest />  }
          <div> hello, my name is alien! </div>
          <Test />
      </div>
   }
}
```

