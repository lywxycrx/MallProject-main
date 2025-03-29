<template>
  <div class="ouDiv">
    <h2>{{goodsData.name}}</h2>
      <el-row :gutter="20">
        <el-col :span="3"><div class="grid-content bg-purple">{{ $t('goods.price') }}: {{goodsData.price}}</div></el-col>
        <el-col :span="3"><div class="grid-content bg-purple">{{ $t('goods.unitsSold') }}: {{goodsData.sales}}</div></el-col>
        <el-col :span="3"><div class="grid-content bg-purple">{{ $t('goods.rating') }}: {{goodsData.score}}</div></el-col>
        <el-col :span="3"><div class="grid-content bg-purple">{{ $t('goods.inventory') }}: {{goodsData.stock}}</div></el-col>
      </el-row>
      <el-row :gutter="20"></el-row>

      <el-carousel :interval="4000" type="card" height="300px">
        <h2 v-if="CarouselList.length==0">{{ $t('goods.noPictures') }}</h2>
        <el-carousel-item v-for="(item, index) in CarouselList" :key="index" :style="{ backgroundImage: 'url(' + item + ')', backgroundSize: 'cover' }">
          <!-- <h3 class="medium">{{ index + 1 }}</h3> -->
        </el-carousel-item>
      </el-carousel>

      <div class="tabDiv">
        <el-button :disabled="isAble" v-show="state != 1" type="warning" icon="el-icon-star-off" class="collection" 
        :style="getStyle()" @click="addCart" v-if="isLoggedIn"> {{btnText}} 
        </el-button>

        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane :label="$t('goods.tabs.parameters')" name="first">{{goodsData.parameter}}</el-tab-pane>
          <el-tab-pane :label="$t('goods.tabs.introduction')" name="second">{{goodsData.introduction}}</el-tab-pane>
          <el-tab-pane :label="$t('goods.tabs.comments')" name="third">
            <el-button type="primary" v-show="state != 1" icon="el-icon-edit" @click="addComment">{{ $t('goods.addComment') }}</el-button>

            <Dialog :dialogVisible="dialogVisible" :gid="gid" @changeDialog="changeDialog"></Dialog>
            <CommentList :commentList="commentList"></CommentList>
          </el-tab-pane>
        </el-tabs>
      </div>
  </div>
</template>

<script>
import CommentList from '../components/CommentList/CommentList.vue'
import Dialog from '../components/AddComments.vue'
import store from '../store/index'

export default {
  components: {
    CommentList,
    Dialog,
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
      isLoggedIn: false
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
        return {background: 'red !important' }
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

<style scoped>
.ouDiv {
  width: 100%;
  position:absolute;
  color: #000;
  text-align: left;
  font-size: 20px;
}

.block {
  margin: 10px;
  right: 2%;
  margin-top: -12%;
  position: absolute;
  width: 45%;
  height: 350px;

  border: 1px solid rgb(235, 235, 235);
  border-radius: 10px 10px 10px 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  background-image: url('../assets/logo.png');
  background-size: cover;
}

.block img {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  max-width: 100%;
  max-height: 100%;
}

.collection {
  position: absolute;
  left: -1px;
  z-index: 9;
  margin-top: -18%;;
}

.tabDiv {
  position: relative;
  margin-top: 17%
}

::v-deep .el-tabs__item {
  font-size: 20px !important;
}

.el-row {
  margin-bottom: 30px;
}

.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.el-carousel {
  height: 300px; /* 确保轮播图的高度 */
  width: 600px;
}

.el-carousel__item {
  height: 100%; /* 确保每个项的高度 */
  display: flex;
  justify-content: center;
  align-items: center;
  color: white; /* 根据需要调整文字颜色 */
  background-size: contain !important; /* 保持图片宽高比，不裁剪 */
  background-position: center center; /* 确保图片居中 */
  background-repeat: no-repeat; /* 防止图片重复 */
  background-color: #000; /* 添加背景颜色，防止图片未完全填充时出现空白 */
}
</style>