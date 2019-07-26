<template functional>
    <span class="anchor pointer" @click="props.click">{{props.text}}</span>
</template>

<style lang="scss">
    @import "../../../assets/variable";
    .anchor{
        color: $primaryColor;
    }
</style>
