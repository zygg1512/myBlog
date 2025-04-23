# 物理像素、逻辑像素、dpr
- __物理像素__：也称硬件像素，也就是说手机屏幕实际拥有的像素点，如：iPhone 6屏幕宽度750个像素点，高度1334个像素点
- __逻辑像素__：也称 __设备独立像素__，即在css/js代码中使用的像素，这个不同的设备是不一样的。在viewport为ideal-viewport模式时， 如iphone6此时的viewport为375px，代表着我们在css中写375px就可以达到全屏的效果；
- __设备像素比（dpr）__：设备的 __物理像素__ 与 __逻辑像素__ 比

## 设备逻辑像素和物理像素获取
在iPhone 6设备上通过window.screen.width和document.documentElement.clientWidth获取的宽度都是 __逻辑像素__ 375

而我们经常说的1倍图、2倍图、3倍图，就是是通过 设备的 __物理像素 / 逻辑像素__ 计算得来，如iPhone 6（750 / 375 = 2）。也可以直接通过window.devicePixelRatio获取设备的像素比

__注意__

在js代码中是无法直接获取到设备的物理像素的，需要通过document.documentElement.clientWidth * window.devicePixelRatio来间接的获取

## 各个设备尺寸图

<img src="https://github.com/zygg1512/myBlog/raw/master/images/css/rem.png" />

__physic pixel：物理像素__

__logic pixel：设计像素（iPhone+独有的，比较特殊）__

__logic point：设备独立像素__

__scale：设备像素比（DPR）__

__PPI：每英寸所占用的像素数目__

__DPI：每英寸占用的点数目__

在上图中我们发现iPhone 6+ 下面多了（downsampling 1242 * 2208），细心的我们其实也发现了，逻辑像素414 * 736 放大3倍就是1242 * 2208，__而这里iPhone 6+的物理像素怎么会是1080 * 1920呢？__

这个downsample（降低采样）技术就是 __将1242 * 2208个像素塞到1080 * 1920个实际物理像素点里来渲染__，这个过程是系统自动完成的，我们不需要管


所以我们在做适配时，可直接把1242 * 2208视为iPhone 6+ 的 __物理像素__，设计也是以1242 * 2208为标准，因此通常把1242 * 2208称为iPhone 6+的 __设计像素__

#### iPhone 6+为什么这样设计?
>其实，当初苹果公司在确定iPhone 6Plus的设备像素比时，想过如果选2，同样的字号在iPhone 6Plus上看起来比6还小，不好；如果选3，字又显得太大，导致一屏展示的内容还没有6多；最合适视觉的设备像素比值是2.46，但是这样一个数字能把设计师和程序员逼疯，最后就想出了引入“设计像素”这样一个两全其美的方案。


# 关于 viewport
viewport就是浏览器上用来显示网页的那部分区域
- layout viewport:整个网页所占据的区域（包括可视也包括不可视的区域）  默认的
- visual viewport:网页在浏览器上的可视区域（浏览器中能够看见的区域）
- ideal viewport:ideal viewport是一个能完美适配移动设备的viewport（没有固定尺寸，就是屏幕的宽度）


layout viewport是默认的，但是由于移动设备比pc端的可视区域小，所以当页面在移动设备上时，字体会很小或出现横向滚动条。为解决此问题，一般会在head里加入代码：
```
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0,minimum-scale=1.0,user-scalable=0" />
/*width=device-width能使所有浏览器当前的viewport宽度变成ideal viewport的宽度，initial-scale=1是将页面的初始缩放值设为1。*/
```
用来将viewport的宽度变成ideal viewport的宽度，防止横向滚动条出现。

- width：设置layout viewport 的宽度，为一个正整数，或字符串”width-device”
- initial-scale：设置页面的初始缩放值，为一个数字，可以带小数
- minimum-scale：允许用户的最小缩放值，为一个数字，可以带小数
- maximum-scale：允许用户的最大缩放值，为一个数字，可以带小数
- height ：设置layout viewport 的高度，这个属性对我们并不重
- user-scalable：是否允许用户进行缩放，值为”no”或”yes”, 如果设置为no，那么minimum-scale 和 maximum-scale都将被忽略，因为根本不可能缩放。


# em 和 rem
## em
1. em作为font-size的单位时，其代表父元素的字体大小
2. <font color=#f00>em作为其他属性单位时，代表自身字体大小</font>

```xml
<div class="p1">
    <div class="s1">1</div>
    <div class="s2">1</div>
</div>
<div class="p2">
    <div class="s5">1</div>
    <div class="s6">1</div>
</div>

<style>
.p1 {font-size: 16px; line-height: 32px;}
.s1 {font-size: 2em;}
.s2 {font-size: 2em; line-height: 2em;}

.p2 {font-size: 16px; line-height: 2;}
.s5 {font-size: 2em;}
.s6 {font-size: 2em; line-height: 2em;}
</style>
```
答案
```
.p1 {font-size: 16px; line-height: 32px;}
.s1 {font-size: 32px; line-height: 32px;}
.s2 {font-size: 32px; line-height: 64px;}

.p2 {font-size: 16px; line-height: 32px;}
.s5 {font-size: 32px; line-height: 64px;}
.s6 {font-size: 32px; line-height: 64px;}
```

