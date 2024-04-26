## 概述
Shell 是一个命令行解释器，她接收应用程序/用户命令，然后调用操作系统内核

<img height="300px" src="https://gitee.com/CwdyBic/myBlog/raw/master/assets/linux/shell原理.png" />

## 脚本基础
脚本以`#!/bin/bash`开头（指定解析器）
```bash
#!/bin/bash
echo "Hello World"
```
### 如何执行脚本
```bash
# 一、命令 + 脚本路径
> bash [相对路径 | 绝对路径]
> sh [相对路径 | 绝对路径]

# 举例
> bash hello-world.sh
```
```bash

# 二、采用输入脚本的绝对路径或者相对路径执行脚本
> [相对路径 | 绝对路径]脚本名称

# 必须具有可执行权限 +x
> chmod 777 脚本名称
```
第一种执行方法，本质是 bash 解析器帮忙执行脚本，所以脚本本身不需要执行权限

第二种执行方法，本质是脚本需要自己执行，所以需要执行权限

## Shell 变量

- 定义变量时，变量名不能加美元符号
   - 命名只能使用英文字母、数字和下划线，首个自负不能以数字开头
   - 中间不能有空格，可以使用下划线(_)
   - 不能使用标点符号
   - 不能使用 bash 里的关键字（可用 help 命令查看保留关键字）
- 变量类型
   - 局部变量
      - 局部变量在脚本或命令中定义，仅在当前 shell 实例中有效，其他 shell 启动的程序不能访问局部变量
   - 环境变量
      - 所有的程序，包括 shell 启动的程序，都能访问环境变量，有些程序需要环境变量来保证其正常运行
   - Shell 变量
      - Shell 变量是由 Shell 程序设置的特殊变量。Shell 变量中有一部分是环境变量，有一部分是局部变量
```bash
# 变量声明
name="xxx"

# 变量调用
echo $name
echo ${name}

# 删除变量
unset name

# 只读变量，不能修改也不能通过 unset 删除
url="xxxxx"
readonly url
url="yyyyy"
# 报错，bash: url: readonly variable
```
## Shell 字符串
字符串可以用单引号，也可以用双引号，也可以不用引号

- 单引号
   - 单引号里的任何字符串都会原样输出，单引号字符串中的变量是无效的
   - 单引号字符中不能出现单独的一个单引号，但可成对出现，作为字符串拼接使用
- 双引号
   - 双引号里可以有变量
   - 双引号里可以出现转义字符
## Shell 数组

- bash 支持一维数组（不支持多维数组），并且没有限定数组大小
- 数组元素的下标由 0 开始编号。获取数组中的元素要利用下标，下标可以是整数或算数表达式，其值应大于或等于0
```bash
# 定义数组，括号表示数组，数组元素用空格分割
# 数组名=(val1 val2 val3)
arr=('足球' '篮球' '乒乓球')

# 读数组 ${数组名[下标]}
a=${arr[1]}

# 使用 @ 符可以获取数组中所有元素
echo ${arr[@]} # 足球 篮球 乒乓球

# 获取数组长度
length1=${#arr(@)}
length2=${#arr(*)}
```
## Shell 注释

- 以 # 开头的行就是注释，会被解释器忽略
- 通过每一行加一个 # 设置多行注释
```bash
# 单行注释
# 注释内容..
# 注释内容..
# 注释内容..


# 多行注释
:<<EOF
注释内容..
注释内容..
注释内容..
EOF

:<<!
注释内容..
注释内容..
注释内容..
!
```
## Shell 运算符
原生bash不支持简单的数学运算，但是可以通过其他命令来实现，例如 awk 和 expr，expr 最常用

