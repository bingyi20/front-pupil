// AMD的迷你实现
const rj = {}
const modules = {}
const defaultOptions = {paths: {}}
const cachePromise = {}

// 配置模块加载路径
rj.config = (options) => {
    Object.assign(defaultOptions, options)
}

const _getUrl = (id) => {
    let url = defaultOptions.paths[id] || id
    const httpReg = /(^http|https)/
    if(httpReg.test(url)) return url
    url = location.href.substr(0, location.href.lastIndexOf('/')) + '/' + id + '.js'
    return url
}

// 依赖加载，可以做缓存，已经加载过的直接返回不再重新加载
const _load = (url) => {
    if(!cachePromise[url]) {
        const p = new Promise((resolve, reject)=>{
            const head = document.getElementsByTagName('head')[0]
            const node = document.createElement('script')
            node.async = true
            node.src = url
            node.onload = resolve
            node.onerror = reject
            head.appendChild(node)
        })
        cachePromise[url] = p;
    }
    return cachePromise[url]
}

/**
 * 定义模块
 * @param {string} id 
 * @param {Array<string>} deps 
 * @param {Function} factory 工厂函数
 */
const define = (id, deps, factory) => {
    let url = _getUrl(id)
    modules[id] = { id, url, deps, factory }
}

// 依赖前置，先将依赖全部加载完成再执行回调
const require = (deps, factory) => {
    if(!Array.isArray(deps)) deps = [deps]
    return Promise.all(deps.map(dep => {
        return _load(_getUrl(dep)).then(()=>{
            if(!modules[dep]) throw Error(`module ${dep} is not defined`)
            const depObject = modules[dep]
            if(depObject.deps.length == 0) return depObject.factory(null)
            // 递归执行依赖
            return require(depObject.deps, depObject.factory)
        })
    })).then(instances => {
        return factory(...instances)
    })
}