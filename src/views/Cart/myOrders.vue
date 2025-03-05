<template> 
  <div class="outDiv">
    <!-- 搜索栏区域 -->
    <div class="header">
      <el-input placeholder="Please enter the order you want to inquire about" @change="searchInput" 
      v-model="input" clearable style="margin-right: 10px;">
      </el-input>
      <el-button type="primary">Select</el-button>
    </div>

    <el-tabs v-model="activeName" @tab-click="cHandleClick">
      <el-tab-pane label="Pending" name="Pending"></el-tab-pane>
      <el-tab-pane label="Delivering" name="Delivering"></el-tab-pane>
      <el-tab-pane label="Completed" name="Completed"></el-tab-pane>
    </el-tabs>

      
    <!-- 表单区域 -->
    <el-table
      class="form"
      :data="tableData"
      border
      style="width: 100%">

      <el-table-column
        prop="oid"
        label="serial number"
        width="150">
      </el-table-column>
      <!-- <el-table-column
        prop="uid"
        label="User ID"
        width="80">
      </el-table-column> -->
      <el-table-column
        prop="detail"
        label="Checklist"
        width="200">
      </el-table-column>
      <el-table-column
        prop="price"
        label="total price"
        width="120">
      </el-table-column>
      <el-table-column
        prop="address"
        label="address"
        width="220">
      </el-table-column>
      <el-table-column
        prop="time"
        label="Order time"
        width="180">
      </el-table-column>
      <el-table-column
        prop="type"
        label="status"
        width="180"
        :formatter="formatType">
      </el-table-column>
      <el-table-column
        label="oprate"
        width="120">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="info"
                @click="handleDetails(scope.row)"
                icon="el-icon-view">
                Details
              </el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
                icon="el-icon-delete"
                v-show="dType">
                Delete
              </el-button>
            </template>
        </el-table-column>
    </el-table>

    <MyPage :total="total" :pageSize="pageSize" @changePage="changePage" class="page" :current-page="currentPage"></MyPage>
    <!-- <Dialog ref="dialog" :title="title" :rowData="rowData"></Dialog> -->



    <el-dialog :visible.sync="dialogVisible" title="Order Details">
      <h3>Order No. {{ rowData.oid }}</h3>
      <p>Delivering Address: {{ rowData.address }}</p>
      <p>Createing Time: {{ rowData.time }}</p>
      <p>Type: {{ rowData.status }}</p>

      <table border="1" style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th>Item</th>
            <th>Quentity</th>
            <th>Unit Price</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item) of rowData.detail">
            <td>{{ item.name }}</td>
            <td>{{ item.num }}</td>
            <td>{{ item.unit_price }}</td>
            <td>{{ item.subtotal }}</td>
          </tr>
          <tr>
            <td><strong>total</strong></td>
            <td colspan="3" style="text-align: right;"><strong>{{ rowData.total }}</strong></td>
          </tr>
        </tbody>
      </table>
    </el-dialog>


  </div>
</template>


<script>
  import MyPage from '../../components/MyPage.vue'
  import store from '../../store/index'  

  export default {
    components: {
      MyPage,
      // Dialog,
    },
    data() {
      return {
        tableData: [],
        total: 5,
        pageSize: 1,
        input: '',

        activeName: '全部',
        dialogVisible: false,
        currentPage: 1, // 页面改变时的变量
        type: 0,
        rowData:{
          oid: 0,
          address: '',
          total: 0,
          time: '',
          status: '',
          detail: []
        },     // 当前行的数据对象

        dType: false,   // 控制删除按钮是否显示
      }
    },

    methods: {
      myOrders(page, type) {
        console.log('myOrders执行=================')
         this.$api.myOrders({
            page,
            uid: store.state.loginModule.userinfo.uid,
            type,        // 查询待处理订单
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
      console.log('searchInput执行');
       if (!val) {
        this.showOrders(1, this.type);
        console.log('val为空执行');
        this.currentPage = 1;
        return;
      }
      this.$api
        .searchMyorders({
          search: val,
          type: this.type,
          uid: store.state.loginModule.userinfo.uid
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
              message: 'There is no such order yet'
            })
          }
        });
      },

      //类别显示
      formatType(order) {
        const typeMap = {
          0: 'Pending',
          1: 'Delivering',
          2: 'Completed'
        };
        return typeMap[order.type] || 'Unknown'; // 默认返回 'Unknown'
      },
      // 类别查询
      cHandleClick() {
        if(this.activeName === 'Pending'){
          this.type = 0
          this.dType = false
          this.myOrders(1, this.type)
        }else if(this.activeName === 'Delivering'){
          this.type = 1
          this.dType = false
          this.myOrders(1, this.type)
        }else if(this.activeName === 'Completed'){
          this.type = 2
          this.dType = true
          this.myOrders(1, this.type)
        }
      },


      // 页面改变
      changePage(num) {
          this.currentPage = num
          this.pageSize = this.pageSize;
          this.myOrders(num, this.type);                //列表分页
      },


      // 删除操作
      handleDelete(index, row){
        console.log('删除', index, row)
        this.$confirm('This operation will permanently delete the order. Do you want to continue?', 'hint', {
          confirmButtonText: 'confirm',
          cancelButtonText: 'cancel',
          type: 'warning'
        }).then(() => {
          this.$api.delOrder({
            oid: row.oid
          }).then(res => {
            if(res.data.status === 200) {
                this.$message({
                type: 'success',
                message: 'Delete successfully'
              })
              this.myOrders(1, this.type)                  // 更新视图
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'Canceled'
          });          
        });
      },

      handleDetails(row){
        this.rowData.oid=row['oid']
        this.rowData.time=row['time']
        this.rowData.address=row['address']
        this.rowData.total=row['price']

        this.rowData.status=row['type']
        if(this.rowData.status == 0){
          this.rowData.status = 'Pending'
        }else if(this.rowData.status == 1){
          this.rowData.status = 'Delivering'
        }else{
          this.rowData.status = 'Completed'
        }

        let subtotalList = row['subtotal'].split(',')

        let checklist = row['detail'].split(',')
        for(let i = 0; i < checklist.length; i++){
          let parts = checklist[i].split('×')
          checklist[i] = {
            name: parts[0],
            num: parts[1],
            unit_price: (subtotalList[i]/parts[1]).toFixed(2),
            subtotal: subtotalList[i]
          }
        }
        this.rowData.detail = []
        this.rowData.detail = this.rowData.detail.concat(checklist)

        this.dialogVisible = true;
      },
    },

    

    created() {
      console.log('dType:', this.dType)
      this.myOrders(1, this.type)
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
      /* margin-left: 30px; */
      margin: auto;
      height: 30%;
    } 

  .form{
    left: 5%;
  }

  .page {
    position: absolute;
    left: 40%;
  }

</style>