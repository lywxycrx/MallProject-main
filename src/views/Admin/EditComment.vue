<template> 
  <div class="outDiv">
    <!-- 搜索栏区域 -->
    <div class="header">
      <el-input placeholder="Please enter the comment you are looking for" @change="searchInput" v-model="input" clearable></el-input>
      <el-button type="primary">Search</el-button>
      <!-- <el-button type="primary" @click="addGoods">添加</el-button> -->
    </div>

      
    <!-- 表单区域 -->
    <el-table
    class="form"
    :data="tableData"
    border
    style="width: 100%">
      <el-table-column
        prop="cid"
        label="Comment ID"
        width="110">
      </el-table-column>
      <el-table-column
        prop="uid"
        label="User ID"
        width="110">
      </el-table-column>
      <el-table-column
        prop="gid"
        label="Product ID"
        width="110">
      </el-table-column>
      <el-table-column
        prop="content"
        label="Comment"
        width="150">
      </el-table-column>
      <el-table-column
        prop="time"
        label="Time"
        width="100">
      </el-table-column>
      <el-table-column
        prop="content2"
        label="Follow up"
        width="150">
      </el-table-column>
      <el-table-column
        prop="time2"
        label="Follow up Time"
        width="150">
      </el-table-column>
      <el-table-column
        label="Operation"
        width="250">
            <template slot-scope="scope">
              <el-button size="mini" 
                @click="handleDetail(scope.$index, scope.row)">
                View
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

    <MyPage :total="total" :pageSize="pageSize" 
    @changePage="changePage" class="page" 
    :current-page="currentPage"></MyPage>
  </div>
</template>


<script>
  import MyPage from '../../components/MyPage.vue'
  import Dialog from './AddGoods.vue'
  

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
      }
    },

    methods: {
      editComments(page) {
         this.$api.editComments({
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
        this.editComments(1);
        this.currentPage = 1;
        return;
      }
      this.$api
        .searchComment({
          search: val,
        })
        .then((res) => {
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
              message: 'No Comments'
            }); 
          }
        });
      },


      // 调用输入查询方法
      getSearch(val) {
        this.searchInput(val)
      },




      // 页面改变
      changePage(num) {
          this.currentPage = num
          this.pageSize = this.pageSize;
          this.editComments(num);                //列表分页
      },


      // 添加时打开弹出
      addGoods(){
        this.title = 'Add product'
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


      // 删除操作
      handleDelete(index, row){
        console.log('删除', index, row)
        this.$confirm('This action will permanently delete the comment, continue or not.?', 'Next', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          this.$api.delComment({
            cid: row.cid
          }).then(res => {
            if(res.data.status === 200) {
                this.$message({
                type: 'success',
                message: 'Deleted successfully'
              })
              this.editComments(1)                  // 更新视图
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'Cancelled'
          });          
        });
      },

    },

    created() {
      this.editComments(1)
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
    left: 10%;
  }

  .page {
    position: absolute;
    left: 40%;
  }

</style>