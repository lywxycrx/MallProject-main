<template>
  <div>
    <!-- 头部导航栏 -->
    <div class="header">
      <el-row class="nav-container" justify="center">
        <el-col :span="2">
          <div class="logoDiv"></div>
        </el-col>
        <el-col :span="3">
          <el-link :class="{ active: isActive('/home') }" @click="linkHome">{{ $t('header.home') }}</el-link>
        </el-col>
        <el-col :span="3">
          <el-link :class="{ active: isActive('/goodsList') }" @click="linkGoods">{{ $t('header.mall') }}</el-link>
        </el-col>
        <el-col :span="3">
          <el-link :class="{ active: isActive('/cart') }" @click="linkCart">{{ $t('header.cart') }}</el-link>
        </el-col>
        <el-col :span="3">
          <el-link :class="{ active: isActive('/myOrders') }" @click="linkOrders">{{ $t('header.myOrders') }}</el-link>
        </el-col>
        <el-col :span="3">
          <el-link :class="{ active: isActive('/center') }" @click="linkCenter">{{ $t('header.personalCenter') }}</el-link>
        </el-col>
        <el-col :span="3">
          <!-- 语言切换下拉菜单 -->
          <el-dropdown @command="handleLanguageChange" trigger="click">
            <span class="language-selector">
              {{ currentLanguageDisplay }}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="zh">中文</el-dropdown-item>
              <el-dropdown-item command="en">English</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
        <el-col :span="4" class="userDiv">
          <div v-if="isLoggedIn">
            <div class="uImg"></div>
            <span class="username">{{ $t('common.hello') }}, {{ userinfo.name }}</span>
            <li class="el-icon-switch-button logout-icon" @click="exit"></li>
          </div>
          <div v-else @click="exit" class="login-text">
            {{ $t('common.clickToLogin') }}
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import store from "../../store/index";

export default {
  name: "Header",
  computed: {
    ...mapState("loginModule", ["userinfo"]),
    currentLanguageDisplay() {
      return this.$i18n.locale === 'zh' ? '中文' : 'English';
    }
  },
  data() {
    return {
      isLoggedIn: store.state.loginModule.userinfo.token ? true : false,
    };
  },
  methods: {
    ...mapMutations("loginModule", ["clearUser"]),
    handleLanguageChange(lang) {
      // 使用我们在element.js中定义的全局方法切换语言
      this.$changeLanguage(lang);
    },
    exit() {
      const message = this.isLoggedIn 
        ? this.$t('common.exitConfirm') 
        : this.$t('common.redirectToLogin');
      
      this.$confirm(message, this.$t('common.hint'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: "warning",
      }).then(() => {
        this.clearUser();
        localStorage.removeItem("user");
        this.$router.push("/login");
      }).catch(() => {
        this.$message({
          type: "info",
          message: this.$t('common.operationCancelled'),
        });
      });
    },
    linkHome() {
      this.$router.push("/home");
    },
    linkGoods() {
      this.$router.push("/goodsList");
    },
    linkCenter() {
      this.$router.push("/center");
    },
    linkCart() {
      this.$router.push("/cart");
    },
    linkOrders() {
      this.$router.push("/myOrders");
    },
    isActive(route) {
      return this.$route.path === route;
    }
  },
  // 组件创建时检查是否有保存的语言设置
  created() {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      this.$i18n.locale = savedLanguage;
    }
  }
};
</script>

<style scoped>
/* 头部导航栏 */
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 70px;
  background-color: #ffffff;
  border-bottom: 2px solid rgb(230, 230, 230);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 让 el-row 不换行 */
.nav-container {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-wrap: nowrap;
}

/* Logo */
.logoDiv {
  width: 60px;
  height: 60px;
  background-image: url("../../assets/logo.png");
  background-size: cover;
}

/* 用户信息 */
.userDiv {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  color: black;
  white-space: nowrap;
}

.username {
  font-weight: bold;
  color: #333;
}

/* 用户头像 */
.uImg {
  width: 30px;
  height: 30px;
  background-image: url("../../assets/user.png");
  background-size: cover;
  border-radius: 50%;
}

/* 退出按钮 */
.logout-icon {
  cursor: pointer;
  font-size: 18px;
  transition: color 0.3s ease;
}

.logout-icon:hover {
  color: red;
}

/* 登录按钮 */
.login-text {
  cursor: pointer;
  font-weight: bold;
  color: #007bff;
  transition: color 0.3s ease;
}

.login-text:hover {
  color: #0056b3;
}

/* 主要内容区域 */
.main-content {
  margin-top: 80px;
  min-height: calc(100vh - 80px);
  padding: 20px;
}

/* 导航栏链接 */
.el-link {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  text-decoration: none;
  transition: all 0.3s ease;
  padding: 10px 15px;
  border-radius: 5px;
}

/* 悬停时的效果 */
.el-link:hover {
  color: #007bff;
  background-color: rgba(0, 123, 255, 0.1);
}

/* 选中（当前页面）时的效果 */
.el-link.active {
  color: #ffffff;
  background-color: #007bff;
  border-radius: 5px;
  padding: 10px 15px;
}

/* 语言选择器样式 */
.language-selector {
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  color: #333;
  padding: 10px 15px;
  border-radius: 5px;
  transition: all 0.3s ease;
  display: inline-block;
}

.language-selector:hover {
  color: #007bff;
  background-color: rgba(0, 123, 255, 0.1);
}

/* 响应式调整 */
@media (max-width: 1200px) {
  .nav-container {
    justify-content: space-between;
  }
  .el-link, .language-selector {
    font-size: 14px;
    padding: 8px 10px;
  }
}

@media (max-width: 992px) {
  .nav-container {
    flex-wrap: wrap;
  }
  .userDiv {
    order: -1;
    width: 100%;
    justify-content: flex-end;
    margin-right: 20px;
  }
}

@media (max-width: 768px) {
  .header {
    height: auto;
    padding: 10px 0;
  }
  .nav-container {
    flex-direction: column;
    align-items: center;
  }
  .el-col {
    margin: 5px 0;
  }
  .main-content {
    margin-top: 220px;
  }
}
</style>