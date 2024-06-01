# children_process
[child_process 子进程 | Node.js v18 文档](https://nodejs.cn/dist/latest-v18.x/docs/api/child_process.html)
## 创建异步子进程
child_process 模块提供了以下 4 个方法用于创建异步子进程，**并且每一种方法都有对应的同步版本**：

- spawn: 启动一个子进程来执行命令
- exec:  启动一个子进程来执行命令，与 spawn 不同的是，它有一个回调函数获知子进程的状况
- execFile: 启动一个子进程来执行可执行文件
- fork:  与 spawn 类似，不同点在于它创建 Node 的子进程只需指定要执行的 JavaScript 文件模块即可

**exec、execFile、fork 都是 spawn 的延伸应用，底层都是通过 spawn 实现的。**基本用法和区分点如下：
```javascript
const cp = require('child_process');

// spawn
cp.spawn('node', ['./dir/test1.js'],
  { stdio: 'inherit' }
);
// exec
cp.exec('node ./dir/test1.js', (err, stdout, stderr) => {
  console.log(stdout);
});
// execFile
cp.execFile('node', ['./dir/test1.js'], (err, stdout, stderr) => {
  console.log(stdout);
});
// fork
cp.fork('./dir/test1.js',
  { silent: false }
);

// ./dir/test1.js
console.log('test1 输出...');

```
差异点：

- spawn 与 exec、execFile 不同的是，后两者创建时可以指定 timeout 属性设置超时时间，一旦创建的进程运行超过设定的时间将会被杀死
- exec 与 execFile 不同的是，exec 适合执行已有的命令，execFile 适合执行文件

差异列表如下：

![image.png](https://cdn.nlark.com/yuque/0/2023/png/26943751/1690072278361-256d90a3-1721-4f12-9d9f-a4329d6b3690.png#averageHue=%23cecece&clientId=ucb1f8c75-0d1e-4&from=paste&height=289&id=ue0c62665&originHeight=578&originWidth=1440&originalType=binary&ratio=2&rotation=0&showTitle=false&size=132481&status=done&style=none&taskId=u295abffd-2bf3-4baf-a88c-4fae4b26a8f&title=&width=720)
## 子进程列表
### child_process.exec()
#### 基本语法
```javascript
child_process.exec(command[, options][, callback])
```
衍生一个 shell，然后在 shell 里执行命令。命令一般是 shell 内置的命令，如 ls、cat 等，也可以是 shell 脚本组成的文件，如 start.sh 等。执行完成后，将 stdout、stderr 作为参数传入回调方法

- command 是一个 shell 命令的字符串，包含了命令的参数
- 可以使用 callback
#### options 参数说明

- cwd：当前工作路径；
- env：环境变量；
- encoding：编码，默认是 utf8；
- shell：用来执行命令的 shell，unix 上默认是 /bin/sh，windows 上默认是 cmd.exe；
- timeout：默认是 0；
- killSignal：默认是 SIGTERM；
   - 如果 timeout 大于 0，当子进程运行超过 timeout 毫秒，就会给进程发送 killSignal 指定的信号（比如 SIGTERM）
   - 如果运行没有出错， error 为 null。如果运行出错，error.code 就是退出代码（exist code），error.signal 会被设置成终止进程的信号。（比如 CTRL+C 时发送的 SIGINT）
- uid：执行进程的 uid；
- gid：执行进程的 gid；
- maxBuffer： 标准输出、错误输出最大允许的数据量（单位为字节），如果超出的话，子进程就会被杀死；默认是 200*1024（即 200k ）
#### 例子 1: 基本用法

1. 执行成功，error 为 null；执行失败，error 为 Error 实例；error.code 为错误码；
2. stdout、stderr 为标准输出、标准错误；默认是字符串，除非 options.encoding 为 buffer；注意：stdout、stderr 会默认在结尾加上换行符
```javascript
const { exec } = require('child_process');

exec('ls', (error, stdout, stderr) => {
  if (error) {
    console.error('error:', error);
    return;
  }
  console.log('stdout: ' + stdout);
  console.log('stderr: ' + stderr);
})
// 输出：
/**
    stdout: dir
    index.js
    new.json
    pages

    stderr: 
 */


exec('ls', {cwd: __dirname + '/dir'}, (error, stdout, stderr) => {
  if (error) {
    console.error('error:', error);
    return;
  }
  console.log('stdout: ' + stdout);
  console.log('stderr: ' + stderr);
})
// 输出：
/**
    stdout: index.js

    stderr: 
 */
```
#### 例子 2: 子进程输出/错误监听
除了 例子1 中支持回调函数获取子进程的输出和错误外，还提供 stdout 和 stderr 对输出和错误进行监听，示例如下所示
```javascript
// dir/test.js
console.log('dir/test.js被执行')

// index.js
const { exec } = require('child_process');

const child = exec('node ./dir/test.js')

child.stdout.on('data', data => {
  console.log('stdout:', data);
})
child.stderr.on('data', err => {
  console.log('error:', err);
})
// 输出：
// stdout: dir/test.js被执行
```
### child_process.execFile()
#### 基本语法
```javascript
child_process.execFile(file[, args][, options][, callback])
```
跟`.exec()`类似，`options`参数与`exec`一样

与 exec 的不同是：

- `**file**`**参数**是要运行的可执行文件的名称或路径，如`node.exe`或`node`命令，不能是 start.js 这种脚本文件
- **命令参数**不能放在第一个参数，只能作为第二个参数传递
- 默认情况下不会衍生新的进程，**指定的可执行**`**file**`**参数将直接作为新进程执行**
   - 其比`child_process.exec()`稍微更高效
- 在 Windows 系统中，由于 .bat 和 .cmd 文件在没有终端的情况下不能单独执行的，所以不能使用 execFile 来执行，而应该使用 exec 或下面介绍的 spawn 来执行。
#### 例子 1：执行 node 文件
```javascript
// dir/test.js
console.log('dir/test.js被执行')

// index.js
const { execFile } = require('child_process');

execFile('node', ['./dir/test1.js'], (error, stdout, stderr) => {
  if (error) {
    console.error('error:', error);
    return;
  }
  console.log('stdout: ' + stdout); 
  console.log('stderr: ' + stderr);
})
// 输出：
// stdout: dir/test.js被执行
```
#### 例子 2：执行 shell 脚本文件
需要注意的是，执行 shell 脚本的时候，并没有重新开一个进程。

比如：在根目录下运行`execFile`命令执行脚本，在`./dir/test2.sh`脚本中执行与`test2.sh`同目录的 test1..js 文件，不能直接写成`node ./test1.js`，会找不到文件，应该从根目录去寻找

注意：shell 脚本文件中如果需要访问 node 环境中的变量，可以将变量赋值给 process.env，这样在 shell 脚本中就可以通过`$变量名`进行直接访问
```javascript
const { execFile } = require('child_process');

// 执行 shell 脚本
// 在 shell 脚本中可以访问到 process.env 的属性 
process.env.DIRNAME = __dirname;
execFile(`${__dirname}/dir/test2.sh`, (error, stdout, stderr) => {
  if (error) {
    console.error('error:', error);
    return;
  }
  console.log('stdout: ' + stdout); // stdout: 执行 test2.sh  test1 输出...
  console.log('stderr: ' + stderr);
})

// ./dir/test2.sh
#! /bin/bash
echo '执行 test2.sh'
node $DIRNAME/dir/test1.js


// ./dir/test1.js
console.log('test1 输出...');

```
上面的例子中，当执行`node $DIRNAME/dir/test1.js`没有衍生新进程

而是直接复用执行``${__dirname}/dir/test2.sh`` 的进程
### child_process.fork()
#### 基本语法
```javascript
child_process.fork(modulePath[, args][, options])
```

- modulePath：要在node子进程中运行的模块，由于是 node.js 的进程，所以可以是 start.js 这种 js 文件
- args：字符串参数列表

注意：

- 该接口专门用于衍生新的 Node.js 进程
- 无回调，参数要以第二个参数传入
- 返回的子进程将内置一个额外的ipc通信通道，允许消息在父进程和子进程之间来回传递
- fork 其实是 spawn 的一个特殊例子，因为 fork() 第一个参数是一个被执行脚本的路径。args 和 options 参数都和 spawn 一致。但是 fork 执行的是一个 node module，所以 fork 提供了一个特性，即在父子进程之间建立一个 IPC 通道，使父子进程之间通过 send() 方法来互相发送信息
#### options 参数
其中与 exec 重复的参数就不重复介绍

- execPath：用来创建子进程的可执行文件，默认是`/usr/local/bin/node`
   - 也就是说，可通过`execPath`来指定具体的 node 可执行文件路径（比如多个 node 版本）
- execArgv：传给可执行文件的字符串参数列表。默认是`process.execArgv`，跟父进程保持一致
- silent：如果为 true，则子进程的标准输入、标准输出和标准错误将通过管道传输到父进程，否则它们将从父进程继承
- stdio：用于配置在父进程和子进程之间建立的管道，如果声明了 stdio，则会覆盖 silent 选项的设置
#### 例子 1：silent
```javascript
const { fork } = require('child_process');

// 1、默认 silent 为 false，子进程会输出 child3.js 中输出的内容
fork('./dir/child3.js', {
  silent: false
});

// 2、设置 silent 为 true，则子进程不会输出
fork('./dir/child3.js', {
  silent: true
});

// 3、通过 stdout 属性，可以获取到子进程输出的内容
const child3 = fork('./dir/child3.js', {
  silent: true
});

child3.stdout.setEncoding('utf8');
child3.stdout.on('data', function (data) {
  console.log('stdout 中输出：');
  console.log(data);
});
```
#### 例子2：父子进程传递消息
```javascript
// IPC 通道
// parent.js
var child_process = require('child_process');

var child = child_process.fork('./child.js');

child.on('message', function(m){
    console.log('message from child: ' + JSON.stringify(m));
});

child.send({from: 'parent'});


// child.js
process.on('message', function(m){
    console.log('message from parent: ' + JSON.stringify(m));
});

process.send({from: 'child'});

// 运行 node parent.js 的输出：
// message from child: {"from":"child"}
// message from parent: {"from":"parent"}
```
