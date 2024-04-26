# CSRF 攻击
## 什么是 CSRF 攻击
CSRF 又称为“跨站请求伪造”，是指黑客引诱用户打开黑客的网站，在黑客的网站中，利用用户的登录状态发起的跨站请求。简单来讲，CSRF 攻击就是黑客利用了用户的登录状态，并通过第三方的站点来做一些坏事。

和 XSS 不同的是，CSRF 攻击不需要将恶意代码注入用户的页面，仅仅是利用服务器的漏洞和用户的登录状态来实施攻击。因此黑客是无法通过 CSRF 攻击来获取用户页面数据的。

## CSRF 攻击的特征
了解了 CSRF 攻击的一些手段之后，再来看看 CSRF 攻击的一些“特征”，然后根据这些“特征”分析下如何防止 CSRF 攻击。下面是发起 CSRF 攻击的三个必要条件：
- 第一个，目标站点一定要有 CSRF 漏洞
- 第二个，用户要登录过目标站点，并且在浏览器上保持有该站点的登录状态
- 第三个，需要用户打开一个第三方站点，可以是黑客的站点，也可以是一些论坛

## CSRF 攻击方式
通常当用户打开了黑客的页面后，黑客有三种方式去实施 CSRF 攻击。

假设某网站具有转账功能，可以通过 POST 或 Get 来实现转账，转账接口如下所示：
```bash
# 同时支持 POST 和 GET
https://www.aaa.com/sendcoin

#参数
{
    user: string #目标用户
    price: number #目标金额
}
```
### 用户进入黑客网站后自动触发
#### 自动发起 Get 请求
下面是黑客页面的 HTML 代码
```html
<html>
  <body>
    <h1>黑客的站点：CSRF攻击演示</h1>
    <img src="https://www.aaa.com/sendcoin?user=hacker&price=100">
  </body>
</html>
```
在这段代码中，黑客将转账的请求接口隐藏在 img 标签内，欺骗浏览器这是一张图片资源。

当该页面被加载时，浏览器会自动发起 img 的资源请求，如果服务器没有对该请求做判断的话，那么服务器就会认为该请求是一个转账请求，于是用户账户上的 100 极客币就被转移到黑客的账户上去了。

#### 自动发起 POST 请求
有些服务器的接口是使用 POST 方法的，所以黑客还需要在他的站点上伪造 POST 请求，当用户打开黑客的站点时，是自动提交 POST 请求。

```html
<html>
<body>
  <h1>黑客的站点：CSRF攻击演示</h1>
  <form id='hacker-form' action="https://www.aaa.com/sendcoin" method=POST>
    <input type="hidden" name="user" value="hacker" />
    <input type="hidden" name="price" value="100" />
  </form>
  <script> document.getElementById('hacker-form').submit(); </script>
</body>
</html>
```
在这段代码中，可以看到黑客在他的页面中构建了一个隐藏的表单，该表单的内容就是极客时间的转账接口。

当用户打开该站点之后，这个表单会被自动执行提交；当表单被提交之后，服务器就会执行转账操作。因此使用构建自动提交表单这种方式，就可以自动实现跨站点 POST 数据提交。

### 引诱用户点击链接
除了自动发起 Get 和 Post 请求之外，还有一种方式是诱惑用户点击黑客站点上的链接，这种方式通常出现在论坛或者恶意邮件上。黑客会采用很多方式去诱惑用户点击链接，示例代码如下所示：
```html
<div>
  <img src=http://images.xuejuzi.cn/1612/1_161230185104_1.jpg />
</div>
<div>
  <a href="hhttps://www.aaa.com/sendcoin?user=hacker&price=100" taget="_blank">
    点击下载图片
  </a>
</div>
```
## 怎么防止 CSRF 攻击
### Cookie 的 SameSite 属性
Cookie 的 SameSite 属性用来限制第三方 Cookie，从而减少安全风险。

通常 CSRF 攻击都是从第三方站点发起的，要防止 CSRF 攻击，最好能实现从第三方站点发送请求时禁止 Cookie 的发送，因此在浏览器通过不同来源发送 HTTP 请求时，有如下区别：
- 如果是从第三方站点发起的请求，那么需要浏览器禁止发送某些关键 Cookie 数据到服务器。
- 如果是同一个站点发起的请求，那么就需要保证 Cookie 数据正常发送。