## rem
- 它是CSS3中新增加的一个尺寸（度量）单位，根节点（html）的font-size决定了rem的尺寸，也就是说它是一个相对单位，相对于(html)。
- 浏览器的默认的font-size是16px，1rem默认就等于16px。（chrome最小字体为12px）

### vw方式计算
假设 UI 图是750px，UI图上一个 div 元素是 400px

则
```
1vw = 7.5px
10vw = 75px
```
设置 html 的字体样式为 10vw，则
```
1rem = 10vw = 75px
x rem = 400px / 10vw = 400px / 75px 
```
但是这种计算每次都要除 75，要用计算器，真麻烦。。。。

所以 再计算，让他每次都除 100 岂不美哉！！！！

既然要除 100，那说明 html 在 750px下字体大小 x vw = 100px

则
```
1 vw = 7.5px
x vw = 100px
```
计算一下 得出 x = 15.33333333333 

设置 html的字体大小为15.33333333333vw 

### 综上 简单总结一下通用公式
- x：要设置的html字体大小
- y：UI 图的宽度

通用公式
```
1 vw = y / 100 px
x vw = 100px
推出
x vw = 10000 / y

此时 x vw = 100px
计算 rem 时 只要用当前 UI 图中的元素宽度除 100 既是rem
```
### 基准
#### 以 iPhone6 为基准 屏幕宽度(UI图) 375px，div宽度 200px
手机型号 | 响应后的宽度
:-:   | :-:
iphone5|170px
iphone6|200px
ipad|410px

#### 以 iPhone5 为基准 屏幕宽度(UI图) 320px，div宽度 200px
手机型号 | 响应后的宽度
:-:   | :-:
iphone5|200px
iphone6|234px
ipad|480px

### 网易rem计算方式
### 思路
假设设计图是 750px，为了计算方便，取一个100px的font-size为参照，那么body元素的宽度就可以设置为width: 7.5rem（1rem=100px，则750px=7.5rem）；于是html的font-size=deviceWidth / 7.5（只有这样font-size才能等于100px）
#### 实现
```javascript
document.documentElement.style.fontSize = document.documentElement.clientWidth / 7.5 + 'px';
```
布局时，设计图标注的尺寸除以100得到css中的尺寸

比如div高度为210px，写样式的时候css应该这么写：height: 2.1rem。之所以取一个100作为参照，就是为了这里计算rem的方便

#### 注意点
第一，如果采用网易这种做法，视口要如下设置：

`<meta name="viewport" content="initial-scale=1,maximum-scale=1, minimum-scale=1">`

第二，当deviceWidth大于设计稿的宽度时，html的font-size应始终等于 __设计图宽度/body元素宽__
之所以这么干，是因为当deviceWidth大于750时，则物理分辨率大于1500（这就看设备的devicePixelRatio这个值了），应该去访问 pc 网站了。

事实就是这样，你从手机访问网易，看到的是触屏版的页面，如果从pad访问，看到的就是电脑版的页面。如果你也想这么干，只要把js的代码稍微改一下就行了：
```javascript
var deviceWidth = document.documentElement.clientWidth;
if(deviceWidth > 750) deviceWidth = 750;
document.documentElement.style.fontSize = deviceWidth / 7.5 + 'px';
```

### 淘宝的rem
（1）动态设置viewport的scale
```javascript
var scale = 1 / devicePixelRatio;
document.querySelector('meta[name="viewport"]').setAttribute('content','initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no');
```

（2）动态计算html的font-size
```javascript
document.documentElement.style.fontSize = document.documentElement.clientWidth / 10 + 'px';
```

（3）布局的时候，各元素的css尺寸=设计稿元素尺寸/设计稿宽度/10

（4）font-size可能需要额外的媒介查询，并且font-size不使用rem，这一点跟网易是一样的。
#### 淘宝方式通过sass或者less自动计算元素的rem
```javascript
@baseFontSize: 75;//基于视觉稿横屏尺寸/100得出的基准font-size
.px2rem(@name, @px){
    @{name}: @px / @baseFontSize * 1rem;
}
//使用示例：
.container {
    .px2rem(height, 240);
}
//less翻译结果：
.container {
    height: 3.2rem;
}
```
#### 为什么要动态设置viewport的scale
通常我们采用如下代码设置viewport:

```xml
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
  ```
  
这样整个网页在设备内显示时的页面宽度就会等于设备逻辑像素大小，也就是device-width。这个device-width的计算公式为：

__设备的物理分辨率/(devicePixelRatio * scale)__

在scale为1的情况下，

__device-width = 设备的物理分辨率/devicePixelRatio__

devicePixelRatio称为设备像素比，每款设备的devicePixelRatio都是已知，并且不变的，目前高清屏，普遍都是2，不过还有更高的，比如2.5, 3 等。

淘宝触屏版布局的前提就是viewport的scale根据devicePixelRatio动态设置

- 在devicePixelRatio为2的时候，scale为0.5

- 在devicePixelRatio为3的时候，scale为0.3333

