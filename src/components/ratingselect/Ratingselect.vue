<template>
  <div class="ratingselect">
    <div class="rating-type border-1px">
      <span @click="select(2,$event)" class="block positive" :class="{'active':selectType===2}">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
      <span @click="select(0,$event)" class="block positive" :class="{'active':selectType===0}">{{desc.positive}}<span class="count">{{positives.length}}</span></span>
      <span @click="select(1,$event)" class="block negative" :class="{'active':selectType===1}">{{desc.negative}}<span class="count">{{negatives.length}}</span></span>
    </div>
    <div @click="toggleContent" class="switch" :class="{'on':onlyContent===true}">
      <span class="icon-check_circle"></span>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const POSITIVE = 0 // 推荐或满意的评价类型
  const NEGATIVE = 1 // 吐槽或不满意的评价类型
  const ALL = 2 // 显示所有评价类型

  export default {
    props: {
      ratings: { // 具体评价内容
        type: Array,
        default() {
          return []
        }
      },
      selectType: { // 选择显示的评价类型
        type: Number,
        default: ALL
      },
      onlyContent: { // 是否只显示有内容的评价
        type: Boolean,
        default: false
      },
      desc: {
        type: Object,
        default() {
          return {
            all: '全部',
            positive: '满意',
            negative: '不满意'
          }
        }
      }
    },
    computed: {
      // 过滤ratings 只显示rateType为POSITIVE的评价
      positives() {
        return this.ratings.filter((rating) => {
          return rating.rateType === POSITIVE
        })
      },
      // 过滤ratings 只显示rateType为NEGATIVE的评价
      negatives() {
        return this.ratings.filter((rating) => {
          return rating.rateType === NEGATIVE
        })
      }
    },
    methods: {
      // 点击切换评价类型
      select(type, event) {
        if (!event._constructed) {
          return
        }
        // 派发事件 通知父组件food.vue selectType改变了
        // this.$root.eventHub.$emit('ratingType.select', type)
        this.$emit('rating-type-select', type)
      },
      // 点解切换是否只显示有内容的评价
      toggleContent() {
        if (!event._constructed) {
          return
        }
        // this.onlyContent = !this.onlyContent
        // 派发事件 通知父组件food.vue onlyContent改变了
        // this.$root.eventHub.$emit('content.toggle', this.onlyContent)
        this.$emit('content-toggle', !this.onlyContent)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus//mixin.styl';

  .ratingselect
    .rating-type
      padding: 18px 0;
      margin: 0 18px;
      border-1px(rgba(7,17,27,0.1));
      font-size: 0;
      .block
        display: inline-block;
        padding: 8px 12px;
        margin-right: 8px;
        border-radius: 1px;
        line-height: 16px;
        font-size: 12px;
        color: rgb(77,85,93);
        &.active
          color: #fff
        .count
          margin-left: 2px;
          font-size: 8px;
        &.positive
          background: rgba(0,160,200,0.1);
          &.active
            background: rgb(0,160,200);
        &.negative
          background: rgba(77,85,93,0.2);
          &.active
            background: rgb(77,85,93);
    .switch
      padding: 12px 18px;
      line-height: 24px;
      border-bottom: 1px solid rgba(7,17,27,0.1);
      color: rgb(147,153,159);
      font-size: 0;
      &.on
        .icon-check_circle
          color: #00c850
      .icon-check_circle
        display: inline-block;
        vertical-align: top;
        font-size: 24px;
        margin-right: 4px;
      .text
        display: inline-block;
        vertical-align: top;
        font-size: 12px;
</style>