# HTTP 缓存
## 关于几种缓存
### memory cache 内存缓存
**几乎所有的网络请求资源都会被浏览器自动加入到 memory cache 中**。也正因为缓存数量很大且浏览器占用的内存不能无限扩大这样两个因素，memory cache 注定只能是个“短期存储”。

常规情况下，浏览器的 Tab 关闭后该次浏览的 memory cache 便告失效 (为了给其他 Tab 腾出位置)。而如果极端情况下 (例如一个页面的缓存就占用了超级多的内存)，那可能在 Tab 没关闭之前，排在前面的缓存就已经失效了。

**几乎所有的请求资源** 都能进入 memory cache，这里细分一下主要有两块：

1. preloader
2. preload；例如 `<link rel="preload">`。这些显式指定的预加载资源，也会被放入 memory cache 中

memory cache 机制保证了一个页面中如果有两个相同的请求 (例如两个 `src` 相同的 `<img>`，两个 `href` 相同的 `<link>`)都实际只会被请求最多一次，避免浪费。

**在从 memory cache 获取缓存内容时，浏览器会忽视例如 `max-age=0`, `no-cache` 等头部配置。**

例如页面上存在几个相同 `src` 的图片，即便它们可能被设置为不缓存，但依然会从 memory cache 中读取。这是因为 memory cache 只是短期使用，大部分情况生命周期只有一次浏览而已。而 `max-age=0` 在语义上普遍被解读为“不要在下次浏览时使用”，所以和 memory cache 并不冲突。

如果不想让一个资源进入缓存，就连短期也不行，那就需要使用 `no-store`。存在这个头部配置的话，即便是 memory cache 也不会存储，自然也不会从中读取了。

特点：
- **快速读取**：内存缓存会将编译解析后的文件，直接存入该进程的内存中，**占据该进程一定的内存资源**，以方便下次运行使用时的快速读取。
- **时效性短**：缓存时效性很短，会随着进程的释放而释放

### disk cache硬盘缓存

disk cache 也叫 HTTP cache，顾名思义是存储在硬盘上的缓存，因此它是持久存储的，是实际存在于文件系统中的。而且它允许相同的资源在跨会话，甚至跨站点的情况下使用，例如两个站点都使用了同一张图片。

**disk cache 会严格根据 HTTP 头信息中的各类字段来判定哪些资源可以缓存，哪些资源不可以缓存；哪些资源是仍然可用的，哪些资源是过时需要重新请求的。** 

当命中缓存之后，浏览器会从硬盘中读取资源，虽然比起从内存中读取慢了一些，但比起网络请求还是快了不少的。绝大部分的缓存都来自 disk cache。

凡是持久性存储都会面临容量增长的问题，disk cache 也不例外。在浏览器自动清理时，会有神秘的算法去把“最老的”或者“最可能过时的”资源删除，因此是一个一个删除的。不过每个浏览器识别“最老的”和“最可能过时的”资源的算法不尽相同，可能也是它们差异性的体现。

特点：
- 容量大
- 时效性长

### 三级缓存原理

1. 先去内存看，如果有，直接加载
2. 如果内存没有，则去硬盘获取，如果有直接加载
3. 如果硬盘也没有，那么就进行网络请求
4. 加载到的资源缓存到硬盘和内存

比如：访问图片-> 200 -> 退出浏览器

再进来-> 200(from disk cache) -> 刷新 -> 200(from memory cache)

### Service Worker 缓存

Service Worker 能够操作的缓存是有别于浏览器内部的 memory cache 或者 disk cache 的。可以从 Chrome 的 F12 中，`Application -> Cache Storage `找到这个单独的“小金库”。除了位置不同之外，这个缓存是永久性的，即关闭 Tab 或者浏览器，下次打开依然还在(而 memory cache 不是)。有两种情况会导致这个缓存中的资源被清除：手动调用 API `cache.delete(resource)` 或者容量超过限制，被浏览器全部清空。

如果 Service Worker 没能命中缓存，一般情况会使用 `fetch()` 方法继续获取资源。**注意：经过 Service Worker 的 `fetch()` 方法获取的资源，即便它并没有命中 Service Worker 缓存，甚至实际走了网络请求，也会标注为 `from ServiceWorker`**

