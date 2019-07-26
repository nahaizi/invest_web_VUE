<template functional>
    <svg class="radio" :style="{width: props.size, height: props.size}" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" version="1.1">
        <defs>
            <linearGradient id="gradient">
                <stop offset="0" :stop-color="props.startColor"/>
                <stop offset="1" :stop-color="props.endColor"/>
            </linearGradient>
        </defs>
        <path
            d="m512 5c-280 0-507 227-507 507 0 280 227 507 507 507 280 0 507-227 507-507 0-280-227-507-507-507zm0 941c-239 0-434-195-434-434 0-239 195-434 434-434 239 0 434 195 434 434 0 239-195 434-434 434zm0-616c-100 0-182 81.6-182 182s81.6 182 182 182 182-81.6 182-182-81.6-182-182-182z"
            fill="currentColor"
        />
    </svg>
</template>

<style lang="scss">
    .current-row svg.radio path{
        fill: url(#gradient);
    }
</style>
