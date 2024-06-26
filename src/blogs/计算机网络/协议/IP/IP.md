# IP协议
## 概述
IP 协议是 TCP/IP 协议族中最为核心的协议，更确切的说是网络层重要的协议之一。

IP 协议把上层数据报封装成 IP 数据报后进行传输，如果 IP 数据报太大，还要对数据报进行分片后再传输，到了目的地址处再进行组装还原，以适应不同物理网络对一次所能传输数据大小的要求。

IP协议具有以下几个显著的特点：
- 最佳传输努力：不能保证 IP 数据报能成功地到达目的地。任何要求的可靠性必须由上层协议来提供（如TCP协议）。
  - IP 协议仅提供最好的传输服务，如果发生某种错误时，如某个路由器暂时用完了缓冲区，IP 有一个简单的错误处理算法：丢弃该数据报，然后发送 ICMP 消息报给发送端。
- 无连接性：IP协议是一种无连接的协议，每个IP数据包（数据报）都是独立的，没有建立和维护连接的过程。每个数据包都独立地进行路由选择和传输，可以按照不同的路径到达目的地。
  - 例如，如果发送端向相同的接受端发送两个连续的数据报（先是 A，然后是 B），每个数据报都是独立地进行路由选择，可能选择不同的路线，因此 B 可能在 A 之前先到达。
- 无状态性：IP协议不维护数据包的状态信息，每个数据包的处理是相互独立的。这意味着IP协议不会记住之前的数据包信息，也不会对后续数据包进行状态跟踪。每个数据包都被视为独立的实体。
- 分组交换：IP协议将数据分割成较小的数据包进行传输，每个数据包都包含了目标地址和源地址等信息。这样可以提高网络的效率和可靠性，同时允许多个数据包并行传输。
### 网络层（IP）与数据链路层（MAC）的区别
IP 在网络层，网络层的主要作用是：实现主机与主机之间的通信，也叫点对点（end to end）通信。

<img src="https://github.com/zygg1512/myBlog/raw/master/images/计算机网络/网络层通信流程.png" height="300px" />

而数据链路层的作用则是实现「直连」的两个设备之间通信，而 IP 则负责在「没有直连」的两个网络之间进行通信传输。

也就说在数据包传输中，源IP地址和目标IP地址在传输过程中是不会变化的，只有源 MAC 地址和目标 MAC 一直在变化。

比如主机1向主机2通信，数据包流程可能如下：
1. 主机1 -> MAC地址为`a`的路由器1
2. 路由器1 -> MAC地址为`b`的路由器2
3. 路由器2 -> 主机2

## IPv4 数据报的报头格式

<img src="https://github.com/zygg1512/myBlog/raw/master/images/计算机网络/IP报文头.webp" height="300px" />

图中，“数据”以上部分就是 IP 报头的内容。因为有了选项部分，所以 IP 报头长度是不定的。如果选项部分没有，则 IP 报头的长度为 160bit（20字节），这也是 IP 报头的最小长度。

### IP 报头中各个部分的含义
#### 版本（Version）
占用 4 bit，标识目前采用的IP协议的版本号，一般取值为 0100（IPv4）和 0110（IPv6）。
#### 首部长度（Header Length）
即 IP 报头长度，这个字段的作用是为了描述 IP 报头的长度。该字段占用 4 bit，由于在 IP 报头中有可变的可选部分，所以为了能多表示一些长度采用 4 字节（32 bit）。

#### 服务类型（Type of Service，TOS）
占用 8 bit，可用 PPP、D、T、R、C、0 这 8 个字符来表示。
- PPP：定义了数据报的优先级，取值越大表示数据越重要，取值如下表所示：

PPP 取值 | 含 义                        |
| ------ | -------------------------- |
| 000    | 普通（Routine）                |
| 001    | 优先（Priority）               |
| 010    | 立即（Immediate）              |
| 011    | 闪速（Flash）                  |
| 100    | 疾速（Flash Override）         |
| 101    | 关键（Critic）                 |
| 110    | 网间控制（Internetwork Control） |
| 111    | 网络控制（Network Control）|

