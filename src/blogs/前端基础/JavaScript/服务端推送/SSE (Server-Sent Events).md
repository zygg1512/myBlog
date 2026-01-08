# SSE (Server-Sent Events) 

SSE（Server-Sent Events）是一种基于 HTTP 协议的服务器推送技术。它允许服务器在客户端建立连接后，主动向客户端持续推送数据。

SSE 的本质是一个**长连接**的 HTTP 请求，具有以下特点：
- **单向通信**：只能由服务器向客户端发送消息，客户端无法通过该连接向服务器发送消息（需要另外发请求）。
- **基于文本**：传输的数据是 UTF-8 格式的纯文本。
- **持久连接**：客户端发起请求后，服务器不立即关闭连接，而是保持 `open` 状态，随时通过这个通道推送数据流。

## 交互流程

1. **客户端发起**：客户端向服务器发送一个标准的 HTTP 请求（通常是 GET）。
2. **服务端响应**：服务器收到请求后，返回特定的响应头（`Content-Type: text/event-stream`），告知浏览器这是一个 SSE 流，不要缓存，保持连接打开。
3. **持续推送**：服务器端有新数据时，按照特定的格式（`data: ...\n\n`）写入响应流。
4. **客户端接收**：浏览器通过 `EventSource` API 或 `fetch` 读取流，解析数据并触发 JavaScript 事件。
5. **断开/重连**：使用 `EventSource` 时，如果连接异常中断，浏览器会自动尝试重连。

## 协议规范（前后端交互细节）
### 服务端响应头 (Response Headers)
服务端必须设置以下 Header 才能建立 SSE 连接：
```http
Content-Type: text/event-stream  # 核心：标识为事件流
Cache-Control: no-cache          # 核心：禁止缓存
Connection: keep-alive           # 核心：保持连接
```
### 消息格式 (Message Format)
服务端发送的数据必须符合 SSE 规范的文本格式。每条消息由字段名和字段值组成，不同字段名之间用换行符 `\n` 分隔，**不同消息之间用两个换行符 `\n\n` 分隔**。

常用字段：
- **`data`**：数据内容（如果是 JSON 需要 `JSON.stringify`）。
- **`event`**：事件类型（默认是 `message`，可以自定义，如 `event: update`）。
- **`id`**：消息 ID，用于断线重连机制（浏览器重连时会带上 `Last-Event-ID`）。
- **`retry`**：如果觉得浏览器默认的 3 秒太快或太慢，服务端可以通过发送 retry 字段来告诉浏览器：“如果断了，请等待 X 毫秒后再连”。

单条数据示例：
```text
event: customEvent
id: 101
retry: 30000
data: {"msg": "这是一条JSON数据", "time": "12:00:00"}
\n
\n
```
注意：末尾必须有两个 `\n` 代表这条消息结束
### 浏览器重连机制
只要`EventSource`对象没有被显式调用`close()`关闭，或者服务端没有返回特定的 HTTP 状态码（如 204），浏览器就会一直尝试重连。
- 触发时机：网络错误、服务端关闭连接（res.end()）、TCP 连接中断。
- 默认间隔：浏览器默认通常是 3秒 左右（不同浏览器可能略有差异）。

## 实战实现
这里展示两种实现方式：
1. **标准方式 (`EventSource`)**：最简单，浏览器原生支持，自带重连，但仅支持 GET 请求。
2. **进阶方式 (`Fetch`)**：模拟 SSE，支持 POST 请求和自定义 Header（类似 ChatGPT 的实现方式）。

### 方式一：标准 EventSource 实现

#### 服务端 (Node.js)
```javascript
const http = require('http')

// 模拟数据库/缓存：存储历史消息
// 在生产环境中，这通常是 Redis 或者内存中的 Circular Buffer
const historySize = 100
let history = [] 
let globalId = 0

// 模拟每秒产生一条新数据
setInterval(() => {
  globalId++
  const newMsg = {
    id: globalId,
    data: `数据内容 #${globalId} @ ${new Date().toLocaleTimeString()}`
  }

  // 存入历史缓存
  history.push(newMsg)
  // 保持缓存大小，避免内存溢出
  if (history.length > historySize) {
    history.shift()
  }
}, 1000)

