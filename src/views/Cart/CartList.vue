<template>
  <div>
    <cart-list-item v-for="item in cartList" 
    :key="item.iid" 
    :item-info="item"
    @sumPrice="sumPrice" @synchronization="synchronization"></cart-list-item>
  </div>
</template>

<script>
  // import Scroll from 'common/scroll/Scroll'
  import CartListItem from './CartListItem'

	export default {
		name: "CartList",
    components: {
		  CartListItem
    },

    data() {
      return {
        sum: 0,
        gNum: '',
      }
    },
    props: {
		  cartList: {
		    type: Array,
        default() {
		      return []
        }
      }
    },

    mounted() {
      // console.log('cartList:', this.cartList)
    },

    methods: {
      sumPrice(itemGid, sumPrice, itemName, sumNum, checked) {
        this.$emit('sumPrice', itemGid, sumPrice, itemName, sumNum, checked)
      },
      synchronization(num, itemPrice, checked, sumNum, itemGid){
        this.$emit('synchronization', num, itemPrice, checked, sumNum, itemGid)
      }
    },
	}
</script>

<style scoped>

</style>
