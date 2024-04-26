import{_ as s,c as i,o as a,a4 as t}from"./chunks/framework.BOW58p_D.js";const y=JSON.parse('{"title":"优化交互的流畅度","description":"","frontmatter":{},"headers":[],"relativePath":"blogs/浏览器原理/性能优化/页面交互阶段性能优化/1. 优化交互的流畅度.md","filePath":"blogs/浏览器原理/性能优化/页面交互阶段性能优化/1. 优化交互的流畅度.md"}'),n={name:"blogs/浏览器原理/性能优化/页面交互阶段性能优化/1. 优化交互的流畅度.md"},h=t(`<h1 id="优化交互的流畅度" tabindex="-1">优化交互的流畅度 <a class="header-anchor" href="#优化交互的流畅度" aria-label="Permalink to &quot;优化交互的流畅度&quot;">​</a></h1><p>谈交互阶段的优化，其实就是在谈渲染进程渲染帧的速度，因为在交互阶段，帧的渲染速度决定了交互的流畅度。</p><p>先来看看交互阶段的渲染流水线。</p><img src="https://gitee.com/CwdyBic/myBlog/raw/master/assets/http/性能优化/交互阶段渲染进程.webp" width="600px"><p>和加载阶段的渲染流水线有一些不同的地方是，在交互阶段没有了加载关键资源和构建 DOM、CSSOM 流程，大部分情况下，生成一个新的帧都是由 JavaScript 通过修改 DOM 或者 CSSOM 来触发的。还有另外一部分帧是由 CSS 来触发的。</p><p>如果在计算样式阶段发现有布局信息的修改，那么就会触发重排操作，然后触发后续渲染流水线的一系列操作。</p><p>同样如果在计算样式阶段没有发现有布局信息的修改，只是修改了颜色一类的信息，那么就不会涉及到布局相关的调整，所以可以跳过布局阶段，直接进入绘制阶段，这个过程叫重绘。</p><p>还有另外一种情况，通过 CSS 实现一些变形、渐变、动画等特效，这是由 CSS 触发的，并且是在合成线程上执行的，这个过程称为合成。因为它不会触发重排或者重绘，而且合成操作本身的速度就非常快，所以执行合成是效率最高的方式。</p><h2 id="回流、重绘、合成" tabindex="-1">回流、重绘、合成 <a class="header-anchor" href="#回流、重绘、合成" aria-label="Permalink to &quot;回流、重绘、合成&quot;">​</a></h2><h3 id="回流" tabindex="-1">回流 <a class="header-anchor" href="#回流" aria-label="Permalink to &quot;回流&quot;">​</a></h3><p>另外一个叫法是重排</p><p><strong>回流触发的条件就是：当Layout Tree中部分或全部元素的尺寸、结构、或某些属性发生改变时，浏览器重新渲染部分或全部文档的过程称为回流。</strong></p><p>以下的操作会触发回流:</p><ul><li><p>一个 DOM 元素的几何属性变化，常见的几何属性有width、height、padding、margin、left、top、border 等等</p></li><li><p>使 DOM 节点发生增减或者移动</p></li><li><p>读写 offset族、scroll族和client族属性的时候，浏览器为了获取这些值，需要进行回流操作</p></li><li><p>调用 window.getComputedStyle 方法</p></li></ul><p>一些常用且会导致回流的属性和方法：</p><ul><li>clientWidth、clientHeight、clientTop、clientLeft</li><li>offsetWidth、offsetHeight、offsetTop、offsetLeft</li><li>scrollWidth、scrollHeight、scrollTop、scrollLeft</li><li>scrollIntoView()、scrollIntoViewIfNeeded()</li><li>getComputedStyle()</li><li>getBoundingClientRect()</li><li>scrollTo()</li></ul><p>依照上面的渲染流水线，触发回流的时候，如果 DOM 结构发生改变，则重新渲染 DOM 树，然后将后面的流程(包括主线程之外的任务)全部走一遍。</p><img src="https://gitee.com/CwdyBic/myBlog/raw/master/assets/http/性能优化/重排.webp" width="50%"><h3 id="重绘" tabindex="-1">重绘 <a class="header-anchor" href="#重绘" aria-label="Permalink to &quot;重绘&quot;">​</a></h3><p><strong>当页面中元素样式的改变并不影响它在文档流中的位置时（例如：color、background-color、visibility等），浏览器会将新样式赋予给元素并重新绘制它，这个过程称为重绘。</strong></p><p>根据概念，我们知道由于没有导致 DOM 几何属性的变化，因此元素的位置信息不需要更新，从而省去布局的过程，流程如下：</p><img src="https://gitee.com/CwdyBic/myBlog/raw/master/assets/http/性能优化/重绘.webp" width="70%"><p>从图中可以看出，如果修改了元素的背景颜色，那么布局阶段将不会被执行，因为并没有引起几何位置的变换，所以就直接进入了绘制阶段，然后执行之后的一系列子阶段，这个过程就叫 <strong>重绘</strong></p><p><strong>相较于重排操作，重绘省去了布局和分层阶段，所以执行效率会比重排操作要高一些</strong></p><h3 id="合成" tabindex="-1">合成 <a class="header-anchor" href="#合成" aria-label="Permalink to &quot;合成&quot;">​</a></h3><p>还有一种情况：就是<strong>更改了一个既不要布局也不要绘制</strong>的属性，那么渲染引擎会跳过布局和绘制，直接执行后续的<strong>合成</strong>操作，这个过程就叫<strong>合成</strong>。</p><ul><li><strong>不会改变图层的内容</strong>；如文字信息的改变，布局的改变，颜色的改变都会改变图层，就会牵扯到重排或者重绘。</li><li><strong>合成线程中实现的是整个图层的几何变换，透明度变换，阴影等</strong>；比如滚动页面的时候，整个页面内容没有变化，这时候做的其实是对图层做上下移动，这种操作是在渲染进程的合成线程上执行的，执行速度快，且不占用主线程。</li></ul><p><strong>通常渲染路径越长，生成图像花费的时间就越多</strong>。这也解释了，为什么合成要优于重绘和重排，而重绘要优于重排。</p><p>举个例子：比如使用CSS的transform来实现动画效果，<strong>避免了回流跟重绘</strong>，直接在非主线程中执行合成动画操作。显然这样子的效率更高，毕竟这个是在非主线程上合成的，没有占用主线程资源，另外也避开了布局和绘制两个子阶段，所以<strong>相对于重绘和重排，合成能大大提升绘制效率。</strong></p><img src="https://gitee.com/CwdyBic/myBlog/raw/master/assets/http/性能优化/合成.webp" width="70%"><p>提升为一些常见的情况：</p><ul><li>3D transforms：translate3d、translateZ 等</li><li>video、canvas、iframe 等元素</li><li>通过 Element.animate() 实现的 opacity 动画转换</li><li>通过 СSS 动画实现的 opacity 动画转换</li><li>position: fixed</li><li>具有 will-change 属性</li><li>对 opacity、transform、fliter、backdropfilter 应用了 animation 或者 transition（需要是 正在执行 的 animation 或者 transition，当 animation 或者 transition 效果未开始或结束后，提升合成层也会失效）</li><li>will-change 设置为 opacity、transform、top、left、bottom、right（其中 top、left 等需要设置明确的定位属性，如 relative 等）</li><li>需要<strong>剪裁</strong>(clip)的地方</li></ul><h2 id="优化方式" tabindex="-1">优化方式 <a class="header-anchor" href="#优化方式" aria-label="Permalink to &quot;优化方式&quot;">​</a></h2><p>了解了在交互过程中的帧是如何生成的，那接下来我们就可以讨论优化方案了。<strong>一个大的原则就是让单个帧的生成速度变快</strong>。</p><h3 id="减少-javascript-脚本执行时间" tabindex="-1">减少 JavaScript 脚本执行时间 <a class="header-anchor" href="#减少-javascript-脚本执行时间" aria-label="Permalink to &quot;减少 JavaScript 脚本执行时间&quot;">​</a></h3><p>有时 JavaScript 函数的一次执行时间可能有几百毫秒，这就严重霸占了主线程执行其他渲染任务的时间。针对这种情况我们可以采用以下两种策略：</p><ul><li>一种是将一次执行的函数分解为多个任务，使得每次的执行时间不要过久。</li><li>另一种是采用 Web Workers。可以把 Web Workers 当作主线程之外的一个线程，在 Web Workers 中是可以执行 JavaScript 脚本的，不过 Web Workers 中没有 DOM、CSSOM 环境，这意味着在 Web Workers 中是无法通过 JavaScript 来访问 DOM 的，所以可以把一些和 DOM 操作无关且耗时的任务放到 Web Workers 中去执行。</li></ul><h3 id="避免强制同步布局" tabindex="-1">避免强制同步布局 <a class="header-anchor" href="#避免强制同步布局" aria-label="Permalink to &quot;避免强制同步布局&quot;">​</a></h3><p>在介绍强制同步布局之前，先来聊聊正常情况下的布局操作。通过 DOM 接口执行添加元素或者删除元素等操作后，是需要重新计算样式和布局的，不过正常情况下这些操作都是在另外的任务中异步完成的，这样做是为了避免当前的任务占用太长的主线程时间。</p><div class="language-html vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">html</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">html</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">body</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">div</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> id</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;mian_div&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">li</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> id</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;time_li&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;time&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">li</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">li</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;geekbang&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">li</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    &lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">div</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">p</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> id</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;demo&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;强制布局demo&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">p</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">button</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> onclick</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">foo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">()&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;添加新元素&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">button</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">script</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        function</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> foo</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">            let</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> main_div </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> document.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getElementById</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;mian_div&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)      </span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">            let</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> new_node </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> document.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">createElement</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;li&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">            let</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> textnode </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> document.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">createTextNode</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;time.geekbang&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            new_node.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">appendChild</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(textnode);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            document.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getElementById</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;mian_div&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">).</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">appendChild</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(new_node);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    &lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">script</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">body</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">html</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span></code></pre></div><p>对于上面这段代码，使用 Performance 工具来记录添加元素的过程，如下图所示：</p><img src="https://gitee.com/CwdyBic/myBlog/raw/master/assets/http/性能优化/Performance强制同步.webp" height="300px"><p><strong>所谓强制同步布局，是指 JavaScript 强制将计算样式和布局操作提前到当前的任务中。</strong> 比如：</p><div class="language-html vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">html</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">script</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    function</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> foo</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        let</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> main_div </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> document.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getElementById</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;mian_div&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        let</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> new_node </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> document.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">createElement</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;li&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        let</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> textnode </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> document.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">createTextNode</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;time.geekbang&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        new_node.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">appendChild</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(textnode);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        document.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getElementById</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;mian_div&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">).</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">appendChild</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(new_node);</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">        //由于要获取到 offsetHeight，</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">        //但是此时的 offsetHeight 还是老的数据，</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">        //所以需要立即执行布局操作</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        console.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">log</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(main_div.offsetHeight)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">script</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span></code></pre></div><p>将新的元素添加到 DOM 之后，我们又调用了<code>main_div.offsetHeight</code>来获取新<code>main_div</code>的高度信息。</p><p>如果要获取到<code>main_div</code>的高度，就需要重新布局，所以这里在获取到<code>main_div</code>的高度之前，JavaScript 还需要强制让渲染引擎默认执行一次布局操作。我们把这个操作称为强制同步布局。</p><p>下面通过 Performance 记录的任务状态：</p><img src="https://gitee.com/CwdyBic/myBlog/raw/master/assets/http/性能优化/Performance强制同步优化.webp" height="300px"><p>从上图可以看出来，计算样式和布局都是在当前脚本执行过程中触发的，这就是强制同步布局。</p><h3 id="避免布局抖动" tabindex="-1">避免布局抖动 <a class="header-anchor" href="#避免布局抖动" aria-label="Permalink to &quot;避免布局抖动&quot;">​</a></h3><p>还有一种比强制同步布局更坏的情况，那就是布局抖动。<strong>所谓布局抖动，是指在一次 JavaScript 执行过程中，多次执行强制布局和抖动操作。</strong></p><p>为了直观理解，可以看下面的代码：</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">function</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> foo</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    let</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> time_li </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> document.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getElementById</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;time_li&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    for</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">let</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> i </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">; i </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 100</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">; i</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">++</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        let</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> main_div </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> document.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getElementById</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;mian_div&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        let</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> new_node </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> document.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">createElement</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;li&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        let</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> textnode </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> document.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">createTextNode</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;time.geekbang&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        new_node.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">appendChild</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(textnode);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        new_node.offsetHeight </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> time_li.offsetHeight;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        document.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getElementById</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;mian_div&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">).</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">appendChild</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(new_node);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>在一个 for 循环语句里面不断读取属性值，每次读取属性值之前都要进行计算样式和布局。执行代码之后，使用 Performance 记录的状态如下所示：</p><img src="https://gitee.com/CwdyBic/myBlog/raw/master/assets/http/性能优化/Performance布局抖动.webp" height="300px"><p>从上图可以看出，在 foo 函数内部重复执行计算样式和布局，这会大大影响当前函数的执行效率。这种情况的避免方式和强制同步布局一样，都是尽量不要在修改 DOM 结构时再去查询一些相关值。</p><h3 id="合理利用-css-合成动画" tabindex="-1">合理利用 CSS 合成动画 <a class="header-anchor" href="#合理利用-css-合成动画" aria-label="Permalink to &quot;合理利用 CSS 合成动画&quot;">​</a></h3><p>合成动画是直接在合成线程上执行的，这和在主线程上执行的布局、绘制等操作不同，如果主线程被 JavaScript 或者一些布局任务占用，CSS 合成动画依然能继续执行。所以要尽量利用好 CSS 合成动画，如果能让 CSS 处理动画，就尽量交给 CSS 来操作。</p><p>另外，如果能提前知道对某个元素执行动画操作，那就最好将其标记为 will-change，这是告诉渲染引擎需要将该元素单独生成一个图层。</p><h3 id="避免频繁的垃圾回收" tabindex="-1">避免频繁的垃圾回收 <a class="header-anchor" href="#避免频繁的垃圾回收" aria-label="Permalink to &quot;避免频繁的垃圾回收&quot;">​</a></h3><p>我们知道 JavaScript 使用了自动垃圾回收机制，如果在一些函数中频繁创建临时对象，那么垃圾回收器也会频繁地去执行垃圾回收策略。这样当垃圾回收操作发生时，就会占用主线程，从而影响到其他任务的执行，严重的话还会让用户产生掉帧、不流畅的感觉。</p><h3 id="避免出现层爆炸" tabindex="-1">避免出现层爆炸 <a class="header-anchor" href="#避免出现层爆炸" aria-label="Permalink to &quot;避免出现层爆炸&quot;">​</a></h3><p>在说层爆炸之前先看下什么是隐式合成</p><h4 id="隐式合成" tabindex="-1">隐式合成 <a class="header-anchor" href="#隐式合成" aria-label="Permalink to &quot;隐式合成&quot;">​</a></h4><p>满足某些显性的特殊条件时，渲染层会被浏览器提升为合成层。除此之外，在浏览器的 Composite 阶段，还存在一种隐式合成，部分渲染层在一些特定场景下，会被默认提升为合成层。比如</p><p>两个 absolute 定位的 div 在屏幕上交叠了，根据 <code>z-index</code> 的关系，其中一个 div 就会”盖在“了另外一个上边。</p><img src="https://gitee.com/CwdyBic/myBlog/raw/master/assets/http/性能优化/隐式合成1.webp" height="300px"><p>这个时候，如果处于下方的 div 被加上了 CSS 属性：<code>transform: translateZ(0)</code>，就会被浏览器提升为合成层。提升后的合成层位于 Document 上方，假如没有隐式合成，原本应该处于上方的 div 就依然还是跟 Document 共用一个 GraphicsLayer，层级反而降了，就出现了元素交叠关系错乱的问题。</p><img src="https://gitee.com/CwdyBic/myBlog/raw/master/assets/http/性能优化/隐式合成2.webp" height="300px"><p>所以为了纠正错误的交叠顺序，浏览器必须让原本应该”盖在“它上边的渲染层也同时提升为合成层。</p><img src="https://gitee.com/CwdyBic/myBlog/raw/master/assets/http/性能优化/隐式合成3.webp" height="300px"><p>了解了隐式合成之后，接下来看什么是层爆炸</p><p><strong>一些产生合成层的原因太过于隐蔽了，尤其是隐式合成。很容易就产生一些不在预期范围内的合成层，当这些不符合预期的合成层达到一定量级时，就会变成 <strong>层爆炸</strong>。</strong></p><p><strong>层爆炸导致的问题：占用 GPU 和大量的内存资源，严重损耗页面性能</strong></p><h4 id="层压缩" tabindex="-1">层压缩 <a class="header-anchor" href="#层压缩" aria-label="Permalink to &quot;层压缩&quot;">​</a></h4><p>如何解决层爆炸</p><ul><li>不要盲目的提升合成层</li><li>层压缩</li></ul><p>面对层爆炸这种问题，浏览器也有相应的应对策略，<strong>如果多个渲染层同一个合成层重叠时，这些渲染层会被压缩到一个 GraphicsLayer 中</strong>，以防止由于重叠原因导致可能出现的“层爆炸”。</p><p>还是之前的模型，只不过这次不同的是，有四个 absolute 定位的 div 在屏幕内发生了交叠。此时处于最下方的 div 在加上了 CSS 属性 <code>transform: translateZ(0)</code> 后被浏览器提升为合成层，如果按照隐式合成的原理，盖在它上边的 div 会提升为一个新的合成层，第三个 div 又盖在了第二个上，自然也会被提升为合成层，第四个也同理。这样一来，岂不是就会产生四个合成层了？</p><img src="https://gitee.com/CwdyBic/myBlog/raw/master/assets/http/性能优化/层压缩1.webp" height="300px"><p>然而事实并不是这样的，浏览器的层压缩机制，会将隐式合成的多个渲染层压缩到同一个 GraphicsLayer 中进行渲染，也就是说，上方的三个 div 最终会处于同一个合成层中，这就是浏览器的层压缩。</p><img src="https://gitee.com/CwdyBic/myBlog/raw/master/assets/http/性能优化/层压缩2.webp" height="300px"><p><strong>当然了，浏览器的自动层压缩并不是万能的，有很多特定情况下，浏览器是无法进行层压缩的</strong></p><h4 id="position-fixed-引发的问题" tabindex="-1">position: fixed 引发的问题 <a class="header-anchor" href="#position-fixed-引发的问题" aria-label="Permalink to &quot;position: fixed 引发的问题&quot;">​</a></h4><p>Demo 如下，父元素设置了<code>transform</code>，子元素添加了相对窗口定位</p><div class="language-html vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">html</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">style</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    .content</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        transform</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">translateX</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">100</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">px</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        width</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">200</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">px</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        height</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">200</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">px</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        background-color</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">#f00</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    .elm</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        width</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">50</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">px</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        height</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">50</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">px</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        background-color</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">#00f</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        position</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">fixed</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        top</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        left</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">style</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">div</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> class</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;content&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    &lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">div</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> class</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;elm&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">div</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">div</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span></code></pre></div><p>即使子元素设置的是<code>fixed</code>，他还是会相对于父元素定位</p><img src="https://gitee.com/CwdyBic/myBlog/raw/master/assets/http/性能优化/fixed定位异常.webp" height="300px"><p>查看 Layers 会发现子元素没有被提升成合成层，而是和<code>document</code>、父元素处于同一层中。这里有个疑问就是子元素明明设置了<code>fixed</code>，符合提升合成层的条件，为什么没有提升成合成层？</p><p>我的理解是子元素被层压缩了。如果提升成了合成层，子元素是就会相对于窗口定位，而不是相对于父元素，就导致父元素的X轴移动可能会压在子元素上，这样会导致层级关系有问题。为了保证层级关系，所以被压缩到了<code>document</code>层中。</p><h3 id="避免使用-settimeout-执行动画" tabindex="-1">避免使用 setTimeOut 执行动画 <a class="header-anchor" href="#避免使用-settimeout-执行动画" aria-label="Permalink to &quot;避免使用 setTimeOut 执行动画&quot;">​</a></h3><h4 id="显示器显示图像的原理解释" tabindex="-1">显示器显示图像的原理解释 <a class="header-anchor" href="#显示器显示图像的原理解释" aria-label="Permalink to &quot;显示器显示图像的原理解释&quot;">​</a></h4><p>当通过渲染流水线通过GPU生成一张图片之后，会将图片存储到<strong>显卡的后缓冲区</strong>，一旦显卡把合成的图像写到后缓冲区，系统就会让后缓冲区和前缓冲区互换；此时显示器会从前缓冲区中获取最新图片。一般情况下显示器的刷新频率是 60HZ，也就是每秒更新 60 张图片。</p><p>也就是说渲染流水线需要在16.66667ms内就要生成一张图片。显卡每16.66667ms就要交换一次缓冲区；如果生成图片过久，显示器就会读取不到新的图片，并保持上一帧图片；从而给用户造成视觉上的卡顿。</p><h4 id="requestanimationframe-回调执行时机" tabindex="-1">requestAnimationFrame 回调执行时机 <a class="header-anchor" href="#requestanimationframe-回调执行时机" aria-label="Permalink to &quot;requestAnimationFrame 回调执行时机&quot;">​</a></h4><p>当显示器将一帧画面绘制完成后，并在准备读取下一帧之前，显示器会发出一个垂直同步信号给浏览器，简称 VSync。浏览器接收到 VSync 信号之后，就可以准备绘制新的一帧了。在每一帧开始执行的时候，会执行<code>requestAnimationFrame</code>回调。</p><p>如下图：</p><p>当显示器将一帧画面绘制完成后，并在准备读取下一帧之前，显示器会发出一个垂直同步信号给浏览器，简称 VSync。浏览器接收到 VSync 信号之后，就可以准备绘制新的一帧了。在每一帧开始执行的时候，会执行<code>requestAnimationFrame</code>回调。</p><p>如下图：</p><img src="https://gitee.com/CwdyBic/myBlog/raw/master/assets/http/性能优化/requestAnimationFrame.webp" height="300px"><h4 id="相较于定时器" tabindex="-1">相较于定时器 <a class="header-anchor" href="#相较于定时器" aria-label="Permalink to &quot;相较于定时器&quot;">​</a></h4><p>当通过<code>setTimeOut</code>执行动画时，其绘制时机是很难和 VSync 时钟保持一致的，从而可能会导致丢帧或者卡顿的情况出现。而<code>requestAnimationFrame</code>和<code>css</code>动画都是和 VSync 时钟保持一致的。</p><h4 id="requestidlecallback-回调执行时机" tabindex="-1">requestIdleCallback 回调执行时机 <a class="header-anchor" href="#requestidlecallback-回调执行时机" aria-label="Permalink to &quot;requestIdleCallback 回调执行时机&quot;">​</a></h4><p>接着上面的继续，对于60Hz的显示器来说，VSync 信号的发送频率是16.66667ms/次。如果渲染进程在16.66667ms内就完成整个操作，那么剩余的时间不会生成新的图片，而是可以在这段空闲时间内执行一些不那么紧急的任务，比如<strong>V8 的垃圾回收</strong>，或者执行<strong>window.requestIdleCallback()的回调任务</strong></p>`,104),l=[h];function p(e,k,E,r,d,g){return a(),i("div",null,l)}const c=s(n,[["render",p]]);export{y as __pageData,c as default};
