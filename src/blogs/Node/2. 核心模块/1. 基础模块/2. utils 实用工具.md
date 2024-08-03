# utils 实用工具
## 转换相关
### `util.promisify(original)`
用于将传统的基于`callback`的异步函数转换为返回 Promise 的函数。

参数：
- `original`：一个传统的基于回调的异步函数，其回调函数通常遵循 Node.js 的错误优先回调风格（即回调函数的第一个参数为错误对象，第二个参数为结果）。

返回一个新的函数，该函数返回一个 Promise：
- 当原始函数成功完成时，Promise 被解决并返回结果
- 当原始函数发生错误时，Promise 被拒绝并返回错误对象
```javascript
const fs = require('fs')
const util = require('util')

// 传统的基于回调的异步函数
fs.readFile('./example.txt', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    console.log(data.toString())
})

// 使用 util.promisify 转换后
const readFilePromise = util.promisify(fs.readFile)

readFilePromise('./example.txt')
    .then(data => {
        console.log(data.toString())
    })
    .catch(err => {
        console.error(err)
    })
```
#### 自定义转换方式
通过在`original`函数上定义`util.promisify.custom`属性，可以自定义转换方式。

下面示例中设置不能将`fs.readFile`的`callback`设置为`promise`
```javascript
const fs = require('fs')
const util = require('util')
fs.readFile[util.promisify.custom] = fileName => {
    return Promise.reject('not allowed')
}
const readFilePromise = util.promisify(fs.readFile)
readFilePromise('./h.js').then(
    data => {
        console.log(data.toString())
    },
    err => {
        console.error(err) // not allowed
    }
)
```
### `util.callbackify(original)`
用于将一个返回`Promise`的异步函数转换为一个使用`callback`的传统异步函数。

参数：
- `original`：一个返回 Promise 的异步函数。

返回一个新的函数，该函数的最后一个参数必须是回调函数，该回调函数接受两个参数`err`和`result`：
- 当原始函数返回的 Promise 被解决后，回调函数的第一个参数为 null，第二个参数为 Promise 解决的值
- 当 Promise 被拒绝时，回调函数的第一个参数为错误对象。

```javascript
const util = require('util')

async function asyncFunction(greeting, name) {
    return `${greeting}, ${name}!`
}

const callbackFunction = util.callbackify(asyncFunction)

callbackFunction('Hello', 'World', (err, result) => {
    if (err) throw err
    console.log(result) // 输出: Hello, World!
})
```
有一种情况需要关注，如果 Promise 是`reject(null || 0 || false)`，那么`callback`会将`err`判断为 truly，导致继续执行`console.log(data)`，这其实是不正确的。

因此`callbackify`对于这种情况做了特殊的处理，即实例化一个`error`对象，将原始的信息放在`error`的`reason`属性上，把`error`对象传递给最终的回调函数。

## 解析命令行参数
### `util.parseArgs([config])`
用于解析命令行参数。这个方法在 Node.js 18.3.0 及以上版本中可用。

参数：
- `config`（可选）：一个对象，包含以下配置选项：
  - `args`：一个字符串数组，表示要解析的命令行参数。默认为`process.argv.slice(2)`。
  - `strict`：一个布尔值，如果为 true，则不允许未定义的选项。默认为 true。
  - `allowPositionals`：一个布尔值，如果为 true，则允许位置参数。默认为 false。
  - `options`：一个对象，键为参数名称，值为参数的配置对象。参数的配置对象可以包含以下属性：
    - `type`：选项的类型，可以是 'string'、'boolean'。
    - `multiple`：一个布尔值，如果为`true`，则允许选项出现多次。
    - `default`：选项的默认值。

返回一个对象，包含解析后的选项和位置参数。

```javascript
const util = require('util')

const config = {
    options: {
        name: { type: 'string' },
        age: { type: 'string' },
        verbose: { type: 'boolean' }
    },
    allowPositionals: true
}

const { values, positionals } = util.parseArgs(config)

console.log(values) // 输出: { name: 'Alice', age: '25', verbose: true }
console.log(positionals) // 输出: ['some', 'positional', 'arguments']

// 运行：node index --name=Alice --age=25 --verbose some positional arguments
```

