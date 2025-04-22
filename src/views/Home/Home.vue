<template>
  <div class="outDiv">
    <el-carousel :interval="4000" type="card" height="300px">
      <el-carousel-item v-for="item in 6" :key="item">
        <img height="300" width="700" style="border: none;" @click="itemClick(item)">
      </el-carousel-item>
    </el-carousel>
    <div class="test" @click="itemClick('watch')" style="cursor: pointer;"></div>
    <div class="test2" @click="itemClick('watch')"></div>
    <h2 class="section-title">{{ $t('home.specials') }}</h2>
    <div class="lowDiv">
      <LowPrice></LowPrice>
    </div>
    <h2 class="section-title">{{ $t('home.recommendGoods') }}</h2>
    <div class="belowDiv">
      <ShowRecommend></ShowRecommend>
    </div>
    <el-footer class="page-footer" v-if="isLogin">
        <i class="el-icon-location footer-item">   {{ $t('home.footer.address') }}: XXXXXX-XXXXX-No.666</i>
        <i class="el-icon-phone footer-item">   {{ $t('home.footer.contact') }}: 1999911</i>
        <li class="el-icon-s-promotion footer-item">   {{ $t('home.footer.mail') }}: @554893.qq.com</li>
        <el-button type="primary" round @click="dialog" icon="el-icon-upload" class="fbbtn">{{ $t('home.footer.feedback') }}</el-button>
    </el-footer>

    <el-dialog
        :title="$t('home.feedback.title')"
        :visible.sync="dialogVisible"
        width="50%"> 

          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item :label="$t('home.feedback.label')" prop="content">
              <el-input type="textarea" 
              maxlength="300"
              show-word-limit 
              v-model="ruleForm.content"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')" 
              style="float: right; margin-top: 30px">{{ $t('home.feedback.submit') }}
              </el-button>
            </el-form-item>
          </el-form>
    </el-dialog>
  </div>
</template>

<script>
import LowPrice from './LowPrice.vue'
import ShowRecommend from './ShowRecommend.vue'
import { mapGetters } from 'vuex';
import store from '../../store/index'

export default {
  components: {
    LowPrice,
    ShowRecommend,
  },
  
  computed: {
    ...mapGetters(['highContrastMode'])
  },
  
mounted() {
    // 检查是否登录
    if (this.$store.state.loginModule.userinfo.token) {
      this.isLogin = true;
    } else {
      this.isLogin = false;
    }
  },

  data() {
    return {
      dialogVisible: false,

      // 是否登录
      isLogin: false,

      ruleForm: {
        content: ''
      },

      rules: {
        content: [
          { required: true, message: this.$t('home.feedback.validation.required'), trigger: 'blur' },
        ],
      },
    }
  },

  // 监听语言变化，更新rules中的message
  watch: {
    '$i18n.locale': function(newVal) {
      this.updateValidationMessages();
    }
  },

  created() {
    this.updateValidationMessages();
  },

  methods: {
    // 更新验证消息以支持实时语言切换
    updateValidationMessages() {
      this.rules.content[0].message = this.$t('home.feedback.validation.required');
    },
    
    dialog() {
      this.dialogVisible = true
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log('进入提交阶段')
          let content = this.ruleForm.content;
          this.$api.addFeedback({
            content,
          })
          .then((res) => {
            if(res.status == 200){
              this.$message({
                type: 'success',
                message: this.$t('home.feedback.successMessage')
              })
            }
          }) 
        }
      })
    },
    itemClick(item) {
      console.log(item)
      let Gid = 0
      if(item == 'watch'){
        Gid = 44
      }else if(item%2 != 0){
        Gid = 57
      }else{
        Gid = 56
      }
      let routeData = this.$router.resolve({
        path: '/GoodsDetail/' + Gid,
      })
      window.open(routeData.href, '_blank') 
    },
  }
}
</script>

<style>
/* 高对比度模式样式 */
.high-contrast-mode .section-title {
  color: #ffffff !important;
  background-color: #000000 !important;
  padding: 10px !important;
  margin: 20px 0 !important;
  font-size: 24px !important;
  font-weight: bold !important;
  border-bottom: 3px solid #ffff00 !important;
  text-align: center !important;
}

.high-contrast-mode .page-footer {
  background-color: #000000 !important;
  color: #ffffff !important;
  border-top: 3px solid #ffff00 !important;
}

.high-contrast-mode .footer-item {
  color: #ffffff !important;
  font-size: 16px !important;
  font-weight: bold !important;
}

.high-contrast-mode .fbbtn {
  background-color: #ffff00 !important;
  color: #000000 !important;
  border: 2px solid #ffff00 !important;
  font-weight: bold !important;
  font-size: 16px !important;
}

.high-contrast-mode .fbbtn:hover {
  background-color: #000000 !important;
  color: #ffff00 !important;
}

.high-contrast-mode .el-carousel__item {
  border: 3px solid #ffffff !important;
}

.high-contrast-mode .test,
.high-contrast-mode .test2 {
  border: 3px solid #ffffff !important;
  filter: contrast(1.5) brightness(1.2) !important;
}

/* 高对比度模式下的弹窗样式 */
.high-contrast-mode .el-dialog {
  background-color: #000000 !important;
  border: 3px solid #ffffff !important;
}

.high-contrast-mode .el-dialog__title {
  color: #ffff00 !important;
  font-size: 20px !important;
  font-weight: bold !important;
}

.high-contrast-mode .el-form-item__label {
  color: #ffffff !important;
  font-size: 16px !important;
  font-weight: bold !important;
}

.high-contrast-mode .el-textarea__inner {
  background-color: #000000 !important;
  color: #ffffff !important;
  border: 2px solid #ffffff !important;
}
</style>

<style scoped>
  /* 标题样式 */
  .section-title {
    text-align: center; 
    color: black;
    margin: 20px 0;
    padding: 10px;
  }
  
  /* 页脚样式 */
  .page-footer {
    color: #333;
    text-align: center;
    line-height: 60px;
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
  
  .footer-item {
    display: inline-flex;
    align-items: center;
  }
  
  /* 轮播图背景 */
  .test {
    position: absolute;
    background-image: url('../../assets/bg.jpg');
    background-size: cover;
    height: 360px;
    width: 180px;
    border-width: 100px;
    border-color: black;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    cursor: pointer;
    z-index: 2
  }

  .test2 {
    position: absolute;
    background-image: url('../../assets/bg.jpg');
    background-size: cover;
    height: 360px;
    width: 180px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    margin-left: 85%;
    cursor: pointer;
    z-index: 2
  }

  .outDiv {
    margin-top: 1%;
    margin: auto;
    height: 100%;
    width: 100%;
    position:absolute;
  }

  .belowDiv {
    width: 90%;
    margin-left: 7%;
    height: 250px;
    margin-top: 10%;
  }

  .lowDiv {
    width: 85%;
    height: 250px;
    margin: auto;
    position: relative;
    margin-top: -2%;
  }

  .second {
    width: 85%;
    height: 350px;
    margin: 1%;
    background-color: antiquewhite;
    position: relative;
    margin-top: 0%;
    float: left;
  }

  .itemDiv {
    height: 39%;
  }


  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
  }
  
  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
    background-image: url('../../assets/item1.jpg');
    background-size: cover;
  }
  
  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
    background-image: url('../../assets/item2.jpg');
    background-size: cover;
  }

  .fbbtn {
    z-index: 99999;
  }
</style>