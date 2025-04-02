<template>
  <div class="goods-detail-container" :class="{ 'high-contrast-mode': highContrastMode }">
    <!-- 商品基本信息区域 -->
    <div class="product-header">
      <h1 class="product-title">{{goodsData.name}}</h1>
      
      <div class="product-rating">
        <div v-if="goodsData.rating !== null">
          <el-rate
            v-model="goodsData.rating"
            disabled
            show-score
            text-color="#ff9900"
            score-template="{value}"
          ></el-rate>
        </div>
        <div v-else>
          <span>{{ $t('orders.details.noRating') }}</span>
        </div>
      </div>
    </div>
    
    <!-- 商品主区域：左侧轮播图，右侧信息 -->
    <div class="product-main-content">
      <!-- 左侧轮播图 -->
      <div class="product-gallery">
        <el-carousel :interval="4000" indicator-position="outside" height="400px">
          <h2 v-if="CarouselList.length==0" class="no-pictures-message">{{ $t('goods.noPictures') }}</h2>
          <el-carousel-item v-for="(item, index) in CarouselList" :key="index">
            <div class="carousel-image" :style="{ backgroundImage: 'url(' + item + ')' }"></div>
          </el-carousel-item>
        </el-carousel>
      </div>
      
      <!-- 右侧商品信息 -->
      <div class="product-info">
        <div class="price-section">
          <span class="price-label">{{ $t('goods.price') }}:</span>
          <span class="price-value">${{goodsData.price}}</span>
        </div>
        
        <div class="product-stats">
          <div class="stat-item">
            <i class="el-icon-shopping-cart-full"></i>
            <span>{{ $t('goods.unitsSold') }}: <strong>{{goodsData.sales}}</strong></span>
          </div>
          <div class="stat-item">
            <i class="el-icon-goods"></i>
            <span>{{ $t('goods.inventory') }}: <strong>{{goodsData.stock}}</strong></span>
          </div>
        </div>
        
        <!-- 加入购物车按钮 -->
        <div class="action-buttons">
          <el-button 
            :disabled="isAble" 
            v-show="state != 1" 
            type="primary"
            size="large"
            icon="el-icon-shopping-cart-2" 
            class="add-to-cart-btn" 
            :class="{ 'in-cart': !btnStatus }"
            :style="getStyle()" 
            @click="addCart" 
            v-if="isLoggedIn">
            {{btnText}}
          </el-button>
        </div>
      </div>
    </div>
    
    <!-- 商品详情选项卡 -->
    <div class="product-details">
      <el-tabs v-model="activeName" @tab-click="handleClick" class="product-tabs" type="border-card">
        <el-tab-pane :label="$t('goods.tabs.parameters')" name="first">
          <div class="tab-content-wrapper parameters-content">
            <h3 class="tab-section-title">{{ $t('goods.tabs.parameters') }}</h3>
            <div class="parameters-grid">
              <p class="tab-content-text">{{goodsData.parameter}}</p>
            </div>
          </div>
        </el-tab-pane>
        
        <el-tab-pane :label="$t('goods.tabs.introduction')" name="second">
          <div class="tab-content-wrapper introduction-content">
            <h3 class="tab-section-title">{{ $t('goods.tabs.introduction') }}</h3>
            <p class="tab-content-text">{{goodsData.introduction}}</p>
          </div>
        </el-tab-pane>
        
        <el-tab-pane :label="$t('goods.tabs.comments')" name="third">
          <div class="tab-content-wrapper comments-content">
            <div class="comments-header">
              <h3 class="tab-section-title">{{ $t('goods.tabs.comments') }}</h3>
              <el-button 
                type="primary" 
                v-show="state != 1" 
                icon="el-icon-edit" 
                @click="addComment" 
                class="add-comment-btn"
                v-if="bought">
                {{ $t('goods.addComment') }}
              </el-button>
            </div>
            
            <Dialog :dialogVisible="dialogVisible" :gid="gid" @changeDialog="changeDialog"></Dialog>
            <CommentList :commentList="commentList"  @addComment="addComment"></CommentList>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import CommentList from '../components/CommentList/CommentList.vue'
import Dialog from '../components/AddComments.vue'
import store from '../store/index'
import { mapGetters } from 'vuex';

