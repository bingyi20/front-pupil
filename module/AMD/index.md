# AMD
AMD是"Asynchronnous Module Definition"的缩写，意思就是“异步模块定义”。

## RequireJS(AMD的代表)

### 定义模块
会先加载其依赖的模块m1,m2然后继续执行回调函数，回调函数的返回值就是该模块暴露的内容
```js
define(["m1", "m2"], (m1, m2) => {
    m1...
    m2...
    return {
        xxx
    }
})
```

### 使用模块
语法和定义模块一样，都是会立即执行，但是define有定义模块的作用，require就是纯执行，执行完后什么都不留下
```js
require(['m1', 'm2'], (m1, m2) => {
    m1xxx
    m2xxx
})
```

### 预定义模块加载路径
```js
require.config({
    paths: {
        "jquery": "http://cdn-oss.xxxx",
        "backbone": "lib/backbone.js"
    }
})
```