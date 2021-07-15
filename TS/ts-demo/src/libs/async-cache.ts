
const cacheMap: Map<string, any> = new Map();

/**
 * 缓存promise请求
 * @param target 
 * @param name 
 * @param descriptor 
 * @returns 
 */
export function EnableCache(target: any, name: any, descriptor: any): any {
    const oldFn = descriptor.value

    descriptor.value = function(...args: any) {
        const cacheKey = `${name}${JSON.stringify(args)}`
        if(!cacheMap.get(cacheKey)) {
            const cacheValue = Promise.resolve(oldFn.apply(this, args)).catch(()=>{cacheMap.set(cacheKey, null)})
            cacheMap.set(cacheKey, cacheValue)
        }
        return cacheMap.get(cacheKey)
    }

    return descriptor
}