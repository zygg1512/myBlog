# indexedDB
## indexedDB 介绍
>[W3C使用介绍](https://www.w3cschool.cn/javascript_guide/javascript_guide-rcfy26a4.html)

IndexedDB 是一个非关系型数据库（不支持通过 SQL 语句操作）。可以存储大量数据，提供接口来查询，还可以建立索引，这些都是其他存储方案无法提供的能力。

- 关系型数据库（SQL数据库）：关系型数据库是指采用了关系模型来组织数据的数据库。简单来说，关系模型就是二维表格模型。
- 非关系型数据库（NoSQL）：以键值来存储，且结构不稳定，每一个元组都可以有不一样的字段，这种就不会局限于固定的结构，可以减少一些时间和空间的开销。使用这种方式，为了获取用户的不同信息，不需要像关系型数据库中，需要进行多表查询。仅仅需要根据key来取出对应的value值即可。
### IndexedDB 特点
- **键值对储存：** IndexedDB 内部采用对象仓库（object store）存放数据。所有类型的数据都可以直接存入，包括 JavaScript 对象。
  - 对象仓库中，数据以"键值对"的形式保存，每一个数据记录都有对应的主键，主键是独一无二的，不能有重复，否则会抛出一个错误。
- **异步：** IndexedDB 操作时不会锁死浏览器，用户依然可以进行其他操作，这与 LocalStorage 形成对比，LocalStorage 的操作是同步的。异步设计是为了防止大量数据的读写，拖慢网页的表现。
- **支持事务：** IndexedDB 支持事务（transaction），这意味着一系列操作步骤之中，只要有一步失败，整个事务就都取消，数据库回滚到事务发生之前的状态，不存在只改写一部分数据的情况。
- **同源限制：** IndexedDB 受到同源限制，网页只能访问自身域名下的数据库，而不能访问跨域的数据库。
- **支持二进制储存：** IndexedDB 不仅可以储存字符串，还可以储存二进制数据（ArrayBuffer 对象和 Blob 对象。
- **储存空间大：** IndexedDB 的储存空间比 LocalStorage 大得多，一般来说不少于 250MB，甚至没有上限。

### IndexedDB 核心概念
- 数据库：IDBDatabase 对象，数据库有版本概念，同一时刻只能有一个版本，每个域名可以建多个数据库
- 对象仓库：IDBObjectStore 对象，类似于关系型数据库的表格
- 索引： IDBIndex 对象，可以在对象仓库中，为不同的属性建立索引，主键默认建立索引
- 事务： IDBTransaction 对象，增删改查都需要通过事务来完成，事务对象提供了error,abord,complete三个回调方法，监听操作结果
- 操作请求：IDBRequest 对象
- 指针： IDBCursor 对象
- 主键集合：IDBKeyRange 对象，主键是默认建立索引的属性，可以取当前层级的某个属性，也可以指定下一层对象的属性，还可以是一个递增的整数

### 和其他存储方案的区别
| 特性     | cookie  | localStorage  | sessionStorage | indexedDB |
| --- | --- | --- | --- | --- |
| 生命周期 | 一般由服务器生成，可以设置过期时间；前端采用和js-cookie等组件也可以生成| 除非被清理，否则一直存在；浏览器关闭还会保存在本地，但是不支持跨浏览器 | 页面关闭就清理刷新依然存在，不支持跨页面交互 | 除非被清理，否则一直存在|
| 存储大小 | 4K | 5M|5M| 不限制大小|
| 与服务端通信 | 每次都会携带在请求的header 中，对于请求性能有影响。由于请求中都带有，所以也容易出现安全问题 | 不参与| 不参与| 不参与|

### IndexedDB 兼容
目前，Chrome 27+、Firefox 21+、Opera 15+和IE 10+支持这个API，但是Safari完全不支持。

下面的代码用来检查浏览器是否支持这个API。
```javascript
if("indexedDB" in window) {
    // 支持
} else {
    // 不支持
}
```
## 创建、打开数据库
`indexedDB.open`方法用于打开或新建数据库。参数如下：
- 第一个参数是数据库名称，格式为字符串，不可省略。
- 第二个参数是数据库版本，是一个大于0的正整数（0将报错）。
```javascript
const openRequest = indexedDB.open('test', 1)
```
上面代码表示，打开一个名为test、版本为1的数据库。如果该数据库不存在，则会新建该数据库。如果省略第二个参数，则会自动创建版本为1的该数据库。

`indexedDB.open`返回一个 IDBRequest 对象。这个对象通过四种事件，处理打开数据库的操作结果。
- `success`：打开成功。
- `error`：打开失败。
- `upgradeneeded`：第一次新建该数据库，或者数据库版本发生变化。
- `blocked`：上一次的数据库连接还未关闭。

第一次打开数据库时，会先触发`upgradeneeded`事件，然后触发`success`事件。

回调函数接受一个事件对象`event`作为参数，它的`target.result`属性就指向打开的 IndexedDB 数据库。
```javascript
const openRequest = indexedDB.open("test",1)
let db

openRequest.onupgradeneeded = function(e) {
    console.log("Upgrading...")
}
 
openRequest.onsuccess = function(e) {
    console.log("Success!")
    db = e.target.result
}
 
openRequest.onerror = function(e) {
    console.log("Error")
    console.dir(e)
}
```
## 创建表格
`db.createObjectStore`方法用于创建存放数据的“对象仓库”（object store），类似于传统关系型数据库的表格。
```javascript
db.createObjectStore("firstOS")
```
上面代码创建了一个名为`firstOS`的对象仓库，如果该对象仓库已经存在，就会抛出一个错误。
### 判断表格是否存在
`objectStoreNames`属性返回一个`DOMStringList`对象，里面包含了当前数据库所有“对象仓库”的名称。可以使用D`OMStringList`对象的`contains`方法，检查数据库是否包含某个“对象仓库”。
```javascript
if(!db.objectStoreNames.contains("firstOS")) {
     db.createObjectStore("firstOS")
}
```
### 设置主键
`db.createObjectStore`方法还可以接受第二个对象参数，用来设置“对象仓库”的属性。
```javascript
// keyPath：设置主键
db.createObjectStore("test", { keyPath: "email" })
// 主键也可以指定为下一层对象的属性，比如{ foo: { bar: 'baz' } }的 foo.bar 也可以指定为主键
db.createObjectStore("test", { keyPath: "foo.bar" })
// 自动生成递增主键，autoIncrement 默认为 false
db.createObjectStore("test2", { autoIncrement: true })
```
一般来说，`keyPath`和`autoIncrement`属性只要使用一个就够了，如果两个同时使用，表示键名为递增的整数，且对象不得缺少指定属性。

### 设置索引键
通过`IDBObject.createIndex`方法可以设置索引键，该方法接受三个参数：
- 索引名称
- 索引所在的属性
- 配置对象，用于说明该属性是否包含重复的值

```javascript
const objectStore = db.createObjectStore('person', { keyPath: 'id' })
objectStore.createIndex('idx_name', 'name', { unique: false })
objectStore.createIndex('email', 'email', { unique: true })
```

一般情况下，新建数据库之后创建表格等后续的操作主要在`upgradeneeded`事件的监听函数里面完成，因为这时版本从无到有，所以会触发这个事件。

相应的，打开已经新建过的数据库不会触发`upgradeneeded`事件，因为该数据库版本没有发生变化。

## 数据的增删改查
`db.transaction`方法用于创建一个数据库事务，数据的增删改查必须先创建数据库事务。

该方法接收两个参数：
- 第一个参数是一个数组，里面是需要操作的对象仓库，通常是只有一个。
- 第二个参数是一个表示操作类型的字符串。目前，操作类型只有两种：`readonly`（只读）和`readwrite`（读写）。
  - 添加数据使用`readwrite`
  - 读取数据使用`readonly`

`db.transaction`方法返回一个事务对象：
- 该对象的`objectStore`方法用于获取指定的对象仓库。
- 该对象有三个事件，可以用来定义回调函数：
  - abort：事务中断。
  - complete：事务完成。
  - error：事务出错。

```javascript
const t = db.transaction(["firstOS"], "readwrite")
// 获取对象仓库
const store = t.objectStore("firstOS")

// 事务完成回调
t.oncomplete = function(event) {}
```
### 新增数据：add 方法
获取对象仓库以后，就可以用`add`方法往里面添加数据了。`add`方法接收两个参数：
- 第一个参数是所要添加的数据
- 第二个参数是这条数据对应的键名（key），上面代码将对象`data`的键名设为 1。
  - 也可以直接在`data`对象中设置主键和主键值。
  - 如果在创建数据仓库时，对键名做了自增设置，这里也可以不指定键名。
```javascript
function add() {
  // 方式一：直接在`data`对象中设置主键和主键值
  const data = { id: 1, name: '张三', age: 24, email: 'zhangsan@example.com' }
  // 从创建事务到添加数据，所有操作方法也可以写成下面这样链式形式
  const request = db.transaction(['person'], 'readwrite')
    .objectStore('person')
    .add(data)

//   // 方式二：通过 add 方法的第二个参数设置主键值
//   const data = { name: '张三', age: 24, email: 'zhangsan@example.com' }
//   const request = db.transaction(['person'], 'readwrite')
//     .objectStore('person')
//     .add(data, 1)

  request.onsuccess = function (event) {
    console.log('数据写入成功')
  }

  request.onerror = function (event) {
    console.log('数据写入失败')
  }
}

add()
```
**增删改查操作都是异步操作，通过监听连接对象的`success`事件和`error`事件，了解是否成功。**

### 读取数据：get 方法
读取数据使用`get`方法，它的参数是主键的值。
```javascript
function read() {
   const transaction = db.transaction(['person'])
   const objectStore = transaction.objectStore('person')
   // 获取数据
   const request = objectStore.get(1)

   request.onerror = function(event) {
     console.log('事务失败')
   }

   request.onsuccess = function( event) {
      if (request.result) {
        console.log('Name: ' + request.result.name)
        console.log('Age: ' + request.result.age)
        console.log('Email: ' + request.result.email)
      } else {
        console.log('未获得数据记录')
      }
   }
}

read()
```
### 遍历数据：openCursor 方法
如果想要遍历数据，需要使用`openCursor`方法，它会在当前对象仓库里面建立一个读取光标（cursor）。

`openCursor`方法接收两个参数：
- 第一个参数用于设定查找范围，是`IDBKeyRange`对象
- 第二个参数表示遍历方向
  - `next`：默认值
  - `prev`：`next`反方向
  - `nextunique`：如果遇到重复值，会自动跳过
  - `prevunique`：如果遇到重复值，会自动跳过

```javascript
function readAll() {
  const objectStore = db.transaction('person').objectStore('person')

   objectStore.openCursor().onsuccess = function (event) {
     // 回调函数接受一个事件对象作为参数，该对象的 target.result 属性指向当前数据对象
     // 当前数据对象的 key 返回主键值
     // 当前数据对象的 value 返回存储的对象
     const cursor = event.target.result
     if (cursor) {
       console.log('Id: ' + cursor.key)
       console.log('Name: ' + cursor.value.name)
       console.log('Age: ' + cursor.value.age)
       console.log('Email: ' + cursor.value.email)
       // continue 方法将光标移到下一个数据对象，如果当前数据对象已经是最后一个数据了，则光标指向 null
       cursor.continue()
    } else {
      console.log('没有更多数据了！')
    }
  }
}

readAll()
```
#### IDBKeyRange 对象
`IDBKeyRange`对象的作用是生成一个表示范围的`Range`对象。生成方法有四种：
- `lowerBound`方法：指定范围的下限
- `upperBound`方法：指定范围的上限
- `bound`方法：指定范围的上下限
- `only`方法：指定范围中只有一个值
```javascript
// All keys ≤ x	
const r1 = IDBKeyRange.upperBound(x)

// All keys < x	
const r2 = IDBKeyRange.upperBound(x, true)

// All keys ≥ y	
const r3 = IDBKeyRange.lowerBound(y)

// All keys > y	
const r4 = IDBKeyRange.lowerBound(y, true)

// All keys ≥ x && ≤ y	
const r5 = IDBKeyRange.bound(x, y)

// All keys > x && < y	
const r6 = IDBKeyRange.bound(x, y, true, true)

// All keys > x && ≤ y	
const r7 = IDBKeyRange.bound(x, y, true, false)

// All keys ≥ x && < y	
const r8 = IDBKeyRange.bound(x, y, false, true)

// The key = z	
const r9 = IDBKeyRange.only(z)
```
前三个方法默认包括端点值，可以传入一个或两个布尔值，修改是否包含端点值。

生成`Range`对象以后，将它作为参数传入`openCursor`方法，就可以在所设定的范围内读取数据。
```javascript
const t = db.transaction(["people"],"readonly")
const store = t.objectStore("people")
const range = IDBKeyRange.bound('B', 'D')

store.openCursor(range).onsuccess = function(e) {
    const cursor = e.target.result
    if(cursor) {
        console.log(cursor.key + ":")
        for(const field in cursor.value) {
            console.log(cursor.value[field])
        }
        cursor.continue()
    }
}
```

### 获取所有数据：getAll 方法
`getAll`方法也可以接收一个`IDBKeyRange`对象，用于范围查询
```javascript
const store = db.transaction(['person']).objectStore('person')
const request = store.getAll()

request.onsuccess = function(event) {
  console.log('indexedDB getAll:', event.target.result)
}
request.onerror = function(event) {
  console.log('indexedDB getAll:', event)
}

```
### 更新记录：put 方法
`put`方法和`add`方法类似。下面的代码表示自动更新了主键为1的记录
```javascript
function update() {
  const request = db.transaction(['person'], 'readwrite')
    .objectStore('person')
    .put({ id: 1, name: '李四', age: 35, email: 'lisi@example.com' })

  request.onsuccess = function (event) {
    console.log('数据更新成功')
  }

  request.onerror = function (event) {
    console.log('数据更新失败')
  }
}

update()
```
### 删除记录：delete 方法
```javascript
function remove() {
  const request = db.transaction(['person'], 'readwrite')
    .objectStore('person')
    .delete(1)

  request.onsuccess = function (event) {
    console.log('数据删除成功')
  }
}

remove()
```
### 基于索引查询：index方法
有了索引以后，就可以针对索引所在的属性读取数据。`index`方法用于从对象仓库返回指定的索引。
```javascript
const transaction = db.transaction(['person'], 'readonly')
const store = transaction.objectStore('person')
// 用 index 方法指定索引在 name 属性上面
const index = store.index('name')
const request = index.get('李四')

request.onsuccess = function (e) {
  const result = e.target.result
  if (result) {
    // ...
  } else {
    // ...
  }
}
```
上面代码打开对象仓库以后，先用`index`方法指定索引在`name`属性上面，然后用`get`方法读取某个`name`属性所在的数据。

如果没有指定索引的那一行代码，`get`方法只能按照主键值读取数据，而不能按照`name`属性（非主键）的属性值读取数据。

需要注意的是，这时`get`方法有可能取回多个数据对象，因为`name`属性没有唯一值。

## 业务中优雅使用
### 定期删除失效数据
>indexedDB 并非无底洞，可以无限存储。要考虑做定期删除等功能

- 首先创建数据的时候就以**时间戳+失效时间**来约定主键规则
- 再通过`getAll`方法，获取指定条件的数据，再遍历数据，调用删除数据API
```javascript
const store = db.transaction(['person'], 'readwrite').objectStore('person')
const request = store.getAll(IDBKeyRange.upperBound(+new Date()))
// 获取成功
request.onsuccess = function(event) {
    const data = event.target.result
    data.forEach(item => {
        console.log('删除数据', item)
        const deletRequest = store.delete(item.id)

        deletRequest.onsuccess = function(event) {
            console.log('数据删除成功', event)
        }

        deletRequest.onerror = function(event) {
            console.log('数据删除失败', event)
        }
    })
}
// 获取失败
request.onerror = function(event) {}
```
## localforage
localforage`/ˈfɔːrɪdʒ/`业界比较认可的第三方库，和`localStorage`使用保持一致。[localforage 中文文档](https://localforage.docschina.org/)

- `localForage`是一个 JavaScript 库，能够类似`localStorage`的存储
- 异步存储，可以优化 web 应用程序的离线体验，而且能存储多种类型的数据
- `localForage`有一个优雅的降级策略，如果浏览器不支持 indexedDB 或者 WebSQL 则使用`localStorage`
- 支持 ES6 的`Promises`API,而且支持添加回调函数