### 请求网络

如果一个请求在上述 3 个位置都没有找到缓存，那么浏览器会正式发送网络请求去获取内容。之后容易想到，为了提升之后请求的缓存命中率，自然要把这个资源添加到缓存中去。具体来说：

1. 根据 Service Worker 中的 handler 决定是否存入 Cache Storage (额外的缓存位置)。
2. 根据 HTTP 头部的相关字段(`Cache-control`, `Pragma` 等)决定是否存入 disk cache
3. memory cache 保存一份资源 **的引用**，以备下次使用。

### 缓存小结

memory cache 是浏览器为了加快读取缓存速度而进行的自身的优化行为，不受开发者控制，也不受 HTTP 协议头的约束，算是一个黑盒。Service Worker 是由开发者编写的额外的脚本，且缓存位置独立，出现也较晚，使用还不算太广泛。所以我们平时最为熟悉的其实是 disk cache，也叫 HTTP cache (因为不像 memory cache，它遵守 HTTP 协议头中的字段)。平时所说的强制缓存，对比缓存，以及 `Cache-Control` 等，也都归于此类。
## HTTP 缓存机制
HTTP缓存可分为强制缓存和协商缓存。

- 强制缓存：直接使用客户端缓存，不从服务器拉取新资源，也不验证缓存资源是否过期。返回的状态码为200（OK）。
- 协商缓存：通过服务器验证资源有效性，资源有效则返回304（Not Modified），资源失效则返回最新的资源文件。

HTTP主流的有三个版本：HTTP/1.0、HTTP/1.1、HTTP/2.0。其中 HTTP/1.0 和 HTTP/1.1 的应用最为广泛。HTTP/2.0 因对缓存机制的改动有别于 HTTP/1.0 和 HTTP/1.1，因此 HTTP/2.0 相关内容会在文末总结部分进行介绍。

HTTP/1.0与HTTP/1.1可根据缓存类别区分如下：

|HTTP版本|强制缓存|协商缓存|
|---|---|---|
|HTTP/1.0|`Expires`|`Last-Modified`|
|HTTP/1.1|`Cache-Control`|`ETag`|

## 强制缓存
### HTTP/1.0 - Expires
`Expires`​的值为服务端返回的到期时间，是一个GMT​（格林尼治标准时间）绝对时间，如：`Tue, 17 Jan 2023 03:48:45 GMT`​。

下一次请求时，客户端判断当前系统GMT​时间是否小于缓存携带的GMT时间。若小于，直接使用缓存数据，否则从服务器请求新的文件。

<img src="https://github.com/zygg1512/myBlog/raw/master/images/计算机网络/性能HTTP头信息化/Expires.png" height="400px" />

#### Expires 缺陷
- 使用客户端获取的GMT​时间与服务器GMT时间作比较，如果客户端主动修改了系统时间，就会出现缓存命中的误差。
- GMT时间是基于格林尼治天文台测算时间后，每隔一小时向全世界发放调时信息。由于观测本身存在的误差以及非实时的同步机制，都可能会导致出现缓存命中的误差。

所以在HTTP/1.1版本中，使用`Cache-Control​`中的`max-age`替代。

### HTTP/1.1 - Cache-Control
`Cache-Control`是HTTP/1.1中重要的缓存规则。它可以在HTTP请求头和响应头中使用，提供了多样化的配置参数。同时也可以适用于更广泛的复杂场景。

指令格式具有以下有效规则：
- 不区分大小写，但建议使用小写。
- 多个指令以逗号分隔。
- 具有可选参数，可以用令牌或者带引号的字符串语法。

#### no-store
直接禁止浏览器缓存数据，每次请求资源都会向服务器要完整的资源。具有HTTP缓存的最高优先级。

<img src="https://github.com/zygg1512/myBlog/raw/master/images/计算机网络/性能HTTP头信息化/no-store.png" height="500px" />

#### no-cache
不使用强制缓存。每次进行响应前都向服务器进行缓存有效性验证。即不使用本地缓存。需要使用协商缓存。

<img src="https://github.com/zygg1512/myBlog/raw/master/images/计算机网络/性能HTTP头信息化/no-cache.png" height="500px" />

