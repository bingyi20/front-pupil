
/**
 * 计算代码执行时间的装饰器
 * @param target 
 * @param name 
 * @param descriptor 
 */
export function measure(target: any, name: any, descriptor: { value: () => any }): any {
    console.log(target)
    const oldValue = descriptor.value

    descriptor.value = async function(...arg) {
        const start = Date.now()
        const ret = await oldValue.apply(this, arg)
        console.log(`${name} 执行耗时 ${Date.now() - start}ms`)
        return ret
    }

    return descriptor
}