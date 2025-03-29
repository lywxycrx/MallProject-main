<template>
  <div class="outside">
    <el-tabs>
      <el-tab-pane :label="$t('personal.tabs.info')">
        <el-row :gutter="20">
          <el-col :span="4">
            <div class="grid-content" v-if="!!userData[0]">
              {{ $t('personal.account') }}: {{userData[0].uid}}  
            </div>
          </el-col>
        </el-row>

        <el-row :gutter="200">
          <el-col :span="8">
            <div class="grid-content" v-if="!!userData[0]">{{ $t('personal.name') }}: {{userData[0].name}}
              <el-button class="editBtn" icon="el-icon-edit" @click="changeName"></el-button>
            </div>
          </el-col>

          <el-col :span="8">
            <div class="grid-content" v-if="!!userData[0]">{{ $t('personal.gender') }}:{{userData[0].sex}}
              <el-button class="editBtn" icon="el-icon-edit" @click="changeSex"></el-button>
            </div>
          </el-col>
        </el-row>

        <el-row :gutter="200"> 
          <el-col :span="8">
            <div class="grid-content" v-if="!!userData[0]">
              {{ $t('personal.phone') }}: {{userData[0].phone}}
              <el-button class="editBtn" icon="el-icon-edit" @click="changePhone"></el-button>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content" v-if="!!userData[0]">{{ $t('personal.address') }}:{{userData[0].address}}
              <el-button class="editBtn" icon="el-icon-edit" @click="changeAddress"></el-button>
            </div>
          </el-col>
        </el-row>
        <ChangeMessage 
          :tableName="tableName" 
          :nDialog='nDialog' 
          :aDialog="aDialog" 
          :pDialog="pDialog" 
          :sDialog="sDialog" 
          @changeDialog="changeDialog">
        </ChangeMessage>  
        
      </el-tab-pane>
      <el-tab-pane :label="$t('personal.tabs.password')">
        <el-row :gutter="150">
          <div>
            <ChangePassword :tableName="tableName"></ChangePassword>
          </div>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import ChangePassword from './ChangePassword.vue' 
import ChangeMessage from './ChangeMessage.vue'
import { mapGetters } from 'vuex';

export default {
  components: {
    ChangePassword,
    ChangeMessage
  },

  props: {
    userData: {
      type: Array,
      default() {
        return ''
      }
    },
    tableName: {
      type: String,
      default() {
        return ''
      }
    },
  },
  
  computed: {
    ...mapGetters(['highContrastMode'])
  },
  
  data() {
    return {
      nDialog: false,
      sDialog: false,
      aDialog: false,
      pDialog: false,
      eDialog: false,
    }
  },

  methods: {
    // 修改弹窗状态
    changeDialog(){
      this.nDialog = false;
      this.sDialog = false;
      this.aDialog = false;
      this.pDialog = false;
      console.log('changeDialog()事件接收了！')
    },

    changeName() {
      this.nDialog = true
    },

    changeSex() {
      this.sDialog = true
    },

    changeAddress() {
      this.aDialog = true
    },

    changePhone() {
      this.pDialog = true
    },
  }
}
</script>

<style>
/* 高对比度模式下的样式 */
.high-contrast-mode .outside .grid-content {
  background-color: #000000 !important;
  color: #ffffff !important;
  border: 2px solid #ffffff !important;
  border-radius: 8px !important;
  padding: 15px !important;
  margin-bottom: 15px !important;
  font-size: 16px !important;
  font-weight: bold !important;
}

.high-contrast-mode .outside .editBtn {
  background-color: #000000 !important;
  color: #ffff00 !important;
  border: 2px solid #ffff00 !important;
  padding: 5px 10px !important;
  margin-left: 10px !important;
}

.high-contrast-mode .outside .editBtn:hover {
  background-color: #ffff00 !important;
  color: #000000 !important;
}

.high-contrast-mode .outside .el-tabs__item {
  color: #ffffff !important;
  font-size: 16px !important;
  font-weight: bold !important;
}

.high-contrast-mode .outside .el-tabs__item.is-active {
  color: #ffff00 !important;
}

.high-contrast-mode .outside .el-tabs__active-bar {
  background-color: #ffff00 !important;
  height: 3px !important;
}
</style>

<style scoped>
  .outside {
    position: absolute;
    margin-top: 5px;
    width: 100%;
    text-align: left;
  }

  .el-row {
    margin-bottom: 20px;
    color: black;
  }
  .el-col {
    border-radius: 4px;
  }

  .grid-content {
    padding: 10px;
    margin: auto;
    background-color: #f5f7fa;
    border-radius: 4px;
    border: 1px solid #ebeef5;
  }

  .editBtn {
    height: 5% !important;
    width: 12% !important;
    border-radius: 5px !important;
    background-color:transparent !important;
    border: 0 !important;
    outline:none !important;
    -webkit-background-size:cover !important;
    -moz-background-size: cover !important;
    -o-background-size: cover !important;
    background-size: cover !important;
  }

  .el-tabs__item {
    font-size: 10px !important;
  }
</style>