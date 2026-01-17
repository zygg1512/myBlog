# WebSocket
## 概述
WebSocket 是基于 TCP 的一种新的应用层网络协议。它实现了客户端与服务器全双工通信，即允许服务器主动发送信息给客户端。

因此，在 WebSocket 中，客户端和服务器只需要完成一次握手，两者之间就直接可以创建持久性的连接，并进行双向数据传输，客户端和服务器之间的数据交换变得更加简单。

### 为什么需要 WebSocket
在 WebSocket 出现之前，如果想实现实时通信，比较常见的方式有两种：
- 短轮询（AJAX 轮询）：在特定时间间隔（比如每秒）由浏览器发出请求，服务器返回最新的数据。
- 长轮询（Long Poll）：客户端发送一个请求到服务器，如果服务器端没有新的数据，就保持这个连接直到有数据。一旦服务器端有了数据（消息）给客户端，它就使用这个连接发送数据给客户端，接着连接关闭。

这样的方式有两个缺陷：
- 浪费带宽：HTTP 请求一般包含的头部信息比较多，其中有效的数据可能只占很小的一部分，导致带宽浪费。
- 占用服务器 CPU 资源：服务器频繁接收请求或持续等待。

### WebSocket 特点
- 建立在 TCP 协议之上。
- 与 HTTP 协议有着良好的兼容性：默认端口也是 80（ws） 和 443(wss，运行在 TLS 之上)，并且握手阶段采用 HTTP 协议。
- 节省带宽：连接创建后，ws 客户端、服务端进行数据交换时，协议控制的数据包头部较小，而 HTTP 协议每次通信都需要携带完整的头部。
- 可以发送文本，也可以发送二进制数据。
- **没有同源限制，客户端可以与任意服务器通信。**
- 协议标识符是 ws，如果加密，则为 wss，服务器网址就是 URL。
- 支持扩展：ws 协议定义了扩展，用户可以扩展协议，或者实现自定义的子协议（比如支持自定义压缩算法等）。
### WebSocket 缺陷
- 不支持无连接：WebSocket 是一种持久化的协议，这意味着连接不会在一次请求之后立即断开。这是有利的，因为它消除了建立连接的开销，但是也可能导致一些资源泄漏的问题。
- 兼容问题：WebSocket 是 HTML5 中的一种标准协议，虽然现代浏览器都支持，但是一些旧的浏览器可能不支持 WebSocket。
- 需要特殊的服务器支持：WebSocket 需要服务端支持，只有特定的服务器才能够实现 WebSocket 协议。这可能会增加系统的复杂性和部署的难度。
- 数据流不兼容：WebSocket 的数据流格式与 HTTP 不同，这意味着在不同的网络环境下，WebSocket 的表现可能会有所不同。

### 相较于 HTTP 的优势
- 更高的实时性能：WebSocket 允许服务器和客户端之间实时双向通信，从而提高了实时通信场景中的性能。
- 更少的网络开销：HTTP 请求和响应之间需要额外的数据传输，而 WebSocket 通过在同一个连接上双向通信，减少了网络开销。
- 更灵活的通信方式：HTTP 请求和响应通常是一一对应的，而 WebSocket 允许服务器和客户端之间以多种方式进行通信，例如消息 Push、事件推送等。
- 更简洁的 API：WebSocket 提供了简洁的 API，使得客户端开发人员可以更轻松地进行实时通信。
## WebSocket 握手流程
在 WebSocket 开始通信之前，通信双方需要先进行握手。

握手流程如下：
- 客户端发送 HTTP 请求
- 服务端解析客户端的 HTTP 请求
- 服务端响应 HTTP 请求
- 客户端验证服务端响应
- HTTP 协议结束，开始进入 WebSocket 协议

### 客户端发送 HTTP 请求
客户端会发送一个 HTTP 的握手包。WebSocket 复用了 HTTP 的握手通道，即客户端通过 HTTP 请求与 WebSocket 服务端协商升级协议。协议升级完成后，后续的数据交换则遵照 WebSocket 的协议。

