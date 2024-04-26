import{_ as s,c as i,o as a,a4 as n}from"./chunks/framework.BOW58p_D.js";const c=JSON.parse('{"title":"测试网络","description":"","frontmatter":{},"headers":[],"relativePath":"blogs/常用命令/Linux/测试网络.md","filePath":"blogs/常用命令/Linux/测试网络.md"}'),p={name:"blogs/常用命令/Linux/测试网络.md"},t=n(`<h1 id="测试网络" tabindex="-1">测试网络 <a class="header-anchor" href="#测试网络" aria-label="Permalink to &quot;测试网络&quot;">​</a></h1><h2 id="ping-命令" tabindex="-1">ping 命令 <a class="header-anchor" href="#ping-命令" aria-label="Permalink to &quot;ping 命令&quot;">​</a></h2><h3 id="概述" tabindex="-1">概述 <a class="header-anchor" href="#概述" aria-label="Permalink to &quot;概述&quot;">​</a></h3><p><strong>ping命令用来测试双向联通性，发送ICMP包</strong></p><p>ping也属于一个通信协议，是TCP/IP协议的一部分。<strong>ping命令本身处于应用层，相当于一个应用程序，它直接使用网络层的ICMP协议。</strong> 它的作用主要为:</p><ul><li>通常用来检测网络的连通情况和测试网络速度</li><li>也可以根据域名得到相应主机的IP地址，<strong>不包含端口号</strong></li><li>根据ping返回的TTL值来判断对方所使用的操作系统及数据包经过路由器数量</li><li>因为具备以上功能，ping命令常常被黑客用来进行网络扫描和攻击</li></ul><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">$</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ping</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> https://wwww.baodi.com</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## ping【目标主机的域名】【目标主机的域名】【不带包头的包大小】</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">PING</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> https://wwww.baodi.com</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (64.190.63.111): 56 data bytes</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Request</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> timeout</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> for</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> icmp_seq</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 0</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Request</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> timeout</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> for</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> icmp_seq</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 1</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">64</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> bytes</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 64.190.63.111:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> icmp_seq=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">2</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ttl=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">52</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> time=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">239.568</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ms</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">64</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> bytes</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 64.190.63.111:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> icmp_seq=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">3</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ttl=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">52</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> time=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">238.539</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ms</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">64</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> bytes</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 64.190.63.111:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> icmp_seq=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">4</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ttl=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">52</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> time=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">281.818</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ms</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">---</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> https://wwww.baodi.com</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ping</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> statistics</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> ---</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 发出去的包数，返回的包数，丢包率，耗费时间</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">6</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> packets</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> transmitted,</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 3</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> packets</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> received,</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 50.0%</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> packet</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> loss</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 最小/最大/平均响应时间和本机硬件耗费时间</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">round-trip</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> min/avg/max/stddev</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 238.539/253.308/281.818/20.164</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ms</span></span></code></pre></div><ul><li>icmp_seq：ping序列，从1开始；如果数字不是按顺序递增也就意味着丢包了</li><li>bytes值：表示通信过程中发送的数据包大小，单位是字节</li><li>time值：表示响应时间，这个时间越小，说明你与对方通信的速度越快，延时越短</li><li>TTL值：Time To Live，表示数据包再经过多少个路由器如果还不能到达就将被丢弃 <ul><li>当报文在网络中转发时，每经过一个‘路由点‘，就把预先设定的这个TTL数值减1，直到最后TTL=1时报文就被扔掉，不向下转发</li><li>这里可以通过 Ping 返回的TTL值大小，粗略地判断目标系统类型是 Windows 系列还是 UNIX/Linux 系列。默认情况下 <ul><li>Linux系统的TTL最大值为64或255</li><li>WindowsNT/2000/XP系统的TTL最大值为128</li><li>UNIX主机的TTL最大值为255</li></ul></li></ul></li></ul><p>ping指的是端对端连通，通常用来作为可用性的检查，但是某些病毒木马会强行大量远程执行ping命令抢占你的网络资源，导致系统变慢，网速变慢。严禁ping入侵作为大多数防火墙的一个基本功能提供给用户进行选择。通常的情况下你如果不用作服务器或者进行网络测试，可以放心的选中它，保护你的电脑。</p><h2 id="telnet命令" tabindex="-1">telnet命令 <a class="header-anchor" href="#telnet命令" aria-label="Permalink to &quot;telnet命令&quot;">​</a></h2><p><strong>telnet协议是TCP/IP协议族的其中之一</strong>，是Internet远端登录服务的标准协议和主要方式，常用于网页服务器的远端控制，可供使用者在本地主机执行远端主机上的工作。</p><p>使用者首先在电脑执行telnet程序，连线至目的地服务器，然后输入帐号和密码以验证身份。使用者可以在本地主机输入命令，然后让已连接的远端主机执行，就像直接在对方的控制台上输入一样。传统telnet会话所传输的资料并未加密，帐号和密码等敏感资料容易会被窃听，因此很多服务器都会封锁telnet服务，改用更安全的ssh。</p><p>一般的telnet指令为：</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">$</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> telnet</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> www.baidu.com</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 80</span></span></code></pre></div><p><strong>同时也是测试目标机器的TCP端口是否开放。</strong> 如<code>telnet IP地址 3389</code>是用来测试目标机器的3389端口是否开放，如果连接失败，可能是防火墙屏蔽，也可能是目标机器没有启用相关远程桌面服务(windows)，或者修改了默认占用3389端口</p><h2 id="telnet、ping区别" tabindex="-1">telnet、ping区别 <a class="header-anchor" href="#telnet、ping区别" aria-label="Permalink to &quot;telnet、ping区别&quot;">​</a></h2><ul><li>telnet是用来探测指定ip是否开放指定端口和远程登录机器</li><li>ping用来检查网络是否通畅或者网络连接速度的命令。ping也属于一个通信协议，是TCP/IP协议的一部分 <ul><li><strong>ping命令本身处于应用层，相当于一个应用程序，它直接使用网络层的ICMP协议</strong></li></ul></li></ul><p>简单的说，ping 可以测试到目标机器的连通性。ping域名还可以得出解析IP。评估网络质量。而telnet命令则用来远程登陆，同时也是测试目标机器的TCP端口是否开放，但telnet不通并不一定代表网络不通。</p><p>ping是基于ICMP协议的命令，就是你发出去一个数据包，对方收到后返给你一个！就好比声纳。这个协议是可以禁止的！禁止后，如果你ping对方，对方收到后就不回馈给你，这样你就显示无法ping通，但实际你们还是连着的！telnet是登陆服务器的！服务没禁止就能登陆。</p><h3 id="例子" tabindex="-1">例子 <a class="header-anchor" href="#例子" aria-label="Permalink to &quot;例子&quot;">​</a></h3><p>离你家百里之外有一个大house，ping就是从你家到house的“路”是通的，可以到达，这个“路”可以是水路，可以小路，也可以是航线，不同的“路”代表了网络质量。ping通代表你们可以连通，物理上没有阻隔。 telnet就是这个大house有很多门，门有各自的编号，你可以从不同的门进去之干不同的事情，有的门是进去是喝茶的，有的是唱歌的，当然这些门后的功能不是绝对对应的，这家的001门是喝茶的，别家喝茶的是走002门。这些门就是port。</p><p>如果这house修了护城河，你们就不是连通的，但是护城河上有一些特定宽度的桥（防火墙），可以到达特定的门，这种情况就是ping不通，telnet某些端口通的。</p><h2 id="curl命令" tabindex="-1">curl命令 <a class="header-anchor" href="#curl命令" aria-label="Permalink to &quot;curl命令&quot;">​</a></h2><h3 id="概述-1" tabindex="-1">概述 <a class="header-anchor" href="#概述-1" aria-label="Permalink to &quot;概述&quot;">​</a></h3><p><strong>curl 是常用的命令行工具，用来请求 Web 服务器。</strong> 它的名字就是客户端（client）的 URL 工具的意思。 不带有任何参数时，curl 就是发出 GET 请求</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">$</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> curl</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> https://www.example.com</span></span></code></pre></div><p>上面命令向<code>www.example.com</code>发出 GET 请求，服务器返回的内容会在命令行输出。</p><h3 id="常用参数" tabindex="-1">常用参数 <a class="header-anchor" href="#常用参数" aria-label="Permalink to &quot;常用参数&quot;">​</a></h3><p><strong>-A</strong></p><p>-A参数指定客户端的用户代理标头，即User-Agent。curl 的默认用户代理字符串是<code>curl/[version]</code></p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">$</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> curl</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -A</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36&#39;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> https://google.com</span></span></code></pre></div><p>上面命令将User-Agent改成 Chrome 浏览器</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">$</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> curl</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -A</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;&#39;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> https://google.com</span></span></code></pre></div><p>上面命令会移除User-Agent标头 也可以通过<code>-H</code>参数直接指定标头，更改User-Agent</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">$</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> curl</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -H</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;User-Agent: php/1.0&#39;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> https://google.com</span></span></code></pre></div><p><strong>-b</strong></p><p>用来向服务器发送 Cookie</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 会生成一个标头Cookie: foo=bar，向服务器发送一个名为foo、值为bar的 Cookie</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">$</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> curl</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -b</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;foo=bar&#39;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> https://google.com</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 发送两个 Cookie</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">$</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> curl</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -b</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;foo1=bar;foo2=bar2&#39;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> https://google.com</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 取本地文件cookies.txt，里面是服务器设置的 Cookie（参见-c参数），将其发送到服务器</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">$</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> curl</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -b</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> cookies.txt</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> https://www.google.com</span></span></code></pre></div><p><strong>-c</strong></p><p>将服务器设置的 Cookie 写入一个文件</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 将服务器响应的 Cookie 写入 cookies.txt</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">$</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> curl</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -c</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> cookies.txt</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> https://www.google.com</span></span></code></pre></div><p><strong>-d</strong></p><p>用于发送 POST 请求的数据体</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">$</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> curl</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -d</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;login=emma＆password=123&#39;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">-X</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> POST</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> https://google.com/login</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 或者</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">$</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> curl</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -d</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;login=emma&#39;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -d</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;password=123&#39;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -X</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> POST</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  https://google.com/login</span></span></code></pre></div><p>使用<code>-d</code>参数以后，HTTP 请求会自动加上标头<strong>Content-Type : application/x-www-form-urlencoded</strong> 并且会自动将请求转为 POST 方法，因此可以省略<code>-X POST</code></p><p>-d参数可以读取本地文本文件的数据，向服务器发送</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">读取data.txt文件的内容，作为数据体向服务器发送</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">$</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> curl</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -d</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;@data.txt&#39;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> https://google.com/login</span></span></code></pre></div><p><strong>--data-urlencode</strong></p><p>等同于<code>-d</code>，发送 POST 请求的数据体，区别在于会自动将发送的数据进行 URL 编码</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 发送的数据hello world之间有一个空格，需要进行 URL 编码</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">$</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> curl</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --data-urlencode</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;comment=hello world&#39;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> https://google.com/login</span></span></code></pre></div><p><strong>-e</strong></p><p>用来设置 HTTP 的标头Referer，表示请求的来源</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 将Referer标头设为https://google.com?q=example</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">$</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> curl</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -e</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;https://google.com?q=example&#39;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> https://www.example.com</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## -H参数可以通过直接添加标头Referer，达到同样效果</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">$</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> curl</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -H</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;Referer: https://google.com?q=example&#39;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> https://www.example.com</span></span></code></pre></div><p><strong>-F</strong></p><p>用来向服务器上传二进制文件</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 会给 HTTP 请求加上标头Content-Type: multipart/form-data，然后将文件photo.png作为file字段上传</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">$</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> curl</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -F</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;file=@photo.png&#39;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> https://google.com/profile</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 可以指定 MIME 类型</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">$</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> curl</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -F</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;file=@photo.png;type=image/png&#39;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> https://google.com/profile</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 上面命令指定 MIME 类型为image/png，否则 curl 会把 MIME 类型设为application/octet-stream</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 也可以指定文件名</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">$</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> curl</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -F</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;file=@photo.png;filename=me.png&#39;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> https://google.com/profile</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 上面命令中，原始文件名为photo.png，但是服务器接收到的文件名为me.png</span></span></code></pre></div><p><strong>-G</strong></p><p>用来构造 URL 的查询字符串</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">$</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> curl</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -G</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -d</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;q=kitties&#39;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -d</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;count=20&#39;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> https://google.com/search</span></span></code></pre></div><p>上面命令会发出一个 GET 请求，实际请求的 URL 为<a href="https://google.com/search?q=kitties&amp;count=20%E3%80%82%E5%A6%82%E6%9E%9C%E7%9C%81%E7%95%A5--G%EF%BC%8C%E4%BC%9A%E5%8F%91%E5%87%BA%E4%B8%80%E4%B8%AA" target="_blank" rel="noreferrer">https://google.com/search?q=kitties&amp;count=20。如果省略--G，会发出一个</a> POST 请求 如果数据需要 URL 编码，可以结合<code>--data--urlencode</code>参数</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">$</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> curl</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -G</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --data-urlencode</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;comment=hello world&#39;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> https://www.example.com</span></span></code></pre></div><p><strong>-H</strong></p><p>添加 HTTP 请求的标头</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 添加 HTTP 标头Accept-Language: en-US</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">$</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> curl</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -H</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;Accept-Language: en-US&#39;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> https://google.com</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 添加两个 HTTP 标头</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">$</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> curl</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -H</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;Accept-Language: en-US&#39;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -H</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;Secret-Message: xyzzy&#39;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> https://google.com</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 添加 HTTP 请求的标头是Content-Type: application/json，然后用-d参数发送 JSON 数据</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">$</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> curl</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -d</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;{&quot;login&quot;: &quot;emma&quot;, &quot;pass&quot;: &quot;123&quot;}&#39;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -H</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;Content-Type: application/json&#39;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> https://google.com/login</span></span></code></pre></div><p><strong>-i</strong></p><p>打印出服务器回应的 HTTP 标头</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">$</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> curl</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -i</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> https://www.example.com</span></span></code></pre></div><p>上面命令收到服务器回应后，先输出服务器回应的标头，然后空一行，再输出网页的源码</p><p><strong>-I</strong></p><p>向服务器发出 HEAD 请求，然会将服务器返回的 HTTP 标头打印出来</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 输出服务器对 HEAD 请求的回应</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">$</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> curl</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -I</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> https://www.example.com</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## --head参数等同于-I</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">$</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> curl</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --head</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> https://www.example.com</span></span></code></pre></div><p><strong>-k</strong></p><p>指定跳过 SSL 检测</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 不会检查服务器的 SSL 证书是否正确</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">$</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> curl</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -k</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> https://www.example.com</span></span></code></pre></div><p><strong>-L</strong></p><p>让 HTTP 请求跟随服务器的重定向。curl 默认不跟随重定向</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">$</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> curl</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -L</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -d</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;tweet=hi&#39;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> https://api.twitter.com/tweet</span></span></code></pre></div><p><strong>--limit-rate</strong></p><p>限制 HTTP 请求和回应的带宽，模拟慢网速的环境</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 将带宽限制在每秒 200K 字节</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">$</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> curl</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --limit-rate</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 200k</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> https://google.com</span></span></code></pre></div><p><strong>-o</strong></p><p>将服务器的回应保存成文件，等同于<code>wget</code>命令</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 将www.example.com保存成example.html</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">$</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> curl</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -o</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> example.html</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> https://www.example.com</span></span></code></pre></div><p><strong>-O</strong></p><p>将服务器回应保存成文件，并将 URL 的最后部分当作文件名</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 将服务器回应保存成文件，文件名为bar.html</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">$</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> curl</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -O</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> https://www.example.com/foo/bar.html</span></span></code></pre></div><p><strong>-s</strong></p><p>将不输出错误和进度信息</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 一旦发生错误，不会显示错误信息。不发生错误的话，会正常显示运行结果</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">$</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> curl</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -s</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> https://www.example.com</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 如果想让 curl 不产生任何输出，可以使用下面的命令</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">$</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> curl</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -s</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -o</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> /dev/null</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> https://google.com</span></span></code></pre></div><p><strong>-S</strong></p><p>指定只输出错误信息，通常与-s一起使用</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 没有任何输出，除非发生错误</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">$</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> curl</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -s</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -o</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> /dev/null</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> https://google.com</span></span></code></pre></div><p><strong>-u</strong></p><p>用来设置服务器认证的用户名和密码</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">$</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> curl</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -u</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;bob:12345&#39;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> https://google.com/login</span></span></code></pre></div><p>上面命令设置用户名为bob，密码为12345，然后将其转为 HTTP 标头<code>Authorization: Basic Ym9iOjEyMzQ1</code> curl 能够识别 URL 里面的用户名和密码</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 能够识别 URL 里面的用户名和密码，将其转为上个例子里面的 HTTP 标头</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">$</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> curl</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> https://bob:12345@google.com/login</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 下面命令只设置了用户名，执行后，curl 会提示用户输入密码</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">$</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> curl</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -u</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;bob&#39;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> https://google.com/login</span></span></code></pre></div><p><strong>-v</strong></p><p>输出通信的整个过程，用于调试</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">$</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> curl</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -v</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> https://www.example.com</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## --trace参数也可以用于调试，还会输出原始的二进制数据</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">$</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> curl</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --trace</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> -</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> https://www.example.com</span></span></code></pre></div><p><strong>-x</strong></p><p>指定 HTTP 请求的代理</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 指定 HTTP 请求通过 myproxy.com:8080 的 socks5 代理发出</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">$</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> curl</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -x</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> socks5://james:cats@myproxy.com:8080</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> https://www.example.com</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 如果没有指定代理协议，默认为 HTTP</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">$</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> curl</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -x</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> james:cats@myproxy.com:8080</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> https://www.example.com</span></span></code></pre></div><p><strong>-X</strong></p><p>指定 HTTP 请求的方法</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 对https://www.example.com发出 POST 请求</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">$</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> curl</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -X</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> POST</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> https://www.example.com</span></span></code></pre></div>`,106),l=[t];function h(e,k,F,g,d,r){return a(),i("div",null,l)}const C=s(p,[["render",h]]);export{c as __pageData,C as default};
