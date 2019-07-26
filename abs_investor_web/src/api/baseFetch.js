
function handleRequest (opt,body){
    let {headers}=opt;
    let contentType = headers.get('content-type')
    if (contentType.includes('application/json')) {
        return JSON.stringify(body)
    } else if (contentType.includes('text/html')) {
        return JSON.stringify(body)
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
        return JSON.stringify(body)
    } else {
        // Other response types as necessary. I haven't found a need for them yet though.
        throw new Error(`Sorry, content-type ${contentType} not supported`)
    }
};

function handleResponse (response) {
    let contentType = response.headers.get('content-type')
    if (contentType.includes('application/json')) {
        return handleJSONResponse(response)
    } else if (contentType.includes('text/html') || contentType.includes('application/x-www-form-urlencoded')) {
        return handleTextResponse(response)
    }else if (contentType.includes('text/json')) {
        return handleJSONResponse(response)
    }else {
        // Other response types as necessary. I haven't found a need for them yet though.
        throw new Error(`Sorry, content-type ${contentType} not supported`)
    }
}

function handleJSONResponse (response) {
    return response.json().then(json => {
        if (response.ok) {
            if(json.code==401){
                window.location.href=location.protocol+'//'+window.location.host+'/#/login';
                return json;
            }else{
                return json
            }
            
        } else {
            return Promise.reject(Object.assign({}, json, {
                status: response.status,
                statusText: response.statusText
            }))
        }
    })
}
function handleTextResponse (response) {
    return response.text()
        .then(text => {
        if (response.ok) {
            if(json.code==401){
                window.location.href=window.location.host+'/#/login';
                return json;
            }else{
                return json
            }
        } else {
            return Promise.reject({
                status: response.status,
                statusText: response.statusText,
                err: text
            })
        }
    })
}

const fetchOptions={                        //fetch 所有参数
    body: JSON.stringify(''), // must match 'Content-Type' header                 只有post需要
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached   是否缓存
    credentials: 'same-origin', // include, same-origin, *omit                      发送cookie的配置
    headers: {
        'user-agent': 'Mozilla/4.0 MDN Example',
        'content-type': 'application/json'
    },
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, cors, *same-origin                                    请求模式
    redirect: 'follow', // manual, *follow, error                                   
    referrer: 'no-referrer', // *client, no-referrer
}

const timeoutVal=15000;                             //超时时间

const FetchFn= ({url='',path='abs_asset/',headers={},data={},methods='GET'}) => {
    let defaultHeader= new Headers({
        'Content-Type':'application/json;charset=UTF-8',
    });
    let options={
        headers:Object.assign(defaultHeader,headers),
        method:methods.toUpperCase(),
        credentials: 'same-origin',
    }
    let getBody=handleRequest(options,data);
    if(options.method=='POST'){
        options.body=getBody;
    }
    // return fetch(path+url,options).then(handleResponse);

    return Promise.race([
        fetch(path+url,options).then(handleResponse),
        new Promise((resolve,reject) => {
            setTimeout(
                () => {
                    reject()
                },
                timeoutVal
            )
        })
    ])
}

export default FetchFn
