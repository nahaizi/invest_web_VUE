<template>
    <div class="step flex-avg">
        <template v-for="(s, i) in list">
            <div v-if="0 < i" class="step-separate bg" :class="{active: s.active}"/>
            <div class="step-item" :class="{active: s.active}">
                <div class="icon bg flex-avg"><span>{{i + 1}}</span></div>
                <div class="title">{{s.title}}</div>
                <div class="date">{{s.date}}</div>
            </div>
        </template>
    </div>
</template>

<script>
    export default {
        props: {list: Array},
    }
</script>

<style lang="scss">
    @import "../../../assets/variable";
    .step{
        padding: 20px;
        align-items: flex-start;
        .bg{
            background-repeat: no-repeat;
            background-position: center;
        }
        .icon, .step-separate{
            height: 48px;
        }
        .step-separate{
            width: 143px;
            margin: 0 35px;
            background-image: url("../../../assets/imgs/arrow-gray.png");
            &.active{
                background-image: url("../../../assets/imgs/arrow-active.png");
            }
        }
        .step-item{
            color: $textColor;
            text-align: center;
            &.active{
                color: $primaryColor;
                .icon{
                    background-image: url("../../../assets/imgs/sign.png");
                }
                span{
                    display: none;
                }
            }
        }
        .icon {
            width: 51px;
            margin: auto;
            font-size: 18px;
            box-shadow: 0 0 5px 1px #E4E4E4;
            border-radius: 15px;
        }
        .title{
            margin: 24px 0 16px 0;
        }
        .date{
            color: #B6B6B6;
        }
    }
</style>
