<template>
    <div>
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name:'baseAsset',
        created (){
            this.$parent.tab='base';                        //设置父级tab值
        },
        data (){
            return {
                
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>
