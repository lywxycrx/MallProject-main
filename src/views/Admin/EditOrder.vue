<template> 
  <div class="outDiv">
    <!-- 搜索栏区域 -->
    <div class="header">
      <el-input placeholder="Please enter the order you want to query" 
      @change="searchInput" v-model="input" clearable style="margin-right: 10px;"></el-input>
      <el-button class="sbtn" type="primary">Search</el-button>

      <download-excel
          class = "export-excel-wrapper"
          :data = this.tableData
          :fields = this.fields
          name = "商品订单表">
          <el-button type="primary" class="ebtn" size="small">Export Orders</el-button>
      </download-excel>
    </div>

    <el-tabs v-model="activeName" @tab-click="cHandleClick">
      <el-tab-pane label="Pending" name="Pending"></el-tab-pane>
      <el-tab-pane label="Shipped" name="Shipped"></el-tab-pane>
      <el-tab-pane label="Completed" name="Completed"></el-tab-pane>
      <el-tab-pane label="Holding" name="Holding"></el-tab-pane>
      <el-tab-pane label="Cancelled" name="Cancelled"></el-tab-pane>
    </el-tabs>

      
    <!-- 表单区域 -->
    <el-table
      class="form"
      :data="tableData"
      border
      style="width: 100%">

      <el-table-column
        prop="oid"
        label='P.O.numbers'
        width="120">
      </el-table-column>
      <el-table-column
        prop="name"
        label="Customer names"
        width="140">
      </el-table-column>
      <!-- <el-table-column
        prop="detail"
        label="Details"
        width="230">
      </el-table-column> -->
      <el-table-column
        prop="price"
        label="Total price"
        width="100">
      </el-table-column>
      <el-table-column
        prop="address"
        label="Address"
        width="200">
      </el-table-column>
      <el-table-column
        prop="time"
        label="Purchase dates"
        width="180">
      </el-table-column>
      <el-table-column
        prop="type"
        label="Status"
        width="180">
        <template slot-scope="scope">
          <span>{{ statusMap[scope.row.type] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="Operations"
        width="380">
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
                type="warning"
                @click="changeStatus(scope.$index, scope.row, 'Shipped')"
                icon="el-icon-truck"
                v-show="dType">
                Delivery
              </el-button>
              <el-button
                size="mini"
                type="danger"
                @click="changeStatus(scope.$index, scope.row, 'Holding')"
                icon="el-icon-warning"
                v-show="abnormalType">
                Hold
              </el-button>
              <el-button
                size="mini"
                type="success"
                @click="changeStatus(scope.$index, scope.row, 'Pending')"
                icon="el-icon-check"
                v-show="solveType">
                Unhold
              </el-button>
              <el-button
                size="mini"
                type="warning"
                @click="handleCancel(scope.row)"
                icon="el-icon-close"
                v-show="cancelType">
                Cancel
              </el-button>
              <el-button
                size="mini"
                type="success"
                @click="changeStatus(scope.$index, scope.row, 'Completed')"
                icon="el-icon-check"
                v-show="sType">
                Complete
              </el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
                icon="el-icon-delete"
                v-show="deleteType">
                Delete
              </el-button>
            </template>
        </el-table-column>
    </el-table>

    <MyPage :total="total" :pageSize="pageSize" @changePage="changePage" class="page" :current-page="currentPage"></MyPage>
    <!-- <Dialog ref="dialog" :title="title" :rowData="rowData"></Dialog> -->
    <el-dialog :visible.sync="dialogVisible" title="Order Details">
      <h3>P.O.number: {{ rowData.oid }}</h3>
      <p>Shipping Address: {{ rowData.address }}</p>
      <p>Createing Time: {{ rowData.time }}</p>
      <p>Shipping Time: {{ rowData.dates[0] }}<span v-if="rowData.dates[0] == null">Not Shipped</span></p>
      <p>Completed Time: {{ rowData.dates[1] }}<span v-if="rowData.dates[1] == null">Not Complete</span></p>
      <p v-if="rowData.dates[2] != null">Problem Time: {{ rowData.dates[2] }}</p>
      <p v-if="rowData.dates[2] != null">Solve Time: {{ rowData.dates[3] }}<span v-if="rowData.dates[3] == null">Not Resolved</span></p>
      <p v-if="rowData.dates[4] != null">Cancel Time: {{ rowData.dates[4] }}</p>
      <p>Type: {{ rowData.status }}</p>

      <table border="1" style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th>Item</th>
            <th>Quantity</th>
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

        activeName: 'All',
        dialogVisible: false,
        currentPage: 1, // 页面改变时的变量
        type: 0,
        title: 'Add product',
        rowData:{
          oid: 0,
          address: '',
          total: 0,
          time: '',
          status: '',
          detail: [],
          dates: ['None yet', 'None yet', null, null, null]
        },     // 当前行的数据对象

        dType: true,    // 控制配送按钮是否显示
        sType: null,    // 控制完成按钮是否显示
        abnormalType: true,
        solveType: false,
        cancelType: false,
        deleteType: false,
        statusMap: {
          0: "Pending",
          1: "Shipped",
          2: "Completed",
          3: "Holding",
          4: "Cancelled"
        },

        fields: {'用户': 'uid', '购物清单': 'detail', '总价': 'price', '地址': 'address', '时间': 'time', },
      }
    },

    methods: {
      showOrders(page, type) {
        console.log('showOrders执行=================')
        
        this.$api.showOrders({
          page,
          type,        // 查询Pending订单
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
      console.log(val)
       if (!val) {
        this.showOrders(1, this.type);
        console.log('val为空执行');
        this.currentPage = 1;
        return;
      }
      this.$api
        .searchOrder({
          search: val,
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
              message: 'No such order at this time'
            })
          }
        });
      },


      // 类别查询
      cHandleClick() {
        if(this.activeName === 'Pending'){
          this.type = 0
          this.dType = true
          this.sType = false
          this.abnormalType = true
          this.solveType = false
          this.cancelType = false
          this.deleteType = false
          this.showOrders(1, this.type)
        }else if(this.activeName === 'Shipped'){
          this.type = 1
          this.dType = false
          this.sType = true
          this.abnormalType = false
          this.solveType = false
          this.cancelType = false
          this.deleteType = false
          this.showOrders(1, this.type)
        }else if(this.activeName === 'Completed'){
          this.type = 2
          this.dType = false
          this.sType = false
          this.abnormalType = false
          this.solveType = false
          this.cancelType = false
          this.deleteType = true
          this.showOrders(1, this.type)
        }
        else if(this.activeName === 'Holding'){
          this.type = 3
          this.dType = false
          this.sType = false
          this.abnormalType = false
          this.solveType = true
          this.cancelType = true
          this.deleteType = false
          this.showOrders(1, this.type)
        }else if(this.activeName === 'Cancelled'){
          this.type = 4
          this.dType = false
          this.sType = false
          this.abnormalType = false
          this.solveType = false
          this.cancelType = false
          this.deleteType = true
          this.showOrders(1, this.type)
        }
      },


      // 页面改变
      changePage(num) {
          this.currentPage = num
          this.pageSize = this.pageSize;
          this.showOrders(num, this.type);                //列表分页
      },


      changeStatus(index, row, bType){
        // console.log('删除', index, row)
        const numType = Object.keys(this.statusMap).find(key => this.statusMap[key] === bType);
        this.$confirm('This will change the status of the order to '+ bType + ', continue or not', 'hint', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          this.$api.changeOrder({
            oid: row.oid,
            type: numType
          }).then(res => {
            if(res.data.status === 200) {
                this.$message({
                type: 'success',
                message: 'Change successfully'
              })
              this.showOrders(1, this.type)                  // 更新视图
            }
          }).then(() => {
            if(numType == 2){
            console.log("add item")
            this.$api.addOrderItem({
              uid: row.uid,
              idList: row.idList,
              detail: row.detail
            }).then(res => {
              console.log(res)
              if(res.data.status === 200) {
                console.log('Change successfully')
              }
              else{
                console.log(res)
              }
            })
          }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'Cancelled'
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
        }else if(this.rowData.status == 3){
          this.rowData.status = 'Holding'
        }else if(this.rowData.status == 4){
          this.rowData.status = 'Cancelled'
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
            subtotal: parseFloat(subtotalList[i]).toFixed(2)
          }
        }
        this.rowData.detail = []
        this.rowData.detail = this.rowData.detail.concat(checklist)
        // let i = 0
        // while(row[`date${i+1}`] != null){
        //   this.rowData.dates[i] = row[`date${i+1}`].split("T")[0]
        //   console.log(i++)
        // }

        this.rowData.dates = [null, null, null, null, null]
        for(let i = 0; i < this.rowData.dates.length; i++){
          if(row[`date${i+1}`] != null){
            let date = new Date(row[`date${i+1}`]);
            date.setHours(date.getHours() + 8);
            this.rowData.dates[i] = date.toISOString().split("T")[0]
          }
        }
        this.dialogVisible = true;
      },

      // 删除操作
      handleDelete(index, row){
        console.log('删除', index, row)
        this.$confirm('This action will permanently delete the order, do you want to continue?', 'hint', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          this.$api.delOrder({
            oid: row.oid
          }).then(res => {
            if(res.data.status === 200) {
                this.$message({
                type: 'success',
                message: 'Deleted successfully'
              })
              this.showOrders(1, this.type)                  // 更新视图
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'Cancelled'
          });          
        });
      },

      handleCancel(row){
        console.log("取消订单")
        this.$confirm(this.$t('orders.confirmMessages.cancel'), {
          confirmButtonText: this.$t('common.confirm'),
          cancelButtonText: this.$t('common.cancel'),
          type: 'warning'
        }).then(() => {
          this.$api.changeOrder({
            oid: row.oid,
            type: 4
          }).then(res => {
            if(res.data.status === 200) {
                this.$message({
                type: 'success',
                message: this.$t('orders.successMessages.cancel')
              })
              this.showOrders(1, this.type)                  // 更新视图
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('orders.cancelMessages.cancel')
          });          
        });
      }
    },

    created() {
      this.showOrders(1, this.type)
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

  .sbtn {
      margin: auto;
      height: 30%;
  }
  
  .ebtn {
    height: 40px;
    margin-left: 10px;
    margin-bottom: 9px;
  }

  .form{
    left: 1%;
  }

  .page {
    position: absolute;
    left: 40%;
  }

</style>