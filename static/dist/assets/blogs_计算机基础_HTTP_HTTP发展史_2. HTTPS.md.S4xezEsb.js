import{_ as a,c as t,o as e,a4 as l}from"./chunks/framework.BOW58p_D.js";const m=JSON.parse('{"title":"HTTPS 原理","description":"","frontmatter":{},"headers":[],"relativePath":"blogs/计算机基础/HTTP/HTTP发展史/2. HTTPS.md","filePath":"blogs/计算机基础/HTTP/HTTP发展史/2. HTTPS.md"}'),i={name:"blogs/计算机基础/HTTP/HTTP发展史/2. HTTPS.md"},r=l('<h1 id="https-原理" tabindex="-1">HTTPS 原理 <a class="header-anchor" href="#https-原理" aria-label="Permalink to &quot;HTTPS 原理&quot;">​</a></h1><h2 id="http缺陷" tabindex="-1">HTTP缺陷 <a class="header-anchor" href="#http缺陷" aria-label="Permalink to &quot;HTTP缺陷&quot;">​</a></h2><ul><li>明文传输</li><li>不验证通信方身份</li><li>无法证明报文完整性</li></ul><h2 id="https-优势" tabindex="-1">HTTPS 优势 <a class="header-anchor" href="#https-优势" aria-label="Permalink to &quot;HTTPS 优势&quot;">​</a></h2><ul><li>通过非对称加密和对称加密的方式解决明文传输的问题</li><li>通过数字证书验证通信方身份</li></ul><h2 id="https-实现思路" tabindex="-1">HTTPS 实现思路 <a class="header-anchor" href="#https-实现思路" aria-label="Permalink to &quot;HTTPS 实现思路&quot;">​</a></h2><p>从 HTTPS 协议栈层面来看，HTTPS 实现思路就是在 TCP 和 HTTP 之间插入一个安全层（SSL/TLS） <img src="https://gitee.com/CwdyBic/myBlog/raw/master/assets/http/http发展史/SSL.webp" height="300px"></p><p>安全层有两个主要的职责：对发起 HTTP 请求的数据进行加密操作和对接收到 HTTP 的内容进行解密操作。</p><h2 id="https-传输流程" tabindex="-1">HTTPS 传输流程 <a class="header-anchor" href="#https-传输流程" aria-label="Permalink to &quot;HTTPS 传输流程&quot;">​</a></h2><img src="https://gitee.com/CwdyBic/myBlog/raw/master/assets/http/http发展史/https传输过程.webp" height="400px"><ul><li>浏览器向服务器发送对称加密套件列表、非对称加密套件列表和随机数 client-random</li><li>服务器保存随机数 client-random，选择对称加密和非对称加密的套件，生成随机数 service-random，向浏览器发送选择的加密套件、service-random 和包含公钥的数字证书</li><li>浏览器验证数字证书并获取公钥</li><li>浏览器保存公钥，生成随机数 pre-master，然后利用公钥对 pre-master 加密，并向服务器发送加密后的数据</li><li>服务器拿出自己的私钥，解密出 pre-master 数据，并返回确认消息</li><li>服务器和浏览器会使用这三组随机数生成对称密钥，因为服务器和浏览器使用同一套方法来生成密钥，所以最终生成的密钥也是相同的</li></ul><h2 id="对称加密" tabindex="-1">对称加密 <a class="header-anchor" href="#对称加密" aria-label="Permalink to &quot;对称加密&quot;">​</a></h2><p>对称加密是指加密和解密都使用的是相同的密钥。缺点也很明显，就是利用随机数合成的密钥算法是公开的，所以黑客拿到随机数之后，也可以合成密钥</p><img src="https://gitee.com/CwdyBic/myBlog/raw/master/assets/http/http发展史/对称加密.webp" height="300px"><p>从上图中可以看出传输 client-random 和 service-random 的过程是明文的</p><h2 id="非对称加密" tabindex="-1">非对称加密 <a class="header-anchor" href="#非对称加密" aria-label="Permalink to &quot;非对称加密&quot;">​</a></h2><p>非对称加密算法中有A、B两把密钥，如果你使用 A 密钥来加密，那么只能使用 B 密钥来解密。返回来如果你使用 B 密钥来加密，那么只能使用 A 密钥来解密</p><p>在 HTTPS 中，服务器会将其中的一个密钥通过明文的形式发送给浏览器，我们把这个密钥称为公钥，服务器自己留下的那个密钥称为私钥。顾名思义，公钥是每个人都能获取到的，而私钥只有服务器才能知道，不对任何人公开。</p><h3 id="非对称加密流程" tabindex="-1">非对称加密流程 <a class="header-anchor" href="#非对称加密流程" aria-label="Permalink to &quot;非对称加密流程&quot;">​</a></h3><ul><li>首先浏览器还是发送加密套件列表给服务器</li><li>然后服务器会选择一个加密套件，不过和对称加密不同的是，使用非对称加密时服务器上需要有用于浏览器加密的公钥和服务器解密 HTTP 数据的私钥，由于公钥是给浏览器加密使用的，因此服务器会将加密套件和公钥一道发送给浏览器</li><li>最后就是浏览器和服务器返回确认消息</li></ul><p>这样浏览器端就有了服务器的公钥，在浏览器端向服务器端发送数据时，就可以使用该公钥来加密数据。由于公钥加密的数据只有私钥才能解密，所以即便黑客截获了数据和公钥，他也是无法使用公钥来解密数据的。</p><p>下图是使用非对称加密改造的 HTTPS 协议：</p><img src="https://gitee.com/CwdyBic/myBlog/raw/master/assets/http/http发展史/非对称加密.webp" height="300px"><h3 id="非对称加密缺陷" tabindex="-1">非对称加密缺陷 <a class="header-anchor" href="#非对称加密缺陷" aria-label="Permalink to &quot;非对称加密缺陷&quot;">​</a></h3><ul><li>第一个是非对称加密的效率太低。这会严重影响到加解密数据的速度，进而影响到用户打开页面的速度。</li><li>第二个是无法保证服务器发送给浏览器的数据安全。虽然浏览器端可以使用公钥来加密，但是服务器端只能采用私钥来加密，私钥加密只有公钥能解密，但黑客也是可以获取得到公钥的，这样就不能保证服务器端数据的安全了。</li></ul><h2 id="数字证书" tabindex="-1">数字证书 <a class="header-anchor" href="#数字证书" aria-label="Permalink to &quot;数字证书&quot;">​</a></h2><h3 id="数字证书作用" tabindex="-1">数字证书作用 <a class="header-anchor" href="#数字证书作用" aria-label="Permalink to &quot;数字证书作用&quot;">​</a></h3><ul><li>一个是通过数字证书向浏览器证明服务器的身份</li><li>另一个是数字证书里面包含了服务器公钥</li></ul><h3 id="如何申请数字证书" tabindex="-1">如何申请数字证书 <a class="header-anchor" href="#如何申请数字证书" aria-label="Permalink to &quot;如何申请数字证书&quot;">​</a></h3><ul><li>首先网站需要准备一套私钥和公钥，私钥留着自己使用</li><li>然后网站向认证机构（CA）提交公钥、公司、站点等信息并等待认证，这个认证过程可能是收费的</li><li>认证机构（CA）通过线上、线下等多种渠道来验证网站所提供信息的真实性，如公司是否存在、企业是否合法、域名是否归属该企业等</li><li>如果信息审核通过，认证机构（CA）会向网站签发认证的数字证书</li></ul><h3 id="数字证书的内容" tabindex="-1">数字证书的内容 <a class="header-anchor" href="#数字证书的内容" aria-label="Permalink to &quot;数字证书的内容&quot;">​</a></h3><p>包含了网站的公钥、组织信息、认证机构（CA）的信息、有效时间、证书序列号等，这些信息都是明文的，同时包含一个认证机构（CA）生成的签名</p><h4 id="数字签名是如何得到的" tabindex="-1">数字签名是如何得到的 <a class="header-anchor" href="#数字签名是如何得到的" aria-label="Permalink to &quot;数字签名是如何得到的&quot;">​</a></h4><p>认证机构（CA）使用 Hash 函数来计算网站提交的明文信息，并得出<strong>信息摘要</strong>；然后认证机构（CA）再使用自己的私钥对信息摘要进行加密，加密后的密文就是认证机构（CA）颁给网站的数字签名</p><p>这就相当于房管局在房产证上盖的章，这个章是可以去验证的，同样我们也可以通过数字签名来验证是否是该认证机构（CA）颁发的</p><h3 id="浏览器如何验证数字证书" tabindex="-1">浏览器如何验证数字证书 <a class="header-anchor" href="#浏览器如何验证数字证书" aria-label="Permalink to &quot;浏览器如何验证数字证书&quot;">​</a></h3><p>浏览器中会提前下载认证机构（CA）的证书，证书中保存了认证机构（CA）的公钥</p><ul><li>当浏览器向服务器发出请求时，服务器会返回数字证书给浏览器</li><li>浏览器接收到数字证书之后，会对数字证书进行验证 <ul><li>首先浏览器读取证书中相关的明文信息，采用 CA 签名时相同的 Hash 函数来计算并得到信息摘要 A</li><li>然后再利用对应 CA 的公钥解密数字签名数据，得到信息摘要 B</li><li>对比信息摘要 A 和信息摘要 B，如果一致，则可以确认证书是合法的，即证明了这个服务器是对应网站的；同时浏览器还会验证证书相关的域名信息、有效时间等信息</li></ul></li></ul><p>在申请和使用证书的过程中，还需要注意以下三点：</p><ul><li>申请数字证书是不需要提供私钥的，要确保私钥永远只能由服务器掌握</li><li>数字证书最核心的是 CA 使用它的私钥生成的数字签名</li><li>内置 CA 对应的证书称为根证书，根证书是最权威的机构，它们自己为自己签名，我们把这称为自签名证书</li></ul>',40),h=[r];function o(s,n,p,d,c,T){return e(),t("div",null,h)}const P=a(i,[["render",o]]);export{m as __pageData,P as default};
