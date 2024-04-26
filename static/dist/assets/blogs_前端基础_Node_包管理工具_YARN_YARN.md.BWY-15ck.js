import{_ as s,c as a,o as i,a4 as n}from"./chunks/framework.BOW58p_D.js";const y=JSON.parse('{"title":"Yarn","description":"","frontmatter":{},"headers":[],"relativePath":"blogs/前端基础/Node/包管理工具/YARN/YARN.md","filePath":"blogs/前端基础/Node/包管理工具/YARN/YARN.md"}'),e={name:"blogs/前端基础/Node/包管理工具/YARN/YARN.md"},l=n(`<h1 id="yarn" tabindex="-1">Yarn <a class="header-anchor" href="#yarn" aria-label="Permalink to &quot;Yarn&quot;">​</a></h1><h2 id="概述" tabindex="-1">概述 <a class="header-anchor" href="#概述" aria-label="Permalink to &quot;概述&quot;">​</a></h2><p><code>yarn</code> 是在 <code>2016</code> 年发布的，那时 <code>npm</code> 还处于 <code>V3</code> 时期，还没有 <code>package-lock.json</code> 文件，不稳定性、安装速度慢等缺点经常会受到广大开发者吐槽。此时，<code>yarn</code> 诞生。</p><p>尽管 npm 发展至今，已经在很多方面向 yarn 看齐，但 yarn 的安装理念仍然需要我们关注。yarn 提出的安装理念很好的解决了当时 npm 的依赖管理问题，yarn有以下优点：</p><ol><li><strong>速度快</strong> 。速度快主要来自以下两个方面： <ol><li>并行安装：无论 npm 还是 Yarn 在执行包的安装时，都会执行一系列任务。npm 是按照队列执行每个 package，也就是说必须要等到当前 package 安装完成之后，才能继续后面的安装。而 Yarn 是同步执行所有任务，提高了性能。</li><li>离线模式：如果之前已经安装过一个软件包，用 Yarn 再次安装时会从缓存中获取，npm5.x 之后也有缓存但是读取速度不如 Yarn。</li></ol></li><li><strong>版本统一</strong>：为了防止拉取到不同的版本，Yarn 有一个锁定文件 (lock file) 记录了被确切安装上的模块的版本号。每次只要新增了一个模块，Yarn 就会创建（或更新）<code>yarn.lock</code>这个文件。npm5.x 之后也有了锁定文件，但是策略和Yarn略有差异，后面会说。</li><li><strong>更简洁的输出</strong>：npm 的输出信息比较冗长。在执行 npm install 的时候，命令行里会不断地打印出所有被安装上的依赖。相比之下，Yarn 简洁太多：默认情况下，结合了 emoji 直观且直接地打印出必要的信息，也提供了一些命令供开发者查询额外的安装信息。</li><li><strong>更好的语义化</strong>： Yarn 改变了一些 npm 命令的名称，比如 yarn add/remove，感觉上比 npm 原本的 install/uninstall 要更清晰。</li></ol><h2 id="yarn-lock" tabindex="-1">yarn.lock <a class="header-anchor" href="#yarn-lock" aria-label="Permalink to &quot;yarn.lock&quot;">​</a></h2><p><code>yarn.lock</code>中会准确的存储每个依赖的具体版本信息，以保证在不同机器安装可以得到相同的目录结构。</p><div class="language-yml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">yml</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY. </span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># yarn lockfile v1 </span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">expect-jsx@^5.0.0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> version &quot;5.0.0&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> </span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> resolved &quot;[http://registry.npmjs.org/expect-jsx/-/expect-jsx-5.0.0.tgz#61761b43365f285a80eb280c785e0783bbe362c7](http://registry.npmjs.org/expect-jsx/-/expect-jsx-5.0.0.tgz#61761b43365f285a80eb280c785e0783bbe362c7 &quot;http://registry.npmjs.org/expect-jsx/-/expect-jsx-5.0.0.tgz#61761b43365f285a80eb280c785e0783bbe362c7&quot;)&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> </span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> integrity sha1-YXYbQzZfKFqA6ygMeF4Hg7vjYsc=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> </span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;"> dependencies</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> collapse-white-space &quot;^1.0.0&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> </span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">react &quot;^16.0.0&quot;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> react-element-to-jsx-string &quot;^13.0.0&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> </span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">react-rater@^6.0.0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> version &quot;6.0.0&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> </span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> resolved &quot;[http://registry.npmjs.org/react-rater/-/react-rater-6.0.0.tgz#2e666b6e5e5c33b622541df6a7124f6c99606927](http://registry.npmjs.org/react-rater/-/react-rater-6.0.0.tgz#2e666b6e5e5c33b622541df6a7124f6c99606927 &quot;http://registry.npmjs.org/react-rater/-/react-rater-6.0.0.tgz#2e666b6e5e5c33b622541df6a7124f6c99606927&quot;)&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> </span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> integrity sha512-NP1+rEeL3LyJqA5xF7U2fSHpISMcVeMgbQ0u/P1WmayiHccI7Ixx5GohygmJY82g7SxdJnIun2OOB6z8WTExmg==</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> </span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;"> dependencies</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> prop-types &quot;^15.7.2&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> </span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> react &quot;^16.8.0&quot;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> react-dom &quot;^16.8.0&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> </span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">// 这里</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">react@^16.0.0, react@^16.8.0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">version &quot;16.14.0&quot;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> resolved &quot;[http://registry.npmjs.org/react/-/react-16.14.0.tgz#94d776ddd0aaa37da3eda8fc5b6b18a4c9a3114d](http://registry.npmjs.org/react/-/react-16.14.0.tgz#94d776ddd0aaa37da3eda8fc5b6b18a4c9a3114d &quot;http://registry.npmjs.org/react/-/react-16.14.0.tgz#94d776ddd0aaa37da3eda8fc5b6b18a4c9a3114d&quot;)&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> </span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> integrity sha512-0X2CImDkJGApiAlcf0ODKIneSwBPhqJawOa5wCtKbu7ZECrmS26NvtSILynQ66cgkT/RJ4LidJOc3bUESwmU8g==</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> </span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;"> dependencies</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> loose-envify &quot;^1.1.0&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> </span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> object-assign &quot;^4.1.1&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> </span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> prop-types &quot;^15.6.2&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> </span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> // 这里</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">react@^17.0.1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">version &quot;17.0.2&quot;</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> resolved &quot;[http://registry.npmjs.org/react/-/react-17.0.2.tgz#d0b5cc516d29eb3eee383f75b62864cfb6800037](http://registry.npmjs.org/react/-/react-17.0.2.tgz#d0b5cc516d29eb3eee383f75b62864cfb6800037 &quot;http://registry.npmjs.org/react/-/react-17.0.2.tgz#d0b5cc516d29eb3eee383f75b62864cfb6800037&quot;)&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> </span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> integrity sha512-gnhPt75i/dq/z3/6q/0asP78D0u592D5L1pd7M8P+dck6Fu/jJeL6iVVK23fptSUZj8Vjf++7wXA8UNclGQcbA==</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> </span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;"> dependencies</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> loose-envify &quot;^1.1.0&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> </span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> object-assign &quot;^4.1.1&quot;</span></span></code></pre></div><p>从上面依赖版本描述的信息中，可以确定以下几点：</p><ol><li>所有依赖，不管是项目声明的依赖，还是依赖的依赖，都是 <strong>扁平化管理</strong>。</li><li>如果安装的依赖有多个版本，将同名依赖基于版本限制规则（<code>^</code>、<code>~</code>）划分版本区间，将相同区间的同名依赖归为一类，并安装最终版本。如： <ol><li><code>react@^16.0.0, react@^16.8.0</code>会被归为一类，并基于<code>^</code>规则安装<code>16.14.0</code>。</li><li><code>react@^17.0.1</code>作为单独一类，基于<code>^</code>规则安装<code>17.0.2</code>。</li></ol></li><li>每个依赖确定的版本中，是由以下几项构成： <ol><li>第一行是 name 和语义化版本号，这些都来自<code>package.json</code>中的定义。</li><li><code>version</code>字段，记录的是一个确切的版本。</li><li><code>resolved</code>字段记录的是包的 URL 地址。</li><li><code>integrity</code>：hash 值，用于检验包的完整性和时效性。</li><li><code>dependencies</code>字段记录的是当前包的依赖，即当前包在<code>package.json</code>的<code>dependencies</code>字段中的所有依赖</li></ol></li></ol><p><code>Yarn</code> 在安装期间，只会使用当前项目的<code>yarn.lock</code>文件（即 顶级<code>yarn.lock</code>文件），会忽略任何依赖里面的<code>yarn.lock</code>文件。在顶级<code>yarn.lock</code>中包含需要锁定的整个依赖树里全部包版本的所有信息。</p><h2 id="yarn-安装依赖流程" tabindex="-1">Yarn 安装依赖流程 <a class="header-anchor" href="#yarn-安装依赖流程" aria-label="Permalink to &quot;Yarn 安装依赖流程&quot;">​</a></h2><p><strong>1、检查（checking）</strong> 主要是检查项目中是否存在一些 npm 相关的配置文件。</p><p>如 package-lock.json 等。如果存在，可能会警告提示，因为它们可能会存在冲突。在这一阶段，也会检查系统 OS、CPU 等信息。</p><p><strong>2、解析包（resolving packages）</strong> 这一步主要是解析依赖树，确定版本信息等。</p><p>首先获取项目<code>package.json</code>中声明的首层依赖，包括 dependencies, devDependencies, optionalDependencies 声明的依赖。</p><p>接着采用遍历首层依赖的方式获取依赖包的版本信息，以及递归查找每个依赖下嵌套依赖的版本信息，并将解析过和正在解析的包用一个 Set 数据结构来存储，这样就能保证同一个版本范围内的包不会被重复解析。</p><ul><li>对于没有解析过的包，首次尝试从<code>yarn.lock</code>中获取到版本信息，并标记为已解析。</li><li>如果在<code>yarn.lock</code>中没有找到包，则向远程发起请求获取满足版本范围的已知最高版本的包信息，获取后将当前包标记为已解析。</li></ul><p>总之，在经过复杂的解析算法后，我们就确定了所有依赖的具体版本信息以及下载地址。</p><p><strong>3、获取包（fetching packages）</strong> 这一步主要是利用系统缓存，到缓存中找到具体的包资源。首先会尝试在缓存中查找依赖包，如果没有命中缓存，则将依赖包下载到缓存中。对于没有命中缓存的包，Yarn 会维护一个 fetch 队列，按照规则进行网络请求。这里也是 yarn 诞生之初解决 npm v3 安装缓慢问题的优化点，支持并行下载。</p><p><strong>4、链接包（linking dependencies）</strong> 这一步主要是将缓存中的依赖，复制到项目目录下，同时遵循扁平化原则。前面说到，Yarn 优先将依赖安装到项目目录，因此需要将全局缓存中的依赖复制到项目。在复制依赖前，Yarn 会先解析 peerDependencies，如果找不到符合 peerDependencies 声明的依赖版本，则进行 warning 提示（这并不会影响命令执行），并最终拷贝依赖到项目中。</p><p><strong>5、构建包（building fresh package）</strong> 如果依赖包中存在二进制包需要进行编译，会在这一步进行。</p><p>简单点说就是</p><ol><li>将依赖包的版本区间解析为某个具体的版本号</li><li>下载对应版本依赖的 tar 包到本地离线镜像</li><li>将依赖从离线镜像解压到本地缓存</li><li>将依赖从缓存拷贝到当前目录的 node_modules 目录</li></ol><p>首次执行<code>yarn install</code>安装，会按照<code>package.json</code>中的版本号，去向远程查询，并获取到符合版本规则的最新的依赖包进行下载，并构建依赖关系树。比如在<code>package.json</code>中指定 vue 的版本为<code>^2.0.0</code>，就会获取符合<code>2.x.x</code>的最高版本的包。然后自动生成<code>yarn.lock</code>文件，并生成缓存。</p><p>之后再执行<code>yarn install</code>，会对比<code>package.json</code>中依赖版本范围和<code>yarn.lock</code>中版本号是否匹配。</p><ol><li>版本号匹配，会根据<code>yarn.lock</code>中的<code>resolved</code>字段去查看缓存。如果有缓存，直接复制；没有缓存则按照<code>resolved</code>字段的 url 去下载包。</li><li>版本号不匹配，根据<code>package.json</code>中的版本范围去远程查询，下载符合版本规则最新的包，并更新至<code>yarn.lock</code>中。</li></ol><h3 id="如何判断有没有命中缓存" tabindex="-1">如何判断有没有命中缓存？ <a class="header-anchor" href="#如何判断有没有命中缓存" aria-label="Permalink to &quot;如何判断有没有命中缓存？&quot;">​</a></h3><p>判断系统中是否存在符合 &quot;<strong>cachefolder+slug+node_modules+pkg.name</strong>&quot; 规则的路径，如果存在则判断为命中缓存，否则就会重新下载。值得注意的是，不同版本的包在缓存中是扁平化管理。可以通过<code>yarn cache dir</code>查看。</p><h2 id="npm-和-yarn" tabindex="-1">npm 和 Yarn <a class="header-anchor" href="#npm-和-yarn" aria-label="Permalink to &quot;npm 和 Yarn&quot;">​</a></h2><p><strong>相同点：</strong></p><ol><li><code>package.json</code>作为项目依赖描述文件。</li><li><code>node_modules</code>作为依赖存储目录，Yarn v2 不再是这样。</li><li><code>lockfile</code>锁定版本依赖，在 Yarn 中叫<code>yarn.lock</code>，在 npm 中叫<code>package-lock.json</code>，在 npm v7 也支持了<code>yarn.lock</code>。它确保在不同机器或不同环境中，能够得到稳定的<code>node_modules</code>目录结构。</li></ol><p><strong>差异：</strong></p><ol><li>依赖管理策略。 <ul><li>生成<code>package-lock.json</code>后，如果手动修改<code>package.json</code>中的版本，重新执行<code>npm install</code>会根据第一章说的那种策略去修改。</li><li>而 Yarn 在执行前是先对比了一遍<code>package.json</code>和<code>yarn.lock</code>中的版本，如果版本范围完全不符的话会重新安装并更新<code>yarn.lock</code></li></ul></li><li><code>package-lock.json</code>自带版本锁定+依赖结构，你想改动一些依赖，可能影响的范围要比表面看起来的复杂的多；而<code>yarn.lock</code>自带版本锁定，并没有确定的依赖结构，使用 Yarn 管理项目依赖，需要<code>package.json + yarn.lock</code>共同确定依赖的结构。</li><li>目前 npm v7 优化了缓存和下载网络策略，性能的差异在缩小。</li></ol><h2 id="yarn-常用命令" tabindex="-1">yarn 常用命令 <a class="header-anchor" href="#yarn-常用命令" aria-label="Permalink to &quot;yarn 常用命令&quot;">​</a></h2><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## npm install</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">yarn</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 重新拉取所有包，即使之前已经安装的（所以以后别在删除node-modules了...） </span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">yarn</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> install</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --force</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 为 node_modules 目录指定另一位置，代替默认的 ./node_modules </span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">yarn</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> install</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --modules-folder</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> &lt;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">pat</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">h</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 不读取或生成 yarn.lock 文件</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">yarn</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> install</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --no-lockfile</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 只安装 dependence下的包，不安装 devDependencies 的包</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">yarn</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> install</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --production[</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">true</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">|</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">false]</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> /</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --production</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> /</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --prod</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 会安装 latest 最新版本</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">yarn</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> add</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> package-name</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 安装包到dependencies中 </span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">yarn</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> add</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> &lt;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">package..</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 用 --dev 或 -D 安装包到 devDependencies</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">yarn</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> add</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> &lt;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">package..</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [--dev/-D]</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 用 --peer 或者 -P 安装包到 peerDependencies</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">yarn</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> add</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> &lt;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">package..</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [--peer/-P]</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 用 --optional 或者 -O 安装包到 optionalDependencies</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">yarn</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> add</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> &lt;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">package..</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [--optional/-O]</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 用 --exact 或者 -E 会安装包的精确版本</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">yarn</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> add</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> &lt;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">package..</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [--exact/-E]</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 删除指定包</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">yarn</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> remove</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> package-name</span></span></code></pre></div><h2 id="yarn缺点" tabindex="-1">yarn缺点 <a class="header-anchor" href="#yarn缺点" aria-label="Permalink to &quot;yarn缺点&quot;">​</a></h2><p>和 npm 一样存在如下问题：</p><ul><li>扁平化算法本身的<strong>复杂性</strong>很高，耗时较长</li><li>项目中仍然可以<strong>非法访问</strong>没有声明过依赖的包</li></ul><h2 id="关于-yarn-的-pnp" tabindex="-1">关于 yarn 的 PnP <a class="header-anchor" href="#关于-yarn-的-pnp" aria-label="Permalink to &quot;关于 yarn 的 PnP&quot;">​</a></h2><blockquote><p>Yarn 1.12+ 版本</p></blockquote><h3 id="yarn-现状与痛点" tabindex="-1">Yarn 现状与痛点 <a class="header-anchor" href="#yarn-现状与痛点" aria-label="Permalink to &quot;Yarn 现状与痛点&quot;">​</a></h3><p>Yarn 团队开发 PnP 特性最直接的原因就是现有的依赖管理方式效率太低。引用依赖时慢，安装依赖时也慢。</p><p>先说说 Node 在处理依赖引用时的逻辑，这个流程会有如下两种情况：</p><ul><li>如果我们传给<code>require()</code>调用的参数是一个<a href="https://nodejs.org/api/modules.html#modules_core_modules" target="_blank" rel="noreferrer">核心模块</a>（例如 “fs”、”path”等）或者是一个本地相对路径（例如<code>./module-a.js</code>或<code>/my-li/module-b.js</code>），那么 Node 会直接使用对应的文件。</li><li>如果不是前面描述的情况，那么 Node 会开始寻找<code>node_modules</code>目录： <ol><li>首先 Node 会在当前目录寻找<code>node_modules</code>，如果没有则到父目录查找，以此类推直到系统根目录。</li><li>找到<code>node_modules</code>目录之后，再在该目录中寻找名为<code>moduleName.js</code>的文件或是名为<code>moduleName</code>的子目录。</li></ol></li></ul><p>可见 Node 在解析依赖时需要进行大量的文件 I/O 操作，效率并不高。</p><p>再来看看安装依赖时发生了什么，现阶段<code>yarn install</code>操作会执行以下 4 个步骤：</p><ol><li>将依赖包的版本区间解析为某个具体的版本号</li><li>下载对应版本依赖的 tar 包到本地离线镜像</li><li>将依赖从离线镜像解压到本地缓存</li><li>将依赖从缓存拷贝到当前目录的<code>node_modules</code>目录</li></ol><p>其中第 4 步同样涉及大量的文件 I/O，导致安装依赖时效率不高（尤其是在 CI 环境，每次都需要安装全部依赖）。</p><h3 id="实现方案" tabindex="-1">实现方案 <a class="header-anchor" href="#实现方案" aria-label="Permalink to &quot;实现方案&quot;">​</a></h3><p>PnP 的具体工作原理是，作为把依赖从缓存拷贝到<code>node_modules</code>的替代方案，Yarn 会维护一张静态映射表，该表中包含了以下信息：</p><ul><li>当前依赖树中包含了哪些依赖包的哪些版本</li><li>这些依赖包是如何互相关联的</li><li>这些依赖包在文件系统中的具体位置</li></ul><p>这个映射表在 Yarn 的 PnP 实现中对应项目目录中的<code>.pnp.js</code>文件。</p><p>这个<code>.pnp.js</code>文件是如何生成，Yarn 又是如何利用它的呢？</p><p>在安装依赖时，在第 3 步完成之后，Yarn 并不会拷贝依赖到<code>node_modules</code>目录，而是会在<code>.pnp.js</code>中记录下该依赖在缓存中的具体位置。这样就避免了大量的 I/O 操作同时项目目录也不会有<code>node_modules</code>目录生成。</p><p>同时<code>.pnp.js</code>还包含了一个特殊的 resolver，Yarn 会利用这个特殊的 resolver 来处理<code>require()</code>请求，该 resolver 会根据<code>.pnp.js</code>文件中包含的静态映射表直接确定依赖在文件系统中的具体位置，从而避免了现有实现在处理依赖引用时的 I/O 操作。</p><h3 id="带来了哪些好处" tabindex="-1">带来了哪些好处 <a class="header-anchor" href="#带来了哪些好处" aria-label="Permalink to &quot;带来了哪些好处&quot;">​</a></h3><p>从 PnP 的实现方案可以看出，同一个系统上不同项目引用的相同依赖的相同版本实际都是指向的缓存中的同一个目录。这带来了几个最直观的好处：</p><ul><li>安装依赖的速度得到了空前的提升</li><li>CI 环境中多个 CI 实例可以共享同一份缓存</li><li>同一个系统中的多个项目不再需要占用多份磁盘空间</li></ul><h3 id="使用-pnp" tabindex="-1">使用 PnP <a class="header-anchor" href="#使用-pnp" aria-label="Permalink to &quot;使用 PnP&quot;">​</a></h3><p>只需在项目中执行下面命令即可开启 PnP 特性</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">yarn</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --pnp</span></span></code></pre></div><h3 id="pkg-installconfig字段" tabindex="-1"><code>pkg.installConfig</code>字段 <a class="header-anchor" href="#pkg-installconfig字段" aria-label="Permalink to &quot;\`pkg.installConfig\`字段&quot;">​</a></h3><p>在项目中开启 PnP 特性后，Yarn 会在<code>package.json</code>文件中创建一个<code>installConfig</code>字段：</p><div class="language-javascript vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  &quot;installConfig&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: {</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">    &quot;pnp&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">true</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>只要<code>installConfig.pnp</code>的值是一个真值且当前版本的 Yarn 支持，PnP 特性就会被启用。</p><h4 id="执行npm-script或是运行-js文件" tabindex="-1">执行<code>npm script</code>或是运行<code>.js</code>文件 <a class="header-anchor" href="#执行npm-script或是运行-js文件" aria-label="Permalink to &quot;执行\`npm script\`或是运行\`.js\`文件&quot;">​</a></h4><p>由于在开启了 PnP 的项目中不再有<code>node_modules</code>目录，所有的依赖引用都必须由<code>.pnp.js</code>中的 resolver 处理。因此不论是执行 scripts命令 还是用<code>node</code>直接执行一个 JS 文件，都必须经由 Yarn 处理。必须通过<code>yarn run</code>或是<code>yarn node</code>执行。</p><h4 id="在项目中调试依赖" tabindex="-1">在项目中调试依赖 <a class="header-anchor" href="#在项目中调试依赖" aria-label="Permalink to &quot;在项目中调试依赖&quot;">​</a></h4><p>在开发过程中有时会直接修改<code>node_modules</code>目录下的依赖来调试。但在 PnP 模式下，由于依赖都指向了全局缓存，我们不再可以直接修改这些依赖。</p><p>针对这种场景，Yarn 提供了<code>yarn unplug packageName</code>来将某个指定依赖拷贝到项目中的<code>.pnp/unplugged</code>目录下。之后<code>.pnp.js</code>中的 resolver 就会自动加载这个 unplug 的版本。</p><p>调试完毕后，再执行<code>yarn unplug --clear packageName</code>可移除本地<code>.pnp/unplugged</code>中的对应依赖。</p>`,72),p=[l];function t(o,h,d,r,k,c){return i(),a("div",null,p)}const E=s(e,[["render",t]]);export{y as __pageData,E as default};
