### 前置概念

#### 剩余空间

> 在父容器的 **主轴**上还有多少空间 可以 被**瓜分**

#### 溢出空间

> 在父容器的 **主轴**上超出了多少空间

### flex-grow 拉伸

> 默认值是0

#### 计算公式

>  元素分配到的剩余空间  = 总剩余空间 * 当前元素flex-grow的值/主轴所有元素的flex-grow之和

:chestnut:例子

> 总剩余空间  n
>
> 假设三个 flex-item（A,B,C）    flex-grow 的值分别为  x,y,z
>
> 元素A分配到剩余空间 = n * x/(x+y+z)

```css
.container {
    display: flex;
    width: 500px;
    height: 200px;
    background-color: #eee;
    color: #666;
    text-align: center;
}
.item {
    height: 100px;
    p {
      margin: 0;
    }
}
.A{
    width: 100px;
    flex-grow:1;
    background-color:#ff4466;
}
.B{
    width: 150px;
    flex-grow:2;
    background-color:#42b983;
}
.C{
    width: 100px;
    flex-grow:3;
    background-color:#61dafb;
}
```

```
A能分配到的剩余空间 = (500-350)*1/(1+2+3)=25px
A的实际宽度  = 100+25 = 125px;
```

###  flex-shrink 收缩

> - 默认值是1
>
> - **如果子容器没有超出父容器，设置 flex-shrink 无效**

#### 计算公式

> 元素要被压缩的空间 =  压缩率  * 溢出空间
>
> 压缩率 = 当前元素的flex-shrink * 当前元素的宽度 /（所有元素的各个宽度*该元素的flex-shrink之和）

:chestnut: 例子

```
总溢出空间  n
假设三个 flex-item（A,B,C）    flex-shrink 的值分别为  x,y,z  宽度分别为w1,w2,w3
元素A要被压缩的空间 =  x*w1 / (x*w1+y*w2+z*w3) * 溢出空间
```

```css
.container {
    display: flex;
    width: 500px;
    height: 200px;
    background-color: #eee;
    color: #666;
    text-align: center;
}
.item {
    height: 100px;
    p {
      margin: 0;
    }
}
.A{
    width: 300px;
    flex-shirnk:1;
    background-color:#ff4466;
}
.B{
    width: 150px;
    flex-shirnk:2;
    background-color:#42b983;
}
.C{
    width: 200px;
    flex-shirnk:3;
    background-color:#61dafb;
}
```

```css
溢出总空间 ： 650-500 = 150px
元素A的压缩空间 = 300*1/(300*1+150*2+200*3) * 150px = 37.5px
实际宽度： 300px -37.5 = 262.5
```

### flex-basis 初始大小

#### 权重优先级

> max-width/min-width > flex-basis > width > box