http.createServer((req, res) => {
  if (req.url === '/sse') {
    // 设置 SSE 响应头
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    })

    // --- 核心重连逻辑 START ---
    
    // 获取客户端传来的 Last-Event-ID
    const lastEventId = Number(req.headers['last-event-id'])

    // 如果有 ID，说明是重连，需要补发数据
    if (!isNaN(lastEventId)) {
      console.log(`客户端重连，上次收到 ID: ${lastEventId}`)
      
      // 过滤出 ID 大于 lastEventId 的所有消息
      const missedMessages = history.filter(msg => msg.id > lastEventId)
      
      // 立即发送错过的消息
      missedMessages.forEach(msg => {
        res.write(`id: ${msg.id}\n`)
        res.write(`data: ${msg.data} (补发)\n\n`)
      })
    } else {
      console.log('新客户端连接')
    }
    
    // --- 核心重连逻辑 END ---

    // 实际项目中应该使用 EventEmitter 或 Pub/Sub 模式监听新数据）
    const interval = setInterval(() => {
        // 获取最新的消息发送给客户端
        const latestMsg = history[history.length - 1]
        
        res.write(`id: ${latestMsg.id}\n`)
        res.write(`data: ${latestMsg.data}\n\n`)
    }, 1000)

    req.on('close', () => {
      clearInterval(interval)
      console.log('连接断开')
    })
  }
}).listen(3000)

console.log('Server running on port 3000')
```
#### 前端 (HTML/JS)
```html
<script>
  // 建立连接
  const eventSource = new EventSource('http://localhost:3000/sse')

  // 1. 监听默认消息
  eventSource.onmessage = function(event) {
    console.log('收到默认消息:', event.data)
  }

  // 2. 监听自定义事件 (对应服务端的 event: ping)
  eventSource.addEventListener('ping', (event) => {
    const data = JSON.parse(event.data)
    console.log('收到 ping 事件:', data)
    document.body.innerHTML += `<div>${data.time}</div>`
  })

  // 3. 监听错误
  eventSource.onerror = function(err) {
    console.error('连接错误:', err)
    eventSource.close() // 出错时关闭
  }
