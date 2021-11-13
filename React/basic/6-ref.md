# ref

## 常见使用

### forward转发ref

#### 跨层级获取

> 场景：grandFather组件获取孙组件的实例

- father（中间）层 通过`React.forwardRef`进行转发

```jsx
import React from "react";

function Son(props) {
  const { grandRef } = props;
  return (
    <div>
      <span>hello</span>
      <span ref={grandRef}> 我是要被获取的元素</span>
    </div>
  );
}

class Father extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <Son grandRef={this.props.grandRef} />
      </div>
    );
  }
}

const NewFather = React.forwardRef((props, ref) => (
  <Father grandRef={ref} {...props} />
));
class grandParent extends React.Component {
  constructor(props) {
    super(props);
  }
  getSoneNodeRef = React.createRef();
  componentDidMount() {
    console.log(this.getSoneNode.current);
  }
  render() {
    <NewFather ref={this.getSoneNodeRef} />;
  }
}

```

#### 合并转发ref

> 使用ref去传递合并后的自定义ref
>
> 场景：外层组件获取子组件的一些东西 比如用到的所有组件

- 通过 `React.forwardRef` 获取当前的ref，并传递给子组件
- 子组件中，对传递进来的`ref`对象重新赋值

```jsx
import React,{useRef,useEffect} from 'react'
import Form from '../Components/Form'


class Index extends React.Component {
  constructor(props){
    super(props)
  }
  fromRef = React.createRef();
  buttonRef = React.createRef();
  componentDidMount(){
    const {homeRef} = this.props;
    homeRef.current = {
      form:this.fromRef.current,
      button:this.buttonRef.current,
      index:this,
    }
  }
  render(){
    return (
      <div>
        <Form ref={this.fromRef}></Form>
        <button ref={this.buttonRef}>测试</button>
      </div>
    )
  }
}

const NewIndex=  React.forwardRef((props,ref)=><Index {...props} homeRef={ref} />)
function Home(props){
  const homeRef = useRef(null);
  useEffect(()=>{
    console.log(homeRef.current)
  })
  return (
    <NewIndex ref={homeRef} />
  )
}
```

#### 高阶组件转发

> 默认高阶组件包裹一个原始类组件，此时的ref会指向 高阶组件返回的新组件 。如果需要获取原本组件的ref，就需要进行转发

```jsx
function HOC(Component){
  class Wrap extends React.Component{
     render(){
        const { forwardedRef ,...otherprops  } = this.props
        return <Component ref={forwardedRef}  {...otherprops}  />
     }
  }
  return  React.forwardRef((props,ref)=> <Wrap forwardedRef={ref} {...props} /> ) 
}
```



### 组件通信

#### 类组件

- 子-->父
  - 父组件传递callback，子组件调用

- 父---> 子
  - 通过ref获取子组件实例，并调用实例上的方法对子组件的值进行更改

```jsx
/* 子组件 */
class Son extends React.PureComponent{
    state={
       fatherMes:'',
       sonMes:''
    }
    fatherSay=(fatherMes)=> this.setState({ fatherMes  }) /* 提供给父组件的API */
    render(){
        const { fatherMes, sonMes } = this.state
        return <div className="sonbox" >
            <div className="title" >子组件</div>
            <p>父组件对我说：{ fatherMes }</p>
            <div className="label" >对父组件说</div> <input  onChange={(e)=>this.setState({ sonMes:e.target.value })}   className="input"  /> 
            <button className="searchbtn" onClick={ ()=> this.props.toFather(sonMes) }  >to father</button>
        </div>
    }
}
/* 父组件 */
export default function Father(){
    const [ sonMes , setSonMes ] = React.useState('') 
    const sonInstance = React.useRef(null) /* 用来获取子组件实例 */
    const [ fatherMes , setFatherMes ] = React.useState('')
    const toSon =()=> sonInstance.current.fatherSay(fatherMes) /* 调用子组件实例方法，改变子组件state */
    return <div className="box" >
        <div className="title" >父组件</div>
        <p>子组件对我说：{ sonMes }</p>
        <div className="label" >对子组件说</div> <input onChange={ (e) => setFatherMes(e.target.value) }  className="input"  /> 
        <button className="searchbtn"  onClick={toSon}  >to son</button>
        <Son ref={sonInstance} toFather={setSonMes} />
    </div>
}
```



