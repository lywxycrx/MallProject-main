<template>
  <div id="shop-item">
    <div class="item-selector">
      <CheckButton :itemPrice="itemPrice" :itemGid="itemGid" :itemName="itemName" @sumPrice="sumPrice" :num="num" ></CheckButton>
    </div>

    <div class="item-img">
      <el-link @click="itemClick">
        <img :src="itemInfo.img" alt="Product pictures">
      </el-link>
    </div>

    <div class="item-info">
      <el-link @click="itemClick">
      <div class="item-title">{{itemInfo.name}}</div>
        <div class="item-desc"><b>{{$t('orders.details.productDescription')}}</b> {{itemInfo.introduction}}</div>
        <div class="info-bottom">
          <div class="item-price left">${{itemInfo.price}}</div>
        </div>
      </el-link>
    </div>

    <el-input-number class="numSelect" size="small" v-model="num" :min="1" @change="synchronization"></el-input-number>
  </div>
</template>

<script>
  import CheckButton from './CheckButton.vue'
  import GoodsDetail from '../../components/GoodsDetail.vue'

  export default {
    name: "ShopCartItem",
    data() {
      return {
        itemGid: this.itemInfo.gid,
        itemName: this.itemInfo.name,
        itemPrice: this.itemInfo.price,
        num: this.itemInfo.number,
        sum: 0,
        gNum: '',
        checked: false
      }
    },

    props: {
      itemInfo: Object
    },
    components: {
      CheckButton,
      GoodsDetail
    },


    created() {
      // console.log('itemInfo:', this.itemInfo)
    },

    methods: {
      sumPrice(itemGid, sumPrice, itemName, sumNum, checked) {
        this.$emit('sumPrice',itemGid, sumPrice, itemName, sumNum, checked)
        this.checked = checked
        this.sumNum = sumNum
        this.itemGid = itemGid
      },
      synchronization(num, itemPrice, checked, sumNum, itemGid){
        this.$emit('synchronization', num, this.itemPrice, this.checked, this.sumNum, this.itemGid)
      },
      itemClick() {
        let routeData = this.$router.resolve({
          path: '/GoodsDetail/' + this.itemGid,
        })
        window.open(routeData.href, '_blank')
      },
    }
  }
</script>

<style scoped>
  #shop-item {
    width: 100%;
    display: flex;
    margin-left: 5%;
    font-size: 0;
    padding: 5px;
    border-bottom: 1px solid #ccc;
  }

  .item-selector {
    width: 3%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .item-title {
    overflow: hidden;
    white-space: nowrap;
    font-size: 15px; /* 调整字体大小 */
    font-weight: bold; /* 设置加粗 */
}

  .item-desc {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .item-img {
    padding: 5px;
    /*border: 1px solid #ccc;*/
  }

  .item-img img {
    width: 100px;
    height: 130px;
    display: block;
    border-radius: 5px;
  }

  .item-info {
    display: flex;
    justify-content: left;
    font-size: 17px;
    color: #333;
    padding: 5px 10px;
    position: relative;
    overflow: hidden;
    width: 60%;
  }

  .item-info .item-desc {
    position: absolute;
    font-size: 14px;
    color: #666;
    margin-top: 9%;
  }

  .info-bottom {
    margin-top: 10px;
    position: absolute;
    /* bottom: 10px; */
    /* left: 10px; */
    /* right: 10px; */
  }

  .info-bottom .item-price {
    color: orangered;
    margin-top: 50%;
    /* margin-bottom: 50%; */
    /* margin-right: 10%; */
  }

  .numSelect {
    margin-top: 6%;
    margin-left: 2%
  }
</style>
