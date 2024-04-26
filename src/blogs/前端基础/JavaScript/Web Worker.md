# Web Worker
JavaScript 语言采用的是单线程模型，也就是说，所有任务只能在一个线程上完成，一次只能做一件事。前面的任务没做完，后面的任务只能等着。

Web Worker 的作用，就是为 JavaScript 创造多线程环境，允许主线程创建 Worker 线程，将一些任务分配给后者运行。在主线程运行的同时，Worker 线程在后台运行，两者互不干扰。等到 Worker 线程完成计算任务，再把结果返回给主线程。这样的好处是，一些计算密集型或高延迟的任务，被 Worker 线程负担了，主线程（通常负责 UI 交互）就会很流畅，不会被阻塞或拖慢。

Worker 线程一旦新建成功，就会始终运行，不会被主线程上的活动（比如用户点击按钮、提交表单）打断。这样有利于随时响应主线程的通信。但是，这也造成了 Worker 比较耗费资源，不应该过度使用，而且一旦使用完毕，就应该关闭。

## 注意点
**（1）同源限制**

分配给 Worker 线程运行的脚本文件，必须与主线程的脚本文件同源。

**（2）DOM 限制**

Worker 线程所在的全局对象，与主线程不一样，无法读取主线程所在网页的 DOM 对象，也无法使用`document`、`window`、`parent`这些对象。

但是，Worker 线程可以使用`navigator`对象和`location`对象。

**（3）通信联系**

Worker 线程和主线程不在同一个上下文环境，它们不能直接通信，必须通过特定 API 完成。

**（4）脚本限制**

Worker 线程不能执行`alert()`方法和`confirm()`方法，但可以使用`XMLHttpRequest`对象、`fetch`发出 AJAX 请求。

**（5）文件限制**

Worker 线程无法读取本地文件，即不能打开本机的文件系统（`file://`），它所加载的脚本，必须来自网络。

## API
### 主进程
- `Worker.onerror`：指定 error 事件的监听函数。
- `Worker.onmessage`：指定 message 事件的监听函数，发送过来的数据在Event.data属性中。
- `Worker.onmessageerror`：指定 messageerror 事件的监听函数。发送的数据无法序列化成字符串时，会触发这个事件。
- `Worker.postMessage()`：向 Worker 线程发送消息。
- `Worker.terminate()`：立即终止 Worker 线程。

### Worker 进程
- `self.name`： Worker 的名字。该属性只读，由构造函数指定。
- `self.onmessage`：指定message事件的监听函数。
- `self.onmessageerror`：指定 messageerror 事件的监听函数。发送的数据无法序列化成字符串时，会触发这个事件。
- `self.close()`：关闭 Worker 线程。
- `self.postMessage()`：向产生这个 Worker 线程发送消息。
- `self.importScripts()`：加载 JS 脚本。
## 新建一个 Worker 线程
主线程采用new命令，调用Worker()构造函数，新建一个 Worker 线程。
```javascript
const worker = new Worker('work.js')
```
`Worker()`构造函数，可以接受两个参数。
- 第一个参数是脚本的网址（必须遵守同源政策），该参数是必需的，且只能加载 JS 脚本，如果下载没有成功（比如404错误），Worker 就会默默地失败。
- 第二个参数是配置对象，该对象可选。它的一个作用就是指定 Worker 的名称，用来区分多个 Worker 线程。
```javascript
// 主线程
var myWorker = new Worker('worker.js', { name : 'myWorker' });

// Worker 线程
self.name // myWorker
```

### 同页面的 Web Worker
通常情况下，Worker 载入的是一个单独的 JavaScript 脚本文件，但是也可以载入与主线程在同一个网页的代码。

```html
<!DOCTYPE html>
  <body>
    <script id="worker" type="app/worker">
      addEventListener('message', function () {
        postMessage('some message');
      }, false);
    </script>
  </body>
</html>
```
上面是一段嵌入网页的脚本，注意必须指定`<script>`标签的type属性是一个浏览器不认识的值，上例是`app/worker`。

然后，读取这一段嵌入页面的脚本，用 Worker 来处理。

```javascript
var blob = new Blob([document.querySelector('#worker').textContent]);
var url = window.URL.createObjectURL(blob);
var worker = new Worker(url);

worker.onmessage = function (e) {
  // e.data === 'some message'
};
```
上面代码中，先将嵌入网页的脚本代码，转成一个二进制对象，然后为这个二进制对象生成 URL，再让 Worker 加载这个 URL。这样就做到了，主线程和 Worker 的代码都在同一个网页上面。



## 线程间通信
### 主 -> 子
#### 向 Worker 发送消息
主线程调用`worker.postMessage()`方法，向 Worker 发消息。

`worker.postMessage()`方法的参数，就是主线程传给 Worker 的数据。它可以是各种数据类型，包括二进制数据。
```javascript
worker.postMessage('Hello World');
worker.postMessage({method: 'echo', args: ['Work']});
```

#### 接收 Worker 发送的消息
接着，主线程通过`worker.onmessage`指定监听函数，接收子线程发回来的消息。
```javascript
worker.onmessage = function (event) {
  console.log('Received message ' + event.data);
  doSomething();
}

function doSomething() {
  // 执行任务
  worker.postMessage('Work done!');
}
```
### 子 -> 主
Worker 线程内部需要有一个监听函数，监听`message`事件。并通过`postMessage`方法向主线程发送消息
```javascript
// 写法一：self 代表子线程自身，即子线程的全局对象
self.addEventListener('message', function (e) {
  self.postMessage('You said: ' + e.data);
}, false);

// 写法二
this.addEventListener('message', function (e) {
  this.postMessage('You said: ' + e.data);
}, false);

// 写法三
addEventListener('message', function (e) {
  postMessage('You said: ' + e.data);
}, false);

// 写法四
self.onmessage(function (e){
    console.log(e.data)
})
```

## 关闭 Worker
```javascript
// 主线程
worker.terminate();

// Worker 线程
self.close();
```
## Worker 内部加载脚本
Worker 内部如果要加载其他脚本，有一个专门的方法`importScripts()`。
```javascript
importScripts('script1.js')
// 该方法可以同时加载多个脚本
importScripts('script1.js', 'script2.js')
```
## 错误处理
### 主线程监听 Worker 异常
主线程可以监听 Worker 是否发生错误。如果发生错误，Worker 会触发主线程的`error`事件。
```javascript
worker.onerror(function (event) {
  console.log([
    'ERROR: Line ', e.lineno, ' in ', e.filename, ': ', e.message
  ].join(''));
});

// 或者
worker.addEventListener('error', function (event) {
  // ...
});
// 指定 messageerror 事件的监听函数。发送的数据无法序列化成字符串时，会触发这个事件。
worker.onmessageerror(function (event) {
  console.log(event);
})
```
### Worker 监听自身异常
Worker 内部也可以监听`error`事件。
```javascript
self.onerror(function (event) {
  console.log([
    'ERROR: Line ', e.lineno, ' in ', e.filename, ': ', e.message
  ].join(''));
});

// 或者
self.addEventListener('error', function (event) {
  // ...
});

// 指定 messageerror 事件的监听函数。发送的数据无法序列化成字符串时，会触发这个事件。
self.onmessageerror(function (event) {
  console.log(event);
})
```