export default {
  components: {
    CommentList,
    Dialog,
  },
  
  computed: {
    ...mapGetters(['highContrastMode'])
  },
  
  mounted() {
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    if(store.state.loginModule.userinfo.token){
      this.isLoggedIn = true
    }else{
      this.isLoggedIn = false
    }
  },
  
  data(){
    return {
      gid: null,
      goodsData:[],
      commentList: [],
      activeName: 'first',
      imgUrl: '',

      btnStatus: true,
      btnText: this.$t('goods.buttons.addToCart'),

      dialogVisible: false,

      state: store.state.loginModule.userinfo.type,
      isAble: false,
      CarouselList: [],
      isLoggedIn: false,
      bought: false
    }
  },

  watch: {
    '$i18n.locale': function(newVal) {
      // 当语言改变时，更新按钮文本
      this.updateButtonText();
    }
  },

  created() {
    this.gid = this.$route.params.gid
    this.$api.selectCart({
      uid: store.state.loginModule.userinfo.uid,
      gid: this.gid
    }).then(res => {
      if(res.data.status == 200){
        this.btnStatus = false;
        this.updateButtonText();
      }
    })

    this.isBought()

    this.$api.goodsDetail({
      gid: this.gid
    }).then(res => {
      this.goodsData = res.data.data[0];
      this.imgUrl = this.goodsData.img;
    }) 
    this.showComments(this.gid);
    this.fetchImages()
    console.log(this.CarouselList)
  },

  methods: {
    //检测用户是否购买过此商品
    isBought(){
      this.$api.searchOrderItem({
        uid: store.state.loginModule.userinfo.uid,
        gid: this.gid
      }).then(res => {
        if(res.data.status === 200){
          this.bought = true
        }else{
          this.bought = false
        }
      })
    },

    // 更新按钮文本，根据当前状态和语言
    updateButtonText() {
      if(this.goodsData && this.goodsData.stock === 0) {
        this.btnText = this.$t('goods.buttons.outOfStock');
      } else if(this.btnStatus === false) {
        this.btnText = this.$t('goods.buttons.deleteFromCart');
      } else {
        this.btnText = this.$t('goods.buttons.addToCart');
      }
    },

    handleClick(tab, event) {
      console.log(this.activeName);
    },

    // 展示评论
    showComments(gid) {
      this.$api.showComments({
          gid,
        }).then(res => {
          this.commentList = res.data.data
          if(res.status == 200){
            this.total = res.data.total;
            this.pageSize = res.data.pageSize;
          }
        })
    },

    // 添加评论
    addComment() {
      console.log('Button event triggered')
      this.dialogVisible = true
    },

    // 加入购物车
    addCart() {
      if(this.btnStatus) {
        let gid = this.gid
        let uid = store.state.loginModule.userinfo.uid
        let gname = this.goodsData.name
        let imgUrl = this.imgUrl
        this.$api.addCart({gid, uid, imgUrl, gname})
        .then((res) => {
          if(res.status == 200){
            this.btnStatus = false
            this.btnText = this.$t('goods.buttons.deleteFromCart')
            this.$message({
              message: this.$t('goods.messages.addSuccess'),
              type: 'success'
            });
          }
        });
      } else {
        let gid = this.gid
        let uid = store.state.loginModule.userinfo.uid          
        this.$api.delCart({gid, uid})
        .then((res) => {
          if(res.status == 200){
            this.btnStatus = true
            this.btnText = this.$t('goods.buttons.addToCart')
            this.$message({
              message: this.$t('goods.messages.deleteSuccess'),
              type: 'success'
            });
          }
        });
      }
    },

    changeDialog() {
      this.dialogVisible = false
    },

    getStyle() {
      if(this.goodsData.stock == 0) {
        this.isAble = true
        this.btnText = this.$t('goods.buttons.outOfStock')
      }else if(this.btnStatus === false) {
        return {background: '#f56c6c', borderColor: '#f56c6c'}
      }
    },
    
    handleVisibilityChange() {
      if (document.visibilityState === 'visible') {
        window.location.reload();
      }
    },

    fetchImages() {
      fetch(`/api/getCarouselImages/${this.gid}`) // 传递参数
        .then(response => response.json())
        .then(data => {
          this.images = data.map(fileName => {
            const imagePath = `http://localhost:8888/Carousel/${fileName}`;
            this.CarouselList.push(imagePath);
            // return imagePath;
          });
        }).catch(error => {
          console.error(this.$t('goods.errors.fetchImages'), error);
        });
    }
  }
}
</script>