## 调试输出相关
### `util.inspect(object[, options])`
将对象转换为字符串表示形式，便于调试和日志记录。

参数：
- `object`：要转换为字符串的对象。
- `options`（可选）：一个对象，包含以下选项：
  - `showHidden`：一个布尔值，如果为`true`，则显示对象的不可枚举的符号或属性。默认为`false`。
  - `depth`：一个数字，指定递归检查对象的深度。默认为`2`。传递`null`表示无限深度。
  - `colors`：一个布尔值，如果为`true`，则输出带有 ANSI 颜色代码的格式化字符串。默认为`false`。
  - `customInspect`：一个布尔值，如果为`false`，则不调用对象上定义的`inspect`方法。默认为`true`。
  - `showProxy`：一个布尔值，如果为`true`，则显示`Proxy`对象的详细信息。默认为`false`。
  - `maxArrayLength`：一个数字，指定数组和类数组对象显示的最大长度。默认为`100`。传递`null`表示无限长度。
  - `breakLength`：一个数字，指定对象属性拆分为多行的长度。默认为`60`。

返回一个字符串，表示对象的格式化字符串。
```javascript
const util = require('util')

const obj = { name: 'Alice', age: 25, secret: 'hidden', [Symbol('a')]: 123 }

Object.defineProperty(obj, 'secret', {
    enumerable: false
})

console.log(util.inspect(obj))
// 输出: { name: 'Alice', age: 25, [Symbol(a)]: 123 }

console.log(util.inspect(obj, { showHidden: true, colors: true }))
// 输出: { name: 'Alice', age: 25, [secret]: 'hidden', [Symbol(a)]: 123 }
```

#### `util.inspect(object[, showHidden[, depth[, colors]]])`
同`util.inspect(object[, options])`一致，只不过将`options`中常用的可配置项平铺到了参数中

### `util.format(format[, ...args])`
用于占位符替换，不同类型的数据采用不同的占位符表示，返回一个格式化后的字符串。

参数：
- `format`：一个格式化字符串，包含零个或多个占位符。
- `...args`：一个或多个参数，用于替换格式化字符串中的占位符。

| 占位符 | 数据类型|
|:-: | :-:|
| %s | 字符串|
| %d | 整数或浮点数|
| %i | 整数|
| %f | 浮点数|
| %j | JSON|
| %o | 对象，带有可枚举属性。  |
| %O | 对象，不带可枚举属性。 |
| %% | 单个百分号（'%'），不消耗参数|

```javascript
const util = require('util')

const formattedString = util.format('%s: %d', '年龄', 25)
console.log(formattedString) // 输出: 年龄: 25

const formattedString2 = util.format('%s: %j', '数据', { name: 'Alice', age: 25 })
console.log(formattedString2) // 输出: 数据: {"name":"Alice","age":25}

const formattedString3 = util.format('%s: %o', '对象', { name: 'Alice', age: 25 })
console.log(formattedString3) // 输出: 对象: { name: 'Alice', age: 25 }
```
### `util.formatWithOptions(inspectOptions, format[, ...args])`
根据格式化字符串和参数生成格式化的字符串，并允许自定义`util.inspect`的选项。

参数：
- `inspectOptions`：一个对象，包含`util.inspect`的选项，用于自定义格式化对象时的行为。
- `format`：一个格式化字符串，包含零个或多个占位符。
- `...args`：一个或多个参数，用于替换格式化字符串中的占位符。

返回一个格式化后的字符串。
```javascript
const util = require('util')

const obj = { name: 'Alice', age: 25 }

const formattedString = util.formatWithOptions({ colors: true }, '%s: %o', '对象', obj)
console.log(formattedString)
// 输出: 对象: { name: 'Alice', age: 25 }
```
### `util.debuglog(section[, callback])`
创建一个根据环境变量`NODE_DEBUG`的值来决定是否输出调试信息的函数。

参数：
- `section`：一个字符串，表示调试信息的分类或模块名称。
- `callback`（可选）：一个函数，当调试信息首次输出时调用。

返回一个函数，该函数用于输出调试信息。当环境变量`NODE_DEBUG`包含指定的`section`时，调试信息会被输出到标准错误流（stderr）。

