# Path 属性和方法
[path 路径 | Node.js v18 文档](https://nodejs.cn/dist/latest-v18.x/docs/api/path.html)
## Node 中的路径分类
node 中的路径大致分 5 类

### `__dirname`、`__filename`、`process.cwd()`
- `__dirname`：获得被执行文件所在目录的绝对路径
- `__filename`：获得被执行文件的绝对路径
- `process.cwd()`：获得执行 Node 命令时所在目录的绝对路径

假设`/Users/test/index.js`文件内容如下，并在`Users`目录下执行`node test`命令
```javascript
console.log(__dirname) // /Users/test
console.log(__filename) // /Users/test/index.js
console.log(process.cwd()) // /Users
```
### `./`、`../`
在`require`中使用时：
- `./`代表的路径和`__dirname`一致，即被执行文件所在目录的绝对路径
- `../`表示的是被执行文件所在目录的上级目录的绝对路径

不在`require`中使用时：
- `./`代表的路径和`process.cwd()`一致，即执行 Node 命令时所在目录的绝对路径
- `../`表示的是执行 Node 命令时所在目录的上级目录的绝对路径

假设`/Users/test/a.js`文件内容如下：
```javascript
module.exports = {
    a: 1
}
```
`/Users/test/index.js`文件内容如下
```javascript
console.log(__dirname) // /Users/test
console.log(process.cwd()) // /Users


const { a } = require('./a.js')
console.log(a) // 1

const fs = require('fs')
const _a = fs.readFileSync('./a.js') //  no such file or directory, open './a.js'
console.log(_a)
```
在`Users`目录中执行`node test`命令后，通过`require`的加载的方式可以读取到`a.js`文件，但通过其他方式就会报错。

所以为了避免上述情况发生，一定要在使用`require()`时才使用相对路径(`./`、`../`) 的写法，其他地方一律使用绝对路径。

## path 模块常用API
### `path.normalize`规范化路径
- 作用：规范化给定的路径。
  - 根据平台的不同，会对路径进行不同的规范化，举个例子，Unix系统是`/`，Windows系统是`\`，在两个系统下看到的返回结果就不一样。
- 语法：`path.normalize(path)`

```javascript
// 如果传入的路径以 / 结尾，则返回的路径也会以 / 结尾
console.log(path.normalize('/User//zygg//img//c')) // /User/zygg/img/c
console.log(path.normalize('/User//zygg//img//c//')) // /User/zygg/img/c/

// 如果传入的路径中有 ./ 或 ../ 则会解析
console.log(path.normalize('/User//zygg//img//c/.')) // /User/zygg/img/c
console.log(path.normalize('/User//zygg//img//c/..')) // /User/zygg/img
console.log(path.normalize('/User//zygg//img/../c/..')) // /User/zygg

// 如果 path 是零长度字符串，则返回 '.'，表示当前工作目录
console.log(path.normalize('')) // .
```

### `path.join`拼接+规范化路径
- 作用：返回拼接且规范化后的路径。
  - 如果返回的路径字符串长度为零，那么他会返回一个`.`，代表当前的文件夹。
  - 根据平台的不同，会对路径进行不同的规范化，举个例子，Unix系统是`/`，Windows系统是`\`，在两个系统下看到的返回结果就不一样。
  - 返回值的开头不是工作目录，而是传入的第一个参数。
- 语法：`path.join([...paths])`
- 参数：字符串的路径片段，可以是一个，也可以是多个。

```javascript
// .. 或 ../ 拼接前面的路径，但是不含前面一节的最后一层路径
path.join('/img', 'book', 'net/abc', 'inter', '..') // /img/book/net/abc
path.join('/img/books', '../net')  // /img/net
path.join('img/books', '../net')   // img/net

// . 或者 空字符串会直接拼接前面的路径
path.join('/img', 'book', 'net/abc', 'inter', '.') // /img/book/net/abc/inter
path.join('/img', 'book', 'net/abc', 'inter', '') // /img/book/net/abc/inter

// ‘/’ 和 ‘./’ 和 没有符号 直接拼接
path.join('/img/books', '/net')   // /img/books/net
path.join('img/books', '/net')    // img/books/net

path.join('/img/books', './net')   // /img/books/net
path.join('img/books', './net')   // img/books/net

path.join('/img/books', 'net')    // /img/books/net
path.join('img/books', 'net')    // /img/books/net
```
### `path.resolve`拼接绝对路径
- 作用：返回包含工作目录的绝对路径。
  - 拼接规则：`process.cwd() + 参数1 + 参数2 + ...`
- 语法：`path.resolve([...paths])`
- 参数说明：字符串的路径片段，可以是一个，也可以是多个。
  - 如果没有传入参数，或者传入参数为空字符，则`path.resolve`会返回当前工作目录的绝对路径，相当于使用`path.resolve(__dirname)`

```javascript
// 假设当前的工作路径为 `/workspace/demo`
path.resolve() // /workspace/demo
path.resolve('') // /workspace/demo
path.resolve(__dirname) // /workspace/demo

// 从后向前拼接
// 若字符串以 / 开头，则不会拼接到前面的路径
path.resolve('/img/books', '/net') // '/net'
path.resolve('img/books', '/net') // '/net'

// 若以 ./ 开头 或者 没有符号 则拼接前面路径
path.resolve('img/books', './net') // '/workspace/demo/img/books/net'
path.resolve('/img/books', './net') // '/img/books/net'
path.resolve('/img/books', 'net') // '/img/books/net'

// 若以 ../ 开头，拼接前面的路径，但是不含前面一节的最后一层路径
path.resolve('/img/books', '../net') // '/img/net'
path.resolve('src', '/img/books', '../net') // '/img/net'
path.resolve('src', './img/books', '../net') // '/workspace/demo/src/img/net'
path.resolve('src', 'img/books', '../net') // '/workspace/demo/src/img/net'
```

`path.resolve`就相当于是 shell 下面的`cd`操作，从左到右运行一遍`cd path`命令，最终获取到`绝对路径/文件名`。

但是`resolve`操作和`cd`操作还是有区别的：`resolve`最后进入的可以是文件。
#### 和`path.join`的区别
名称 | 'net' | '/net' | './net' | '../net'
:-: | :-:|:-:|:-:|:-:
join | 直接拼接 | 直接拼接 |直接拼接|拼接前面的路径，但是不含前面一节的最后一层路径
resolve | 直接拼接 | 不会拼接前面的路径，</br>只返回自身|直接拼接|拼接前面的路径，但是不含前面一节的最后一层路径

这两个方法的返回值也不一样，假设绝对路径是：`/User/zygg/c`。
```javascript
const path = require('path')

console.log(path.resolve('c', './a.js')) // /User/zygg/c/a.js
console.log(path.join('c', './a.js')) // c/a.js
```
### `path.parse`解析路径
- 作用：解析路径
- 语法：`path.parse(path)`
- 返回的是一个对象：
  - root：根目录
  - dir：文件所在的文件夹
  - base：文件名 + 后缀名
  - name：文件名
  - ext：文件的后缀名
```javascript
const path = require('path')

console.log(path.parse('User/zygg/img/c'))
// { root: '', dir: 'User/zygg/img', base: 'c', ext: '.js', name: 'c' }

console.log(path.parse('/User/zygg/img/c.js'))
// { root: '/', dir: 'User/zygg/img', base: 'c.js', ext: '.js', name: 'c' }
```

### `path.basename`解析最后的文件/文件夹
- 作用：解析最后的文件/文件夹
- 语法：`path.basename(path[, ext])`
- 参数：接收两个参数：
  - 第一个需要解析的路径
  - 第二个是可选参数，表示文件后缀，当输入第二个参数的时候，打印结果不出现后缀名
  - 如果传入的路径没有后缀，则第二个参数即使传了也不会生效
  - 如果传入的路径后缀和第二个参数传入的后缀不一致，也不会生效

```javascript
console.log(path.basename('User/zygg/img/c')) // c

console.log(path.basename('User/zygg/img/c.js', '.js')) // c

// 如果传入的路径没有后缀，则第二个参数即使传了也不会生效
console.log(path.basename('User/zygg/img/c', '.js')) // c

// 如果传入的路径后缀和第二个参数传入的后缀不一致，不会生效
console.log(path.basename('User/zygg/img/c.js', '.html')) // c.js
```

### `path.dirname`解析文件上级目录
- 作用：解析文件上级目录
- 语法：`path.dirname(path)`

```javascript
const path = require('path')

console.log(path.dirname('User/zygg/img/c')) // User/zygg/img
console.log(path.dirname('/User/zygg/img/c')) // /User/zygg/img
```

### `path.extname`解析后缀名
- 作用：解析后缀名
- 语法：`path.extname(path)`

```javascript
const path = require('path')
console.log(path.extname('index.html')) // .thml
console.log(path.extname('index.coffee.md')) // .md
console.log(path.extname('index.')) // .
console.log(path.extname('index')) // 空
console.log(path.extname('.index')) // 空
```
### `path.relative`
- 语法：`path.relative(from, to)`。
- 作用：根据当前工作目录（`process.cwd()`）返回从 from 到 to 的相对路径。
  - 从 from 的内部（子目录）作为开始目录向上查找 to。
  - 如果 from、to 指向同个路径，那么，返回空字符串。
  - 如果 from、to 中任一者为空，那么，返回当前工作路径。

```javascript
const path = require('path')

console.log(path.relative('/User/zygg/test/a', '/User/zygg/img/b')) // ../../img/b

console.log(path.relative('/User/demo', '/User/demo')) // 空

console.log(path.relative('/User/demo', '')) // ../../当前工作路径（process.cwd()）

// 当两个文件毫无关联时，会从根路径开始
console.log(path.relative('/c/a', '/test/b')) // ../../test/b
console.log(path.relative('c/a', 'test/b')) // ../../test/b
```