<style>
/* 高对比度模式全局样式 */
.high-contrast-mode .product-title {
  color: #ffffff !important;
  background-color: #000000 !important;
  padding: 15px !important;
  margin-bottom: 20px !important;
  font-size: 28px !important;
  font-weight: bold !important;
  border-bottom: 3px solid #ffff00 !important;
}

.high-contrast-mode .price-value {
  color: #ffff00 !important;
  background-color: #000000 !important;
  font-size: 24px !important;
  font-weight: bold !important;
  padding: 10px !important;
  border: 2px solid #ffffff !important;
}

.high-contrast-mode .product-stats .stat-item {
  background-color: #000000 !important;
  color: #ffffff !important;
  border: 2px solid #ffffff !important;
  padding: 15px !important;
  font-size: 18px !important;
  font-weight: bold !important;
  margin-bottom: 10px !important;
  border-radius: 5px !important;
}

.high-contrast-mode .add-to-cart-btn {
  background-color: #ffff00 !important;
  color: #000000 !important;
  border: 3px solid #000000 !important;
  font-size: 18px !important;
  font-weight: bold !important;
  padding: 15px 30px !important;
}

.high-contrast-mode .add-to-cart-btn.in-cart {
  background-color: #ff0000 !important;
  color: #ffffff !important;
  border: 3px solid #ffffff !important;
}

.high-contrast-mode .add-to-cart-btn:disabled {
  background-color: #666666 !important;
  color: #ffffff !important;
  border: 3px solid #ffffff !important;
  opacity: 0.8 !important;
}

.high-contrast-mode .carousel-image {
  border: 3px solid #ffffff !important;
}

.high-contrast-mode .no-pictures-message {
  color: #ffff00 !important;
  font-size: 24px !important;
  font-weight: bold !important;
  background-color: #000000 !important;
  padding: 20px !important;
  border: 2px solid #ffffff !important;
}

/* 修复标签页样式 */
.high-contrast-mode .product-tabs {
  border: 3px solid #ffffff !important;
  background-color: #000000 !important;
}

.high-contrast-mode .product-tabs .el-tabs__header {
  background-color: #000000 !important;
  border-bottom: 3px solid #ffff00 !important;
}

.high-contrast-mode .product-tabs .el-tabs__item {
  font-size: 22px !important;
  color: #ffffff !important;
  padding: 15px 20px !important;
  background-color: #000000 !important;
}

.high-contrast-mode .product-tabs .el-tabs__item.is-active {
  color: #ffff00 !important;
  font-weight: bold !important;
  background-color: #000000 !important;
}

.high-contrast-mode .product-tabs .el-tabs__active-bar {
  background-color: #ffff00 !important;
  height: 4px !important;
}

/* 修复标签页内容区域 */
.high-contrast-mode .el-tabs__content {
  background-color: #000000 !important;
  color: #ffffff !important;
  border-top: 2px solid #ffffff !important;
  padding: 20px !important;
}

.high-contrast-mode .tab-content-wrapper {
  background-color: #000000 !important;
  color: #ffffff !important;
  padding: 15px !important;
  border-radius: 5px !important;
  border: 2px solid #ffffff !important;
}

.high-contrast-mode .tab-section-title {
  color: #ffff00 !important;
  font-size: 22px !important;
  margin-bottom: 15px !important;
  border-bottom: 2px solid #ffff00 !important;
  padding-bottom: 10px !important;
}

.high-contrast-mode .tab-content-text {
  color: #ffffff !important;
  font-size: 18px !important;
  line-height: 1.6 !important;
  margin: 0 !important;
  background-color: #000000 !important;
}

/* 添加评论按钮样式 */
.high-contrast-mode .add-comment-btn {
  background-color: #ffff00 !important;
  color: #000000 !important;
  border: 2px solid #000000 !important;
  font-size: 18px !important;
  font-weight: bold !important;
  padding: 10px 20px !important;
}