- D：时延，0 表示普通，1表示延迟尽量小
- T：吞吐量，0 表示普通，1表示流量尽量大
- R：可靠性，0 表示普通，1表示可靠性尽量大
- C：传输成本，0 表示普通，1表示成本尽量小
- 0：这是最后一位，被保留，恒定为 0
#### 总长度
占用 16 bit，该字段表示**以字节为单位**的 IP 数据报的总长度（包括 IP 报头部分和 IP 数据部分）。

如果该字段全为 1，就是最大长度了，即 216-1= 65535字节≈63.9990234375KB，有些教程上写最大是 64KB，其实是达不到的，最大长度只能是 65535 字节，而不是 65536 字节。

#### 标识
该字段占用 16 bit。在协议栈中保持着一个计数器，每产生一个数据报，计数器就加 1，并将此值赋给标识字段。

注意这个“标识符”并不是序号，IP 是无连接服务，数据报不存在按序接收的问题。当 IP 数据报由于长度超过网络的 MTU（Maximum Transmission Unit，最大传输单元）而必须分片（把一个大的网络数据报拆分成一个个小的数据报）时，这个标识字段的值就被复制到所有的小分片的标识字段中。相同的标识字段的值使得分片后的各数据报片最后能正确地重装成为原来的大数据报。

#### 标志（Flags）
该字段占用 3 bit，总共有3位
- Reserved（保留位）：不使用，Reserved 位是IP报文头中的第一位，保留位必须设置为 0
- 第二位称 DF（Don't Fragment）位：
  - 设为 1 时表明路由器不对数据报分片。如果一个数据报无法在不分段的情况下进行转发，则路由器会丢弃数据报并发送一个ICMP错误消息给发送方。
- 最低位称 MF（More Fragments）位：
  - 为 1 时说明这个 IP 数据报是分片的，并且后续还有数据报
  - 为 0 时说明这个 IP 数据报是分片的，但已经是最后一个分片了

这些标志位用于在IP数据报的传输过程中进行分片和重组操作，以适应不同网络链路的MTU限制。通过设置DF位和MF位，发送方和中间路由器可以控制IP数据报的分片行为，以确保数据的正确传输和重组。
#### 片偏移
该字段占 13 bit。该字段的含义是某个分片在原 IP 数据报中的相对位置。第一个分片的偏移量为 0。片偏移以 8 个字节为偏移单位。这样，每个分片的长度一定是 8 字节（64 位）的整数倍。
#### 生存时间（TTL，Time to Live，也称存活时间）
该字段占 8 bit。表示数据报到达目标地址之前的路由跳数。

TTL 是由发送端设置的一个计数器，每经过一个路由节点就减 1，减到为 0 时，路由就丢弃该数据报，向发送端发送 ICMP 差错报文。这个字段的主要作用是防止数据报不断在 IP 互联网络上循环转发。

#### 协议
该字段占 8 bit。该字段用来标识数据部分所使用的协议，比如：
- 取值1表示 ICMP
- 取值 2 表示 IGMP
- 取值 6 表示 TCP
- 取值 17 表示 UDP
- 取值 88 表示 IGRP
- 取值 89 表示 OSPF
#### 首部校验和（Header Checksum）
该字段占 16 bit。该字段用于检测 IP 头部的正确性，但不包含数据部分。

计算首部校验和的过程是将IP报文头部进行二进制求和，然后将结果取反得到校验和值。在接收端，当收到一个IP报文时，接收端会重新计算首部校验和，并将计算得到的校验和与报文中的校验和进行比较。如果两者不一致，说明IP报文在传输过程中发生了错误或损坏，接收端会丢弃该报文。

由于每个路由器会改变 TTL 的值，所以路由器会为每个通过的数据报重新计算首部校验和。

