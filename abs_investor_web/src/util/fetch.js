/*
* JSON.stringify
* 1）忽略以$开头的key值
* 2）忽略value为空的key值
* */
let isEmpty = v => v === undefined || v === '' || v === null,
    except = (k, v) => k.startsWith('$') || isEmpty(v),
    ignore = (key, val) => except(key, val) ? undefined : val,
    headers = new Headers({'Content-Type': 'application/json;charset=UTF-8'});

const PUT = {method: 'PUT'}, DELETE = {method: 'DELETE'},
    parseJSON      = obj => JSON.stringify(obj, ignore),
    getMethod      = (entity = {}) => Object.entries(entity).reduce((r, [k, v]) => r + (except(k, v) ? '' : `${k}=${encodeURIComponent(v)}&`), '?').slice(0, -1),
    putMethod      = (entity = {}, parse = parseJSON, method = 'PUT') => ({method, body: parse(entity), headers}),
    postMethod     = (entity, parse) => putMethod(entity, parse, 'POST');

/*
* chain of responsibility
* */
const handleResponseType = (() => {

    class ContentType {

        constructor(next){
            this.next = next;
        }

        handle(){}

        isCanHandle(){}

        exec(r, type = r.headers.get('content-type')){
            return this.isCanHandle(type) ? this.handle(r) : this.next.exec(r, type);
        }

    }

    class JsonContent extends ContentType {

        handle(r){
            return r.json();
        }

        isCanHandle(type){
            return /(text|application)\/json(;charset=utf-8)?/i.test(type);
        }

    }

    class BlobContent extends ContentType {

        handle(r){
            return r.blob().then(file => ({code: 200, data: {file, name: this.getFileName(r)}}));
        }

        getFileName(r){
            return decodeURIComponent(r.headers.get('content-disposition').replace(/.+filename=([\w.%-]+)$/, '$1'));
        }

        isCanHandle(type){
            let blobTypes = ['application/vnd.ms-excel'];
            return _.some(blobTypes, b => type.includes(b));
        }

    }

    class ExceptContent extends ContentType {

        exec(){
            return Promise.reject({message: 'unsupported content-type'});
        }

    }

    let handles = [JsonContent, BlobContent],
        handle = handles.reduceRight((r, h) => new h(r), new ExceptContent());

    return handle.exec.bind(handle);

})();

export {
    PUT,
    DELETE,
    getMethod,
    putMethod,
    postMethod,
    handleResponseType,
}
