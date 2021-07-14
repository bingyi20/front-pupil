

interface IRequestParams {
    url: string,
    type?: 'GET' | 'POST',
    timeout?: number,
    data?: any
}


function data2queryString(data: any) {
    const queryArr = []
    for(let key in data) {
        queryArr.push(`${key}=${encodeURIComponent(data[key])}`)
    }
    return queryArr.join('&')
}

function ajax(params: IRequestParams = {url: '', type: 'GET', timeout: 3000, data: {}}) {
    if(!params.url) return;
    return new Promise((resolve, reject) => {
        let xhr, timer

        if((window as any).XMLHttpRequest) {
            xhr = new XMLHttpRequest()
        }else{
            xhr = new ActiveXObject('Microsoft.XMLHTTP')
        }

        const queryString = data2queryString(params.data)

        const onStateChange = () => {
            xhr.onreadystatechange = () => {
                if(xhr.readyState == 4) {
                    console.log(xhr)
                    if((xhr.status >= 200 && xhr.status < 300) || 
                        xhr.status == 304) {
                        resolve(xhr.responseText)
                    }else{
                        reject(xhr.code)
                    }
                }
            }
        }
        console.log("==>", params.type)
        if(params.type == 'GET') {
            xhr.open('GET', `${params.url}?${queryString}`)
            onStateChange()
            xhr.send()
        }else{
            xhr.open('POST', params.url)
            xhr.setRequestHeader(
                "Content-Type",
                "application/x-www-form-urlencoded"
            )
            onStateChange()
            xhr.send(params.data)
        }
        
        // 超时处理
        if(params.timeout) {
            timer = setTimeout(() => {
                xhr.abort()
                reject("timeout")
            }, params.timeout)
        }

    })
}

ajax({url: 'http://127.0.0.1:7001/index', type: 'GET'}).then(res=>{console.log(res)})
ajax({url: 'http://127.0.0.1:7001/create', type: 'POST'}).then(res=>{console.log(res)})