# 认识jsx

> jsx--->React.createElement（转换+组装）--->ReactElement对象--->创建对应fiber Obj ---->fiber Obj 关联--->fiber 结构

## jsx是如何映射为DOM的

### 参数

```
type: 组件---类或函数   dom--- dom标签字符串（如div、span）
[props]:组件--- props     dom---标签属性
[...children]: 按顺序排列的子children
```

### createElement---转换器

> createElement本质上就是在做格式化处理 


#### 带注释源码

```jsx
export function createElement(type, config, children) {
  // propName 变量用于储存后面需要用到的元素属性
  let propName;
  // props 变量用于储存元素属性的键值对集合
  const props = {};
  // key、ref、self、source 均为 React 元素的属性，此处不必深究
  let key = null;
  let ref = null;
  let self = null;
  let source = null;
  // config 对象中存储的是元素的属性
  if (config != null) {
    // 进来之后做的第一件事，是依次对 ref、key、self 和 source 属性赋值
    if (hasValidRef(config)) {
      ref = config.ref;
    }
    // 此处将 key 值字符串化
    if (hasValidKey(config)) {
      key = "" + config.key;
    }
    self = config.__self === undefined ? null : config.__self;
    source = config.__source === undefined ? null : config.__source;
    // 接着就是要把 config 里面的属性都一个一个挪到 props 这个之前声明好的对象里面
    for (propName in config) {
      if (
        // 筛选出可以提进 props 对象里的属性
        hasOwnProperty.call(config, propName) &&
        !RESERVED_PROPS.hasOwnProperty(propName)
      ) {
        props[propName] = config[propName];
      }
    }
  }
  // childrenLength 指的是当前元素的子元素的个数，减去的 2 是 type 和 config 两个参数占用的长度
  const childrenLength = arguments.length - 2;
  // 如果抛去type和config，就只剩下一个参数，一般意味着文本节点出现了
  if (childrenLength === 1) {
    // 直接把这个参数的值赋给props.children
    props.children = children;
    // 处理嵌套多个子元素的情况
  } else if (childrenLength > 1) {
    // 声明一个子元素数组
    const childArray = Array(childrenLength);
    // 把子元素推进数组里
    for (let i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    // 最后把这个数组赋值给props.children
    props.children = childArray;
  }
  // 处理 defaultProps
  if (type && type.defaultProps) {
    const defaultProps = type.defaultProps;

    for (propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }

  // 最后返回一个调用ReactElement执行方法，并传入刚才处理过的参数
  return ReactElement(
    type,
    key,
    ref,
    self,
    source,
    ReactCurrentOwner.current,
    props
  );
}
```

> 本质上每一个步骤几乎都在格式化数据
#### 总体流程图