- expr 是一款表达式计算工具，使用它能完成表达式的求值操作
- 表达式和运算符之间要有空格，例如 2+2 是不对的，必须写成 2 + 2
- 例如，两个数相加(**注意使用的是反引号 ` 而不是单引号 '**)：
```bash
#!/bin/bash

val=`expr 2 + 2`
echo "两数之和为 : $val"
```
### 算数运算符
下表列出了常用的算术运算符，假定变量 a 为 10，变量 b 为 20：

| 运算符 | 说明 | 举例 |
| --- | --- | --- |
| + | 加法 | `expr $a + $b` 结果为 30。 |
| - | 减法 | `expr $a - $b` 结果为 -10。 |
| * | 乘法 | `expr $a \\* $b` 结果为  200。 |
| / | 除法 | `expr $b / $a` 结果为 2。 |
| % | 取余 | `expr $b % $a` 结果为 0。 |
| = | 赋值 | a=$b 把变量 b 的值赋给 a。 |
| == | 相等。用于比较两个数字，相同则返回 true。 | [ $a == $b ] 返回 false。 |
| != | 不相等。用于比较两个数字，不相同则返回 true。 | [ $a != $b ] 返回 true。 |

**注意：**

- 条件表达式要放在方括号之间，并且要有空格，例如: **[$a==$b]** 是错误的，必须写成 **[ $a == $b ]**
- 乘号(*)前边必须加反斜杠(\)才能实现乘法运算
- if...then...fi 是条件语句，后续将会讲解
- 在 MAC 中 shell 的 expr 语法是：`**$((表达式))**`，此处表达式中的 "*" 不需要转义符号 "\" 
```bash
#!/bin/bash

a=10
b=20

val=`expr $a + $b`
echo "a + b : $val"

val=`expr $a - $b`
echo "a - b : $val"

val=`expr $a \* $b`
echo "a * b : $val"

val=`expr $b / $a`
echo "b / a : $val"

val=`expr $b % $a`
echo "b % a : $val"

if [ $a == $b ]
then
   echo "a 等于 b"
fi

if [ $a != $b ]
then
   echo "a 不等于 b"
fi

# 输出结果如下
a + b : 30
a - b : -10
a * b : 200
b / a : 2
b % a : 0
a 不等于 b
```
### 关系运算符
关系运算符只支持数字，不支持字符串，除非字符串的值是数字。

下表列出了常用的关系运算符，假定变量 a 为 10，变量 b 为 20：

| 运算符 | 说明 | 举例 |
| --- | --- | --- |
| -eq | 检测两个数是否相等，相等返回 true。 | [ $a -eq $b ] 返回 false。 |
| -ne | 检测两个数是否不相等，不相等返回 true。 | [ $a -ne $b ] 返回 true。 |
| -gt | 检测左边的数是否大于右边的，如果是，则返回 true。 | [ $a -gt $b ] 返回 false。 |
| -lt | 检测左边的数是否小于右边的，如果是，则返回 true。 | [ $a -lt $b ] 返回 true。 |
| -ge | 检测左边的数是否大于等于右边的，如果是，则返回 true。 | [ $a -ge $b ] 返回 false。 |
| -le | 检测左边的数是否小于等于右边的，如果是，则返回 true。 | [ $a -le $b ] 返回 true。 |

```bash
#!/bin/bash

a=10
b=20

if [ $a -eq $b ]
then
   echo "$a -eq $b : a 等于 b"
else
   echo "$a -eq $b: a 不等于 b"
fi
if [ $a -ne $b ]
then
   echo "$a -ne $b: a 不等于 b"
else
   echo "$a -ne $b : a 等于 b"
fi
if [ $a -gt $b ]
then
   echo "$a -gt $b: a 大于 b"
else
   echo "$a -gt $b: a 不大于 b"
fi
if [ $a -lt $b ]
then
   echo "$a -lt $b: a 小于 b"
else
   echo "$a -lt $b: a 不小于 b"
fi
if [ $a -ge $b ]
then
   echo "$a -ge $b: a 大于或等于 b"
else
   echo "$a -ge $b: a 小于 b"
fi
if [ $a -le $b ]
then
   echo "$a -le $b: a 小于或等于 b"
else
   echo "$a -le $b: a 大于 b"
fi

# 输出结果
10 -eq 20: a 不等于 b
10 -ne 20: a 不等于 b
10 -gt 20: a 不大于 b
10 -lt 20: a 小于 b
10 -ge 20: a 小于 b
10 -le 20: a 小于或等于 b
```
### 布尔运算符
下表列出了常用的布尔运算符，假定变量 a 为 10，变量 b 为 20：

| 运算符 | 说明 | 举例 |
| --- | --- | --- |
| ! | 非运算，表达式为 true 则返回 false，否则返回 true。 | [ ! false ] 返回 true。 |
| -o | 或运算，有一个表达式为 true 则返回 true。 | [ $a -lt 20 -o $b -gt 100 ] 返回 true。 |
| -a | 与运算，两个表达式都为 true 才返回 true。 | [ $a -lt 20 -a $b -gt 100 ] 返回 false。 |

```bash
#!/bin/bash

a=10
b=20

if [ $a != $b ]
then
   echo "$a != $b : a 不等于 b"
else
   echo "$a == $b: a 等于 b"
fi
if [ $a -lt 100 -a $b -gt 15 ]
then
   echo "$a 小于 100 且 $b 大于 15 : 返回 true"
else
   echo "$a 小于 100 且 $b 大于 15 : 返回 false"
fi
if [ $a -lt 100 -o $b -gt 100 ]
then
   echo "$a 小于 100 或 $b 大于 100 : 返回 true"
else
   echo "$a 小于 100 或 $b 大于 100 : 返回 false"
fi
if [ $a -lt 5 -o $b -gt 100 ]
then
   echo "$a 小于 5 或 $b 大于 100 : 返回 true"
else
   echo "$a 小于 5 或 $b 大于 100 : 返回 false"
fi

# 输出结果
10 != 20 : a 不等于 b
10 小于 100 且 20 大于 15 : 返回 true
10 小于 100 或 20 大于 100 : 返回 true
10 小于 5 或 20 大于 100 : 返回 false
```
### 逻辑运算符
以下介绍 Shell 的逻辑运算符，假定变量 a 为 10，变量 b 为 20:

| 运算符 | 说明 | 举例 |
| --- | --- | --- |
| && | 逻辑的 AND | [[ $a -lt 100 && $b -gt 100 ]] 返回 false |
| &#124;&#124; | 逻辑的 OR | [[ $a -lt 100 &#124;&#124; $b -gt 100 ]] 返回 true |

```bash
#!/bin/bash

a=10
b=20

if [[ $a -lt 100 && $b -gt 100 ]]
then
   echo "返回 true"
else
   echo "返回 false"
fi

if [[ $a -lt 100 || $b -gt 100 ]]
then
   echo "返回 true"
else
   echo "返回 false"
fi

# 输出结果
返回 false
返回 true
```
### 字符串运算符
下表列出了常用的字符串运算符，假定变量 a 为 "abc"，变量 b 为 "efg"：

| 运算符 | 说明 | 举例 |
| --- | --- | --- |
| = | 检测两个字符串是否相等，相等返回 true。 | [ $a = $b ] 返回 false。 |
| != | 检测两个字符串是否不相等，不相等返回 true。 | [ $a != $b ] 返回 true。 |
| -z | 检测字符串长度是否为0，为0返回 true。 | [ -z $a ] 返回 false。 |
| -n | 检测字符串长度是否不为 0，不为 0 返回 true。 | [ -n "$a" ] 返回 true。 |
| $ | 检测字符串是否为空，不为空返回 true。 | [ $a ] 返回 true。 |

```bash
#!/bin/bash

a="abc"
b="efg"

if [ $a = $b ]
then
   echo "$a = $b : a 等于 b"
else
   echo "$a = $b: a 不等于 b"
fi
if [ $a != $b ]
then
   echo "$a != $b : a 不等于 b"
else
   echo "$a != $b: a 等于 b"
fi
if [ -z $a ]
then
   echo "-z $a : 字符串长度为 0"
else
   echo "-z $a : 字符串长度不为 0"
fi
if [ -n "$a" ]
then
   echo "-n $a : 字符串长度不为 0"
else
   echo "-n $a : 字符串长度为 0"
fi
if [ $a ]
then
   echo "$a : 字符串不为空"
else
   echo "$a : 字符串为空"
fi

# 输出结果
abc = efg: a 不等于 b
abc != efg : a 不等于 b
-z abc : 字符串长度不为 0
-n abc : 字符串长度不为 0
abc : 字符串不为空
```
### 文件测试运算符
文件测试运算符用于检测 Unix 文件的各种属性

属性检测描述如下：

| 操作符 | 说明 | 举例 |
| --- | --- | --- |
| -b file | 检测文件是否是块设备文件，如果是，则返回 true。 | [ -b $file ] 返回 false。 |
| -c file | 检测文件是否是字符设备文件，如果是，则返回 true。 | [ -c $file ] 返回 false。 |
| -d file | 检测文件是否是目录，如果是，则返回 true。 | [ -d $file ] 返回 false。 |
| -f file | 检测文件是否是普通文件（既不是目录，也不是设备文件），如果是，则返回 true。 | [ -f $file ] 返回 true。 |
| -g file | 检测文件是否设置了 SGID 位，如果是，则返回 true。 | [ -g $file ] 返回 false。 |
| -k file | 检测文件是否设置了粘着位(Sticky Bit)，如果是，则返回 true。 | [ -k $file ] 返回 false。 |
| -p file | 检测文件是否是有名管道，如果是，则返回 true。 | [ -p $file ] 返回 false。 |
| -u file | 检测文件是否设置了 SUID 位，如果是，则返回 true。 | [ -u $file ] 返回 false。 |
| -r file | 检测文件是否可读，如果是，则返回 true。 | [ -r $file ] 返回 true。 |
| -w file | 检测文件是否可写，如果是，则返回 true。 | [ -w $file ] 返回 true。 |
| -x file | 检测文件是否可执行，如果是，则返回 true。 | [ -x $file ] 返回 true。 |
| -s file | 检测文件是否为空（文件大小是否大于0），不为空返回 true。 | [ -s $file ] 返回 true。 |
| -e file | 检测文件（包括目录）是否存在，如果是，则返回 true。 | [ -e $file ] 返回 true。 |

其他检查符：

- **-S**: 判断某文件是否 socket
- **-L**: 检测文件是否存在并且是一个符号链接
```bash
#!/bin/bash

# 变量 file 表示文件 /var/www/runoob/test.sh，它的大小为 100 字节，具有 rwx 权限
file="/var/www/runoob/test.sh"
if [ -r $file ]
then
   echo "文件可读"
else
   echo "文件不可读"
fi
if [ -w $file ]
then
   echo "文件可写"
else
   echo "文件不可写"
fi
if [ -x $file ]
then
   echo "文件可执行"
else
   echo "文件不可执行"
fi
if [ -f $file ]
then
   echo "文件为普通文件"
else
   echo "文件为特殊文件"
fi
if [ -d $file ]
then
   echo "文件是个目录"
else
   echo "文件不是个目录"
fi
if [ -s $file ]
then
   echo "文件不为空"
else
   echo "文件为空"
fi
if [ -e $file ]
then
   echo "文件存在"
else
   echo "文件不存在"
fi

# 输出结果
文件可读
文件可写
文件可执行
文件为普通文件
文件不是个目录
文件不为空
文件存在
```
## Shell echo命令
用于字符串的输出

```bash
# 1.显示普通字符串
echo "It is a test"
# 可以省略双引号
echo It is a test

# 2.显示转义字符
echo "\"It is a test\"" # "It is a test"

# 3.显示变量
name=OK
echo "$name It is a test" # OK It is a test

# 显示换行
echo -e "OK! \n" # -e 开启转义
echo "It is a test"
# 输出
OK!

It is a test

# 4.显示不换行
echo -e "OK! \c" # -e 开启转义 \c 不换行
echo "It is a test"
# 输出
OK! It is a test

# 5. 显示结果定向至文件
echo "It is a test" > myfile # 将结果输出到 myfile 文件中

# 6. 原样输出字符串，不进行转义或取变量(用单引号)
echo '$name\"' # $name\"

# 7. 显示命令执行结果
echo `date` # Thu Jul 24 10:08:46 CST 2014

```
## Shell test 命令
Shell中的 test 命令用于检查某个条件是否成立，它可以进行数值、字符和文件三个方面的测试
### 数值测试
| 参数 | 说明 |
| --- | --- |
| -eq | 等于则为真 |
| -ne | 不等于则为真 |
| -gt | 大于则为真 |
| -ge | 大于等于则为真 |
| -lt | 小于则为真 |
| -le | 小于等于则为真 |

```bash
num1=100
num2=100
if test $[num1] -eq $[num2]
then
    echo '两个数相等！'
else
    echo '两个数不相等！'
fi

# 输出
两个数相等！
```
代码中的 **[]** 执行基本的算数运算，如：
```bash
#!/bin/bash

a=5
b=6

result=$[a+b] # 注意等号两边不能有空格
echo "result 为： $result"

# 输出
result 为： 11
```
### 字符串测试
| 参数 | 说明 |
| --- | --- |
| = | 等于则为真 |
| != | 不相等则为真 |
| -z 字符串 | 字符串的长度为零则为真 |
| -n 字符串 | 字符串的长度不为零则为真 |

```bash
num1="ru1noob"
num2="runoob"
if test $num1 = $num2
then
    echo '两个字符串相等!'
else
    echo '两个字符串不相等!'
fi
# 输出
两个字符串不相等!
```
### 文件测试
| 参数 | 说明 |
| --- | --- |
| -e 文件名 | 如果文件存在则为真 |
| -r 文件名 | 如果文件存在且可读则为真 |
| -w 文件名 | 如果文件存在且可写则为真 |
| -x 文件名 | 如果文件存在且可执行则为真 |
| -s 文件名 | 如果文件存在且至少有一个字符则为真 |
| -d 文件名 | 如果文件存在且为目录则为真 |
| -f 文件名 | 如果文件存在且为普通文件则为真 |
| -c 文件名 | 如果文件存在且为字符型特殊文件则为真 |
| -b 文件名 | 如果文件存在且为块特殊文件则为真 |

```bash
cd /bin
if test -e ./bash
then
    echo '文件已存在!'
else
    echo '文件不存在!'
fi
# 输出
文件已存在!
```
另外，Shell 还提供了与( -a )、或( -o )、非( ! )三个逻辑操作符用于将测试条件连接起来，其优先级为： **!** 最高， **-a** 次之， **-o** 最低。例如：
```bash
cd /bin
if test -e ./notFile -o -e ./bash
then
    echo '至少有一个文件存在!'
else
    echo '两个文件都不存在'
fi
# 输出
至少有一个文件存在!
```
## Shell 流程控制
### if
```bash
if condition1
then
    command1
elif condition2 
then 
    command2
else
    commandN
fi
```
实例
```bash
a=10
b=20
if [ $a == $b ]
then
   echo "a 等于 b"
elif [ $a -gt $b ]
then
   echo "a 大于 b"
elif [ $a -lt $b ]
then
   echo "a 小于 b"
else
   echo "没有符合的条件"
fi

# 输出
a 小于 b

# if else 语句经常与 test 命令结合使用
num1=$[2*3]
num2=$[1+5]
if test $[num1] -eq $[num2]
then
    echo '两个数字相等!'
else
    echo '两个数字不相等!'
fi

# 输出
两个数字相等!
```
### case

- 每个 case 分支用右圆括号开始，用两个分号 **;;** 表示 break，即执行结束，跳出整个 case ... esac 语句
- esac（就是 case 反过来）作为结束标记
```bash
case 值 in
模式1)
    command1
    command2
    ...
    commandN
    ;;