这么做目的当然是为了保证 __页面的大小__ 与 __设计稿__ 保持一致，比如设计稿如果是750px，那么实际页面的device-width，以iphone6来说，也等于750，这样的话设计稿上元素的尺寸只要除以某一个值就能够转换为rem了


### 其他几种rem计算方式

#### 使用 postcss-plugin-pr2rem 自动转换px为rem 的配置方法
还有另外两种配置方法：postcss-pxtorem（postcss-px2rem），
这里说一下 postcss-plugin-px2rem，其他的两种可以看[这里](https://www.cnblogs.com/hss-blog/p/11362900.html)

假设我们拿到一个以 iPhone 6 Plus 为基准的视觉稿，宽度为 1750px，视觉稿上有个 400px 宽度的 div，那么html font-size=1vw，所以我们写 CSS 则根据实际宽度来写：
```css
div{
    width: 400pr;
}
```
> 在我们实际项目中，为了区分 rem 和 vw，专门引入了一个新的单位pr（再次类似小程序的 rpx），这样我们写 pr 的时候，经过postcss 处理会被转换成对应的 rem，而不是直接写 rem（防止混淆，万一真的用到 rem 或者 vw 呢），为了转换pr单位，这里引入了一个postcss插件：postcss-plugin-pr2rem。

下载
```javascript
npm i -D postcss-plugin-pr2rem
```
在 postcsss.config.js 中配置 postcss-plugin-pr2rem：
```javascript
const pr2rem = require('postcss-plugin-pr2rem');

const pr2remConfig = {
    // 设计图为750px，一份 root 对应着 rootWidth/100 = 7.5px
    /* 
    1. 如果是默认100，把根标签的字体规定为1rem为50px,这样就可以从设计稿上量出多少个px直接在代码中写多上px了。
    2. 如果是 设计图宽度/100，把根标签的字体规定为1rem为1vw,这样就可以从设计稿上量出多少个px直接在代码中写多上px了。
    */
    rootValue: 7.5, //换算基数（1rem 对应的 px 的值）， 默认100  
    unitPrecision: 1, // 转换成REM后的小数点的个数，设为 1 ，50.3 rem
    propWhiteList: [],//默认值是一个空数组，这意味着禁用白名单并启用所有属性。
    propBlackList: ['font-size'], // 黑名单(不会转换)
    selectorBlackList: [], ///要忽略并保留为px的选择器
    ignoreIdentifier: '00',  //（boolean/string）忽略单个属性的方法，启用ignoreidentifier后，replace将自动设置为true。
    replace: true, // （布尔值）替换包含REM的规则，而不是添加回退。
    mediaQuery: false,  //（布尔值）允许在媒体查询中转换px。
    minPixelValue: 3, //要替换的最小像素值(3pr会被转rem),低于3的将不会转换。 默认 0
};

module.exports = {
    plugins: [pr2rem(pr2remConfig)]
};
```
执行后
```css
/* input */
div{
    width: 621pr;
}

/* output */
div {
    width: 50rem;
}
```


### 关于 1px边框的问题
>在retina屏中，像素比为2(iPhone6/7/8)或3(iPhone6Plus/7Plus/8Plus)，1px的边框看起来比真的1px更宽。

>所谓“Retina”是一种显示标准，是把更多的像素点压缩至一块屏幕里，从而达到更高的分辨率并提高屏幕显示的细腻程度

#### 解决方案：使用伪类加transform的方式
元素本身不定义边框，伪元素定义1px边框，并且根据根据像素比值设置缩放比例，像素比为3时设置为0.33，像素比为2时设置0.5。
```html
HTML:
<div class="border-1px"></div>

CSS:
<style>
.border-1px {
    position: relative;
}

.border-1px:after {
    position: absolute;
    content: "";
    width: 100%;
    height: 100%;
    border-top: 1px solid #666;
}
/* min-device-pixel-radio 像素比 */
@media (min-device-pixel-radio: 3) {
    border-1px::after {
        -webkit-transform: scaleY(0.33333333);
        transform: scaleY(0.33333333);
    }
}

@media (min-device-pixel-radio: 2) {
    border-1px::after {
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
    }
}
</style>
```

### 关于 元素字体大小
首先是字体的问题，字体大小并不能使用rem，__字体的大小和字体宽度，并不成线性关系__，所以字体大小不能使用rem；由于设置了根元素字体的大小，会影响所有没有设置字体大小的元素，因为字体大小是会继承的，难道要每个元素都显示设置字体大小？

那字体的大小如何实现响应式呢？可以通过修改body字体的大小来实现，同时所有设置字体大小的地方都是用em单位，对就是em，因为只有em才能实现，同步变化，早就说过em就是为字体而生的

当然不同屏幕字体大小相同也是非常合理和不错的效果，需要你自己做决策
```javascript
@media screen and (min-width: 320px) {
    body {font-size: 16px}
}
@media screen and (min-width: 481px) and (max-width:640px) {
    body {font-size: 18px}
}
@media screen and (min-width: 641px) {
    body {font-size: 20px}
}

p {font-size: 1.2em}
p a {font-size: 1.2em}
```

