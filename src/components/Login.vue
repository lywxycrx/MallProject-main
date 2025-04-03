<template>
  <div class="outDiv">
    <div class="loginDiv">
      <div class="imgDiv"></div>
      <el-form 
        :model="ruleForm" 
        status-icon 
        :rules="rules" 
        ref="ruleForm" 
        label-width="80px" 
        class="form">
        
        <el-form-item label="Account" prop="uid">
          <el-input type="text" v-model="ruleForm.uid" autocomplete="off"></el-input>
        </el-form-item>
        
        <el-form-item label="Password" prop="pwd">
          <el-input type="password" v-model="ruleForm.pwd" autocomplete="off"></el-input>
        </el-form-item>

        <div class="radioDiv">
          <el-radio v-model="type" label="0">Customer</el-radio>
          <el-radio v-model="type" label="1">Vendor</el-radio>
        </div>

        <Dialog ref="dialog" />

        <el-form-item>
          <div class="button-group">
            <el-button @click="submitForm('ruleForm')">Log in</el-button>
            <el-button @click="register()">Sign up</el-button>
            <el-button @click="resetForm('ruleForm')">Reset</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import jwt from 'jwt-decode';
import { mapMutations } from 'vuex';
import Dialog from './register';

export default {
  components: { Dialog },
  data() {
    const validateUser = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please enter your account'));
      } else {
        callback();
      }
    };
    const validatePwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please enter your password'));
      } else {
        callback();
      }
    };

    return {
      type: null,
      ruleForm: {
        uid: '',
        pwd: '',
      },
      rules: {
        uid: [{ validator: validateUser, trigger: 'blur' }],
        pwd: [{ validator: validatePwd, trigger: 'blur' }],
      },
    };
  },
  methods: {
    register() {
      this.$refs.dialog.dialogVisible = true;
    },
    ...mapMutations('loginModule', ['setUser']),
    submitForm(formName) {
      if (this.type === null) {
        this.$message({
          type: 'error',
          message: 'Please choose your login identity',
        });
        return;
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const { uid, pwd } = this.ruleForm;
          this.$api.getLogin({ uid, pwd, type: this.type }).then((res) => {
            if (res.data.status === 200) {
              const decoded = jwt(res.data.data);
              const obj = {
                uid: decoded.uid,
                name: decoded.name,
                address: decoded.address,
                token: res.data.data,
                type: this.type,
              };
              this.setUser(obj);
              localStorage.setItem('user', JSON.stringify(obj));
              this.$router.push(this.type == 1 ? '/aHome' : '/home');
            } else {
              this.$message({
                type: 'error',
                message: 'Incorrect account or password entry',
              });
            }
          });
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style scoped>
.outDiv {
  position: fixed;
  background-image: url('../assets/demo1.jpg');
  background-size: cover;
  background-position: center;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
}

.loginDiv {
  width: 460px;
  padding: 60px 40px 30px;
  margin: 100px auto;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  position: relative;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
}

.imgDiv {
  position: absolute;
  top: -50px;
  left: 50%;
  transform: translateX(-50%);
  height: 100px;
  width: 100px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 50%;
  background-image: url('../assets/logo.png');
  background-size: cover;
  background-position: center;
}

.form {
  margin-top: 40px;
}

.radioDiv {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 10px;
  margin-bottom: 20px;
}

.button-group {
  display: flex;
  justify-content: space-between;
}

.el-input {
  width: 100%;
}

.el-button {
  min-width: 80px;
}
</style>