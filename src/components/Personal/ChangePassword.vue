<template>
  <div class="formDiv">
      <el-form label-position="right" ref="form" :rules="rules" :model="form" label-width="80px">
          <el-form-item :label="$t('password.oldPassword') + ': '" label-width="200px" prop="opwd">
              <el-input v-model="form.opwd" type="password"></el-input>
          </el-form-item>
          <el-form-item :label="$t('password.newPassword') + ': '" label-width="200px" prop="npwd">
              <el-input v-model="form.npwd" type="password"></el-input>
          </el-form-item>
          <el-form-item :label="$t('password.confirmPassword') + ': '" label-width="200px" prop="cpwd">
              <el-input v-model="form.cpwd" type="password"></el-input>
          </el-form-item>

          <el-form-item>
              <el-button type="primary" class="subbtn" @click="onSubmit('form', tableName, 'pwd', form.npwd)" :plain="true">{{ $t('password.confirmButton') }}</el-button>
          </el-form-item>

          <div class="ulDiv">
              <ul style="font-size: 14px">
                  <li>{{ $t('password.rules.length') }}</li>
                  <li>{{ $t('password.rules.content') }}</li>
                  <li>{{ $t('password.rules.email') }}</li>
              </ul>
          </div>
      </el-form>
  </div>
</template>

<script>
import store from '../../store/index'

export default {
  props: {
      tableName: {
          type: String,
          default() {
              return ''
          }
      },
  },
  data() {
      return {
          form: {
              opwd:'',
              npwd:'',
              cpwd:''
          },
          rules: {
              opwd: [
                  { required: true, message: this.$t('password.validation.oldRequired'), trigger: 'blur' },
              ],
              npwd: [
                  { required: true, message: this.$t('password.validation.newRequired'), trigger: 'blur' },
                  { min: 8, max: 64, message: this.$t('password.validation.lengthError'), trigger: 'blur' },
                  { pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,24}$/, message: this.$t('password.validation.formatError'), trigger: 'blur' },
              ],
              cpwd: [
                  { required: true, message: this.$t('password.validation.confirmRequired'), trigger: 'blur' },
                  { min: 8, max: 24, message: this.$t('password.validation.lengthError'), trigger: 'blur' }
              ],
          }
      }
  },

  watch: {
      '$i18n.locale': function(newVal) {
          this.updateValidationMessages();
      }
  },

  created() {
      this.updateValidationMessages();
  },

  methods: {
      // 更新验证消息以支持多语言
      updateValidationMessages() {
          this.rules.opwd[0].message = this.$t('password.validation.oldRequired');
          this.rules.npwd[0].message = this.$t('password.validation.newRequired');
          this.rules.npwd[1].message = this.$t('password.validation.lengthError');
          this.rules.npwd[2].message = this.$t('password.validation.formatError');
          this.rules.cpwd[0].message = this.$t('password.validation.confirmRequired');
          this.rules.cpwd[1].message = this.$t('password.validation.lengthError');
      },

      onSubmit(formName, tableName, column, message) { 
          if (this.form.npwd === this.form.cpwd) {
              this.$refs[formName].validate((valid) => {
                  if (valid) {
                      console.log('Moving to the submission stage')
                      this.$api.changeMessage({
                          tableName,
                          column,
                          message,
                          uid: store.state.loginModule.userinfo.uid,
                      })
                      .then((res) => {
                          if(res.status == 200){
                              this.$message({
                                  message: this.$t('password.messages.success'),
                                  type: 'success'
                              });      
                              setTimeout(() => {
                                  this.$router.push('/login')
                              }, 1000);
                          }
                      }) 
                  } else {
                      this.$message({
                          message: this.$t('password.messages.serverError'),
                          type: 'error'
                      });
                      return false;
                  }
              });
          } else {
              this.$message({
                  message: this.$t('password.messages.mismatch'),
                  type: 'error'
              });
          }
      }
  }
}
</script>

<style scoped>
  .formDiv {
      width: 90%;
  }

  .ulDiv {
      width: 50%;
      margin-left: 5%;
      color: rgb(107, 107, 107);
  }

  .ulDiv li {
      height: 30px;
  }

  .subbtn {
      position: relative;
      left: 50%;
      /* background: #409EFF !important; */
  }

  .el-form-item__label {
      font-size: 16px;
  }
</style>