模式2)
    command1
    command2
    ...
    commandN
    ;;
esac
```
例子
```bash
#!/bin/sh

site="runoob"

case "$site" in
   "runoob") echo "菜鸟教程"
   ;;
   "google") echo "Google 搜索"
   ;;
   "taobao") echo "淘宝网"
   ;;
esac
# 输出
菜鸟教程
```
### for 循环
```bash
for var in item1 item2 ... itemN
do
    command1
    command2
    ...
    commandN
done
```
例子
```bash
#!/bin/bash

for str in This is a string
do
    echo $str
done
# 输出
This
is
a
string
```
### while 语句
while 循环用于不断执行一系列命令，也用于从输入文件中读取数据
```bash
while condition
do
    command
done
```
例子
```bash
#!/bin/bash
int=1
while(( $int<=5 ))
do
    echo $int
    let "int++"
done
# 输出
1
2
3
4
5
```
### 无限循环
```bash
# 无限循环语法格式：
while : do     command done
# 或者
while true do     command done
# 或者
for (( ; ; ))
```
### 跳出循环
```bash
# break命令允许跳出所有循环（终止执行后面的所有循环）
#!/bin/bash
while :
do
    echo -n "输入 1 到 5 之间的数字:"
    read aNum
    case $aNum in
        1|2|3|4|5) echo "你输入的数字为 $aNum!"
        ;;
        *) echo "你输入的数字不是 1 到 5 之间的! 游戏结束"
            break
        ;;
    esac