首部校验和的目的是为了提高IP报文的可靠性，尽早发现传输过程中的错误。然而，首部校验和只能检测到一部分错误，不能保证完全的数据完整性和正确性。因此，在更高层次的协议（如TCP）中，通常还会有更强大的校验和机制来提供更可靠的数据传输。
#### 起源和目标地址
这两个地址都占用 32 bit。用于标识这个 IP 数据报的起源和目标 IP 地址。值得注意的是，除非使用 NAT（网络地址转换），否则整个传输的过程中，这两个地址不会改变。
#### 选项（可选）
最大长度是 40 bit。这是一个可变长的字段。该字段属于可选项，主要是给一些特殊的情况使用。
#### 填充（Padding）
由于 IP 报头长度这个字段的单位为 32 bit，所以 IP 报头的长度必须为 32bit 的整数倍。因此，在可选项后面，IP 协议会填充若干个 0，以达到 32bit 的整数倍。

## IP数据报分片
IP 协议在传输数据报时，将数据报分为若干分片（小数据报）后进行传输，并在目的系统中进行重组，这一过程称为分片（Fragmentation）。

IP 协议在传输数据报时，若IP数据报加上数据帧头部后长度大于 MTU，则将数据报切分成若干分片后再进行传输，并在目标系统中进行重组。IP 分片既可能在发送方进行，也可能发生在中间的路由器处，因为不同网络的 MTU 是不一样的，而传输的整个过程可能会经过不同的物理网络。如果传输路径上的某个网络的 MTU 比源端网络的 MTU 要小，路由器就可能对 IP 数据报再次进行分片。分片数据的重组只会发生在接收方的 IP 层。

IP 层的切片过程如下：

<img src="https://github.com/zygg1512/myBlog/raw/master/images/计算机网络/IP分包.webp"  height="600px"/>

- 如果消息过长，IP层会按 MTU 长度把消息分成 N 个切片，每个切片带有自身在包里的位置（offset）和同样的IP头信息。
- 各个切片在网络中进行传输。每个数据包切片可以在不同的路由中流转，然后在最后的终点汇合后再组装。
- 在接收端收到第一个切片包时会申请一块新内存，创建IP包的数据结构，等待其他切片分包数据到位。
- 等消息全部到位后就把整个消息包给到上层（传输层）进行处理。

## IP 地址
>局域网通信规则：在同一个局域网中，所有的 IP 必须在同一个网段中才可以互相通信

IP地址是一个唯一的数字标识，用于定位设备。通过IP地址，数据可以从源设备发送到目标设备，实现端到端的通信。

IP地址分为网络地址（网络号）和主机地址（主机号）两部分。网络地址用于标识设备所在的网络，而主机地址用于标识设备在网络中的具体位置。

网络号相同的 IP 地址，为同一网段，如果两台计算机处于同一个网段上，则这两台计算机就可以直接进行通信交流。通过子网掩码，可以确定 IP 地址中的网络地址和主机地址的范围。

### IPv4 和 IPv6
IPv4 和 IPv6 是不同类型的 IP 地址。它们的主要用途相同，用于标记不同的设备，并让设备间能通过 IP 进行通信。主要区别在于 IPv6 是最新一代的 IP 地址。
#### IPv4
通常，IPv4 地址以点分十进制表示。共32位，每8位为一组，共4组

也就是说，IPv4 地址组合的数量是有限的。总体而言，可以算出`256^4`个唯一地址。随着时间推移，IPv4 地址越来越少，直至2011年，全球互联网编号分配机构（IANA）分发了IPv4地址空间的最后一块。2015年，IANA正式宣布美国已用完IPv4地址。

