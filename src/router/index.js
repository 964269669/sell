import Vue from 'vue'
import Router from 'vue-router'
import goods from 'components/goods/Goods.vue'
import seller from 'components/seller/Seller.vue'
import ratings from 'components/ratings/Ratings.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/goods',
      component: goods
    },
    {
      path: '/ratings',
      component: ratings
    },
    {
      path: '/seller',
      component: seller
    }
  ]
})
