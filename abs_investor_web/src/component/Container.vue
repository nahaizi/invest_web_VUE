<template>
    <div class="container">
        <div class="header flex-avg">
            <slot name="title">{{title}}</slot>
        </div>
        <div class="body" :class="bodyClass">
            <slot/>
        </div>
    </div>
</template>

<script>

    export default {
        props: {
            title: String,
            bodyClass: undefined,
        }
    }

</script>

<style lang="scss">
    @import "../../assets/variable";
    .container {
        margin: 5px;
        >.header{
            color: $titleColor;
            height: 70px;
            padding: 0 10px;
            font-size: 18px;
            justify-content: flex-start;
        }
        >.body{
            padding: 10px;
        }
    }
</style>
