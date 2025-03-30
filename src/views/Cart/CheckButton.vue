<template>
  <div class="cart-item-control">
    <el-checkbox 
      v-model="checked"
      :label="itemGid"
      @change="change"
      class="item-checkbox">
    </el-checkbox>
    <el-button 
      type="danger" 
      icon="el-icon-delete" 
      circle 
      class="delete-btn" 
      @click="delCart"
      aria-label="Delete item">
    </el-button>
  </div>
</template>

<script>
import store from '../../store/index'

export default {
  inject: ['reload'],

  data() {
    return {
      checked: false,
      sumPrice: 0,
      sunNum: '',
    }
  },

  props: ['itemGid', 'itemName', 'itemPrice', 'num'],

  methods: {
    change() {
      this.sumPrice = this.itemPrice * this.num
      this.sumNum = this.num
    
      this.$emit('sumPrice', this.itemGid, this.sumPrice, this.itemName, this.sumNum, this.checked)
    },

    delCart() {
      console.log(this.itemGid)
      this.$confirm('This operation will remove the item. Do you want to continue?', 'hint', {
          confirmButtonText: 'confirm',
          cancelButtonText: 'cancel',
          type: 'warning'
        }).then(() => {
          this.$api.delCart({
            gid: this.itemGid,
            uid: store.state.loginModule.userinfo.uid,
          }).then(res => {
            if(res.data.status === 200) {
                this.$message({
                type: 'success',
                message: 'Delete successfully'
              })
              this.reload()                  // 更新视图
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'Canceled'
          });          
        });
    }
  }
}
</script>

<style scoped>
  .cart-item-control {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 8px 0;
  }

  .item-checkbox {
    flex: 1;
  }

  .delete-btn {
    margin-left: 12px;
    flex-shrink: 0;
    transition: all 0.2s ease;
  }
  
  .delete-btn:hover {
    background-color: #f56c6c;
    color: #fff;
    transform: scale(1.05);
  }
  
  /* 高对比度模式适配 */
  @media (forced-colors: active) {
    .delete-btn {
      forced-color-adjust: none;
      background-color: ButtonFace;
      color: ButtonText;
      border: 1px solid ButtonText;
    }
    
    .delete-btn:hover {
      background-color: Highlight;
      color: HighlightText;
    }
  }
  
  /* 响应式调整 */
  @media (max-width: 768px) {
    .cart-item-control {
      padding: 6px 0;
    }
    
    .delete-btn {
      margin-left: 8px;
    }
  }
</style>