当前IPv4地址仍然承载着最多（超过90％）的互联网流量。到目前为止，即使存在IPv4地址耗尽的问题，也有一些方法可以继续使用IPv4地址。比如，通过使用NAT设备，可以将多个私有IPv4地址映射到一个或多个公共IPv4地址上，实现多个设备共享一个公共IPv4地址的访问互联网。
- 家用路由器：家庭网络中常见的路由器通常具有NAT功能。它们将家庭网络中的多个设备连接到一个公共IPv4地址上，并通过NAT将内部设备的IP地址转换为公共IP地址，实现与互联网的通信。

#### IPv6
IPv6 地址并不是一种全新的技术。它是Internet协议的最新版本，但它是在1998年开发的，旨在替换IPv4地址。

IPv6 地址的长度为 128 位，由八个 16 位字段组成，相邻字段用冒号分隔。IPv6 地址中的每个字段都必须包含一个十六进制数字
```bash
2001:0db8:3c4d:0015:0000:0000:1a2f:1a2b
```
在下图中，x 表示十六进制数字。

<img src="https://github.com/zygg1512/myBlog/raw/master/images/计算机网络/IPv6组成.gif" height="200px" />

- 站点前缀：最左侧的三组（通常是 48 位）。用于标识设备所在的网络。它指示了地址的范围和网络的标识。
- 子网 ID：中间的一组（通常是 16位）。用于标识特定子网。它用于在特定网络中划分子网，并为每个子网分配唯一的标识符。
- 接口 ID：最后四组（通常是 64 位）。用于标识设备的接口。它用于在特定子网中唯一标识设备的接口。接口ID的长度通常为64位，可以基于设备的MAC地址生成，也可以使用其他方法生成。

需要注意的是，这些位数是常见的配置，但在实际使用中，根据网络的需求和配置，这些位数可以有所不同。例如，站点前缀的长度可以更长或更短，子网ID的长度可以根据子网规模进行调整，接口ID的长度也可以根据设备的需求进行调整。
>为了方便理解，通常会将IPv6地址分为网络地址和主机地址：站点前缀和子网ID通常被视为网络地址，而接口ID被视为主机地址。

IPv6地址简写：`2001:cdba:0000:0000:0000:0000:3257:9652`
- 省略前导零，上述地址可以简写成：`2001:cdba:0:0:0:0:3257:9652`（4个0简写成1个0）
- 通过使用双冒号（`::`）代替一系列零来指定Ipv6地址，上述地址可以表示为：`2001:cdba::3257:9652`（`:0:0:0:0:`简写成`::`,即省略所有的0）
  - 需要注意一个IP地址中只可使用一次双冒号

### IP 地址 和 MAC 地址的区别
MAC 地址是指网络设备的硬件地址，是由网络设备的制造商烧录在设备的网卡中的一个全球唯一的地址。类比现实生活的话，IP 地址更像是精确到门牌号的地址信息，而 MAC 地址则是拥有唯一身份证号的“人”。

| 区别   | IP地址      | MAC地址           |
| ---- | --------- | --------------- |
| 地址类型 | 逻辑地址      | 物理地址            |
| 分配方式 | 由运营商分配    | 由设备制造商烧录到设备的网卡中 |
| 作用范围 | 全球互联网上的通信 | 局域网内通信          |
| 主要功能 | 标识设备和选择路由 | 唯一标识设备          |

### 子网掩码
子网掩码是用于划分网络地址和主机地址的一种标识符，它的作用是帮助确定一个IP地址中哪部分是网络地址，哪部分是主机地址。以及判断网络间的可达性。
#### 子网掩码组成
子网掩码，由 32 位的二进制组成，例如：

`11111111.11111111.11111111.00000000`即表示为：`255.255.255.0`

子网掩码中的网络部分全为1，主机部分全为0
#### 子网掩码表示方法
- `.`**点分十进制表示法**
```bash
## 二进制转换十进制，每 8 位用点号隔开，例如：
子网掩码二进制 11111111.11111111.11111111.00000000
表示为 255.255.255.0
```

