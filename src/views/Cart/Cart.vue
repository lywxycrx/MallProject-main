<template>
  <div class="cart-container">
    <h2 class="cart-title">{{ $t('cart.title') }}</h2>
    
    <div v-if="!cartList || cartList.length === 0" class="cart-empty">
      <h3>{{ $t('cart.empty') }}</h3>
    </div>
    
    <div v-else class="cart-content">
      <CartList 
        :cartList="cartList" 
        @sumPrice="sumPrice" 
        @synchronization="synchronization"
      ></CartList>
      
      <div class="pagination-container">
        <MyPage 
          :total="total" 
          :pageSize="pageSize" 
          @changePage="changePage" 
          :current-page="currentPage"
        ></MyPage>
      </div>
    </div>

    <div class="checkout-bar" :class="{ 'has-items': cartList && cartList.length > 0 }">
      <div class="checkout-details">
        <div class="checkout-items">
          <p>{{ $t('cart.checklist') }}:</p>
          <div class="items-list">{{totalNum}}</div>
        </div>
        <div class="checkout-total">
          <p>{{ $t('cart.total') }}:</p>
          <span class="total-amount">${{totalPrice}}</span>
        </div>
      </div>
      <el-button 
        type="primary" 
        class="checkout-btn" 
        :disabled="!cartList || cartList.length === 0"
        @click="selectStock">
        {{ $t('cart.checkout') }}
      </el-button>
    </div>
  </div>
</template>

<script>
import CartList from './CartList'
import MyPage from '../../components/MyPage.vue'
import store from '../../store/index'

export default {
  name: 'Cart',
  inject: ['reload'],

  components: {
    CartList,
    MyPage,
  },

  data() {
    return {
      cartList: [],
      currentPage: 1,
      total: 5,
      pageSize: 1,
      
      sum: 0,         // 总价
      byte: '',       // 清单字节
      gList: [],      // 清单
      idList: [],     // 选中的商品id
      numList: [],    // 选中的数量num
      stockList: [],  // 库存数量列表
      sumPriceList: [],
      disabled: ''
    };
  },

  computed: {
    totalPrice: function() {
      return parseFloat(this.sum).toFixed(2) 
    },

    totalNum: function() {
      return this.gList.join(", ");
    },

    totalId: function()  {
      return this.idList.join(",")
    },

    num: function()  {
      return this.numList.join(",")
    },
  },

  created() {
    this.getCart(1);
  },

  methods: {
    // 购物车数据绑定
    getCart(page) {
      this.$api.getCart({
        page,
        uid: store.state.loginModule.userinfo.uid
      }).then(res => {
        if(res.status == 200){
          this.cartList = res.data.data
          console.log(this.cartList)
          for(let i = 0; i < this.cartList.length; i++){
            let status = this.cartList[i].isEnabled
            console.log(status)
            if(status != 0){
              console.log(`${this.cartList[i].name} ${this.$t('cart.noLongerAvailable')}`)
              this.disabled = this.disabled + this.cartList[i].name + " " + this.$t('cart.noLongerAvailable')
              this.$api.delCart({
                gid: this.cartList[i].gid,
                uid: this.cartList[i].uid,
              }).then(res => {
                if(res.data.status === 200) {
                  this.cartList.splice(i, 1)
                  this.reload()                  // 更新视图
                }
              }).catch(err => {
                console.log(err)
              })
            }
          }
          if(this.disabled != ''){
            alert(this.disabled)
          }
          this.total = res.data.total;
          this.pageSize = res.data.pageSize;
        }
      })
    },

    // 购物车结算显示数据
    sumPrice(itemGid, sumPrice, itemName, sumNum, checked) {
      this.byte = itemName + '×' + sumNum
      if(checked === true){
        this.sum = this.sum + sumPrice
        this.sumPriceList = this.sumPriceList.concat(sumPrice)
        console.log(this.sumPriceList)
        this.gList = this.gList.concat(this.byte)
        this.idList = this.idList.concat(itemGid)
        this.numList = this.numList.concat(sumNum)
      } else {
        this.sum = this.sum - sumPrice
        this.sumPriceList.splice(this.sumPriceList.indexOf(sumPrice), 1);
        console.log(this.sumPriceList)
        this.gList.splice(this.gList.indexOf(this.byte), 1);
        this.idList.splice(this.idList.indexOf(itemGid), 1);
        this.numList.splice(this.numList.indexOf(sumNum), 1);
      }
    },
    
    synchronization(num, itemPrice, checked, sumNum, itemGid) {
      for(let i = 0; i < this.idList.length; i++){
        if(this.idList[i] == itemGid){
          let originalnum = this.numList[i]
          this.numList[i] = num
          let difference = num - originalnum
          this.sum += difference * itemPrice

          const x = this.gList[i].lastIndexOf('×');
          const str = this.gList[i].substring(0, x) + '×' + num
          this.$set(this.gList, i, str);

          this.$set(this.sumPriceList, i, num * itemPrice);
          console.log(this.sumPriceList)
        }
      }
    },

    // 查询库存数量后并生结算成订单
    selectStock() {
      for(let i=0; i<this.idList.length; i++) {
        this.$api.selectStock({
          gid: this.idList[i],
        }).then(res => {
          this.stockList.push(res.data.data)
        })
      }
      setTimeout(() => {
        for(let i=0; i<this.idList.length; i++) {
          if(this.stockList[i] < this.numList[i]) {
            this.$message.error(this.$t('cart.errors.exceedsStock'));
            this.stockList.length = 0
            return
          }else if(i+1 == this.idList.length) {
            this.stockList.length = 0
            this.settlement()
          }
        }
      }, 1000);
    },

    // 购物车结算事件
    settlement() {
      this.$api.addOrder({
        uid: store.state.loginModule.userinfo.uid,
        address: store.state.loginModule.userinfo.address,
        gid: this.idList,
        detail: this.totalNum,
        prcie: this.totalPrice,
        subtotal: this.sumPriceList.join(",")
      })
      .then((res) => {
        if(res.status == 200){
          console.log(this.$t('cart.messages.orderGenerated'))
          this.$api.delCart({
            uid: store.state.loginModule.userinfo.uid,
            gid: this.idList,
          }).then((res) => {
            if(res.status == 200){
              this.$message({
                type: 'success',
                message: this.$t('cart.messages.settlementSuccess')
              })
              setTimeout(() => {
                this.reload()
              }, 700);
            }
          })
        }else {
          this.$message.error(this.$t('cart.errors.settlementFailed'));
          return false; 
        }
      });
      for(let i=0; i<this.idList.length; i++) {
        this.$api.updateSales({
          gid: this.idList[i],
          num: this.numList[i],
        })
        this.$api.updateStock({
          gid: this.idList[i],
          num: this.numList[i],
        })
      }
    },

    // 页面改变
    changePage(num) {
      this.currentPage = num
      this.pageSize = this.pageSize;
      this.getCart(num);                //列表分页
    },
  },
};
</script>