done

# 输出结果
输入 1 到 5 之间的数字:3
你输入的数字为 3!
输入 1 到 5 之间的数字:7
你输入的数字不是 1 到 5 之间的! 游戏结束
```
```bash
# continue命令跳出当前循环
#!/bin/bash
while :
do
    echo -n "输入 1 到 5 之间的数字: "
    read aNum
    case $aNum in
        1|2|3|4|5) echo "你输入的数字为 $aNum!"
        ;;
        *) echo "你输入的数字不是 1 到 5 之间的!"
            continue
            echo "游戏结束"
        ;;
    esac
done

# 当输入大于5的数字时，该例中的循环不会结束，语句 echo "游戏结束" 永远不会被执行
```
## Shell 函数
linux shell 可以用户定义函数，然后在shell脚本中可以随便调用
```bash
[ function ] funname [()]

{

    action;

    [return int;]

}
```

- 可以带`function fun()`定义，也可以直接`fun() `定义,不带任何参数
- 参数返回，可以显示加`return`返回，如果不加，将以最后一条命令运行结果作为返回值。 `return`后跟数值n`(0-255)`。函数返回值在调用该函数后通过 $? 来获得
   - **$?** 仅对其上一条指令负责，一旦函数返回后其返回值没有立即保存入参数，那么其返回值将不再能通过 **$?** 获得
- 所有函数在使用前必须定义。这意味着必须将函数放在脚本开始部分，直至shell解释器首次发现它时，才可以使用

例子一
```bash
#!/bin/bash

