<template functional>
    <div class="not-found flex-avg">
        <span>404</span>
        <div class="tip">您访问的页面不存在！</div>
        <router-link to="/home" class="el-button el-button--text">回到首页</router-link>
    </div>
</template>

<style lang="scss">
    .not-found{
        height: 100vh;
        font-size: 1.2em;
        flex-direction: column;
        >span{
            font-size: 7em;
        }
        .el-button--text{
            font-size: inherit;
            margin-top: 5em;
        }
    }
</style>
