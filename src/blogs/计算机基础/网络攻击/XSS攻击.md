# XSS攻击
## 什么是 XSS 攻击
也叫跨站脚本攻击。XSS 攻击是指黑客往 HTML 文件中或者 DOM 中注入恶意脚本，从而在用户浏览页面时利用注入的恶意脚本对用户实施攻击

## XSS 攻击的危害
### 窃取 Cookie 信息
恶意 JavaScript 可以通过“document.cookie”获取 Cookie 信息，然后通过 XMLHttpRequest 或者 Fetch 加上 CORS 功能将数据发送给恶意服务器；恶意服务器拿到用户的 Cookie 信息之后，就可以在其他电脑上模拟用户的登录，然后进行转账等操作。
### 监听用户行为
恶意 JavaScript 可以使用“addEventListener”接口来监听键盘事件，比如可以获取用户输入的信用卡等信息，将其发送到恶意服务器。黑客掌握了这些信息之后，又可以做很多违法的事情。
### 修改 DOM
通过修改 DOM 伪造假的登录窗口，用来欺骗用户输入用户名和密码等信息。
### 在页面内生成恶意浮窗广告
通过在页面内生成恶意浮窗广告引导用户点击，从而获取用户一些信息。

## XSS 攻击方式
通常情况下，主要有**存储型 XSS 攻击**、**反射型 XSS 攻击**和**基于 DOM 的 XSS 攻击**三种方式来注入恶意脚本

### 存储型 XSS 攻击
<img src="https://gitee.com/CwdyBic/myBlog/raw/master/assets/http/网络攻击/存储型XSS.webp" height="300px" />

通过上图，我们可以看出存储型 XSS 攻击大致需要经过如下步骤：
- 首先黑客利用站点漏洞将一段恶意 JavaScript 代码提交到网站的数据库中
- 然后用户向网站请求包含了恶意 JavaScript 脚本的页面
- 当用户浏览该页面的时候，恶意脚本就会将用户的 Cookie 信息等数据上传到服务器

比如在输入框中输入一段恶意脚本并提交，服务器会保存该恶意脚本到数据库中。当用户访问的页面回显提交后，会执行该恶意脚本，这样就可以获取用户的 Cookie 等数据信息

恶意脚本可以通过 XMLHttpRequest 或者 Fetch 将用户的 Cookie 数据上传到黑客的服务器。黑客拿到了用户 Cookie 信息之后，就可以利用 Cookie 信息在其他机器上登录该用户的账号

### 反射型 XSS 攻击
用户将一段恶意代码作为请求参数提交给服务器，服务器接收到请求时，又将恶意代码反射给了浏览器端，这就是反射型 XSS 攻击。

比如黑客经常会通过 QQ 群或者邮件等渠道诱导用户去点击一些恶意链接。用户点击后，链接上的恶意 JavaScript 脚本在用户页面中被执行时，黑客就可以利用该脚本做一些恶意操作。
```text
http://www.x.com/?xss=<script>alert('你被xss攻击了')</script>
```

另外需要注意的是，**服务器不会存储反射型 XSS 攻击的恶意脚本，这是和存储型 XSS 攻击不同的地方。**

### 基于 DOM 的 XSS 攻击
基于 DOM 的 XSS 攻击是不牵涉到页面 Web 服务器的。黑客通过各种手段将恶意脚本注入用户的页面中。

比如通过网络劫持，在页面传输过程中修改 HTML 页面的内容，这种劫持类型很多，有通过 WiFi 路由器劫持的，有通过本地恶意软件来劫持的，它们的共同点是在 Web 资源传输过程或者在用户使用页面的过程中修改 Web 页面的数据。

## 如何阻止 XSS 攻击
存储型 XSS 攻击和反射型 XSS 攻击都是需要经过 Web 服务器来处理的，因此可以认为这两种类型的漏洞是服务端的安全漏洞。而基于 DOM 的 XSS 攻击全部都是在浏览器端完成的，因此基于 DOM 的 XSS 攻击是属于前端的安全漏洞。

