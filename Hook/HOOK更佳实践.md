## HOOK更佳实践

### 整体思路-拆分 尽可能隔离  将hooks当成普通函数

#### 实例

##### 需求

1. 需要展示一个博客文章的列表  
2. 其中一列显示文章的分类
3. 提供表格过滤功能  只显示某个分类的文章

##### 思路

1. API获取文章列表
2. API获取分类列表
3. 结合分类数据和文章
4. 根据选择的分类过滤
5. 渲染UI

##### hooks编写思路

1. useArticles --获取文章列表
2. useCategories---获取分类列表
3. useCombinedArticles ---结合分类和文章数据
4. useFilteredArticles ---过滤
5. 在ui容器中 分别调用以上hook

### 设计模式

#### 按条件渲染--容器模式 或者写入hook中

##### 容器模式

**将条件判断的结果放到两个组件之中**

###### :chestnut:实例

**需求**

1. modal组件 的visible为假 不渲染
2. visible 为真 获取数据并渲染

**错误写法**

```jsx
function someModal({visible,dataId,...rest}){
	if(!visible) return null;
    const {data,loading,error} = useGetData(dataId);
    return (
    	...渲染ui
    )
}
```

**容器模式**

```jsx
function modalWrapper({visible,...rest}){
	// 如果对话框不显示 就不render 任何内容
	if(!visible) return null;
    // 否则 真正执行对话框的组件逻辑
    return <SomeModal visible {...rest}>
}
```

##### 将判断写入hook中

#### render props 复用UI逻辑

:chestnut:实例

###### 需求

- 需要一个组件,当数据超过一定数量时候，显示一个更多的文字
- 鼠标移上去  弹出一个框 用于显示其他的数据
- 会在不同的列表中使用到

###### 实现

1. 父组件传入 renderItem函数
2. 子组件接受rederItem函数   max 和data参数
   - 先用renderItem 遍历 将每个子组件都实现出来
   - 再根据max 分割 要显示的和隐藏的数据组件
   - 最后对应显示出来

```jsx
function ListWithMore({ renderItem, data, max }) {
  const element = data.map((item, index) => renderItem(item, index, data));
  const showEle = element.slice(0, max);
  const hideEle = element.slice(max);
  return (
    <span>
      {showEle}
      {hideEle.length > 0 && (
        <Popover content={<div style={{ maxWidth: 500 }}>{hideEle}</div>}>
          <span>{hideEle.length}more...</span>
        </Popover>
      )}
    </span>
  );
}
```



### 状态管理

#### 1.保持状态的完整性和最小化

> **如果某个状态能从已有状态中计算得到 那么就不要计算结果保存到state中 而是通过计算得出**

:chestnut: 实例

###### 需求

- 一个搜索框+一个列表
- 列表展示的数据 是 由源数据 通过 搜索关键词过滤得到的

###### 实现

- searchKey 和data 可以用 useState 进行定义
- filterData  用 useMemo 进行包裹 内部是他的过滤逻辑 useMemo依赖项为 data 和searchKey

```js
import { useState, useMemo } from 'react';

function FilterList({ data }) {
  const [searchKey, setSearchKey] = useState('');
  const filtered = useMemo(() => {
    data.filtered((item) => {
      return item.title.toLowerCase().includes(searchKey.toLowerCase());
    });
  }, [data, searchKey]);
    
  return (
	...ui渲染
  );
}
```

#### 确认数据的来源，避免用中间状态转发

:chestnut:实例

###### 需求

- 和上面一样的需求
- 新增 将search参数 与 url 同步

###### 问题

让url不管因为什么原因（输入框改变,手动更改）发生变化，都能同步查询查询参数到`searchKey`

###### 解决方案

剥离中间的 `searchKey `这个`state`直接让 输入框与 url进行同步

> window.history.push() 向当前浏览器的历史里面添加一个状态
>
> 参数1：state 要传递的 state对象
>
> 参数2：title 标题 暂时不可用  一般传递 空字符串
>
> 参数3: url 新的历史记录

```js
import { useMemo, useCallback } from 'react';
import { useSearchParam } from 'react-use';

function FilterList({ data }) {
  /**
   * useSearchParam hook 从url中获取  key 关键词的值
   * 替代用state 去保存数据
   */
  // const [searchKey, setSearchKey] = useState('');
  const searchKey = useSearchParam('key') || '';
  const filtered = useMemo(() => {
    data.filtered((item) => {
      return item.title.toLowerCase().includes(searchKey.toLowerCase());
    });
  }, [data, searchKey]);
  const handleSearch = useCallback((evt) => {
    window.history.pushState(
      {},
      '',
      `${window.location.pathname}?key=${evt.target.value}`
    );
  });
  return (
	ui 渲染
  );
}
```

### 请求处理



#### 处理并发和串行请求

##### 处理思路

**从状态变化的角度去组织异步调用**  （useEffect 引发组件render）

##### :chestnut:实例

###### 需求

1. 获取文章内容
2. 获取作者信息 头像等
3. 获取文章的评论

###### 思路

作者信息要等到文章内容获取回来才知道

1. 组件首次渲染 传入id   
   - 先产生两个副作用 去获取 文章内容和评论
   - 因为还不知道作者id  先不进行use请求
2. 文章内容请求回来 触发二次渲染
3. 获得了作者id  请求接口
   - 展示用户信息

### useState

#### 函数式setState方法 配合useCallback 或者useMemo 减少不必要的创建

:chestnut: 两个方法实现效果一样

> 赋值式

```js
const handleIncrement = useCallback(() => setCount(count + 1), [count]);
```

> 函数式

```js
const handleIncrement = useCallback(() => setCount(q => q + 1), []);
```

##### 解析

- 赋值式 再每一次count变化时都会创建回调函数  即使**count不是增加**的行为
- 函数式  只创建了一次函数  后续每次创建都被 useCallback优化

### 函数组件中的redux

#### 异步使用

##### 前提---已经设置thunk等中间件

> fetch data 

```js
function fetchData(url){
    return dispatch=>{
        dispatch({type:'FETCH_DATA_BEGIN'})
        fetch(url).then(res=>{
            dispatch({ type: 'FETCH_DATA_SUCCESS', data: res });
        }).catch(error=>{
            dispatch({type:'FETCH_DATA_ERROR',error})
        })
    }
}
```

> 使用

```js
import fetchData from './fetchData';
function DataList() {  
    const dispatch = useDispatch();
    // dispatch 了一个函数由 redux-thunk 中间件去执行
    dispatch(fetchData('some url'));
}
```

