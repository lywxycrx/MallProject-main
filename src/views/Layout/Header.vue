<template>
  <div>
    <!-- 头部导航栏 -->
    <div class="header" :class="{ 'high-contrast': highContrastMode }">
      <div class="nav-wrapper">
        <!-- Logo区域 -->
        <div class="logo-area">
          <div class="logoDiv"></div>
        </div>
        
        <!-- 导航链接区域 -->
        <div class="nav-links">
          <el-link :class="{ active: isActive('/home'), 'high-contrast': highContrastMode }" @click="linkHome">{{ $t('header.home') }}</el-link>
          <el-link :class="{ active: isActive('/goodsList'), 'high-contrast': highContrastMode }" @click="linkGoods">{{ $t('header.mall') }}</el-link>
          <el-link :class="{ active: isActive('/cart'), 'high-contrast': highContrastMode }" @click="linkCart">{{ $t('header.cart') }}</el-link>
          <el-link :class="{ active: isActive('/myOrders'), 'high-contrast': highContrastMode }" @click="linkOrders">{{ $t('header.myOrders') }}</el-link>
          <el-link :class="{ active: isActive('/center'), 'high-contrast': highContrastMode }" @click="linkCenter">{{ $t('header.personalCenter') }}</el-link>
        </div>
        
        <!-- 功能区域：语言切换、辅助工具和用户信息 -->
        <div class="functional-area">
          <!-- Language switch drop-down menu -->
          <el-dropdown @command="handleLanguageChange" trigger="click" class="language-dropdown">
            <span class="language-selector" :class="{ 'high-contrast': highContrastMode }">
              {{ currentLanguageDisplay }}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="zh">中文</el-dropdown-item>
              <el-dropdown-item command="en">English</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          
          <!-- 辅助工具 -->
          <AccessibilityTools class="accessibility-tools" />
          
          <!-- 用户信息/登录区域 -->
          <div class="userDiv">
            <div v-if="isLoggedIn" class="user-info">
              <div class="uImg"></div>
              <span class="username" :class="{ 'high-contrast': highContrastMode }">{{ $t('common.hello') }}, {{ userinfo.name }}</span>
              <li class="el-icon-switch-button logout-icon" :class="{ 'high-contrast': highContrastMode }" @click="exit"></li>
            </div>
            <div v-else @click="exit" class="login-text" :class="{ 'high-contrast': highContrastMode }">
              {{ $t('common.clickToLogin') }}
            </div>
          </div>
        </div>
        
        <!-- 移动端菜单按钮 -->
        <div class="mobile-menu-toggle" @click="toggleMobileMenu" :class="{ 'high-contrast': highContrastMode }">
          <i class="el-icon-menu"></i>
        </div>
      </div>
      
      <!-- 移动端菜单 -->
      <div class="mobile-menu" v-show="mobileMenuVisible">
        <el-link :class="{ active: isActive('/home'), 'high-contrast': highContrastMode }" @click="linkHome">{{ $t('header.home') }}</el-link>
        <el-link :class="{ active: isActive('/goodsList'), 'high-contrast': highContrastMode }" @click="linkGoods">{{ $t('header.mall') }}</el-link>
        <el-link :class="{ active: isActive('/cart'), 'high-contrast': highContrastMode }" @click="linkCart">{{ $t('header.cart') }}</el-link>
        <el-link :class="{ active: isActive('/myOrders'), 'high-contrast': highContrastMode }" @click="linkOrders">{{ $t('header.myOrders') }}</el-link>
        <el-link :class="{ active: isActive('/center'), 'high-contrast': highContrastMode }" @click="linkCenter">{{ $t('header.personalCenter') }}</el-link>
        <div class="mobile-language" :class="{ 'high-contrast': highContrastMode }">
          <span @click="handleLanguageChange('zh')">中文</span> | 
          <span @click="handleLanguageChange('en')">English</span>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from "vuex";
import store from "../../store/index";
import AccessibilityTools from '@/components/AccessibilityTools.vue';