但无论是何种类型的 XSS 攻击，它们都有一个共同点，那就是首先往浏览器中注入恶意脚本，然后再通过恶意脚本将用户信息发送至黑客部署的恶意服务器上。所以要阻止 XSS 攻击，我们可以通过阻止恶意 JavaScript 脚本的注入和恶意消息的发送来实现。

### 服务器对输入脚本进行过滤或转码
不管是反射型还是存储型 XSS 攻击，我们都可以在服务器端将一些关键的字符进行转码，比如最典型的：
```text
code:<script>alert('你被xss攻击了')</script>
```
这段代码过滤后，只留下了：
```text
code:
```
除了过滤之外，服务器还可以对这些内容进行转码，还是上面那段代码，经过转码之后，效果如下所示：
```text
code:&lt;script&gt;alert(&#39;你被xss攻击了&#39;)&lt;/script&gt;
```
经过转码之后的内容，如`script`标签被转换为`&lt;script&gt;`，因此即使这段脚本返回给页面，页面也不会执行这段脚本。

### 使用 HttpOnly 属性
使用 HttpOnly 标记的 Cookie 只能使用在 HTTP 请求过程中，所以无法通过 JavaScript 来读取这段 Cookie。


HttpOnly并非万能，仍具有绕过手段
- CVE-2012-0053 Apache服务器2.0-2.2版本存在个漏洞
  - 攻击者可通过向网站植人超大的Cookie，令其HTTP头超过Apache的最大请求长度，4192字节，使得Apache返回400错误，状态页中包含了 HttpOnly 保护的 Cookie
  - 除了Apache，-些其他的服务器在使用者不了解其特性的情况下，也很容易出现HttpOnly保护的Cookie被爆出的情况，例如Squid等
-  PHPINFO页面无论是否设置了 HttpOnly 属性，phpinfo 函数都会输出当前请求上下文的Cookie信息。如果目标网站存在PHPINFO页面，就可以通过XMLHttpRequest请求该页面获取Cookie信息
-  Flash/Java 安全团队在2012年提出，通过Flash、Java 的一些API可以获取到HttpOnly Cookie，这种情况可以归结为客户端的信息泄露

### 充分利用 CSP
虽然在服务器端执行过滤或者转码可以阻止 XSS 攻击的发生，但完全依靠服务器端依然是不够的，我们还需要把 CSP 等策略充分地利用起来，以降低 XSS 攻击带来的风险和后果。

#### 内容安全策略（CSP）
**CSP 的核心思想是服务器通过发送一个 CSP 头部，让服务器决定浏览器能够加载哪些资源，是否能够执行内联 JavaScript 代码。**具体来讲 CSP 有如下几个功能：
- 限制加载其他域下的资源文件，这样即使黑客插入了一个 JavaScript 文件，这个 JavaScript 文件也是无法被加载的
- 禁止向第三方域提交数据，这样用户数据也不会外泄
- 禁止执行内联脚本和未授权的脚本
- 还提供了上报机制，这样可以帮助我们尽快发现有哪些 XSS 攻击，以便尽快修复问题

##### CSP的分类
```bash
# 启用后，不符合 CSP 的外部资源就会被阻止加载
Content-Security-Policy: 策略

# 不执行限制选项，只是记录违反限制的行为。它必须与 report-uri 选项配合使用
Content-Security-Policy-Report-Only : 策略
```
##### CSP的使用
- 在HTTP Header上使用（首选）
```text
"Content-Security-Policy:" 策略
"Content-Security-Policy-Report-Only:" 策略
```
- 在HTML上使用
```html
<meta http-equiv="content-security-policy" content="策略">
<meta http-equiv="content-security-policy-report-only" content="策略">
```
Meta 标签与 HTTP 头只是行式不同而作用是一致的，如果 HTTP 头与 Meta 定义同时存在，则优先采用 HTTP 中的定义。

如果用户浏览器已经为当前文档执行了一个 CSP 的策略，则会跳过 Meta 的定义。如果 META 标签缺少 content 属性也同样会跳过。

