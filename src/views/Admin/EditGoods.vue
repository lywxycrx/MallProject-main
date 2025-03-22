<template> 
  <div class="outDiv">
    <!-- 搜索栏区域 -->
    <div class="header">
      <el-input placeholder="Please enter the product you are looking for" @change="searchInput" v-model="input" clearable></el-input>
      <el-button type="primary">Search</el-button>
      <el-button type="primary" @click="addGoods">Add product</el-button>
    </div>

      <el-tabs v-model="activeName" @tab-click="cHandleClick">
        <el-tab-pane label="All" name="All"></el-tab-pane>
        <el-tab-pane label="Latest" name="0"></el-tab-pane>
        <el-tab-pane label="Popular" name="1"></el-tab-pane>
        <el-tab-pane label="Recommended" name="2"></el-tab-pane>
        <el-tab-pane label="Sale" name="3"></el-tab-pane>
        <el-tab-pane label="Hot" name="4"></el-tab-pane>
        <el-tab-pane label="Limited Stock" name="5"></el-tab-pane>
      </el-tabs>

      
    <!-- 表单区域 -->
    <el-table
    class="form"
    :data="tableData"
    border
    style="width: 100%">
      <el-table-column
        prop="img"
        label="Thumbnail"
        width="120">
        <template slot-scope="scope">
          <img :src="scope.row.img" style="width:110px;height:80px;"/>
        </template>
      </el-table-column>

      <el-table-column
        prop="gid"
        label="Product ID"
        width="110">
      </el-table-column>
      <el-table-column
        prop="name"
        label="Product Name"
        width="140">
      </el-table-column>
      <el-table-column
        prop="price"
        label="Price"
        width="80">
      </el-table-column>
      <el-table-column
        prop="sales"
        label="Sales"
        width="80">
      </el-table-column>
      <el-table-column
        prop="score"
        label="Rating"
        width="80">
      </el-table-column>
      <el-table-column
        label="Operations"
        width="380">
            <template slot-scope="scope">
              <el-button size="mini" 
                @click="handleDetail(scope.$index, scope.row)">
                View
              </el-button>
              <el-button size="mini" 
                @click="handleEnable(scope.$index, scope.row)">
                {{ getStatusText(scope.row.isEnabled) }}
              </el-button>
              <el-button
                type="primary"
                size="mini"
                @click="handleEdit(scope.$index, scope.row)"
                icon="el-icon-edit">
                Edit
              </el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
                icon="el-icon-delete">
                Delete
              </el-button>
            </template>
        </el-table-column>
    </el-table>

    <MyPage :total="total" :pageSize="pageSize" @changePage="changePage" class="page" :current-page="currentPage"></MyPage>
    <Dialog ref="dialog" :title="title" :rowData="rowData" :update="update"></Dialog>
  </div>
</template>


<script>
  import MyPage from '../../components/MyPage.vue'
  import Dialog from './AddGoods.vue'
  // import * as Thumbnail from '../../../server/Thumbnail';

  export default {
    components: {
      MyPage,
      Dialog,
    },
    data() {
      return {
        tableData: [],
        total: 5,
        pageSize: 1,
        input: '',

        activeName: 'All',
        dialogVisible: false,
        currentPage: 1, // 页面改变时的变量
        type: 'name',
        title: 'Add product',
        rowData:{},     // 当前行的数据对象
        update: true
      }
    },

    methods: {
      showGoods(page) {
        console.log('showgoods执行=================')
         this.$api.showGoods({
            page,
          }).then(res => {
            if(res.status == 200){
              this.tableData = res.data.data
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
      if(/^[0-9]+$/.test(val)){
        this.type = 'gid'
      }
      this.$api
        .getSearch({
          search: String(val),
          type: this.type
        })
        .then((res) => {
          console.log("搜索---", res.data);
          this.currentPage = 1;
          if (res.data.status === 200) {
            this.tableData = res.data.data
            this.total = res.data.total;
            this.pageSize = res.data.pageSize;;
          } else {
            this.total = 1;
            this.pageSize = 1;
            this.$message({
              type: 'error',
              message: 'This product is not available'
            })
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


      // 添加时打开弹出
      addGoods(){
        this.title = 'Add product'
        this.update=false
        this.$refs.dialog.dialogVisible = true;
      },
      

      // 编辑弹窗
      handleEdit(index, row){
        this.title = 'Edit product'
        this.update=true
        this.rowData = row;
        this.$refs.dialog.dialogVisible = true;
      },


      // 查看详情操作
      handleDetail(index, row) {
        this.rowData = row;
        let routeData = this.$router.resolve({
            path: '/GoodsDetail/' + this.rowData.gid,
        })
        window.open(routeData.href, '_blank')
      },

      getStatusText(status) {
      const statusMap = {
          0: '禁用',
          1: '启用'
        };
        return statusMap[status] || '未知状态';
      },

      handleEnable(index, row){
        console.log(this.tableData)
        console.log(row.isEnabled)
        this.$api.enableGoods(row)
        this.showGoods(1)
      },

      // 删除操作
      handleDelete(index, row){
        console.log('Delete', index, row)
        this.$confirm('This action will permanently delete the product, do you want to continue?', 'hint', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          this.$api.delGoods({
            gid: row.gid
          }).then(res => {
            if(res.data.status === 200) {
                this.$message({
                type: 'success',
                message: 'Deleted successfully'
              })
              this.showGoods(1)                  // 更新视图
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'Canceled'
          });          
        });
      },

    },

    created() {
      this.showGoods(1)
    }
  }

</script>

<style scoped>
  .outDiv {
    margin-top: 1%;
    margin: auto;
    height: 100%;
    width: 100%;
    position:absolute;
  }

  .header{
    display: flex;
    margin: 20px;
  }

  .header button {
    margin-top: 7px;
    margin-left: 20px;
    height: 10%;
  } 

  .form{
    left: 18%;
  }

  .page {
    position: absolute;
    left: 40%;
  }

</style>