#### public
公共缓存。任何从源服务器到客户端中的每个节点都可以对资源进行缓存。
#### private
私有缓存。仅客户端可以对资源进行缓存。
#### max-age
客户端缓存存储的最长时间，单位秒。判断的优先级高于Expires​，客户端会判断资源已缓存的时长是否小于设置的`max-age`​时长。是则直接使用缓存数据，否则会进行Expires的判断流程。

<img src="https://github.com/zygg1512/myBlog/raw/master/images/计算机网络/性能HTTP头信息化/max-age.png" height="500px" />

#### s-maxage
代理缓存服务器最长的缓存时间，单位秒。优先级高于`max-age`和`Expires`，仅适用于缓存服务器。


## 对比缓存（协商缓存）
客户端缓存失效后会向服务器进行进行缓存有效性验证，这个缓存有效性验证的过程就是协商缓存​。若资源有效，则返回304（Not Modified）​。客户端拿到304状态码后会再从本地缓存中获取资源。

整个请求响应过程是与无缓存流程一样的。相对于无缓存流程的优势在于仅响应状态码后，客户端直接从本地缓存获取文件，而无需进行文件下载。减少了网络响应的文件大小，进而加快了网络响应速度。

协商缓存的请求和响应是需要相互配合的，可组合使用。如下表：

|HTTP版本|请求|响应|
|---|---|---|
|HTTP/1.0|`If-Modified-Since` <br /> `If-Unmodified-Since`|`Last-Modified`|
|HTTP/1.1|`If-None-Match` <br /> `If-Match`|`ETag`|

协商缓存会先判断请求头中是否携带`no-store`。如果携带，则直接返回最新的服务器文件。

<img src="https://github.com/zygg1512/myBlog/raw/master/images/计算机网络/性能HTTP头信息化/对比缓存.png" height="500px" />

### HTTP/1.0 - Last-Modified
客户端第一次向服务器请求资源时，服务器会返回资源。同时会在响应头中添加`Last-Modified`​字段来表明资源的最后修改时间。当客户端强制缓存失效后，会重新向服务器进行缓存有效性验证。

在验证的请求头中，会添加`If-Modified-Since`​字段。服务器会对请求头中的`If-Modified-Since`​和其存储的资源`Last-Modified`​进行比较。
- 若`If-Modified-Since`​的时间大于等于`Last-Modified`的时间​，则资源有效，返回304（Not Modified）​。
- 否则返回资源本身，并且重新记录文件的`Last-Modified`。

#### Last-Modified​
响应头携带的资源最后修改时间。格式为`last-modified:GMT`。
```bash
last-modified: Sat, 14 Jan 2023 08:40:00 GMT
```
#### If-Modified-Since​
请求头携带的资源是否在某个时间后有修改。服务器会使用此值和其本身存储的时间进行比较。格式为：`If-Modified-Since:GMT`​。只可以用在 GET​ 或 HEA D请求中。

#### If-Unmodified-Since​
请求头携带的资源是否在某个时间后没有修改。格式为：`if-unmodified-since:GMT`​。

有别于`If-Modified-Since`，`If-Unmodified-Since`​被用于POST​或其他非简单请求。如果在`If-Unmodified-Since`​指定的时间内有过修改，则返回412(Precondition Failed)。

<img src="https://github.com/zygg1512/myBlog/raw/master/images/计算机网络/性能HTTP头信息化/If-Unmodified-Since​.png" height="500px" />

#### Last-Modified 缺陷
- `Last-Modified`只关注文件的最后修改时间，和文件内容无关。所以文件内容在修改后又重新恢复，也会导致文件的最后修改时间改变。此时客户端的请求则无法使用缓存。
- `Last-Modified`​只能监听到秒级别的文件修改，如果文件在1秒内进行了多次修改，那么响应头返回的`Last-Modified`​的时间是不变的。此时客户端因接收到响应304，会导致资源无法及时更新，使用缓存的资源文件。

因此HTTP/1.1使用了ETag来进行缓存协商。

### HTTP/1.1 - ETag
为了解决上述`Last-Modified`​可能存在的不准确的问题，HTTP/1.1推出了新的响应字段`ETag`​来进行协商缓存。`ETag`​的优先级比`Last-Modified`高。

