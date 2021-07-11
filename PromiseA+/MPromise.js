
let PID = 0
const map = {}

// 定义MPromise三种状态
const PENDING = "pending"
const FULFILLED = "fulfilled"
const REJECTED = "rejected"

class MPromise{
    FULFILLED_CALLBACK_LIST = []
    REJECTED_CALLBACK_LIST = []
    _status = PENDING
    // const promise1 = new MPromise((resolve, reject)=>{})
    constructor(fn) {
        // 每个实例给一个唯一_pid，便于识别
        this._pid = PID++;
        map[this._pid] = this;

        this.status = PENDING
        this.value = null
        this.reason = null
        try{
            fn(this.rlesolve.bind(this), this.reject.bind(this))
        }catch(e) {
            this.reject(e)
        }
    }

    rlesolve(value) {
        if(this.status === PENDING) {
            this.value = value
            this.status = FULFILLED
        }
    }

    reject(reason) {
        if(this.status === PENDING) {
            this.reason = reason
            this.status = REJECTED
        }
    }

    get status() {
        return this._status
    }
    // 动态监听status的变化，执行相应队列里面的回调
    set status(newStatus) {
        this._status = newStatus
        if(newStatus === FULFILLED) {
            this.FULFILLED_CALLBACK_LIST.forEach(cb => {
                cb(this.value)
            })
        }else if(newStatus === REJECTED) {
            this.REJECTED_CALLBACK_LIST.forEach(cb => {
                cb(this.reason)
            })
        }
    }

    then(onFulfilled, onRejected) {
        const onRelFulfilled = this.isFunction(onFulfilled) ? onFulfilled : (value) => {
            return value
        }
        const onRelRejected = this.isFunction(onRejected) ? onRejected : (reason) => {
            throw reason
        }
        
        // then方法返回一个promise
        const promise2 = new MPromise((resolve, reject)=>{
            const fulfilledMicrotask = ()=> {
                queueMicrotask(() => {
                    try {
                        let x = onRelFulfilled(this.value)
                        this.resolvePromise(promise2, x, resolve, reject) 
                    }catch(e) {
                        reject(e)
                    }
                })
            }

            const rejectedMicrotask = () => {
                queueMicrotask(()=> {
                    try{
                        let x = onRelRejected(this.reason)
                        this.resolvePromise(promise2, x, resolve, reject)
                    }catch(e) {
                        reject(e)
                    }
                })
            }

            switch(this.status) {
                case FULFILLED:
                    fulfilledMicrotask()
                    break
                case REJECTED:
                    rejectedMicrotask()
                    break
                case PENDING: {
                    this.FULFILLED_CALLBACK_LIST.push(fulfilledMicrotask)
                    this.REJECTED_CALLBACK_LIST.push(rejectedMicrotask)
                    break
                }
            }
        })
        return promise2
    }

    resolvePromise(promise2, x, resolve, reject) {
        if(promise2 === x) {
            return reject(new TypeError("The promise and the return value are the same."))
        }
        if(x instanceof MPromise) {
            x.then((y) => {
                this.resolvePromise(promise2, y, resolve, reject)
            }, reject)
        }else if(typeof x === 'object' || this.isFunction(x)) {
            if (x === null) {
                resolve(x)
            }

            let then = null
            try{
                then = x.then
            }catch(e) {
                return reject(e)
            }

            if(this.isFunction(then)) {
                let called = false
                try{
                    then.call(
                        x,
                        (y) => {
                            if(called) {
                                console.log("已经被调用了")
                                return 
                            } 
                            called = true
                            this.resolvePromise(promise2, y, resolve, reject)
                        },
                        (r) => {
                            if(called) return
                            called = true
                            return reject(r)
                        }
                    )
                }catch(e) {
                    reject(e)
                }
            }else{
                // 如果then不是函数
                resolve(x)
            }

        }else{
            // 如果x不是MPromise，不是对象，不是函数
            resolve(x)
        }

    }

    isFunction(value) {
        return typeof value === 'function'
    }
}


const thenable = {
    then() {
        console.log('then able')
    }
}

const promise = new MPromise((resolve) => {
    console.log(1)
    resolve(2)
}).then(res => {
    console.log(res)
    return thenable
})

console.log(promise)

setTimeout(() => {
    console.log('after 1second');
    console.log(promise)
    thenable.then()
}, 1000)