demoFun(){
    echo "这是我的第一个 shell 函数!"
}
echo "-----函数开始执行-----"
demoFun
echo "-----函数执行完毕-----"

# 输出结果
-----函数开始执行-----
这是我的第一个 shell 函数!
-----函数执行完毕-----
```
例子二
```bash
#!/bin/bash

funWithReturn(){
    echo "这个函数会对输入的两个数字进行相加运算..."
    echo "输入第一个数字: "
    read aNum
    echo "输入第二个数字: "
    read anotherNum
    echo "两个数字分别为 $aNum 和 $anotherNum !"
    return $(($aNum+$anotherNum))
}
funWithReturn
echo "输入的两个数字之和为 $? !"

# 输出结果
这个函数会对输入的两个数字进行相加运算...
输入第一个数字: 
1
输入第二个数字: 
2
两个数字分别为 1 和 2 !
输入的两个数字之和为 3 !
```
### 函数参数
在Shell中，调用函数时可以向其传递参数。在函数体内部，通过 $n 的形式来获取参数的值，例如，$1表示第一个参数，$2表示第二个参数...
```bash
#!/bin/bash
# author:菜鸟教程
# url:www.runoob.com

funWithParam(){
    echo "第一个参数为 $1 !"
    echo "第二个参数为 $2 !"
    echo "第十个参数为 $10 !"
    echo "第十个参数为 ${10} !"
    echo "第十一个参数为 ${11} !"
    echo "参数总数有 $# 个!"
    echo "作为一个字符串输出所有参数 $* !"
}
funWithParam 1 2 3 4 5 6 7 8 9 34 73

# 输出结果
第一个参数为 1 !
第二个参数为 2 !
第十个参数为 10 !
第十个参数为 34 !
第十一个参数为 73 !
参数总数有 11 个!
作为一个字符串输出所有参数 1 2 3 4 5 6 7 8 9 34 73 !
```
注意，$10 不能获取第十个参数，获取第十个参数需要`${10}`。当`n>=10`时，需要使用`${n}`来获取参数

另外，还有几个特殊字符用来处理参数：

| 参数处理 | 说明 |
| --- | --- |
| $# | 函数的参数个数 |
| $* | 字符串形式显示所有参数

如"$*"用「"」括起来的情况、以"$1 $2 … $n"的形式输出所有参数 |
| $@ | 与$*相同，但是使用时加引号，并在引号中返回每个参数

如"$@"用「"」括起来的情况、以"$1" "$2" … "$n" 的形式输出所有参数 |
| $- | 显示Shell使用的当前选项，与set命令功能相同 |
| $? | 显示最后命令的退出状态。0表示没有错误，其他任何值表明有错误 |