SameSite 属性可以设置三个值
#### Strict
Strict最为严格，完全禁止第三方 Cookie，跨站点时，任何情况下都不会发送 Cookie。换言之，只有当前网页的 URL 与请求目标一致，才会带上 Cookie。
```bash
Set-Cookie: CookieName=CookieValue; SameSite=Strict;
```
这个规则过于严格，可能造成非常不好的用户体验。比如，当前网页有一个 GitHub 链接，用户点击跳转就不会带有 GitHub 的 Cookie，跳转过去总是未登陆状态。

#### Lax
Lax规则稍稍放宽，大多数情况也是不发送第三方 Cookie，但是导航到目标网址的 Get 请求除外。
```bash
Set-Cookie: CookieName=CookieValue; SameSite=Lax;
```
导航到目标网址的 GET 请求，只包括三种情况：链接，预加载请求，GET 表单。详见下表。

|请求类型| 示例|正常情况| Lax|
|---|---|---|---|
|链接| `<a href="..."></a>`| 发送 Cookie | 发送 Cookie |
| 预加载     | `<link rel="prerender" href="..."/>`| 发送 Cookie | 发送 Cookie |
| GET 表单  | `<form method="GET" action="...">`| 发送 Cookie | 发送 Cookie|
| POST 表单 | `<form method="POST" action="...">`  | 发送 Cookie | 不发送|
| iframe  | `<iframe src="..."></iframe>`        | 发送 Cookie|不发送|
| AJAX    | `$.get("...")`                       | 发送 Cookie|不发送|
| Image   | `<img src="...">`                    | 发送 Cookie|不发送|

设置了Strict或Lax以后，基本就杜绝了 CSRF 攻击。当然，前提是用户浏览器支持 SameSite 属性。
#### None
Chrome 计划将Lax变为默认设置。这时，网站可以选择显式关闭 SameSite 属性，将其设为 None。不过，前提是必须同时设置Secure属性（Cookie 只能通过 HTTPS 协议发送），否则无效。
```bash
# 无效设置
Set-Cookie: widget_session=abc123; SameSite=None
# 有效设置
Set-Cookie: widget_session=abc123; SameSite=None; Secure
```

### 验证请求的来源站点
通过 HTTP 请求头中的 Referer 和 Origin 属性，在服务器端验证请求来源的站点。
#### Referrer 属性
Referer字段实际上告诉了服务器，用户在访问当前资源之前的位置。这往往可以用来用户跟踪。

一个典型的应用是，有些网站不允许图片外链，只有自家的网站才能显示图片，外部网站加载图片就会报错。它的实现就是基于Referer字段，如果该字段的网址是自家网址，就放行。
```bash
Referer: https://www.xxx.com/detail
```
##### Referer 的发生场景
浏览器向服务器请求资源的时候，Referer 字段的逻辑是这样的，用户在地址栏输入网址，或者选中浏览器书签，就不发送Referer字段。

主要是以下三种场景，会发送Referer字段。
- 用户点击网页上的链接。
- 用户发送表单。
- 网页加载静态资源，比如加载图片、脚本、样式。
```html
<!-- 加载图片 -->
<img src="foo.jpg" />
<!-- 加载脚本 -->
<script src="foo.js"></script>
<!-- 加载样式 -->
<link href="foo.css" rel="stylesheet">
```

上面这些场景，浏览器都会将当前网址作为Referer字段，放在 HTTP 请求的头信息发送。

浏览器的 JavaScript 引擎提供document.referrer属性，可以查看当前页面的引荐来源。。

由于涉及隐私，很多时候不适合发送Referer字段，因为 Referer 字段很可能把这些 URL 暴露出去。这里举两个例子，都不适合暴露 URL：
- 功能 URL，即有的 URL 不要登录，就能直接完成密码重置、邮件退订等功能。
- 内网 URL，不希望外部用户知道内网有这样的地址。

虽然可以通过 Referer 告诉服务器 HTTP 请求的来源，但是有一些场景是不适合将来源 URL 暴露给服务器的。因此浏览器提供给开发者一些选项，可以不用上传 Referer 值。

##### rel属性

对于开发者来说，`rel="noreferrer"`属性是最简单的一种方法。`<a>`、`<area>`和`<form>`三个标签可以使用这个属性，一旦使用，该元素就不会发送 Referer 字段。
```html
<a href="..." rel="noreferrer" target="_blank">xxx</a>
```
上面链接点击产生的 HTTP 请求，不会带有 Referer 字段。

