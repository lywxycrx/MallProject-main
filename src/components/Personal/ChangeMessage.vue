<template>
    <div>
        <el-dialog
        title="Change Name"
        :visible.sync="nDialog"
        :append-to-body="true"
        :before-close="handleDialogClose"
        width="70%"> 
             <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item :label="$t('personal.edit.name')" prop="name">
                <el-input v-model="ruleForm.name"></el-input>
                </el-form-item>

                <el-form-item>
                <el-button type="primary" @click="submitMessage('ruleForm', tableName, 'name', ruleForm.name)" style="float: right; margin-top: 30px">Confirm</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog
        title="Change Gender"
        :visible.sync="sDialog"
        :append-to-body="true"
        :before-close="handleDialogClose"
        width="70%"> 
             <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px" class="demo-ruleForm">
                <el-form-item :label="$t('personal.edit.gender')" prop="sex">
                <el-input v-model="ruleForm.sex"></el-input>
                </el-form-item>

                <el-form-item>
                <el-button type="primary" @click="submitMessage('ruleForm', tableName, 'sex', ruleForm.sex)" style="float: right; margin-top: 30px">Confirm</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog
        title="Change Address"
        :visible.sync="aDialog"
        :append-to-body="true"
        :before-close="handleDialogClose"
        width="70%"> 
             <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px" class="demo-ruleForm">
                <el-form-item :label="$t('personal.edit.address')" prop="address">
                <el-input v-model="ruleForm.address"></el-input>
                </el-form-item>

                <el-form-item>
                <el-button type="primary" @click="submitMessage('ruleForm', tableName, 'address', ruleForm.address)" style="float: right; margin-top: 30px">Confirm</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog
        title="Change your phone number"
        :visible.sync="pDialog"
        :append-to-body="true"
        :before-close="handleDialogClose"
        width="70%"> 
             <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item :label="$t('personal.edit.email')" prop="phone">
                <el-input v-model="ruleForm.phone"></el-input>
                </el-form-item>

                <el-form-item>
                <el-button type="primary" @click="submitMessage('ruleForm', tableName, 'phone', ruleForm.phone)" style="float: right; margin-top: 30px">Confirm</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </diV>
</template>

<script>

import store from '../../store/index'

export default {
    inject: ['reload'],
    props: [
        'nDialog',
        'sDialog',
        'pDialog',
        'aDialog',
        'tableName',
    ],
    data() {
        return {
        value: '',

        ruleForm: {
          name: '',
          address: '',
          sex: '',
          phone: '',
        },

        rules: {
          name: [
            { required: true, message: 'Please enter your name', trigger: 'blur' },
            
          ],
          address: [
            { required: true, message: 'Please enter your address', trigger: 'blur' },
            
          ],
          sex: [
            { required: true, message: 'Please enter your gender', trigger: 'blur' },
            
          ],
          phone: [
            { required: true, message: 'Please enter your phone number', trigger: 'blur' },
            
          ],
        }
      };
    },

    methods: {
      // 关闭弹窗时发送的事件
      handleDialogClose() {
          this.$emit('changeDialog')
          console.log('The event is triggered when the popup closes!')
      },

      submitMessage(formName, tableName, column, message) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log('Moving to the submission stage')
            this.$api.changeMessage({
              tableName: tableName,
              column,
              message,
              uid: store.state.loginModule.userinfo.uid,
            })
            .then((res) => {
              if(res.status == 200){
                this.$message({
                    message: 'Modified successfully',
                    type: 'success'
                });         
                setTimeout(() => {
                  this.reload()
                }, 700);
              }
            }) 
          } else {
            console.log('Failed to modify');
            return false;
          }
        });
      },

    }
}
</script>

<style scoped>
  .el-upload {
    float: left;
    margin-left: 50px;
  }
</style>