![createElement ](https://i.loli.net/2021/09/18/U6JiEW3pICAMc8R.png)
### ReactElement---组装

#### 带注释版源码

```jsx
const ReactElement = function(type, key, ref, self, source, owner, props) {
  const element = {
    // REACT_ELEMENT_TYPE是一个常量，用来标识该对象是一个ReactElement
    $$typeof: REACT_ELEMENT_TYPE,
    // 内置属性赋值
    type: type,
    key: key,
    ref: ref,
    props: props,
    // 记录创造该元素的组件
    _owner: owner,
  };
  // 
  if (__DEV__) {
    // 这里是一些针对 __DEV__ 环境下的处理，对于大家理解主要逻辑意义不大，此处我直接省略掉，以免混淆视听
  }
  return element;
};
```

ReactElement 把传入的参数按照一定的规范，“组装”进了 element 对象里，并把它返回给了 React.createElement，最终 React.createElement 又把它交回到了开发者手中

### 整体图示

![整体流程图](https://i.loli.net/2021/09/18/3ARlCEH5xSFnIMt.png)



从上面不难看出，`JSX`是一种描述当前组件内容的数据结构，他不包含组件**schedule**、**reconcile**、**render**所需的相关信息。

比如如下信息就不包括在`JSX`中：

- 组件在更新中的`优先级`
- 组件的`state`
- 组件被打上的用于**Renderer**的`标记`

这些内容都包含在`Fiber节点`中，所以，在组件`mount`时，`Reconciler`根据`JSX`描述的组件内容生成组件对应的`Fiber节点`。

在`update`时，`Reconciler`将`JSX`与`Fiber节点`保存的数据对比，生成组件对应的`Fiber节点`，并根据对比结果为`Fiber节点`打上`标记`

### jsx的转换规则

> jsx 和转换后对应规则

| `jsx`元素类型     | `react.createElement` 转换后                      | `type` 属性                   |
| ----------------- | ------------------------------------------------- | ----------------------------- |
| `elment`元素类型  | `react element`类型                               | 标签字符串，例如 `div`        |
| `fragment/<>`类型 | `react element`类型                               | `symbol` `react.fragment`类型 |
| 组件类型          | `react element`类型                               | 组件类或者组件函数            |
| 文本类型          | 直接字符串                                        | 无                            |
| 数组类型          | 返回数组结构，里面元素被`react.createElement`转换 | 无                            |

> 表达式或者函数的执行都先执行函数/表达式，然后按上面的规则去处理。

## 后续处理

调和阶段，

1. 创建---上述 React element 对象的每一个子节点都会形成一个与之对应的 fiber 对象，
2. 关联---然后通过 sibling、return、child 将每一个 fiber 对象联系起来

### 创建fiber对象

#### 各种种类的fiber对象

> 不同种类的 `React Element`  会产生不同 种类的 fiber 对象
>
> 不同的类型 有不同的tag

```js
export const FunctionComponent = 0;       // 函数组件
export const ClassComponent = 1;          // 类组件
export const IndeterminateComponent = 2;  // 初始化不知道是类组件或函数组件时的过渡tag 
export const HostRoot = 3;                // 通过reactDom.render()产生的根元素 RootFiber
export const HostPortal = 4;              // 对应 ReactDOM.createPortal 产生的 Portal 
export const HostComponent = 5;           // dom 元素 比如 <div>
export const HostText = 6;                // 文本节点
export const Fragment = 7;                // 对应 <React.Fragment> 
export const Mode = 8;                    // 对应 <React.StrictMode>   
export const ContextConsumer = 9;         // 对应 <Context.Consumer>
export const ContextProvider = 10;        // 对应 <Context.Provider>
export const ForwardRef = 11;             // 对应 React.ForwardRef
export const Profiler = 12;               // 对应 <Profiler/ >
export const SuspenseComponent = 13;      // 对应 <Suspense>
export const MemoComponent = 14;          // 对应 React.memo 返回的组件
```

> map返回数组结构的外层 会被加上fragment 节点

### 关联fiber对象

fiber 对应关系

- child： 一个由父级 fiber 指向子级 fiber 的指针。

- return：一个子级 fiber 指向父级 fiber 的指针。

- sibiling: 一个 fiber 指向下一个兄弟 fiber 的指针。

```jsx
const toLearn = ["jsx", "fiber调和", "虚拟dom", "diff算法"];

const TextComponent = () => <div>  i am function component </div>;

class Index extends React.Component {
  status = false; /* 状态 */
  render() {
    /* 以下都是常用的jsx元素节 */
    return (
      <div style={{ marginTop: "100px" }}>
        {/* element 元素类型 */}
        <div>hello,world</div>
        {/* fragment 类型 */}
        <React.Fragment>
          <div> 嘿嘿 </div>
        </React.Fragment>
        {/* text 文本类型 */}
        my name is 云实
        {/* 数组节点类型 */}
        {toLearn.map((item) => (
          <div key={item}>let us learn {item} </div>
        ))}
        {/* 组件类型 */}
        <TextComponent />
        {/* 三元运算 */}
        {this.status ? <TextComponent /> : <div>三元运算</div>}
        {/* 函数执行 */}
        {this.renderFoot()}
        <button onClick={() => console.log(this.render())}>
          打印render后的内容
        </button>
      </div>
    );
  }
}
```

![fiber树](https://i.loli.net/2021/09/18/jkzisC84haqLm6V.png)

## element,fiber,dom三种什么关系？

- element 是 React **视图层在代码层级上的表象**，也就是开发者写的 jsx 语法，写的元素结构，都会被创建成 element 对象的形式。上面保存了 props ， children 等信息。
- DOM 是元素在浏览器上给用户**直观的表象**。
- fiber 可以说是是 element 和真实 DOM 之间的交流枢纽站，一方面每一个类型 element 都会有一个与之对应的 fiber 类型，element 变化引起更新流程都是通过 fiber 层面做一次调和改变，然后对于元素，形成新的 DOM 做视图渲染。

![image-20210918135721637](https://i.loli.net/2021/09/18/nlSy5XOIZs4Twmt.png)