##### 常用的CSP指令
| 指令  |指令说明 |
| --- | --- |
| `default-src`  | 针对所有类型（js/image/css/font/ajax/iframe/多媒体等）资源的默认加载策略，如果某类型资源没有单独定义策略，就使用默认的 |
| `script-src`  | 对 JavaScript 的加载策略 |
| `style-src`  | 对样式的加载策略 |
| `img-src`  | 对图片的加载策略 |
| `connect-src`  | 对 Ajax、WebSocket 等请求的加载策略<br />不允许的情况下，浏览器会模拟一个状态为 400 的响应 |
| `font-src`   | 针对 WebFont 的加载策略 |
| `object-src`  | 针对插件的加载策略，例如：`<object>`、`<embed>`、`<applet>` |
| `media-src`  | 针对多媒体的加载策略，例如:音频标签`<audio>`和视频标签`<video>` |
|`frame-src` |针对框架的加载策略，例如： `<frame>`,`<iframe>`|
| `child-src` | 针对框架的加载策略，例如： `<frame>`,`<iframe>`|
| `sandbox` | 针对 sandbox 的限制，相当于 `<iframe>`的sandbox属性|
| `form-action` |针对提交的 form 到特定源的加载策略 |
| `referrer` |针对 referrer 的加载策略 |
| `reflected-xss` | 定义针对 XSS 过滤器使用策略|
| `report-uri`   | 告诉浏览器如果请求的资源不被策略允许时，往哪个地址提交日志信息。<br /> Ps：如果想让浏览器只汇报日志，不阻止任何内容，可以改用 Content-Security-Policy-Report-Only 头。 |
##### CSP 指令值
| 指令值| 说明|
| --- | --- |
|`*`| 允许加载任何内容|
|`'none'`| 不允许加载任何内容|
|`'self'`| 允许加载相同源的内容|
|`www.a.com`| 允许加载指定域名的资源|
|`*.a.com`| 允许加载 a.com 任何子域名的资源|
| `https://a.com/` | 允许加载 a.com 的 https 资源|
|`https:`| 允许加载 https 资源|
|`data:`| 允许加载 data: 协议，例如：base64编码的图片|
|`'unsafe-inline'`| 允许加载 inline 资源，例如style属性、onclick、inline js、inline css等 |
|`'unsafe-eval'`| 允许加载动态 js 代码，例如 eval()|

##### 例子
- 所有内容均从当前域名加载
```bash
Content-Security-Policy: default-src 'self'
```
- 所有内容都从当前域名加载以及其他子域（假如网站的地址是：a.com）
```bash
Content-Security-Policy: default-src 'self' *.a.com
```
- 多个指令之间用「英文分号」分割；多个指令值用「英文空格」分割
```bash
Content-Security-Policy: default-src https://host1.com https://host2.com; frame-src 'none'; object-src 'none'  
# 错误写法，第二个指令将会被忽略
Content-Security-Policy: script-src https://host1.com; script-src https://host2.com
# 正确写法如下
Content-Security-Policy: script-src https://host1.com https://host2.com
```
- 网站接受任意域名的图像，指定域名（a.com）的音频、视频和多个指定域名（a.com、b.com）的脚本
```bash
Content-Security-Policy: default-src 'self';img-src *;media-src a.com;script-src a.com b.com
```
- 通过 report-uri 选项指示浏览器发送JSON格式的拦截报告到某个地址

```bash
Content-Security-Policy: default-src 'self'; report-uri /my_amazing_csp_report_parser; 

# 报告看起来会像下面这样
{  
  "csp-report": {  
    "document-uri": "http://example.org/page.html",  
    "referrer": "http://evil.example.com/",  
    "blocked-uri": "http://evil.example.com/evil.js",  
    "violated-directive": "script-src 'self' https://apis.google.com",  
    "original-policy": "script-src 'self' https://apis.google.com; report-uri http://example.org/my_amazing_csp_report_parser"  
  }  
}
```