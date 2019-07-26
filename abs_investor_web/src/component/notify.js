import {Notification}       from 'element-ui';

export default {
    success({message}){
        Notification.success({title: '成功', message});
    },
    warning({message}){
        Notification.warning({title: '警告', message});
    },
    error({message}){
        Notification.error({title: '错误', message});
    }
};

