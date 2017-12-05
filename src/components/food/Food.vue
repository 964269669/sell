<template>
  <transition name="move">
    <div class="food" v-show="showFlag" ref="food">
      <div class="food-content">
        <div class="image-header">
          <img :src="food.image">
          <div class="back" @click="hide">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <div class="content">
          <h1 class="title">{{food.name}}</h1>
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}份</span>
            <span class="rating">好评率{{food.rating}}%</span>
          </div>
          <div class="price">
            <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
          </div>
          <div class="cartcontrol-wrapper">
            <cartcontrol :food="food"></cartcontrol>
          </div>
          <transition name="fade">
            <div @click.stop.prevent="addFirst" class="buy" v-show="!food.count || food.count===0">加入购物车</div>
          </transition>
        </div>
        <!-- split组件 -->
        <split v-show="food.info"></split>
        <div class="info" v-show="food.info">
          <h1 class="title">商品信息</h1>
          <p class="text">{{food.info}}</p>
        </div>
        <split></split>
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <ratingselect :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="food.ratings" @rating-type-select="ratingTypeSelect" @content-toggle="contentToggle"></ratingselect>
          <div class="rating-wrapper">
            <ul v-show="food.ratings && food.ratings.length">
              <li v-show="needShow(rating.rateType,rating.text)" v-for="rating in food.ratings" class="rating-item border-1px">
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img :src="rating.avatar" width="12" height="12" class="avatar">
                </div>
                <div class="time">{{rating.rateTime | formateDate}}</div>
                <p class="text">
                  <span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>{{rating.text}}
                </p>
              </li>
            </ul>
            <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评论</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue'
  import BScroll from 'better-scroll'
  import {formateDate} from 'common/js/date'
  import cartcontrol from 'components/cartcontrol/Cartcontrol'
  import split from 'components/split/Split'
  import ratingselect from 'components/ratingselect/Ratingselect'

  // const POSITIVE = 0
  // const NEGATIVE = 1
  const ALL = 2

  export default {
    props: {
      food: {
        type: Object
      }
    },
    data() {
      return {
        showFlag: false,
        selectType: ALL, // 选择的评价类型
        onlyContent: true, // 只看有评论的内容
        desc: {
          all: '全部',
          positive: '推荐',
          negative: '吐槽'
        }
      }
    },
    methods: {
      show() {
        this.showFlag = true
        // 每次展示的时候初始化评论类型
        this.selectType = ALL // 选择的评价类型
        this.onlyContent = true // 只看有评论的内容
        // 页面展示的时候初始化BScroll
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.food, {
              click: true
            })
          } else {
            this.scroll.refresh()
          }
        })
      },
      hide() {
        this.showFlag = false
      },
      addFirst(event) {
        if (!event._constructed) {
          return
        }
        this.$root.eventHub.$emit('cart.add', event.target)
        Vue.set(this.food, 'count', 1)
      },
      // 监听子组件rating-type-select的回调函数
      ratingTypeSelect(type) {
        this.selectType = type
      },
      // 监听子组件content-toggle的回调函数
      contentToggle(onlyContent) {
        this.onlyContent = onlyContent
      },
      // 控制需要显示的评论类型
      needShow(type, text) {
        if (this.onlyContent && !text) {
          return false
        }
        if (this.selectType === ALL) {
          return true
        } else {
          return type === this.selectType
        }
      }
    },
    created() {
      // 接受ratingselect中发送的数据
      // this.$root.eventHub.$on('ratingType.select', (type) => {
      //   this.selectType = type
      // })

      // 接受ratingselect中发送的数据
      // this.$root.eventHub.$on('content.toggle', (onlyContent) => {
      //   this.onlyContent = onlyContent
      // })
    },
    filters: {
      formateDate(time) {
        let date = new Date(time)
        return formateDate(date, 'yyyy-MM-dd hh:mm')
      }
    },
    components: {
      cartcontrol,
      split,
      ratingselect
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl";

  .food
    position: fixed;
    left: 0;
    top: 0;
    bottom: 48px;
    z-index: 30;
    width: 100%
    background: #fff;
    transform: translate3d(0, 0, 0)
    &.move-enter-active,&.move-leave-active
      transition: all 0.2s linear
      transform: translate3d(0, 0, 0)
    &.move-enter,&.move-leave-to
      transform: translate3d(100%, 0, 0)
    .image-header
      position: relative;
      width: 100%;
      /* 小技巧 图片不能设置高，但还要留有高度的空间 给padding/margin设百分比，值相对于父元素的width */
      height: 0;
      padding-top: 100%;
      img
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      .back
        position: absolute;
        top: 10px;
        left: 0;
        .icon-arrow_lift
          display: block;
          padding: 10px;
          font-size: 20px;
          color: #fff;
    .content
      position: relative;
      padding: 18px;
      .title
        line-height: 14px;      
        margin-bottom: 8px;
        font-size: 14px;
        font-weight: 700;
        color: rgb(7, 17, 27);
      .detail
        margin-bottom: 18px;
        line-height: 10px;
        height: 10px;
        font-size: 0;
        .sell-count,.rating
          font-size: 10px;
          color: rgb(147, 153, 159);
        .sell-count
          margin-right: 12px;
      .price
        font-weight: 700;
        line-height: 24px;
        .now
          margin-right: 18px;
          font-size: 14px;
          color: rgb(240, 20, 20)
        .old
          text-decoration: line-through;
          font-size: 10px;
          color: rgb(147, 153, 159)
      .cartcontrol-wrapper
        position: absolute;
        right: 12px;
        bottom: 12px;
      .buy
        position: absolute;
        right: 18px;
        bottom: 18px;
        z-index: 10;
        height: 24px;
        line-height: 24px;
        padding: 0 12px;
        box-sizing: border-box;
        font-size: 10px;
        border-radius: 12px
        color: #fff;
        background: rgb(0, 160, 220);
        opacity: 1;
        &.fade-enter-active,&.fade-leave-active
          transition: all 0.2s
          opacity: 1;
        &.fade-enter,&.fade-leave-to
          opacity: 0;
    .info
      padding: 18px;
      .title
        line-height: 14px;
        margin-bottom: 6px;
        font-size: 14px;
        color: rgb(7, 17,27);
      .text
        line-height: 24px;
        font-size: 12px;
        padding: 0 8px;
        color: rgb(77, 85,93);
    .rating
      padding-top: 18px;
      .title
        line-height: 14px;
        margin-left: 18px;
        font-size: 14px;
        color: rgb(7, 17, 27)
      .rating-wrapper
        padding: 0 18px;
        .rating-item
          position: relative;
          padding: 16px 0;
          border-1px(rgba(7,17,27,0.1))
          .user
            position: absolute;
            right: 0;
            top: 16px;
            line-height: 12px;
            font-size: 0;
            .name
              display: inline-block;
              margin-right: 6px;
              vertical-align: top;
              font-size: 10px;
              color: rgb(147,153,159);
            .avatar
              border-radius: 50%
          .time
            margin-bottom: 6px;
            line-height: 12px;
            font-size: 10px;
            color: rgb(147,153,159)
          .text
            line-height: 16px;
            font-size: 12px;
            color: rgb(7,17,27);
            .icon-thumb_up,.icon-thumb_down
              margin-right: 4px;
              line-height: 16px;
              font-size: 12px;
            .icon-thumb_up
              color: rgb(0,160,220)
            .icon-thumb_down
              color: rgb(147,153,159)
        .no-rating
          font-size: 12px;
          padding: 16px 0;
          color: rgb(147,153,159);
</style>