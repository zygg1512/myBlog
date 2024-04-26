import{_ as s,c as i,o as a,a4 as n}from"./chunks/framework.BOW58p_D.js";const E=JSON.parse('{"title":"过滤命令","description":"","frontmatter":{},"headers":[],"relativePath":"blogs/常用命令/Linux/过滤命令.md","filePath":"blogs/常用命令/Linux/过滤命令.md"}'),l={name:"blogs/常用命令/Linux/过滤命令.md"},t=n(`<h1 id="过滤命令" tabindex="-1">过滤命令 <a class="header-anchor" href="#过滤命令" aria-label="Permalink to &quot;过滤命令&quot;">​</a></h1><h2 id="管道符" tabindex="-1">管道符 <a class="header-anchor" href="#管道符" aria-label="Permalink to &quot;管道符&quot;">​</a></h2><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 将 A 命令的输出作为 B 命令的输入</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> A </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">|</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> B</span></span></code></pre></div><h2 id="grep-过滤" tabindex="-1">grep 过滤 <a class="header-anchor" href="#grep-过滤" aria-label="Permalink to &quot;grep 过滤&quot;">​</a></h2><p>grep 查找文件里符合条件的字符串，常与管道符<code>|</code>、<code>cat</code>、<code>ps</code>一起使用；主要用于</p><ul><li>查找文件中符合条件的字符串</li><li>统计文件中符合条件的字符串行数</li><li><code>grep</code> 不显示自身进程</li></ul><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">grep</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [option] 正则表达式 文件或目录</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## option</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">-c</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">	## 统计符合字符串条件的行数</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">-v</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">	## 显示不包括文本的所有信息</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">-i</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">	## 不区分大小写</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">-l</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  ## 查询多文件时只输出包含匹配字符的文件名</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">-n</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> 	## 显示匹配行及行号</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">-s</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  ## 不显示错误信息</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">-o</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  ## 只显示匹配字符串的部分</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 正则表达式</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">-x</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> 					## 同时显示匹配行的上下 x 行</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">^x</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">  				## 以 x 开头的行</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">$x    			</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 以 x 结尾的行</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&lt;</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">						## 从匹配正则表达式的行开始</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">						## 到匹配正则表达式的行结束</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[a]					</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 包含 a</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[^a]				</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 不包含 a</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[A-C]				</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 范围匹配，即A、B、C都符合要求</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[a,b]				</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 只有 a、b 符合</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">.</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">						## 单个字符</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">						## 0 个或多个</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">\\</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">						## 用来屏蔽一个元字符的特殊含义，使其作为单纯的一个字符</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[:alnum:] 	</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 字母数字集 “a-z A-Z 0-9”</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[:alpha:] 	</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 字母集合 “a-z A-Z”</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[:blank:] 	</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 空格或制表键</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[:cntrl:] 	</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 任何控制字符</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[:digit:] 	</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 数字集合 “0-9”</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[:graph:] 	</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 任何可视字符（无空格）</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[:lower:]	  </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 小写字母 “a-z”</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[:print:] 	</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 非控制字符</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[:punct:] 	</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 标点字符</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[:space:] 	</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 空格</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[:upper:] 	</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 大写字母 “A-Z”</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[:xdigit:] 	</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 十六进制数字 “0-9 a-f A-F”</span></span></code></pre></div><p>例子</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 假设 text.txt 内容如下</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">kk</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">sds</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">^sdads</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">7</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">a</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 在文本中搜素只有一个字符的行，且为字母或数字</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> grep </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;^[[:alnum:]]$&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> text.txt</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">7</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">a</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## grep、cat、管道符配合使用</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 过滤 text.txt 文件中 kk 内容</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> cat text.txt </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">|</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">grep</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> kk</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">sds</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">^sdads</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">7</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">a</span></span></code></pre></div><h2 id="nul、2-nul、-nul-2-nul-过滤输出信息" tabindex="-1">&gt;nul、2&gt;nul、&gt;nul 2&gt;nul 过滤输出信息 <a class="header-anchor" href="#nul、2-nul、-nul-2-nul-过滤输出信息" aria-label="Permalink to &quot;&gt;nul、2&gt;nul、&gt;nul 2&gt;nul 过滤输出信息&quot;">​</a></h2><ul><li><code>&gt;nul</code>：即“1&gt;nul”；屏蔽操作成功显示的信息，但是出错还是会显示</li><li><code>2&gt;nul</code>：是屏蔽操作失败显示的信息，如果成功依旧显示</li><li><code>&gt;nul 2&gt;nul</code>：全部都屏蔽，成功的还是失败的都不显示</li></ul><p>举例</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> node -v</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## v12.22.12</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> node</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">nul -v</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 空</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> asdf -v</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## zsh: command not found: asdf</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> asdf </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">2&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">nul -v</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 空</span></span></code></pre></div>`,13),p=[t];function h(k,e,d,r,g,c){return a(),i("div",null,p)}const A=s(l,[["render",h]]);export{E as __pageData,A as default};