```javascript
const util = require('util')
console.log('执行了', process.env.NODE_DEBUG)
const debuglog = util.debuglog('myapp')

if (process.env.NODE_DEBUG && process.env.NODE_DEBUG.includes('myapp')) {
    debuglog('调试信息: %s', '这是一个调试信息')
}

// >NODE_DEBUG=myapp node index
// 输出：MYAPP 38185: 调试信息: 这是一个调试信息
```
#### NODE_DEBUG
`NODE_DEBUG`如果希望输出多个`section`可以用逗号做分隔，同时`NODE_DEBUG`也支持通配符形式（Node版本需要10）
```javascript
NODE_DEBUG=fs,net,tls // 多个section
NODE_DEBUG=foo*  // 通配符
```
`debuglog`函数执行的时候支持占位符，其实底层使用的是`util.format`方法。
#### `debuglog().enabled`
是一个布尔属性，用于检查当前调试日志函数是否启用。如果环境变量`NODE_DEBUG`包含指定的`section`，则`enabled`属性为`true`，否则为`false`。
#### `util.debug(section)`
`util.debuglog`的别名。

## 类型检查（`util.types`）
提供了一系列用于检查不同类型对象的方法。这些方法可以帮助开发者确定对象的具体类型，

- `util.types`提供了更明确的检查方法，特别是那些在 JavaScript 层面无法直接检查的类型。
- `instanceof`在检查跨`Realm`的对象、基本类型包装对象和某些内置特殊对象时可能会遇到问题。比如：
  - **跨 Realm 的对象**：在不同的 JavaScript 全局环境中创建的对象（例如在不同的`<iframe>`或 Worker 中），`instanceof`无法准确判断其类型。
  - **基本类型包装对象**：例如 String、Number、Boolean 等基本类型的包装对象，`instanceof`无法判断其为`Object`类型。

```javascript
const util = require('util')

// 跨 Realm 的对象
const iframe = document.createElement('iframe')
document.body.appendChild(iframe)
const iframeArray = iframe.contentWindow.Array
const array = new iframeArray()

console.log(array instanceof Array) // 输出: false
console.log(util.types.isArray(array)) // 输出: true
// array 是在 <iframe> 中创建的 Array 对象，instanceof 无法准确判断其类型。

// 基本类型包装对象
const str = new String('hello')

console.log(str instanceof String) // 输出: true
console.log(typeof str) // 输出: 'object'
console.log(util.types.isStringObject(str)) // 输出: true
// str 是 String 的包装对象，instanceof 可以准确判断其类型，但通常我们更关心其基本类型。

// 内置的特殊对象
const buffer = new ArrayBuffer(8)

console.log(buffer instanceof ArrayBuffer) // 输出: true
console.log(util.types.isArrayBuffer(buffer)) // 输出: true
// buffer 是 ArrayBuffer 对象，instanceof 可以准确判断其类型，但 util.types 提供了更明确的检查方法。
```
### 常用的类型检查方法
- `util.types.isArrayBuffer(value)`：检查 value 是否为 ArrayBuffer。
- `util.types.isDate(value)`：检查 value 是否为 Date 对象。
- `util.types.isMap(value)`：检查 value 是否为 Map 对象。
- `util.types.isPromise(value)`：检查 value 是否为 Promise 对象。
- `util.types.isRegExp(value)`：检查 value 是否为正则表达式对象。
- `util.types.isSet(value)`：检查 value 是否为 Set 对象。
- `util.types.isTypedArray(value)`：检查 value 是否为 TypedArray 对象。
- `util.types.isDataView(value)`：检查 value 是否为 DataView 对象。
- `util.types.isAsyncFunction(value)`：检查 value 是否为异步函数。
- `util.types.isGeneratorFunction(value)`：检查 value 是否为生成器函数。
- `util.types.isProxy(value)`：检查 value 是否为 Proxy 对象。
- `util.types.isArgumentsObject(value)`：如果值为`arguments`对象，则返回 true。

