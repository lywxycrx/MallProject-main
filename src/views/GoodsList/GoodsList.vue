<template>
  <div class="outDiv">
    <div class="searchDiv">
      <el-input :placeholder="$t('goodsList.searchPlaceholder')" @change="getSearch" v-model="input" clearable></el-input>
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
  },

  created() {
    this.showGoods(1);
  },
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