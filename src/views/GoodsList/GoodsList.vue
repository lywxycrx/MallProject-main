<template>
  <div class="outDiv">
    <div class="searchDiv">
      <el-input :placeholder="$t('goodsList.searchPlaceholder')" @change="getSearch" v-model="input" clearable></el-input>
      <el-button type="primary" class="voice-btn" :class="{'listening': isListening}" @click="toggleVoiceInput">
        <i class="el-icon-microphone"></i>
      </el-button>
      <el-button type="primary" icon="el-icon-search">{{ $t('common.search') }}</el-button>
    </div>

    <el-tabs v-model="activeName" @tab-click="cHandleClick">
      <el-tab-pane :label="$t('goodsList.tabs.all')" name="全部"></el-tab-pane>
      <el-tab-pane :label="$t('goodsList.tabs.new')" name="1"></el-tab-pane>
      <el-tab-pane :label="$t('goodsList.tabs.popular')" name="2"></el-tab-pane>
      <el-tab-pane :label="$t('goodsList.tabs.recommend')" name="3"></el-tab-pane>
      <el-tab-pane :label="$t('goodsList.tabs.onSale')" name="4"></el-tab-pane>
      <el-tab-pane :label="$t('goodsList.tabs.lastFiveDays')" name="5"></el-tab-pane>
    </el-tabs>

    <div class="listDiv">
      <GoodsList :imgList="imgList" class="itemDiv"></GoodsList> 
    </div>
    <MyPage :total="total" :pageSize="pageSize" 
        @changePage="changePage" class="page" 
        :current-page="currentPage">
    </MyPage>
  </div> 
</template>

<script>
import GoodsList from '../../components/ShowList/List.vue'
import MyPage from '../../components/MyPage.vue'