export default {
  name: "Header",
  components: {
    AccessibilityTools
  },
  computed: {
    ...mapState("loginModule", ["userinfo"]),
    ...mapGetters(["highContrastMode"]),
    currentLanguageDisplay() {
      return this.$i18n.locale === 'zh' ? '中文' : 'English';
    }
  },
  data() {
    return {
      isLoggedIn: store.state.loginModule.userinfo.token ? true : false,
      mobileMenuVisible: false
    };
  },
  methods: {
    ...mapMutations("loginModule", ["clearUser"]),
    toggleMobileMenu() {
      this.mobileMenuVisible = !this.mobileMenuVisible;
    },
    handleLanguageChange(lang) {
      this.$changeLanguage(lang);
      this.mobileMenuVisible = false;
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
      this.mobileMenuVisible = false;
    },
    linkGoods() {
      this.$router.push("/goodsList");
      this.mobileMenuVisible = false;
    },
    linkCenter() {
      this.$router.push("/center");
      this.mobileMenuVisible = false;
    },
    linkCart() {
      this.$router.push("/cart");
      this.mobileMenuVisible = false;
    },
    linkOrders() {
      this.$router.push("/myOrders");
      this.mobileMenuVisible = false;
    },
    isActive(route) {
      return this.$route.path === route;
    }
  },
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
  background-color: #ffffff;
  border-bottom: 2px solid rgb(230, 230, 230);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10000;
}

.nav-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Logo区域 */
.logo-area {
  flex: 0 0 auto;
}

.logoDiv {
  width: 60px;
  height: 80px;
  background-image: url("../../assets/logo.png");
  background-size: cover;
}

/* 导航链接区域 */
.nav-links {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex: 1;
}

/* 功能区域 */
.functional-area {
  display: flex;
  align-items: center;
  gap: 15px;
}

/* 用户信息 */
.userDiv {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.username {
  font-weight: bold;
  color: #333;
  white-space: nowrap;
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
  list-style: none;
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
  white-space: nowrap;
}

.login-text:hover {
  color: #0056b3;
}

/* 主要内容区域 */
.main-content {
  margin-top: 70px;
  min-height: calc(100vh - 70px);
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
  white-space: nowrap;
}

.language-selector:hover {
  color: #007bff;
  background-color: rgba(0, 123, 255, 0.1);
}

/* 辅助功能工具样式 */
.accessibility-tools {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 移动端菜单按钮 */
.mobile-menu-toggle {
  display: none;
  cursor: pointer;
  font-size: 24px;
}

/* 移动端菜单 */
.mobile-menu {
  display: none;
  flex-direction: column;
  padding: 15px;
  background-color: #fff;
  border-top: 1px solid #e6e6e6;
}

.mobile-menu .el-link {
  margin: 8px 0;
  width: 100%;
  text-align: center;
}

.mobile-language {
  margin-top: 15px;
  text-align: center;
  font-weight: bold;
}

.mobile-language span {
  cursor: pointer;
  padding: 5px;
}

/* 高对比度模式样式 */
.header.high-contrast {
  background-color: #000;
  border-bottom-color: #fff;
}

.el-link.high-contrast {
  color: #fff;
  background-color: transparent;
}

.el-link.high-contrast:hover {
  color: #ffff00;
  background-color: #333;
}

.el-link.active.high-contrast {
  color: #000;
  background-color: #ffff00;
}

.language-selector.high-contrast {
  color: #fff;
}

.language-selector.high-contrast:hover {
  color: #ffff00;
  background-color: #333;
}

.username.high-contrast {
  color: #fff;
}

.logout-icon.high-contrast {
  color: #fff;
}

.logout-icon.high-contrast:hover {
  color: #ffff00;
}

.login-text.high-contrast {
  color: #ffff00;
}

.login-text.high-contrast:hover {
  color: #ff0;
  text-decoration: underline;
}

.mobile-menu-toggle.high-contrast {
  color: #fff;
}

.mobile-language.high-contrast {
  color: #f88383;
}

.mobile-language.high-contrast span:hover {
  color: #ffff00;
  background-color: #000;
}

/* 响应式调整 */
@media (max-width: 1200px) {
  .nav-links {
    gap: 10px;
  }
  
  .el-link, .language-selector {
    font-size: 14px;
    padding: 8px 10px;
  }
}

@media (max-width: 992px) {
  .nav-links {
    display: none;
  }
  
  .mobile-menu-toggle {
    display: block;
  }
  
  .mobile-menu {
    display: flex;
  }
  
  .functional-area {
    gap: 10px;
  }
  
  .username {
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

@media (max-width: 768px) {
  .language-dropdown {
    display: none;
  }
  
  .functional-area {
    gap: 5px;
  }
  
  .username {
    display: none;
  }
}

@media (max-width: 480px) {
  .nav-wrapper {
    padding: 0 10px;
  }
  
  .accessibility-tools {
    display: none;
  }
  
  .logoDiv {
    width: 50px;
    height: 50px;
  }
}
</style>