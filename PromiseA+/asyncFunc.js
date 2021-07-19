

function longTimeTask(value, timeout) {
    return new Promise((resolve) => {
        setTimeout(()=>{
            resolve(value)
        }, timeout)
    })
}

/**
 * 模拟ascnc await
 * @param {Function} generator 生成器函数
 */
function asyncFunc(generator) {
    const iterator = generator()

    const next = (res) => {
        const {done, value} = iterator.next(res)
        if(done) {
            return  value
        }

        Promise.resolve(value).then(res => {
            next(res)
        })
    }

    next()
}

function *generator() {
    const value1 = yield longTimeTask(111, 1000)
    console.log(value1)
    const value2 = yield 5555
    console.log(value2)
    const value3 = yield longTimeTask(333, 500)
    console.log(value3)
    console.log(value1, value2, value3)
}

asyncFunc(generator)

