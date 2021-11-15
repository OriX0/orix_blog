## 时间分片

### 适用场景

初次加载，一次性渲染大量数据造成的卡顿 （**浏览器执 js 速度要比渲染 DOM 速度快的多**）

### 实现

#### 原理

通过event loop，将一次性任务分割开，让任务每次完成一小部分

#### 思路

- 规定一些变量
  - 每次渲染的数量 （通过每次渲染的数量计算出总次数）
  - 缓存当前渲染的次数
  - 缓存当前渲染的列表
- 开始渲染，通过当前index和总次数进行比较 判断是否渲染完成
  - 未完成   通过 `requestIdleCallback ` 或 `setTimeout ` 让浏览器空闲时执行下一帧渲染
- 通过 `renderList` 把已经渲染的 `element`缓存起来，下次渲染可跳过

#### 实例

```jsx
class Index extends React.Component{
    state={
        dataList:[],    //数据源列表
        renderList:[],  //渲染列表
        position:{ width:0,height:0 }, // 位置信息
        eachRenderNum:500,  // 每次渲染数量
    }
    box = React.createRef() 
    componentDidMount(){
        const { offsetHeight , offsetWidth } = this.box.current
        const originList = new Array(20000).fill(1)
        const times = Math.ceil(originList.length / this.state.eachRenderNum) /* 计算需要渲染此次数*/
        let index = 1
        this.setState({
            dataList:originList,
            position: { height:offsetHeight,width:offsetWidth },
        },()=>{
            this.toRenderList(index,times)
        })
    }
    toRenderList=(index,times)=>{
        if(index > times) return /* 如果渲染完成，那么退出 */
        const { renderList } = this.state
        renderList.push(this.renderNewList(index)) /* 通过缓存element把所有渲染完成的list缓存下来，下一次更新，直接跳过渲染 */
        this.setState({
            renderList,
        })
        requestIdleCallback(()=>{ /* 用 requestIdleCallback 代替 setTimeout 浏览器空闲执行下一批渲染 */
            this.toRenderList(++index,times)
        })
    }
    renderNewList(index){  /* 得到最新的渲染列表 */
        const { dataList , position , eachRenderNum } = this.state
        const list = dataList.slice((index-1) * eachRenderNum , index * eachRenderNum  )
        return <React.Fragment key={index} >
            {  
                list.map((item,index) => <Circle key={index} position={position}  />)
            }
        </React.Fragment>
    }
    render(){
         return <div className="bigData_index" ref={this.box}  >
            { this.state.renderList }
         </div>
    }
}
```

## 虚拟列表

### 适用场景

处理大量Dom存在 带来的性能问题

### 实现

#### 三个区域

![image-20211115175259082](http://image.ori8.cn/img/202111151753156.png)

- 视图区：视图区就是能够直观看到的列表区，此时的元素都是真实的 DOM 元素。
- 缓冲区：缓冲区是为了防止用户上滑或者下滑过程中，出现白屏等效果。（缓冲区和视图区为渲染真实的 DOM ）
- 虚拟区：剩下的区域，不需要渲染真实的 DOM 元素。

#### 思路

##### 元素定高

- useRef 获取元素，缓存变量
- useEffect 初始化计算 容器高度。 截取初始化列表长度
- 监听 滚动容器的 onScroll 事件
  - 根据scollTop来计算渲染区域的向上偏移量
- 通过计算 真实dom的 end和 start 来重新渲染列表

##### 元素不定高

- 元素不定高，先给到一个虚拟高度
- 生成一个object 保存着 各个元素理论上的位置
- 滚动事件新增
  - 取得当前视图区第一个元素的高度和index ，计算出和理论位置的偏差
  - 更新object  index后的理论高度

