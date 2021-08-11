## 两列布局

### 一列定宽一列自适应

#### flex方案

```css
#parent {
 display:flex;
}
#left {
  width:100px;
}
#right {
  flex:1;
}
```

#### Grid方案

```css
#parent {
  display:grid;
  grid-template-columns:100px 1fr;
}
```

#### float+margin

```css
#left {
  float:left;
  // 
  width:100px
}
#right {
  margin-left:-100px;// 大于等于左边的宽度
}
```

### 一列不定宽，一列自适应

#### flex方案

```css
#parent {
  display:flex;
}
#left {
//不能设置宽度
}
#right {
  flex:1;
}
```

#### Grid方案

```css
#parent {
  display:grid;
  grid-template-columns:auto 1fr;
}
```

#### float+overflow

```css
#left {
 float:left;
 // 不能设置宽度
}
#right {
 overflow:hidden;
}
```

## 三列布局

> 连列定宽 一列自适应 可以和两列布局一样 把定宽的两列放在一起讨论 不做演示

### 两侧定宽 中间自适应

#### Grid

```css
#parent {
 display:grid;
 grid-template-rows:100px auto 100px;
}
```

#### 双飞翼布局

```html
<style>
  body {
    min-width: 550px;
  }
  #center {
    width: 100%;
    height: 200px;
    background-color: skyblue;
  }
  #left {
    width: 150px;
    height: 200px;
    background-color: #ab2b2b;
  }
  #right {
    width: 200px;
    height: 200px;
    background-color: #eddd9e;
  }
  /* 1.先浮动起来 */
  .column {
    float: left;
  }
  /* 2.通过margin给两边留白 */
  #center-wrap {
    margin: 0 200px 0 150px;
  }
  /* 3.设置左边 设置 margin-left:-100% 从而向上挤一行 和center重叠 */
  #left {
    margin-left: -100%;
  }
  /* 4.设置右边  */
  #right {
    margin-left:-200px;
  }
</style>
<body>
  <main>
    <div id="center" class="column">
      <div id="center-wrap">
        this is center
      </div>
    </div>
    <div id="left" class="column">this is left</div>
    <div id="right" class="column">this is right</div>
  </main>
</body>
```

#### 圣杯布局

```html
<style>
  /* 基础设置部分 */
  header {
    background-color: #ccc;
  }
  footer {
    background-color: #ddd;
  }
  header,footer {
    text-align: center;
  }
  .column {
    height: 30px;
  }
  #left {
    background-color: skyblue;
    width: 150px;
  }
  #right {
    background-color: #eddd9e;
    width: 200px;
  }
  #center {
    background-color: #ab2b2b;
    width: 100%;
  }
  /* 核心实现圣杯布局 */
  /* 1.让三块都浮动起来 */
  .column {
    float: left;
  }
  /* 2.清除浮动 */
  footer {
    clear: both;
  }
  /* 3.根据左右的两部分的宽度 父元素设置padding 
      从而让left和right部分有地方去 */
  #container {
    padding-right: 200px;
    padding-left:150px ;
  }
  /* 4.设置左边 
    margin-left:-100% 从而向上挤一行 和center重叠  */
  #left {
    margin-left:-100%;
  }
  /* 5.设置左边
  相对定位 将自己往左移动200px */
  #left {
    position: relative;
    right: 150px;
  }
  /* 6.设置右边 
    margin-right设置负值  右侧的元素不占位置后 right元素就上去了*/
  #right {
    margin-right: -200px;
  }

</style>
<body>
  <header>我是头部</header>
  <main id="container">
    <div class="column" id='center'>center</div>
    <div class="column" id="left" >left</div>
    <div class="column" id="right">right</div>
  </main>
  <footer>我是尾部</footer>
</body>
```

## 多列布局

### 九宫格布局

#### flex方案

```html
<div id="parent">
    <div class="row">
        <div class="item">1</div>
        <div class="item">2</div>
        <div class="item">3</div>
    </div>
    <div class="row">
        <div class="item">4</div>
        <div class="item">5</div>
        <div class="item">6</div>
    </div>
    <div class="row">
        <div class="item">7</div>
        <div class="item">8</div>
        <div class="item">9</div>
    </div>
</div>
```

```css
#parent {
    width: 1200px;
    height: 500px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
}
.row {
    display: flex;
    flex: 1;
}
.item {
    flex: 1;
    border: 1px solid #000;
}
```

#### grid方案

```html
<div id="parent">
    <div class="item">1</div>
    <div class="item">2</div>
    <div class="item">3</div>
    <div class="item">4</div>
    <div class="item">5</div>
    <div class="item">6</div>
    <div class="item">7</div>
    <div class="item">8</div>
    <div class="item">9</div>
</div>
```

```css
#parent {
    width: 1200px;
    height: 500px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(3, 1fr); /*等同于1fr 1fr 1fr,此为重复的合并写法*/
    grid-template-rows: repeat(3, 1fr);  /*等同于1fr 1fr 1fr,此为重复的合并写法*/
}
.item {
    border: 1px solid #000;
}
```