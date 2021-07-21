console.log("===> 主模块开始执行")

// 加载moduleA & math，两个模块都加载完成后才开始执行回调函数，已经加载过的模块会进行缓存，不会重复加载
require(['moduleA', 'math'], function (moduleA, math) {
    moduleA.sayA_B(10, 12)
    moduleA.sayA_B(1, 2)
    console.log(math.add(1,2))
})

define(function(){
    console.log("定义模块会立马执行吗？")
})

console.log("===> 主模块执行结束")