<style scoped>
  /* 基础容器样式 */
  .cart-container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    position: relative;
    min-height: calc(100vh - 200px);
    padding-bottom: 80px; /* 为底部结算栏腾出空间 */
  }

  .cart-title {
    margin-bottom: 24px;
    color: #333;
    font-size: 24px;
    border-bottom: 1px solid #eee;
    padding-bottom: 12px;
  }

  /* 空购物车样式 */
  .cart-empty {
    text-align: center;
    padding: 40px 0;
    background-color: #f9f9f9;
    border-radius: 8px;
    margin: 20px 0;
  }

  .cart-empty h3 {
    color: #666;
    font-size: 18px;
  }

  /* 购物车内容区域 */
  .cart-content {
    margin-bottom: 80px;
  }

  /* 分页容器 */
  .pagination-container {
    margin-top: 30px;
    display: flex;
    justify-content: center;
  }

  /* 结算栏样式 */
  .checkout-bar {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    width: calc(100% - 40px);
    max-width: 1160px;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 15px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 10;
  }

  .checkout-details {
    display: flex;
    flex-direction: column;
    flex: 1;
    margin-right: 20px;
  }

  .checkout-items, .checkout-total {
    display: flex;
    align-items: center;
    margin-bottom: 6px;
  }

  .checkout-items p, .checkout-total p {
    font-size: 16px;
    color: #555;
    margin: 0;
    margin-right: 10px;
  }

  .items-list {
    font-size: 14px;
    color: #333;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 400px;
  }

  .total-amount {
    font-size: 20px;
    font-weight: bold;
    color: #e53935; /* 深红色，比原先的红色对比度更高 */
  }

  /* 高对比度模式适配 */
  @media (forced-colors: active) {
    .checkout-bar {
      border: 2px solid CanvasText;
    }
    
    .total-amount {
      color: CanvasText;
    }
    
    .checkout-btn {
      forced-color-adjust: none;
      color: Canvas;
      background-color: ButtonText;
      border-color: ButtonText;
    }
  }

  .checkout-btn {
    padding: 10px 30px;
    font-size: 16px;
    border-radius: 4px;
  }

  /* 响应式设计 */
  @media (max-width: 768px) {
    .cart-container {
      padding: 15px;
      padding-bottom: 100px;
    }
    
    .checkout-bar {
      flex-direction: column;
      padding: 12px;
      bottom: 10px;
    }
    
    .checkout-details {
      width: 100%;
      margin-right: 0;
      margin-bottom: 10px;
    }
    
    .checkout-btn {
      width: 100%;
    }
    
    .items-list {
      max-width: 250px;
    }
  }
</style>