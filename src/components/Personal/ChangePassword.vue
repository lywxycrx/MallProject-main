<template>
    <div class="formDiv">
        <el-form label-position="right" ref="form" :rules="rules" :model="form" label-width="80px">
            <el-form-item label="Old password: " label-width="200px" prop="opwd">
                <el-input v-model="form.opwd" type="password"></el-input>
            </el-form-item>
            <el-form-item label="New password: " label-width="200px" prop="npwd">
                <el-input v-model="form.npwd" type="password"></el-input>
            </el-form-item>
            <el-form-item label="Enter again: " label-width="200px" prop="cpwd">
                <el-input v-model="form.cpwd" type="password"></el-input>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" class="subbtn" @click="onSubmit('form', tableName, 'pwd', form.npwd)" :plain="true">Confirm modification</el-button>
            </el-form-item>

            <div class="ulDiv">
                <ul style="font-size: 14px">
                    <li>Password length 8-24 bits</li>
                    <li>Must contain uppercase letters, lowercase letters, numbers, no special characters.</li>
                    <li>The password cannot contain an email address</li>
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
            { required: true, message: 'Please enter the old password', trigger: 'blur' },
            
          ],
          npwd: [
            { required: true, message: 'Please enter the new password', trigger: 'blur' },
            { min: 8, max: 64, message: '8 to 64 characters in length', trigger: 'blur' },
            { pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,24}$/, message: 'Incorrect password format', trigger: 'blur' },
          ],
          cpwd: [
            { required: true, message: true, message: 'Please confirm the new password', trigger: 'blur' },
            { min: 8, max: 24, message: '8 to 64 characters in length', trigger: 'blur' }
          ],
        }
      }
    },

    created() {
      // console.log('---------------', this.tableName);
    },


    methods: {
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
                        message: 'Modified successfully, please re-login',
                        type: 'success'
                    });      
                    setTimeout(() => {
                      this.$router.push('/login')
                    }, 1000);
                  }
                }) 
                } else {
                    this.$message({
                        message: 'Server error, modification failed',
                        type: 'error'
                    });
                    return false;
                  }
                });
        }else {
            this.$message({
                message: 'Modification failed, two password fields do not match',
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