export default {
  components: {
    GoodsList,
    MyPage,
  },

  data() {
    return {
      imgList: [],
      input: '',
      activeName: '全部',
      type: 'name',         // 查询时的字段

      total: 5,
      pageSize: 1,
      currentPage: 1,
      
      // 语音识别相关
      recognition: null,
      isListening: false,
      supportedLanguages: {
        'zh': 'zh-CN',
        'en': 'en-US',
        // 可以根据需要添加更多语言
      }
    }
  },

  computed: {
    // 获取当前语言的语音识别语言代码
    currentRecognitionLang() {
      const currentLocale = this.$i18n.locale;
      return this.supportedLanguages[currentLocale] || 'en-US'; // 默认使用英语
    }
  },

  methods: {
    showGoods(page) {
      console.log('showgoods执行=================')
      this.$api.showGoods({
        page,
      }).then(res => {
        if(res.status == 200){
          this.imgList = res.data.data
          this.total = res.data.total;
          this.pageSize = res.data.pageSize;
        }
      })
    },

    // 通过输入查询
    searchInput(val){
      if (!val) {
        this.showGoods(1);
        this.currentPage = 1;
        return;
      }
      this.$api
        .getSearch({
          search: val,
          type: this.type
        })
        .then((res) => {
          console.log("搜索---", res.data);
          this.currentPage = 1;
          if (res.data.status === 200) {
            this.imgList = res.data.data
            this.total = res.data.total;
            this.pageSize = res.data.pageSize;;
          } else {
            this.total = 1;
            this.pageSize = 1;
            this.$message.error(this.$t('goodsList.noProductError'));
            return false; 
          }
        });
    },

    // 改变传入的type值。调用输入查询方法
    getSearch(val) {
      this.type = 'name'
      this.searchInput(val)
    },

    // 类别查询
    cHandleClick() {
      if(this.activeName === '全部'){
        this.showGoods(1)
      }else{
        this.type = 'type';
        this.searchInput(this.activeName);
        this.type = 'name'
      }
    },

    // 页面改变
    changePage(num) {
      this.currentPage = num
      this.pageSize = this.pageSize;
      this.showGoods(num);                //列表分页
    },
    
    // 清理语音识别文本，移除结尾的标点符号
    cleanRecognitionText(text) {
      // 移除末尾的句号、问号、感叹号、逗号等常见标点
      return text.replace(/[.。,，?？!！;；:：'"''""]+$/g, '').trim();
    },
    
    // 初始化语音识别
    initSpeechRecognition() {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        this.$message.error(this.$t('common.browserNotSupported') || '您的浏览器不支持语音识别功能');
        return;
      }
      
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      
      // 根据当前语言设置语音识别语言
      this.recognition.lang = this.currentRecognitionLang;
      
      this.recognition.onresult = (event) => {
        let transcript = event.results[0][0].transcript;
        // 清理识别文本，移除结尾的标点符号
        transcript = this.cleanRecognitionText(transcript);
        this.input = transcript;
        this.getSearch(transcript);
        this.isListening = false;
      };
      
      this.recognition.onerror = (event) => {
        console.error('语音识别错误:', event.error);
        const errorMessage = this.$i18n.locale === 'zh' ? 
          '语音识别失败，请重试' : 
          'Voice recognition failed, please try again';
        this.$message.error(this.$t('common.voiceRecognitionError') || errorMessage);
        this.isListening = false;
      };
      
      this.recognition.onend = () => {
        this.isListening = false;
      };
    },
    
    // 切换语音输入
    toggleVoiceInput() {
      // 每次使用前都重新初始化，以确保使用最新的语言设置
      this.initSpeechRecognition();
      
      if (!this.recognition) {
        return; // 如果初始化失败则退出
      }
      
      if (this.isListening) {
        this.recognition.stop();
        this.isListening = false;
      } else {
        this.isListening = true;
        try {
          this.recognition.start();
          const speakMessage = this.$i18n.locale === 'zh' ? 
            '请开始说话...' : 
            'Please start speaking...';
          this.$message.info(this.$t('common.speakNow') || speakMessage);
        } catch (error) {
          console.error('语音识别启动失败:', error);
          const errorMessage = this.$i18n.locale === 'zh' ? 
            '语音识别启动失败' : 
            'Failed to start voice recognition';
          this.$message.error(this.$t('common.voiceRecognitionStartError') || errorMessage);
          this.isListening = false;
        }
      }
    }
  },

  created() {
    this.showGoods(1);
  },
  
  watch: {
    // 监听语言变化，更新语音识别语言
    '$i18n.locale'() {
      if (this.recognition) {
        this.recognition.lang = this.currentRecognitionLang;
      }
    }
  },
  
  beforeDestroy() {
    // 在组件销毁前停止语音识别
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }
}
</script>

<style scoped>
.outDiv {
  margin-top: 1%;
  margin: auto;
  min-height: 100vh; /* 让页面至少撑满视口 */
  width: 100%;
  display: flex;
  flex-direction: column;
}

.el-tabs__item {
  font-size: 10px !important;
}

.el-tabs__active-bar {
  top: 73% !important;
}

.el-tabs__nav-wrap::after {
  top: 73% !important;
}

.searchDiv {
  display: flex;
  margin-top: 1%;
}

.searchDiv button {
  margin-left: 20px;
  height: 40px;
  margin-top: 8px;
}

/* 语音按钮相关样式 */
.voice-btn {
  width: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.voice-btn.listening {
  background-color: #ff4949;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

/* 让商品列表区域根据内容自适应 */
.listDiv {
  width: 90%;
  margin: auto;
  flex-grow: 1; /* 让其随内容高度增长 */
  background: rgb(240, 239, 239);
}

.itemDiv {
  margin-top: 8%;
}

/* 让分页组件在商品列表结束后自然出现 */
.page {
  width: 100%;
  text-align: center;
  padding: 10px 0;
  background: white;
  margin-top: 20px; /* 让分页组件与商品列表有一点间距 */
}
</style>