>利用 HTTP 完成握手有什么好处呢？
>1. 可以让 WebSocket 和 HTTP 基础设备兼容（运行在 80 端口 或 443 端口）
>2. 可以复用 HTTP 的 Upgrade 机制，完成升级协议的协商过程

请求头格式如下：
```bash
# 方法必须是 GET 方法，HTTP 版本不能低于1.1
GET /chat HTTP/1.1
Host: server.example.com
# 表示要升级到 WebSocket 协议，该值不区分大小写
Upgrade: websocket
# 表示要升级协议，该值不区分大小写
Connection: Upgrade
# 值是一个 Base64 编码的 16 字节随机字符串，和响应头 Sec-WebSocket-Accept 结合使用
# 提供基本的防护，比如恶意的连接，或者无意的连接
# 比如：用于避免将普通的 HTTP 请求误认为升级 WebSocket 协议
Sec-WebSocket-Key: x3JJHMbDL1EzLkh9GBhXDw==
# 包含了一个或者多个客户端希望使用的子协议。用逗号分隔的根据权重排序
Sec-WebSocket-Protocol: chat, superchat
# 表明协议版本，要求双端一致。当前默认的 WebSocket 协议版本是 13 版本
Sec-WebSocket-Version: 13
# 如果这个请求来自一个浏览器，那么请求必须包含一个 Origin 字段。
# 如果请求是来自一个非浏览器客户端，那么当该客户端 Origin 字段的语义也用于表示来源时，这个请求也可能包含这个字段。
Origin: http://example.com
```
### 服务端解析客户端的 HTTP 请求
为了获得必要的信息来保证服务端的握手响应，服务端会解析这个客户端发送过来的握手包是否符合规范。

当服务端发现收到的握手包不符合以下规范时，会立马停止处理，并向客户端发送一个表示错误的 HTTP 请求。如状态码`400 Bad Request`。
- HTTP 协议版本是`1.1`及以上
- 请求方式是 GET 请求
- 包含服务端权限的Host字段
- 有`Upgrade`字段，且值为`"websocket"`
- 有`Connection`字段，且值为`"Upgrade"`
- 有`Sec-WebSocket-Key`字段，且值为16字节的base64编码
- 有`Sec-WebSocket-Version`字段，且服务端支持该版本

#### WebSocket 版本协商
如果服务端不支持客户端请求的版本，那么服务端会返回`Sec-WebSocket-Version`字段包含服务端支持的所有版本，用逗号分隔。在这种情况下，如果客户端支持其中任意一个版本，它可以选择一个新的版本值重新发起握手请求。

下面的示例演示了如何进行上面所述的版本协商：
```bash
# 客户端发送握手请求
GET /chat HTTP/1.1
Host: server.example.com
Upgrade: websocket
Connection: Upgrade
...
Sec-WebSocket-Version: 25

# 服务端不支持改版本，并返回下面内容
HTTP/1.1 400 Bad Request
...
Sec-WebSocket-Version: 13,8,7

# 客户端选择了版本13，重新进行握手
GET /chat HTTP/1.1
Host: server.example.com
Upgrade: websocket
Connection: Upgrade
...
Sec-WebSocket-Version: 13
```

### 服务端响应 HTTP 请求
服务端验证完握手包且握手包符合规范之后，也会发送一个握手包给客户端。格式如下：
```bash
# 101 状态码，表示协议切换
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Protocol: chat # 表示最终使用的协议
Sec-WebSocket-Accept: HSmrc0sMlYUkAGmm5OPpG2HaGWk=
```
`Sec-Websocket-Accept`值的计算规则如下：
- 首先将一个固定的字符串拼接到`Sec-WebSocket-Key`对应值的后面
- 对拼接后的字符串进行一次 SHA-1 计算
- 将计算结果进行 Base64 编码

### 客户端验证服务端响应
客户端收到服务端的握手包之后会验证报文格式是否符合规范。通过以下规则验证服务端请求：
- 如果服务端返回的状态码不是`101`，则客户端需要将其作为 HTTP 的响应，比如：
  - 收到`401`状态码，客户端需要进行身份验证
  - 收到`3xx`状态码，客户端需要进行重定向
