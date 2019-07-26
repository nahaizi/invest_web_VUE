<template functional>
    <span>{{props.value | date(props.type.format)}}</span>
</template>