服务器接收到浏览器请求后，会先进行`If-None-Match`与`ETag`​值的比较。若相等，则资源有效，返回304（Not Modified）​。否则返回资源本身，并且重新记录文件的`ETag`。
#### ETag
响应头携带的资源标识符。格式为`ETag:ETag-value`可由服务器自行设置算法生成，通常是使用内容的散列或简单的使用版本号。


```bash
etag: "I82YRPyDtSi45r0Ps/eo8GbnDfg="
```
##### 强校验和弱校验
ETag的格式为：`ETag= [ weak ] opaque-tag`，其中`[ weak ]`表示可选。

ETag支持强校验和弱校验，它们的区别在于 ETag 标识符中是否存在一个初始的`“W/”`（即有无`[ weak ]`），格式如下所示：

| 值                  | 类型          |
| ------------------ | ----------- |
| ETag="123456789"   | 强校验         |
| ETag=W/"123456789" | 弱校验（W大小写敏感） |


- 强ETag是指在资源内容发生变化时，ETag值也会随之改变的标识符。它是由服务器根据资源内容生成的，通常是使用哈希算法计算资源内容的摘要值作为ETag值。
  - 客户端在请求资源前，如果发现本地缓存的ETag值与服务器返回的ETag值相同，则可以直接使用本地缓存，不需要重新下载资源。

- 弱ETag是指在资源内容发生变化时，ETag值不一定会随之改变的标识符。它通常是由服务器根据资源的某些属性（如最后修改时间）生成的。
  - 户端在请求资源前，如果发现本地缓存的ETag值与服务器返回的ETag值相同，则还需要向服务器发送一个条件请求，询问服务器资源是否发生了变化，如果没有变化，则服务器返回304 Not Modified状态码，客户端可以直接使用本地缓存。

强ETag和弱ETag的生成方式不同，但它们的作用都是为了优化HTTP请求，减少网络传输的数据量，提高页面加载速度

#### If-None-Match
请求头携带的是否无匹配文件。优先级高于`Last-Modified`​。

当服务器没有任何资源的`ETag`​与请求头携带的`ETag`值完全一样时，返回最新的资源，否则服务器会返回304。
```bash
if-none-match: "I82YRPyDtSi45r0Ps/eo8GbnDfg="
```

#### If-Match​
请求头携带的是否存在匹配文件。对于简单请求需要搭配`Range`​首部使用。对于非简单请求，如PUT​，可用于上传`ETag`。
```bash
if-match: "I82YRPyDtSi45r0Ps/eo8GbnDfg="
```

<img src="https://github.com/zygg1512/myBlog/raw/master/images/计算机网络/性能HTTP头信息化/If-Match​.png" height="500px" />

## 推送缓存
HTTP/2.0中设计了新的缓存方式，服务器推送（Push Server）。有别于强制缓存和协商缓存，属于推送缓存。

这种新的缓存方式主要是为了解决客户端缓存时效性的问题，即还没有收到客户端的请求，服务器就把各种资源推送给客户端。

比如，客户端只请求了`a.html`，但是服务器把`a.html`、`a.css`、`a.png`全部发送给客户端。这样的话，只需要一次请求，客户端就更新了所有文件的缓存，提高了缓存的时效性。

## 用户行为对缓存的影响
不同的浏览器在 F5 刷新的时候，同一个文件：
- qq 、fire fox 浏览器会返回 304 Not Nodified，在请求头中不携带`Expires/Cache-Control`。
- chrome 和 safari 刷新的时候，会返回 200 from cache，没有真正发起请求，走强缓存。

可见不同的浏览器反馈是不一致的，所以下面表格中"F5 刷新"时`Expires/Cache-Control`会无效我认为是存在一定争议的。而 Ctrl + F5 强制刷新的时候，会暂时禁用强缓存和协商缓存。

|用户操作 | Expires/Cache-Control | Last-Modied/Etag |
| ---| --- | --- |
| 地址栏回车| 有效 | 有效|
| 页面链接跳转| 有效| 有效|
| 新开窗口| 有效| 有效|
| 前进回退| 有效| 有效|
| F5 刷新| **无效**(有争议，不同浏览器反馈不一致) | 有效|
| **Ctrl+F5 强制刷新**| **无效**| **无效**|

