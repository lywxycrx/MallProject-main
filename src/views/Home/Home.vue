<template>
  <div class="outDiv">
    <el-carousel :interval="4000" type="card" height="300px">
      <el-carousel-item v-for="item in 6" :key="item">
        <!-- <h3 class="medium">{{ item }}</h3> -->
      </el-carousel-item>
    </el-carousel>
    <div class="test">
    </div>
    <div class="test2">
    </div>
    <h2 style="text-align: center; color: black;">{{ $t('home.specials') }}</h2>
    <div class="lowDiv">
      <LowPrice></LowPrice>
    </div>
    <h2 style="text-align: center; color: black;">{{ $t('home.recommendGoods') }}</h2>
    <div class="belowDiv">
      <ShowRecommend></ShowRecommend>
    </div>
    <el-footer>
        <i class="el-icon-location">   {{ $t('home.footer.address') }}: XXXXXX-XXXXX-No.666</i>
        <i class="el-icon-phone">   {{ $t('home.footer.contact') }}: 1999911</i>
        <li class="el-icon-s-promotion">   {{ $t('home.footer.mail') }}: @554893.qq.com</li>
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

export default {
  components: {
    LowPrice,
    ShowRecommend,
  },
  data() {
    return {
      dialogVisible: false,

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
  }
}
</script>

<style scoped>
  /* 样式保持不变 */
  .test {
    position: absolute;
    background-image: url('../../assets/bg.jpg');
    background-size: cover;
    height: 360px;
    width: 180px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    /* margin-left: 85%; */
  }

  .test2 {
    position: absolute;
    background-image: url('../../assets/bg.jpg');
    background-size: cover;
    height: 360px;
    width: 180px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    margin-left: 85%;
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


/* 轮播图背景 */
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


/* 页面布局背景 */
  .el-footer {
    color: #333;
    text-align: center;
    line-height: 60px;
    width: 100%;

    display: flex;
    justify-content: space-around;
    /* justify-content: center;   子元素水平居中 */
    align-items: center;       /* 子元素垂直居中 */
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
  }
</style>