/* 确保评论列表在高对比度模式下可见 */
.high-contrast-mode .el-table {
  background-color: #000000 !important;
  color: #ffffff !important;
  border: 2px solid #ffffff !important;
}

.high-contrast-mode .el-table th,
.high-contrast-mode .el-table tr,
.high-contrast-mode .el-table td {
  background-color: #000000 !important;
  color: #ffffff !important;
  border-color: #ffffff !important;
}

.high-contrast-mode .el-table--striped .el-table__body tr.el-table__row--striped td {
  background-color: #333333 !important;
}

/* 确保对话框在高对比度模式下可见 */
.high-contrast-mode .el-dialog {
  background-color: #000000 !important;
  border: 3px solid #ffffff !important;
}

.high-contrast-mode .el-dialog__title {
  color: #ffff00 !important;
  font-size: 20px !important;
  font-weight: bold !important;
}

.high-contrast-mode .el-dialog__body {
  color: #ffffff !important;
}

.high-contrast-mode .el-input__inner,
.high-contrast-mode .el-textarea__inner {
  background-color: #000000 !important;
  color: #ffffff !important;
  border: 2px solid #ffffff !important;
}

.high-contrast-mode .el-form-item__label {
  color: #ffffff !important;
  font-weight: bold !important;
}
</style>

<style scoped>
/* 基本容器样式 */
.goods-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  color: #333;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

/* 商品头部区域 */
.product-header {
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eaeaea;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.product-title {
  font-size: 28px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
  flex: 1;
}

.product-rating {
  margin: 10px 0;
}

/* 主要内容区 - 布局 */
.product-main-content {
  display: flex;
  gap: 30px;
  margin-bottom: 40px;
}

@media (max-width: 768px) {
  .product-main-content {
    flex-direction: column;
  }
}

/* 左侧轮播图区域 */
.product-gallery {
  flex: 1;
  min-width: 0; /* 防止flex项目溢出 */
  background-color: #f9f9f9;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.carousel-image {
  height: 100%;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  background-color: #f9f9f9;
}

.no-pictures-message {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  text-align: center;
  color: #909399;
  font-size: 18px;
  background-color: #f9f9f9;
}

/* 右侧商品信息区域 */
.product-info {
  flex: 1;
  min-width: 0; /* 防止flex项目溢出 */
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.price-section {
  margin-bottom: 15px;
}

.price-label {
  font-size: 25px;
  color: #606266;
}

.price-value {
  font-size: 28px;
  font-weight: 600;
  color: #f56c6c;
  margin-left: 5px;
}

.product-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
}

.stat-item {
  flex: 1;
  min-width: 120px;
  padding: 15px;
  background-color: #f0f2f5;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.stat-item i {
  font-size: 24px;
  color: #409EFF;
}

.action-buttons {
  margin-top: auto; /* 推到底部 */
  display: flex;
  gap: 15px;
}

.add-to-cart-btn {
  flex: 1;
  height: 50px;
  font-size: 18px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.add-to-cart-btn.in-cart {
  background-color: #f56c6c;
  border-color: #f56c6c;
}

/* 商品详情标签页 */
.product-details {
  margin-top: 40px;
}

.product-tabs {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

.tab-content-wrapper {
  padding: 25px;
}

.tab-section-title {
  font-size: 20px;
  color: #303133;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eaeaea;
}

.tab-content-text {
  font-size: 16px;
  line-height: 1.8;
  color: #606266;
}

/* 参数部分特别样式 */
.parameters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 4px;
}

/* 评论部分特别样式 */
.comments-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.add-comment-btn {
  padding: 10px 20px;
  font-size: 14px;
}

/* 深度选择器以修改Element UI组件样式 */
::v-deep .el-carousel {
  border-radius: 8px;
  overflow: hidden;
}

::v-deep .el-carousel__indicators {
  margin-bottom: 15px;
}

::v-deep .el-tabs__item {
  height: 50px;
  line-height: 50px;
  font-size: 16px;
  font-weight: 500;
}

::v-deep .el-tabs__item.is-active {
  color: #409EFF;
  font-weight: bold;
}

::v-deep .el-tabs__active-bar {
  height: 3px;
}

::v-deep .el-rate__icon {
  font-size: 20px;
  margin-right: 5px;
}
</style>