- **CIDR斜线记法**
```bash
## IP地址/n
## 例1：
192.168.1.100/24
其子网掩码表示为 255.255.255.0
二进制表示为 11111111.11111111.11111111.00000000
## 例2：
172.16.198.12/20
其子网掩码表示为 255.255.240.0
二进制表示为 11111111.11111111.11110000.00000000
```
不难发现，例1中共有24个１，例2中共有20个１，所以 n 表示的是子网掩码中有前 n 位是 1

再看几个例子
```bash
## 网络部分是 24 位，主机部分是 8 位
## 相当于子网掩码是：11111111.11111111.11111111.00000000 即：255.255.255.0
129.168.1.1 /24
## 网络部分是 27 位，主机部分是 5 位
## 相当于子网掩码是：11111111.11111111.11111111.11100000 即：255.255.255.224
172.16.10.33/27
```

### 如何判断两个 IP 是否处于同一网段
将两个计算机的 IP 地址和子网掩码都转化为二进制，分别进行 AND 运算，计算出两个 IP 地址的网络号

如果网络号相同，则说明两台计算机处在同一个网段，可以直接通信。也就是说子网掩码通过 AND 运算可以将 IP 地址中的主机部分置为0，从而得到网络号。
#### 例子1
-  IP1：192.168.1.1，子网掩码：255.255.255.0
-  IP2：192.168.1.0，子网掩码：255.255.255.0
```bash
## IP1 & 子网掩码
11000000 10101000 00000001 00000001
11111111 11111111 11111111 00000000
## => 
11000000 10101000 00000001 00000000
## => IP1的网络号就是：192.168.1.0

## IP2 & 子网掩码
11000000 10101000 00000010 00000001
11111111 11111111 11111111 00000000
## => 
11000000 10101000 00000010 00000000
## => IP2的网络号就是：192.168.2.0
```
很明显，二者的结果是不一样的，一个是网段192.168.1.0，一个是网段192.168.2.0，所以不是一个网段。
#### 例子2
- ip地址1：192.168.1.1 子网掩码：255.255.252.0
- ip地址2：192.168.2.1 子网掩码：255.255.252.0
```bash
## IP1 & 子网掩码
11000000 10101000 00000001 00000001
11111111 11111111 11111100 00000000
## => 
11000000 10101000 00000000 00000000
## => 转换成网络号就是：192.168.0.0

## IP2 & 子网掩码
11000000 10101000 00000010 00000001
11111111 11111111 11111100 00000000
## => 
11000000 10101000 00000000 00000000
## => 转换成网络号就是：192.168.0.0
```
很明显，二者的结果是一样的，都是属于192.168.0.0网段，所以他们是同属于一个网段

### 网关
通过子网掩码判断出两台计算机处于不同的网络字段，两台计算机就不能直接进行通信，为了能进行通信，这个时候网关就出现了，可以将不同网络频段的两台计算机联系在一起，从而进行通信

打个比方：在古代我们从一个地方到另一个地方，需要经过一个城门口，比如说从东北进入内地需要经过山海关。这个城门口叫做“关口“。那么同样道理而言，从一个网络通道进入另一个网络通道是，也必须要经历这样的一个“关口”，在这里我们称之为网关。即从一个网络连接进入另一个网络的“入口“。

再打个比方：你和一个美国人进行交流，而你不懂英语，美国人也不懂汉语，那怎么办？你们互相说话的话，都是无法交流的。

这时，我们可以借助于一个翻译机，可以将对方所说的话翻译成我所能听得懂的语言。这样就可以了，网关的作用也是这样的，两个不同网络频段的计算机，经过网关（网关需要靠路由器来实现协议作用）可以进行无障碍的交流通信
### 网关的作用
比如现有 网络a 和 网络b 两个网络，而如果两个网络之间要是没有路由器的话，网络a 和 网络b 之间是不能进行TCP/IP通信。根据子网掩码我们判断出 网络a 和 网络b 是处于不同的网络，因此要使两个网络可以互相连通，则必须通过网关