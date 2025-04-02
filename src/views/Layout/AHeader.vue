<template>
    <div class="header">
      <div>
        <el-row :gutter="20">
        <el-col :span="2">
          <div class="grid-content bg-purple">
            <div class="logoDiv"></div>
          </div>
        </el-col>
        <el-col :span="2"><div class="grid-content bg-purple">
          <el-link @click="linkHome">Home</el-link>
        </div></el-col>
        <el-col :span="2"><div class="grid-content bg-purple">
          <el-link @click="editUsers">User list</el-link>
        </div></el-col>
        <el-col :span="2"><div class="grid-content bg-purple">
          <el-link @click="editGoods">Product</el-link>
        </div></el-col>
        <el-col :span="2"><div class="grid-content bg-purple">
          <el-link @click="editOrder">Order</el-link>
        </div></el-col>
        <el-col :span="2"><div class="grid-content bg-purple">
          <el-link @click="editComment">Comment</el-link>
        </div></el-col>
        <el-col :span="4"><div class="grid-content bg-purple">
          <el-link @click="linkCenter">Personal Center</el-link>
        </div></el-col>

        <div class="userDiv">
          <div class="uImg"></div>
          Hello, {{userinfo.name}}
          <li class="el-icon-switch-button" @click="exit"></li>
        </div>
      </el-row>
      </div>
      <router-view></router-view>
    </div>
    
</template>

<script>
import {mapState, mapMutations} from 'vuex'

export default {
    name: 'Header',

    computed: {
      ...mapState('loginModule', ['userinfo'])
    },

    data() {
        return {
            
        };
    },

    mounted() {
        
    },

    methods: {
      linkHome() {
        this.$router.push('/aHome')
      },

      editGoods() {
        this.$router.push('/editGoods')
      },

      linkCenter() {
        this.$router.push('/adminCenter')
      },

      editOrder() {
        this.$router.push('/editOrder')
      },

      editComment() {
        this.$router.push('/editComment')
      },

      editUsers() {
        this.$router.push('/editUsers')
      },

      ...mapMutations('loginModule', ['clearUser']),
      exit() {
        console.log('退出');
         this.$confirm('Do you exit the system?', 'Hint', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          // 情况vuex和本地数据，跳转至登录界面
          this.clearUser();
          localStorage.removeItem('user')
          this.$router.push('/login')
        }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Cancelled'
          }); 
        })
      },
    }
};
</script>

<style scoped>
    .header {
      position: relative;
      background-color: #ffffff;
      color: rgb(255, 255, 255);
      text-align: center;
      line-height: 55px;
      
      border: 1px solid rgb(235, 235, 235);
      border-radius: 10px 10px 10px 10px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    }

    .userDiv {
      position: absolute;
      color: black;
      right: 5%;
      top: 5%;
    }

    .uImg {
      position: relative;
      float: left;
      margin-top: 8%;
      right: 5%;
      height: 30px;
      width: 30px;
      background-image: url('../../assets/user.png');
      background-size: cover;
      border-radius: 100%;
      /* border: 1px solid; */
    }

    .el-row {
      margin: auto;
    }

    .logoDiv {
      position: relative;
      margin-left: 30px;
      margin-top: 10px;
      margin-bottom: 10px;
      height: 80px;
      width: 60px;
      background-image: url("../../assets/logo.png");
      background-size: cover;
    }

    .el-link.el-link--default {
      font-size: 16px;
    }


</style>