##### Referrer Policy

rel属性只能定制单个元素的Referer行为，而且选择比较少，只能发送或不发送。W3C 为此制定了更强大的 Referrer Policy。

Referrer Policy 可以设定8个值：
```text
（1）no-referrer：不发送Referer字段。

（2）no-referrer-when-downgrade：如果从 HTTPS 网址链接到 HTTP 网址，不发送Referer字段，其他情况发送（包括 HTTP 网址链接到 HTTP 网址）。这是浏览器的默认行为。

（3）same-origin：链接到同源网址（协议+域名+端口 都相同）时发送，否则不发送。注意，https://foo.com链接到http://foo.com也属于跨域。

（4）origin：Referer字段一律只发送源信息（协议+域名+端口），不管是否跨域。

（5）strict-origin：如果从 HTTPS 网址链接到 HTTP 网址，不发送Referer字段，其他情况只发送源信息。

（6）origin-when-cross-origin：同源时，发送完整的Referer字段，跨域时发送源信息。

（7）strict-origin-when-cross-origin：同源时，发送完整的Referer字段；跨域时，如果 HTTPS 网址链接到 HTTP 网址，不发送Referer字段，否则发送源信息。

（8）unsafe-url：Referer字段包含源信息、路径和查询字符串，不包含锚点、用户名和密码。
```
Referrer Policy 的用法如下：

（1）HTTP 头信息：服务器发送网页的时候，通过 HTTP 头信息的 Referrer-Policy 告诉浏览器。
```bash
Referrer-Policy: origin
```
（2）`<meta>`标签：也可以使用`<meta>`标签，在网页头部设置。
```html
<meta name="referrer" content="origin">
```
（3）referrerpolicy 属性：`<a>`、`<area>`、`<img>`、`<iframe>`和`<link>`标签，可以设置 referrerpolicy 属性。
```html
<a href="..." referrerpolicy="origin" target="_blank">xxx</a>
```
##### 退出页面重定向

还有一种比较老式的技巧，但是非常有效，可以隐藏掉原始网址，谷歌和 Facebook 都在使用这种方法。

链接的时候，不要直接跳转，而是通过一个重定向网址，就像下面这样。
```html
<a  href="/exit.php?url=http%3A%2F%2Fexample.com">Example.com</a>
```
上面网址中，先跳转到/exit.php，然后再跳转到目标网址。这时，Referer字段就不会包含原始网址。

#### Origin 属性
由于在服务器端验证请求头中的 Referer 并不是太可靠，因此标准委员会又制定了 Origin 属性，在一些重要的场合，比如通过 XMLHttpRequest、Fecth 发起**跨站请求**或者**通过 Post 方法发送请求**时，都会带上 Origin 属性。
```bash
Origin: https://www.xxx.com
```
Origin 属性只包含了域名信息，并没有包含具体的 URL 路径，这是 Origin 和 Referer 的一个主要区别。Origin 的值之所以不包含详细路径信息，是有些站点因为安全考虑，不想把源站点的详细路径暴露给服务器。

服务器的策略是优先判断 Origin 属性，如果请求头中没有包含 Origin 属性，再根据实际情况判断是否使用 Referer 值。

### 使用 CSRF Token
除了使用以上两种方式来防止 CSRF 攻击之外，还可以采用 CSRF Token 来验证，这个流程比较好理解，大致分为两步。

第一步，在浏览器向服务器发起请求时，服务器生成一个 CSRF Token。CSRF Token 其实就是服务器生成的字符串，然后将该字符串植入到返回的页面中。
```html
<html>
<body>
    <form action="https://www.aaa.com/sendcoin" method="POST">
      <input type="hidden" name="csrf-token" value="nc98P987bcpncYhoadjoiydc9ajDlcn">
      <input type="text" name="user">
      <input type="text" name="price">
      <input type="submit">
    </form>
</body>
</html>
```
第二步，在浏览器端如果要发起转账的请求，那么需要带上页面中的 CSRF Token，然后服务器会验证该 Token 是否合法。如果是从第三方站点发出的请求，那么将无法获取到 CSRF Token 的值，所以即使发出了请求，服务器也会因为 CSRF Token 不正确而拒绝请求。