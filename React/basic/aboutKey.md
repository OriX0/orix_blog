## 关于key的合理使用

> 关于 React.createElement的知识配合 JSX章节来阅读

### 从diff children的流程出发

#### 遍历新children  复用 老的fiber节点

1. React.createElement 产生了 新的数组（child组成）
2. 遍历该数组，同时**旧fiber树**节点 的指针也会**同时移动**，找到和当前 child 对应的 旧fiber
3. 然后调用 updateSolat方法
   - 判断 当前的child 和fiber 的 tag和key是否匹配
     - 匹配就复用老fiber形成新的fiber
     - 不匹配就返回null，此时newFiber等于null

```jsx
//react-reconciler/src/ReactChildFiber.js
function reconcileChildrenArray(){
    /* 第一步  */
    for (; oldFiber !== null && newIdx < newChildren.length; newIdx++) {  
        if (oldFiber.index > newIdx) {
            nextOldFiber = oldFiber;
            oldFiber = null;
        } else {
            nextOldFiber = oldFiber.sibling;
        }
        const newFiber = updateSlot(returnFiber,oldFiber,newChildren[newIdx],expirationTime,);
        if (newFiber === null) { break }
        // ..一些其他逻辑
        }  
        if (shouldTrackSideEffects) {  // shouldTrackSideEffects 为更新流程。
            if (oldFiber && newFiber.alternate === null) { /* 找到了与新节点对应的fiber，但是不能复用，那么直接删除老节点 */
                deleteChild(returnFiber, oldFiber);
            }
        }
    }
}
```

### 后续处理场景

#### 节点删除

- **oldChild: A B C D**
- **newChild: A B**

> 统一删除oldFiber

```js
if (newIdx === newChildren.length) {
    deleteRemainingChildren(returnFiber, oldFiber);
    return resultingFirstChild;
```

#### 节点新增

- **oldChild: A B**
- **newChild: A B C D**

> 统一创建newFiber

```js
if(oldFiber === null){
   for (; newIdx < newChildren.length; newIdx++) {
       const newFiber = createChild(returnFiber,newChildren[newIdx],expirationTime,)
       // ...
   }
}
```

#### 节点移动（位置改变）

- **oldChild: A B C D**
- **newChild: A B D C**

> 先复用 A B  ,然后调用mapRemainingChildren 并遍历处理没有处理到的children

- mapRemainingChildren 方法返回一个map
  - map里存放 老fiber和对应的key的映射关系
- 遍历没有处理的Child
  - updateFromMap 处理，判断 返回的map中有没有可以复用的oldFiber，
    - 有 就复用，且在mapRemainingChildren 返回的map里删除
    - 没有 就新建

```js
const existingChildren = mapRemainingChildren(returnFiber, oldFiber);
for (; newIdx < newChildren.length; newIdx++) {
    const newFiber = updateFromMap(existingChildren,returnFiber)
    /* 从mapRemainingChildren删掉已经复用oldFiber */
}
```

#### 复杂情况（删除+新增+移动）

- **oldChild: A B C D**
- **newChild: A E D B**

> 会按照上面的流程去操作
>
> - 先复用 A
> - 再创建 E
> - D B 按照移动的处理
> - 删除C