```javascript
const util = require('util')

const buffer = new ArrayBuffer(8)
const date = new Date()
const promise = new Promise((resolve, reject) => {})
const regExp = /abc/
const set = new Set()
const typedArray = new Uint8Array()
const dataView = new DataView(buffer)
const asyncFunction = async () => {}
const generatorFunction = function* () {}
const proxy = new Proxy({}, {})
const wasmModule = new WebAssembly.Module(new Uint8Array([0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00]))

console.log(util.types.isArrayBuffer(buffer)) // 输出: true
console.log(util.types.isDate(date)) // 输出: true
console.log(util.types.isPromise(promise)) // 输出: true
console.log(util.types.isRegExp(regExp)) // 输出: true
console.log(util.types.isSet(set)) // 输出: true
console.log(util.types.isTypedArray(typedArray)) // 输出: true
console.log(util.types.isDataView(dataView)) // 输出: true
console.log(util.types.isAsyncFunction(asyncFunction)) // 输出: true
console.log(util.types.isGeneratorFunction(generatorFunction)) // 输出: true
console.log(util.types.isProxy(proxy)) // 输出: true
console.log(util.types.isWebAssemblyCompiledModule(wasmModule)) // 输出: true

function foo() {
  util.types.isArgumentsObject(arguments)  // 返回 true
}
```

## 实用方法
### `util.isDeepStrictEqual(val1, val2)`
用于深度严格比较两个值是否相等。这个方法会递归地比较对象的每个属性，包括嵌套对象和数组。

返回一个布尔值，表示两个值是否深度严格相等。
```javascript
const util = require('util')

const obj1 = { a: 1, b: { c: 2 } }
const obj2 = { a: 1, b: { c: 2 } }
const obj3 = { a: 1, b: { c: 3 } }

console.log(util.isDeepStrictEqual(obj1, obj2)) // 输出: true
console.log(util.isDeepStrictEqual(obj1, obj3)) // 输出: false
```
注意事项
- `util.isDeepStrictEqual`方法会递归地比较对象的每个属性，包括嵌套对象和数组。
- 它使用严格相等（`===`）来比较原始值（如字符串、数字、布尔值等）。
- 它还会比较对象的类型、原型链和不可枚举属性。

### `util.deprecate(fn, msg[, code])`
用于标记一个函数或方法为已弃用（deprecated）。当被标记的函数或方法被调用时，会输出一个警告信息，提示开发者该函数或方法已被弃用，并建议使用替代方案。

参数：
- fn：要标记为已弃用的函数或方法。
- msg：一个字符串，包含弃用警告信息。
- code（可选）：一个字符串，表示弃用代码。这个代码可以用于在代码库中统一查找和处理弃用警告。

返回一个新的函数，该函数在被调用时会输出弃用警告信息，并调用原始的`fn`函数。
```javascript
const util = require('util')

function oldFunction() {
    console.log('This is an old function.')
}

const deprecatedFunction = util.deprecate(oldFunction, 'oldFunction is deprecated. Use newFunction instead.')

deprecatedFunction()
// 输出: This is an old function.
// 警告: (node:1234) DeprecationWarning: oldFunction is deprecated. Use newFunction instead.
```
- 弃用警告信息只会输出一次，即使在同一个进程中多次调用被标记的函数。
- 弃用警告信息会输出到标准错误流（stderr）。

### `util.getSystemErrorName(err)`
用于获取系统错误码对应的错误名称。这个方法可以帮助开发者将系统错误码转换为可读性更高的错误名称字符串。

参数：
- `err`：一个数字，表示系统错误码。

返回一个字符串，表示与给定错误码对应的错误名称。
```javascript
const util = require('util')

const errorCode = 9 // EBADF (Bad file descriptor)
const errorName = util.getSystemErrorName(errorCode)

console.log(errorName) // 输出: EBADF
```
- 该方法仅适用于系统错误码，不适用于自定义错误码。
- 错误名称是根据 Node 内部定义的错误码映射表获取的，因此可能因 Node 版本的不同而有所变化。

### `util.getSystemErrorMap()`
用于获取系统错误码及其对应的错误名称的映射表。这个方法返回一个包含所有系统错误码和错误名称的 Map 对象。
```javascript
const util = require('util')

const errorMap = util.getSystemErrorMap()

console.log(errorMap.get(9)) // 输出: EBADF
```