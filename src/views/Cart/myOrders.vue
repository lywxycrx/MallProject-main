<template> 
  <div class="outDiv">
    <!-- 搜索栏区域 -->
    <div class="header">
      <el-input :placeholder="$t('orders.searchPlaceholder')" @change="searchInput" 
      v-model="input" clearable style="margin-right: 10px;">
      </el-input>
      <el-button type="primary">{{ $t('orders.select') }}</el-button>
    </div>

    <el-tabs v-model="activeName" @tab-click="cHandleClick">
      <el-tab-pane :label="$t('orders.status.pending')" name="Pending"></el-tab-pane>
      <el-tab-pane :label="$t('orders.status.delivering')" name="Delivering"></el-tab-pane>
      <el-tab-pane :label="$t('orders.status.completed')" name="Completed"></el-tab-pane>
      <el-tab-pane :label="$t('orders.status.abnormal')" name="Abnormal"></el-tab-pane>
      <el-tab-pane :label="$t('orders.status.cancelled')" name="Cancelled"></el-tab-pane>     
    </el-tabs>

      
    <!-- 表单区域 -->
    <el-table
      class="form"
      :data="tableData"
      border
      style="width: 100%">

      <el-table-column
        prop="oid"
        :label="$t('orders.table.orderNumber')"
        width="150">
      </el-table-column>
      <el-table-column
        prop="detail"
        :label="$t('orders.table.checklist')"
        width="200">
      </el-table-column>
      <el-table-column
        prop="price"
        :label="$t('orders.table.totalPrice')"
        width="120">
      </el-table-column>
      <el-table-column
        prop="address"
        :label="$t('orders.table.shippingAddress')"
        width="220">
      </el-table-column>
      <el-table-column
        prop="time"
        :label="$t('orders.table.purchaseDate')"
        width="180">
      </el-table-column>
      <el-table-column
        prop="type"
        :label="$t('orders.table.status')"
        width="180"
        :formatter="formatType">
      </el-table-column>
      <el-table-column
        :label="$t('orders.table.operation')"
        width="220">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="info"
                @click="handleDetails(scope.row)"
                icon="el-icon-view">
                {{ $t('orders.actions.details') }}
              </el-button>
              <el-button
                size="mini"
                type="warning"
                @click="handleCancel(scope.row)"
                icon="el-icon-close"
                v-show="CancelType">
                {{ $t('orders.actions.cancel') }}
              </el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
                icon="el-icon-delete"
                v-show="dType">
                {{ $t('orders.actions.delete') }}
              </el-button>
            </template>
        </el-table-column>
    </el-table>

    <MyPage :total="total" :pageSize="pageSize" @changePage="changePage" class="page" :current-page="currentPage"></MyPage>

    <el-dialog :visible.sync="dialogVisible" :title="$t('orders.details.title')">
      <h3>{{ $t('orders.details.orderNumber') }}: {{ rowData.oid }}</h3>
      <p>{{ $t('orders.details.shippingAddress') }}: {{ rowData.address }}</p>
      <p>{{ $t('orders.details.creatingTime') }}: {{ rowData.time }}</p>
      <p>{{ $t('orders.details.shippingTime') }}: {{ rowData.dates[0] }}<span v-if="rowData.dates[0] == null">{{ $t('orders.details.notShipped') }}</span></p>
      <p v-if="rowData.dates[4] == null">{{ $t('orders.details.completedTime') }}: {{ rowData.dates[1] }}<span v-if="rowData.dates[1] == null">{{ $t('orders.details.notCompleted') }}</span></p>
      <p v-if="rowData.dates[2] != null">{{ $t('orders.details.problemTime') }}: {{ rowData.dates[2] }}</p>
      <p v-if="rowData.dates[2] != null">{{ $t('orders.details.solveTime') }}: {{ rowData.dates[3] }}<span v-if="rowData.dates[3] == null">{{ $t('orders.details.notResolved') }}</span></p>
      <p v-if="rowData.dates[4] != null">{{ $t('orders.details.cancelTime') }}: {{ rowData.dates[4] }}</p>
      <p>{{ $t('orders.details.type') }}: 
        <span v-if="type == 0">{{ $t('orders.status.pending') }}</span>
        <span v-else-if="type == 1">{{ $t('orders.status.delivering') }}</span>
        <span v-else-if="type == 2">{{ $t('orders.status.completed') }}</span>
        <span v-else-if="type == 3">{{ $t('orders.status.abnormal') }}</span>
        <span v-else>{{ $t('orders.status.cancelled') }}</span>
      </p>

      <table border="1" style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th>{{ $t('orders.details.table.item') }}</th>
            <th>{{ $t('orders.details.table.quantity') }}</th>
            <th>{{ $t('orders.details.table.unitPrice') }}</th>
            <th>{{ $t('orders.details.table.subtotal') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item) of rowData.detail" :key="item.name">
            <td>{{ item.name }}</td>
            <td>{{ item.num }}</td>
            <td>{{ item.unit_price }}</td>
            <td>{{ item.subtotal }}</td>
          </tr>
          <tr>
            <td><strong>{{ $t('orders.details.table.total') }}</strong></td>
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
          detail: [],
          // dates: [this.$t('orders.details.notAvailable'), this.$t('orders.details.notAvailable'), 
          //        this.$t('orders.details.notAvailable'), this.$t('orders.details.notAvailable')]
          dates: [null, null, null, null, null]
        },     // 当前行的数据对象

        dType: false,   // 控制删除按钮是否显示
        CancelType: true
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
          this.myOrders(1, this.type);
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
                message: this.$t('orders.noOrderError')
              })
            }
          });
      },

      //类别显示
      formatType(order) {
        const typeMap = {
          0: this.$t('orders.status.pending'),
          1: this.$t('orders.status.delivering'),
          2: this.$t('orders.status.completed'),
          3: this.$t('orders.status.abnormal'),
          4: this.$t('orders.status.cancelled')
        };
        return typeMap[order.type] || this.$t('orders.status.unknown'); // 默认返回 'Unknown'
      },

      // 类别查询
      cHandleClick() {
        if(this.activeName === 'Pending'){
          this.type = 0
          this.dType = false
          this.CancelType = true
          this.myOrders(1, this.type)
        }else if(this.activeName === 'Delivering'){
          this.type = 1
          this.dType = false
          this.CancelType = false
          this.myOrders(1, this.type)
        }else if(this.activeName === 'Completed'){
          this.type = 2
          this.dType = false
          this.CancelType = false
          this.myOrders(1, this.type)
        }
        else if(this.activeName === 'Abnormal'){
          this.type = 3
          this.dType = false
          this.CancelType = true
          this.myOrders(1, this.type)
        }else if(this.activeName === 'Cancelled'){
          this.type = 4
          this.dType = false
          this.CancelType = false
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
        this.$confirm(this.$t('orders.confirmMessages.delete'), this.$t('common.hint'), {
          confirmButtonText: this.$t('common.confirm'),
          cancelButtonText: this.$t('common.cancel'),
          type: 'warning'
        }).then(() => {
          this.$api.delOrder({
            oid: row.oid
          }).then(res => {
            if(res.data.status === 200) {
                this.$message({
                type: 'success',
                message: this.$t('orders.successMessages.delete')
              })
              this.myOrders(1, this.type)                  // 更新视图
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('orders.cancelMessages.delete')
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
          this.rowData.status = this.$t('orders.status.pending')
        }else if(this.rowData.status == 1){
          this.rowData.status = this.$t('orders.status.delivering')
        }else if(this.rowData.status == 3){
          this.rowData.status = this.$t('orders.status.holding')
        }else if(this.rowData.status == 4){
          this.rowData.status = this.$t('orders.status.cancelled')
        }else{
          this.rowData.status = this.$t('orders.status.completed')
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

        // 重置日期数组
        // this.rowData.dates = [
        //   this.$t('orders.details.notAvailable'), 
        //   this.$t('orders.details.notAvailable'), 
        //   this.$t('orders.details.notAvailable'), 
        //   this.$t('orders.details.notAvailable')
        // ];
        
        // let i = 0
        // while(row[`date${i+1}`] != null){
        //   this.rowData.dates[i] = row[`date${i+1}`].split("T")[0]
        //   console.log(i++)
        // }
        this.rowData.dates = [null, null, null, null, null]
        for(let i = 0; i < this.rowData.dates.length; i++){
          if(row[`date${i+1}`] != null){
            this.rowData.dates[i] = row[`date${i+1}`].split("T")[0]
          }
        }

        this.dialogVisible = true;
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
              this.myOrders(1, this.type)                  // 更新视图
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