#### 函数组件

![image-20211111234554197](http://image.ori8.cn/img/202111112345499.png)

- 父--->子
  - forwarRef处理子组件
  - 子组件接收ref，调用 `useImperativeHandle `，生成相应的ref
  - 父组件调用ref中的方法
- 子--->父
  - 父组件传递callback，子组件调用

```jsx
// 子组件
function Son (props,ref) {
    const inputRef = useRef(null)
    const [ inputValue , setInputValue ] = useState('')
    useImperativeHandle(ref,()=>{
       const handleRefs = {
           onFocus(){              /* 声明方法用于聚焦input框 */
              inputRef.current.focus()
           },
           onChangeValue(value){   /* 声明方法用于改变input的值 */
               setInputValue(value)
           }
       }
       return handleRefs
    },[])
    return <div>
        <input placeholder="请输入内容"  ref={inputRef}  value={inputValue} />
    </div>
}

const ForwarSon = forwardRef(Son)
// 父组件
class Index extends React.Component{
    cur = null
    handerClick(){
       const { onFocus , onChangeValue } =this.cur
       onFocus() // 让子组件的输入框获取焦点
       onChangeValue('测试') // 让子组件input  
    }
    render(){
        return <div style={{ marginTop:'50px' }} >
            <ForwarSon ref={cur => (this.cur = cur)} />
            <button onClick={this.handerClick.bind(this)} >操控子组件</button>
        </div>
    }
}。
```

### 函数组件缓存数据

- useRef 可以创建出一个 ref 原始对象，只要组件没有销毁，ref 对象就一直存在
- 把一些不依赖于视图更新的数据储存到 ref 对象中
- useEffect，useMemo hooks无需将ref对象加入依赖项，因为ref对象始终指向一个内存空间

## 底层处理

### ref执行和处理

> 对于Ref处理，React底层 用 `commitDetachRef `和`commitAttachRef `进行处理

![image-20211111235110512](http://image.ori8.cn/img/202111112351433.png)

#### 更新流程

1. 在commit的mutation阶段 ，执行`commitDetachRef`  清空ref值，重置为null
2. DOM 更新阶段，这个阶段会根据不同的 effect 标签，真实的操作 DOM 
3. layout阶段，元素节点被更新，ref跟着更新

### ref的更新时机

> 只有fiber被打上 Ref的Tag的时候（fiber更新的时候）才会进行更新，并非每一次fiber更新ref就会更新

#### 打上ref标识的情况

**初始化**

- ` current === null && ref !== null`第一次 ref（初始化） 处理的时候，是一定要标记 Ref 的。

**更新时**

- ` current !== null && current.ref !== ref`：ref 对象的指向变了。

> 所以如果是回调函数绑定ref的形式，每次ref其实都进行了更新。

```jsx
// 每一次都会打印
<div ref={(node)=>{
               this.node = node
               console.log('此时的参数是什么：', this.node )
}}  >ref元素节点</div>
```

### 卸载ref

> 被卸载的 fiber 会被打成 `Deletion` effect tag 。
>
> 有ref表示的组件会统一走safelyDetachRef方法来卸载ref

```jsx
function safelyDetachRef(current) {
  const ref = current.ref;
  if (ref !== null) {
    if (typeof ref === 'function') {  // 函数式 ｜ 字符串
        ref(null)
    } else {
      ref.current = null;  // ref 对象
    }
  }
}
```

- 对于字符串 `ref="dom"` 和函数类型 `ref={(node)=> this.node = node }` 的 ref，会执行传入 null 置空 ref 。
- 对于 ref 对象类型，会清空 ref 对象上的 current 属性。

### 细节

#### 字符串ref最后会按函数的形式处理

**当ref属性为一个字符串的时候，react会自动绑定一个函数**，**字符串的 ref 会被绑定在组件实例的 refs属性下**

> react-reconciler/src/ReactChildFiber.js

```js
const ref = function(value) {
    let refs = inst.refs;
    if (refs === emptyRefsObject) {
        refs = inst.refs = {};
    }
    if (value === null) {
        delete refs[stringRef];
    } else {
        refs[stringRef] = value;
    }
};
```

