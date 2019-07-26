<template functional>
    <el-tooltip :content="props.data[props.tipProp] || props.value" class="help" placement="top">
        <span>{{props.value}}<slot/></span>
    </el-tooltip>
</template>
