<template>
  <div class="cartcontrol">
    <transition name="move">
      <div class="cart-decrease" v-show="food.count>0" @click.stop.prevent="decreaseCart($event)">
        <span class="inner icon-remove_circle_outline"></span>
      </div>
    </transition>
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <div class="cart-add icon-add_circle" @click.stop.prevent="addCart($event)"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue'

  export default {
    props: {
      food: {
        type: Object
      }
    },
    methods: {
      // 增加商品
      addCart(event) {
        // 该组件所在面板goodsWrapper使用了BScroll 所以要先click:true
        // 再判断是不是PC端点击
        if (!event._constructed) {
          return
        }
        if (!this.food.count) {
          // 通过props传过来的数据 要添加/删除字段 得用Vue.set
          Vue.set(this.food, 'count', 1)
        } else {
          this.food.count++
        }
        // 派发事件
        // this.$root.eventHub.$emit('cart.add', event.target)
        this.$emit('cartadd', event.target)
      },
      // 减少商品
      decreaseCart(event) {
        if (!event._constructed) {
          return
        }
        if (this.food.count) {
          this.food.count--
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .cartcontrol
    font-size: 0;
    .cart-decrease
      display: inline-block
      padding: 6px;
      opacity: 1;
      .inner
        display: inline-block;
        font-size: 24px;
        line-height: 24px;
        color: rgb(0, 160, 220)
      &.move-enter-active,&.move-leave-active
        transform: translate3d(0, 0, 0)
        opacity: 1;
        transition: all 0.4s linear
        .inner
          transition: all 0.4s linear
          transform: rotate(0)
      &.move-enter,&.move-leave-to
        opacity: 0;
        transform: translate3d(24px, 0, 0)
        .inner
          transform: rotate(180deg)
    .cart-count
      display: inline-block
      vertical-align: top;
      width: 12px;
      padding-top: 6px;
      line-height: 24px;
      text-align: center;
      font-size: 10px;
      color: rgb(147, 153, 159)
    .cart-add
      display: inline-block
      font-size: 24px;
      line-height: 24px;
      padding: 6px;
      color: rgb(0, 160, 220)
</style>