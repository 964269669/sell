<template>
  <div>
    <div class="goods">
      <!-- 左侧菜单栏 -->
      <div class="menu-wrapper" ref="menuWrapper">
        <ul>
          <li v-for="(item,index) in goods" class="menu-item" :class="{'current':currentIndex===index}" @click="selectMenu(index,$event)">
            <span class="text border-1px">
              <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
            </span>
          </li>
        </ul>
      </div>
      <!-- 右侧商品栏 -->
      <div class="foods-wrapper" ref="foodsWrapper">
        <ul>
          <!-- food-list-hook这个类 表明是被js选择的，无实际样式意义 -->
          <li v-for="item in goods" class="food-list food-list-hook">
            <h1 class="title">{{item.name}}</h1>
            <ul>
              <li v-for="food in item.foods" class="food-item border-1px" @click="selectFood(food,$event)">
                <div class="icon">
                  <img :src="food.icon" width="57" height="57" alt="">
                </div>
                <div class="content">
                  <h2 class="name">{{food.name}}</h2>
                  <p class="desc">{{food.description}}</p>
                  <div class="extra">
                    <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
                  </div>
                  <div class="price">
                    <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                  </div>
                  <!-- 组件cartcontrol @cart.add="_drop" -->
                  <div class="cartcontrol-wrapper">
                    <cartcontrol :food="food" @cartadd="_drop"></cartcontrol>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <!-- 底部结算区域 -->
      <shopcart ref="shopcart" :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
    </div>
    <food :food="selectedFood" ref="food"></food>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import cartcontrol from 'components/cartcontrol/Cartcontrol'
  import shopcart from 'components/shopcart/Shopcart'
  import food from 'components/food/Food'

  const ERR_OK = 0

  export default {
    props: {
      seller: {
        type: Object // 从父组件App.vue中的router-view传来
      }
    },
    data() {
      return {
        goods: [], // 从服务器获取到的商品
        listHeight: [], // li的高度区间
        scrollY: 0, // 实时滚动Y值
        selectedFood: {}
      }
    },
    computed: {
      // 左侧菜单栏的当前索引
      currentIndex() {
        for (let i = 0; i < this.listHeight.length; i++) {
          let height1 = this.listHeight[i]
          let height2 = this.listHeight[i + 1]
          // 如果滚动到最后一个 i+1就是undefined的了
          if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            return i
          }
        }
        return 0 // 如果listHeight没有，返回0
      },
      // 选中的food
      selectFoods() {
        let foods = []
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            // 如果有count属性，说明点击了加号按钮
            if (food.count) {
              foods.push(food)
            }
          })
        })
        return foods
      }
    },
    created() {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']

      this.$http.get('api/goods').then((response) => {
        response = response.body
        if (response.errno === ERR_OK) {
          this.goods = response.data
          // 一定要在dom渲染后再计算
          this.$nextTick(() => {
            this._initScroll()
            this._calculateHeight()
          })
          // setTimeout(() => {
          //   this._initScroll()
          //   this._calculateHeight()
          // }, 20)
        }
      })
      // 接受cartcontrol中发送的数据
      // this.$root.eventHub.$on('cart.add', (target) => {
      //   this._drop(target)
      // })
      // this.$on('cart.add', (target) => {
      //   this._drop(target)
      // })
    },
    methods: {
      // 点左侧 右侧滚动到相应位置
      selectMenu(index, event) {
        // 浏览器原生事件没有_constructed属性,如果监听到是浏览器的事件 就return
        if (!event._constructed) {
          return
        }
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
        let el = foodList[index]
        // 调用BScroll的方法滚动
        this.foodsScroll.scrollToElement(el, 300)
      },
      // 进入商品详情页的
      selectFood(food, event) {
        if (!event._constructed) {
          return
        }
        this.selectedFood = food
        // 调用子组件food的方法
        this.$refs.food.show()
      },
      _drop(target) {
        // console.log(target)
        // 体验优化解决第一次点动画(两个动画一起执行)有点卡
        // 不让动画立即执行 异步执行
        this.$nextTick(() => {
          // 调用另一个子组件shopcart的drop方法
          this.$refs.shopcart.drop(target)
          // console.log(this.$refs.shopcart)
        })
      },
      // 初始化BScroll
      _initScroll() {
        this.menuScroll = new BScroll(this.$refs.menuWrapper, {
          click: true
        })

        this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
          probeType: 3, // 滚动的时候事实告诉我们滚动的位置
          click: true
        })
        // BScoll监听滚动事件 pos为实时滚动位置
        this.foodsScroll.on('scroll', (pos) => {
          this.scrollY = Math.abs(Math.round(pos.y))
        })
      },
      // 计算高度区间
      _calculateHeight() {
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
        let height = 0
        this.listHeight.push(height)
        for (let i = 0; i < foodList.length; i++) {
          let item = foodList[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
      }
    },
    components: {
      shopcart,
      cartcontrol,
      food
    // },
    // events: {
    //   'cart.add'(target) {
    //     this._drop(target)
    //   }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl";

  .goods
    display: flex;
    position: absolute;
    top: 174px;
    bottom: 46px;
    width: 100%;
    overflow: hidden;
    .menu-wrapper
      flex: 0 0 80px
      width: 80px;
      background: #f3f5f7;
      .menu-item
        display: table
        width: 56px;
        height: 54px;
        line-height: 14px;
        padding: 0 12px
        &.current
          position: relative;
          margin-top: -1px;
          z-index: 10;
          background: #fff;
          font-weight: 700;
          .text
            border-none()
        .icon
          display: inline-block
          vertical-align: top
          width: 12px
          height: 12px
          margin-right: 2px
          background-size: 12px 12px
          background-repeat: no-repeat
          &.decrease
            bg-image('decrease_3')
          &.discount
            bg-image('discount_3')
          &.guarantee
            bg-image('guarantee_3')
          &.invoice
            bg-image('invoice_3') 
          &.special
            bg-image('special_3')
        .text
          display: table-cell
          width: 56px;
          vertical-align: middle;
          border-1px(rgba(7, 17, 27, 0.2))
          font-size: 12px;
    .foods-wrapper
      flex: 1
      .title
        padding-left: 14px;
        height: 26px;
        line-height: 26px;
        border-left: 2px solid #d9dde1;
        font-size: 12px;
        color: rgb(147, 153, 159)
        background: #f3f5f7;
      .food-item
        display: flex
        margin: 18px;
        padding-bottom: 18px;
        border-1px(rgba(7, 17, 27, 0.2))
        &:last-child
          border-none()
          margin-bottom: 0;
        .icon
          flex: 0 0 57px
          width: 57px;
          margin-right: 10px;
        .content
          flex: 1
          .name
            margin: 2px 0 8px 0;
            height: 14px;
            line-height: 14px;
            font-size: 14px;
            color: rgb(7, 17, 27)
          .desc,.extra
            line-height: 10px;
            font-size: 10px;
            color: rgb(147, 153, 159)
          .desc
            margin-bottom: 8px;
            line-height: 12px;
          .extra
            .count
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
            right: 0;
            bottom: 12px;

            
</style>