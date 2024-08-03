# EJS嵌入式模板
## 安装
利用 NPM 安装 EJS 很简单，[官网](https://ejs.bootcss.com/)。
```bash
npm install ejs
```
## 用法
### 基本使用

**`render`方法：传入模版字符串，用于返回 HTML 字符串**
```javascript
let ejs = require('ejs')
// 输出渲染后的 HTML 字符串
// str: HTML 模版
// data: 数据
// options: 参数
const html = ejs.render(str, data, options)


// 例子
const html = ejs.render('<%= people.join(", "); %>', {people: people});
```
**`compile`方法：传入模版字符串，返回一个用于生成 HTML 字符串的函数**
```javascript
let ejs = require('ejs')
const template = ejs.compile(str, options)
// 输出渲染后的 HTML 字符串
template(data)
```
**`renderFile`方法：传入模版文件，并返回 HTML 字符串**
```javascript
// str：渲染后的 HTML 字符串
ejs.renderFile(filename, data, options, function(err, str){});
```
#### options 属性

- `async`：当值为`true`时，EJS 将使用异步函数进行渲染。（依赖于 JS 运行环境对 async/await 是否支持）
- `delimiter`：放在角括号中的字符，用于标记标签的开与闭，默认是`%`，即`<%= x %>`
   - 假设设置为`?`，在使用时就变成了`<?= x ?>`
## 模版标签
### 输出数据（不渲染HTML）
`<%= x %>`输出数据到模板，如果输出包含 HTML 标签，不会被渲染。
```html
<!-- 假设 x = asdf -->
<div>
   <%= x %>
</div>
  
 <!-- 编译后 -->
  <div>
    asdf
  </div>
```
### 输出数据（渲染HTML）
`<%- x %>`输出数据到模板，如果输出包含 HTML 标签，HTML会被渲染。
```html
<!-- 假设 x = <div style="color: red">asdf</div> -->
<div>
   <%- x %>
</div>
  
 <!-- 编译后，asdf 是红色样式 -->
  <div>
    <div style="color: red">asdf</div>
  </div>
```
### 删除数据中的空格
- `<%_`将开始标签前面的空格符全部删除
- `_%>`将结束标签后面的空格符全部删除
```html
<h1><%= 'Title' _%>      </h1>

<!-- convert -->
<h1>Title</h1>
```
### 删除数据中的回车
 `-%>`删除紧随其后的换行符，只删除一个
```html
<h1><%= 'Title' -%>
</h1>

<!-- convert -->
<h1>Title</h1>
```
### 表达式标签
`<%` '脚本' 标签，用于流程控制，无输出
#### `if`语句
```html
<div>
   <% if(test) { %>
     <%= test %>
   <% } else { %>
     123
   <% } %>
</div>
```
#### 循环语句
```html
<ul>
  <% users.forEach(function(user){ %>
    <%= user %>
  <% }) %>
</ul>
```
### 其他标签
- `<%# 注释 %>`：注释，不输出内容
- `<%%`：输出字符串`'<%'`
## 导入模版片段
通过`include`指令将相对于模板路径中的模板片段包含进来

需要结合`<%-`使用，避免对输出的 HTML 代码做转义处理
```html
<ul>
  <% users.forEach(function(user){ %>
    <%- include('user/show', {user: user}); %>
  <% }); %>
</ul>
```
## Koa2 中使用
```bash
# 安装 koa-views、ejs
npm install koa-views ejs --save
```
```javascript
 // 加载模板引擎，views文件夹内存放 ejs 模版
app.use(views(path.join(__dirname, './views'), {
    extension: 'ejs'
}))
// 使用
app.use( async ( ctx ) => {
    // 传入模版文件和数据
    // 如果不加入 koa-views 依赖和配置，ctx 对象没有 render 方法
    await ctx.render('index', {
        title: 'hello koa2'
    })
})
```
### 缓存
EJS 附带了一个基本的进程内缓存，用于缓在渲染模板过程中所生成的临时 JavaScript 函数。 通过 Node 的`lru-cache`库可以很容易地加入 LRU 缓存：
```javascript
const ejs = require('ejs')
LRU = require('lru-cache')
// 具有 100 条内容限制的 LRU 缓存
ejs.cache = LRU(100);
```