/**
 * author   lut000
 * date     2019/05/10
 * purpose  请求处理公用方法
 * */

export default function setParams(obj){                               //拼接对象为查询字符串
    let str='';
    if(typeof obj == 'object'){
        for(let key in obj){
            str+='&'+key+'='+obj[key];
        }
        return str.replace('&','?');
    }else{
        return str;
    }
}