</script>
```

### 方式二：Fetch 流式读取 (类 ChatGPT 实现)

由于 `EventSource` 不支持 POST 请求（无法传递复杂的 JSON body），现代 AI 应用（如 ChatGPT）通常使用 `fetch` 配合流式读取来模拟 SSE。

#### 服务端 (Node.js)

*与标准方式基本一致，只是不再强制要求 `event` 和 `id` 字段，重点是流式输出 `data`。*

#### 前端 (Fetch 实现)

```javascript
// 完整的 SSE 流式读取实现
async function streamSSE(url, options = {}) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 30000)
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
      },
      body: JSON.stringify(options.body),
      signal: controller.signal,
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
     // 获取一个可读流 ReadableStream
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      // 流式解码（可能保留不完整字符）
      buffer += decoder.decode(value, { stream: true })
      
      // 按 SSE 消息边界分割
      const messages = buffer.split('\n\n')
      // 保留不完整的消息
      buffer = messages.pop() || ''
      
      for (const msg of messages) {
        if (msg.trim()) {
          // 解析 SSE 消息
          const lines = msg.split('\n')
          let data = null
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                data = JSON.parse(line.slice(6))
              } catch {
                data = line.slice(6)
              }
            }
          }
          
          if (data !== null) {
            // 触发自定义事件或回调
            options.onMessage?.(data)
          }
        }
      }
    }
  } catch (error) {
    options.onError?.(error)
  } finally {
    clearTimeout(timeoutId)
  }
}
```

## SSE vs WebSocket
- **SSE** 像是**收音机广播**：电台（服务端）一直播，你（客户端）只能听，想点歌得另外打电话（发 HTTP 请求）。
- **WebSocket** 像是**打电话**：双方建立了专线，谁都可以随时说话，不需要挂断再拨。

| 维度 | SSE (Server-Sent Events) | WebSocket |
| --- | --- | --- |
| **通信方向** | **单工** (Server -> Client) | **全双工** (Server <-> Client) |
| **底层协议** | **HTTP** (基于 TCP) | **WebSocket** (握手后升级为独立 TCP 协议) |
| **数据格式** | 仅支持 **UTF-8 文本** | 支持 **文本** 和 **二进制** (Blob/ArrayBuffer) |
| **连接性质** | 长连接 (Keep-Alive)，只是个不结束的 HTTP 请求 | 真正的 TCP 通道，状态有状态协议 |
| **自动重连** | **浏览器内置** (`EventSource` 自带重连机制) | **无** (需手动编写代码或使用 socket.io 等库) |
| **事件ID** | **内置支持** (自动处理 `Last-Event-ID`) | **无** (需业务层手动实现) |
| **防火墙/代理** | 友好 (就是普通 HTTP 流量) | 较差 (部分企业防火墙会拦截非 HTTP 协议) |
| **浏览器并发限制** | **严重** (HTTP/1.1 下限制 6 个连接)，HTTP/2 可解 | 无特殊限制 (主要受限于服务器资源) |
| **开发成本** | **极低** (无需引入额外 SDK) | **中/高** (前后端通常都需要专用库) |

### 协议握手与升级
**SSE**：是一个标准的 HTTP 请求。客户端发 `GET`，服务端回 `200 OK` + `Content-Type: text/event-stream`。连接建立后，实际上就是服务端一直在 `res.write()` 但不 `res.end()`。

**WebSocket**：需要一次“协议升级”。客户端发 HTTP 请求带上 `Upgrade: websocket` 头。服务端同意后，连接状态切换，之后的通信不再遵循 HTTP 规范，而是 WebSocket 的二进制帧格式。

### 数据传输效率
**SSE**：稍微冗余。因为每条消息都要加上 `data:`、`event:` 这种前缀，且必须文本化。如果传大文件，Base64 编码会增加体积（约 33%）。

**WebSocket**：高效。头部开销极小（只有几个字节），支持直接传输二进制流，适合音视频、即时游戏。

### 浏览器连接数限制（SSE 的最大痛点）
这是 SSE 开发中最容易踩的坑。
- **问题**: 在 HTTP/1.1 标准下，浏览器对**同一个域名**同时只能建立 **6 个 TCP 连接**。
- **后果**: 如果你开了 6 个 SSE 标签页，第 7 个标签页的任何 AJAX/Fetch 请求都会被阻塞（pending），直到你关掉一个 SSE。
- **解决**:
  - 使用 **HTTP/2** (HTTP/2 支持多路复用，这就不再是问题)。
  - 或者使用不同的域名（domain sharding）。

**WebSocket**: 不受此 6 连接限制。


### 场景选型
#### 适合用 SSE 的场景
**场景特征**：主要是“读”数据，客户端很少需要频繁回传。
- **AI 生成流式输出** (ChatGPT, Claude)：这是目前最典型的 SSE 场景。
- **实时即时通知**：站内信、未读消息数更新。
- **即时数据大屏**：股票走势图（只看）、日志监控平台。
- **体育赛事比分直播**。

**为什么 AI 很多用 SSE？**
1. AI 回复是纯文本。
2. 主要是 Server 推给 Client。
3. 遇到网络波动，SSE 的自动重连和 `Last-Event-ID` 能保证文字不丢失、不重复，开发体验极好。

#### 适合用 WebSocket 的场景
**场景特征**：高频交互，低延迟，双向对等。
- **即时通讯 (IM)**：微信、Slack、聊天室（需要双向发消息）。
- **在线多人游戏**：王者荣耀、FPS 游戏（毫秒级延迟，且也是双向）。
- **协同编辑文档**：Figma、Google Docs（多人同时操作）。
- **视频弹幕**：虽然是下行多，但为了极致的实时性和二进制包体积，大流量下 WebSocket 更好。