- 如果服务端返回的状态码是`101`，则遵循下面的步骤：
  - 如果响应内容缺少`Upgrade`字段或者`Upgrade`字段值不是`"websocket"`，那么客户端必须关闭连接。
  - 如果响应内容缺少`Connection`字段或者`Connection`字段值不是`"Upgrade"`，那么客户端必须关闭连接。
  - 如果响应内容缺少`Sec-WebSocket-Accept`或者将`Sec-WebSocket-Accept`的值解码后不等于`Sec-WebSocket-Key + 固定字符串`，那么客户端必须关闭连接。
  - 如果响应内容中包含`Sec-WebSocket-Protocol`字段，并且这个字段的值没有出现在请求的`Sec-WebSocket-Protocol`字段值中（即服务端使用了一个客户端不支持的子协议），那么客户端必须关闭连接。

此时，HTTP 协议结束，开始进入 WebSocket 协议。[在线测试](http://www.websocket-test.com/)

完成握手后，之后的数据传输将都依赖 WebSocket 协议，如下图

<img src="https://github.com/zygg1512/myBlog/raw/master/images/计算机网络/webSocket通信.webp" height="300px" />

## WebSocket 帧结构
### 数据帧
在WebSocket协议中，数据是通过一系列数据帧来进行传输的。具体的数据帧格式大概长下面这样（从左到右，单位是比特）：
```lua
      0                   1                   2                   3
      0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
     +-+-+-+-+-------+-+-------------+-------------------------------+
     |F|R|R|R| opcode|M| Payload len |    Extended payload length    |
     |I|S|S|S|  (4)  |A|     (7)     |             (16/64)           |
     |N|V|V|V|       |S|             |   (if payload len==126/127)   |
     | |1|2|3|       |K|             |                               |
     +-+-+-+-+-------+-+-------------+ - - - - - - - - - - - - - - - +
     |     Extended payload length continued, if payload len == 127  |
     + - - - - - - - - - - - - - - - +-------------------------------+
     |                               |Masking-key, if MASK set to 1  |
     +-------------------------------+-------------------------------+
     | Masking-key (continued)       |          Payload Data         |
     +-------------------------------- - - - - - - - - - - - - - - - +
     :                     Payload Data continued ...                :
     + - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - +
     |                     Payload Data continued ...                |
     +---------------------------------------------------------------+
```
WebSocket 数据帧主要包括两个部分：帧头和有效载荷。
- 帧头：帧头包括四个部分：FIN、RSV1、RSV2、RSV3、opcode、masked 和 Payload length
- 有效载荷：有效载荷是数据帧中实际的数据部分，它由客户端和服务端进行数据传输。

帧头字段如下：
- FIN：1bit，值为 1 表示这是消息的最后一帧，为 0 则不是
- RSV1, RSV2, RSV3：各占 1bit，一般情况下全为 0，非零值表示采用 WebSocket 扩展
- Opcode：4bit，表示操作码，可能的值有：
  - 0x1，传输数据是文本
  - 0x2，传输数据是二进制数据
  - 0x0，表示该帧是一个延续帧（这意味着服务器应该将帧的数据连接到从该客户端接收到的最后一个帧）
  - 0x3-7：保留的操作代码，用于后续定义的非控制帧
  - 0x8：表示连接断开
  - 0x9：表示这是一个心跳请求（ping）
  - 0xA：表示这是一个心跳响应（pong）
  - 0xB-F：保留的操作代码，用于后续定义的控制帧
- Mask: 1 个比特，表示是否要对数据部分添加掩码。如果设置为1，那么掩码的键值存在于 Masking-Key 中
- Payload length：数据负载的长度，单位是字节。为 7bit，或 7+16bit，或 1+64bit
- Masking-key：0 或 4 字节（32bit），存储掩码的键值：
  - Mask 为 1，会携带了 4 字节的 Masking-key
  - Mask 为 0，表示没有 Masking-key
#### 消息分片
在 WebSocket 协议中，客户端与服务端数据交换的最小信息单位叫做帧（frame），由1个或多个帧按照次序组成一条完整的消息（message）。

WebSocket 的每条消息可能被切分为多个数据帧，当 WebSocket 的接收方接收到一个数据帧时，会根据 FIN 值来判断是否收到消息的最后一个数据帧。
- FIN = 1 时，表示为消息的最后一个数据帧
- FIN = 0 时，则不是消息的最后一个数据帧，接收方还要继续监听接收剩余数据帧。
  - 注意，接收方是在整个接收过程中逐步组装消息的，而不是等到所有帧都接收完毕后再组装。

看一个来自 MDN 上的示例：
```bash
# 第一条消息
Client: FIN=1, opcode=0x1, msg="hello"
Server: (process complete message immediately) Hi.

# 第二条消息
Client: FIN=0, opcode=0x1, msg="and a"
Server: (listening, newmessage containing text started)

Client: FIN=0, opcode=0x0, msg="happy new"
Server: (listening, payload concatenated to previous message)

Client: FIN=1, opcode=0x0, msg="year!"
Server: (process complete message) Happy new year to you too!
```
在该示例中，客户端向服务器发送了两条消息，第一个消息在单个帧中发送，而第二个消息跨三个帧发送。当 WebSocket 的接收方收到一个数据帧时，会根据 FIN 字段值来判断是否收到消息的最后一个数据帧。利用 FIN 和 Opcode，就可以实现跨帧发送消息。

### 控制帧
除了数据帧之外，WebSocket 协议还包括一些控制帧，用于交换状态信息，控制帧可以插在消息片段之间。所有的控制帧的负载长度均不大于 125 字节，并且禁止对控制帧进行分片处理。

主要包括 Ping、Pong 和 Close 帧。以下是 WebSocket 控制帧结构的简要介绍：
- Ping帧（0x9）：客户端（或者服务器）会周期性地向对方发送一个特殊的帧，这称为 Ping帧。Ping帧 并不携带任何应用级别的数据，而仅仅是一个用于检查连接状态的标志。具体的发送周期通常可以根据实际情况设定，例如可以设置每隔1 0 秒发送一次 Ping帧。
- Pong帧（0xA）：当另一方接收到 Ping帧 后，会立即回应一个 Pong帧。这是一个自动的操作，当收到 Ping帧 后，WebSocket 的 API 会自动发送 Pong帧。像 Ping帧 一样，Pong帧 也不携带任何应用级别的数据。
- Close帧（0x8）：Close帧 用于关闭客户端和服务端之间的连接，它包括四个部分：fin、rsv1、rsv2、rsv3、opcode、masked 和 payload_length。其中，opcode 的值为 0x8，表示 Close 帧。

>注：WebSocket中，控制帧的处理优先级高于数据帧。当同时收到数据帧和控制帧时，不论数据帧的处理是否完成，控制帧都会被优先处理。

## WebSocket 使用
### 心跳机制
在实际使用中，还需要考虑以下几种异常情况：
- 如果服务器因为某种异常情况而突然断开了 WebSocket 服务，之后又恢复了，此时的浏览器会断开 WebSocket 连接并触发`close`事件，从用户使用角度来说，需要重新连接 WebSocket 服务器
- 如果客户端因为某种异常情况而断开了 WebSocket 连接（比如断网了），之后用恢复了，同样希望能够自动重新连接 WebSocket 服务器

针对上面的问题，可以采用以下的方案：
- 监听浏览器 WebSocket 的`close`、`error`事件，一旦出现就尝试重新连接 WebSocket 服务器
- 设置一个心跳机制，一旦停止心跳，说明此时通信出现异常，也要进行重连尝试
- 设置一个超时机制，如果在设定的时间内没有接收到 Pong帧，那么就认为对方已经离线或者连接出现问题。于是，可以执行相应的操作，例如断开连接，或者发出提醒

对于心跳包的实现，存在两种方式：
- 方式一：客户端发送心跳包（ping），服务器需要响应心跳包消息（pong）来表明通信正常，客户端一旦没有接收到响应消息就进行重连尝试。
  - 优点：客户端可以灵活控制心跳包的发送频率
  - 缺点：需要ping、pong两次消息传递，比较消耗带宽
- 方式二：由服务器来发送心跳包，客户端如果过期没有接收到，就进行重连尝试。
  - 优点：只需要服务器发送心跳包就可以了
  - 缺点：客户端无法灵活控制心跳包的发送频率，只能在服务器进行设置
#### Chrome 中的心跳机制
Chrome 的 WebSocket 会自动发送 Ping消息 和处理 Pong消息。这个过程是由 Chrome 自动处理的，开发者无需手动发送 Ping消息 和处理 Pong消息。
- 当 WebSocket 连接建立后，Chrome 会自动定期发送 Ping消息 给服务器。
- 当服务端发送了 Ping消息, 那么会立即收到 Chrome 发送的回来的 Pong消息。

需要注意的是，Chrome 的 Network 面板中不会显示 Ping消息 和 Pong消息，因为这些消息是在底层处理的，不会暴露给开发者。开发者只需要关注 WebSocket 的`onmessage`事件，处理接收到的消息即可。

并且 HTML 的 WebSocket 对象也没有提供直接的 Pong方法或事件。在HTML中，WebSocket 对象只提供了`send`方法用于发送消息，以及`close`方法用于关闭连接。

也就是说 Chrome 自动实现了心跳机制，但这个心跳机制缺少超时机制和重试机制，如果需要超时机制和重试机制的话，得自己手动实现一份心跳机制。

### 关闭连接
#### 常见的关闭状态码
|状态码|含义|
|:-:|:-:|
|1000|表示一个正常的关闭|
|1001|表示终端已经“走开”，例如服务器停机了或者在浏览器中离开了这个页面|
|1002|表示终端由于协议错误中止了连接|
|1003|表示终端由于收到了一个不支持的数据类型的数据（如终端只能理解文本数据，但是收到了一个二进制数据）从而关闭连接|
|1005|是一个保留值并且不能被终端当做一个关闭帧的状态码。为了给上层应用表示当前没有状态码|
|1006|是一个保留值并且不能被终端当做一个关闭帧的状态码。为了给上层应用表示连接被异常关闭。如没有发送或者接收到关闭帧|
|1007|表示终端因为收到了类型不连续的消息（如非 UTF-8 编码的文本消息）导致的连接关闭|
|1008|表示终端是因为收到了一个违反政策的消息导致的连接关闭。这是一个通用的状态码，可以在没有什么合适的状态码（如 1003 或者 1009）时或者可能需要隐藏关于政策的具体信息时返回|
|1009|表示终端由于收到了一个太大的消息无法进行处理从而关闭连接|
#### 服务器关闭
服务器可以通过向客户端发送关闭帧来主动关闭连接。服务器发送一个包含关闭码的帧，表明连接的原因，并随后关闭连接。

例如在 Node.js 中使用 WebSocket 库可以通过`close`方法来完成。
```javascript
const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 3000 })

wss.on('connection', (ws) => {
  // ...

  // 服务器端关闭连接
  ws.close(1000, 'Goodbye, client!')
})
```
#### 客户端关闭
客户端也可以主动关闭 WebSocket 连接，同样通过发送关闭帧来完成。在浏览器中，可以使用 WebSocket 对象的`close`方法
```javascript
// 客户端关闭连接
const socket = new WebSocket('ws://example.com')
socket.close(1000, 'Goodbye, server!')
```
#### 超时关闭
除了主动关闭，连接也可能因为超时而被动关闭。WebSocket 协议中定义了超时机制，如果在一定时间内没有收到数据帧，连接将被自动关闭。这有助于释放不再使用的资源，防止不必要的连接保持。

### 最佳实践
- [node+ws 模块搭建 WebSocket 服务](https://juejin.cn/post/6945057379834675230)