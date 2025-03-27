<template> 
  <div class="outDiv">
    <!-- 表单区域 -->
    <el-table
      class="feedback-table"
      :data="tableData"
      border
      stripe
      style="width: 100%">
      
      <el-table-column prop="fid" label="#" width="60" align="center"></el-table-column>

      <el-table-column prop="content" label="Feedback Contents" min-width="300">
        <template slot-scope="scope">
          <span class="feedback-content">{{ scope.row.content }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="time" label="Time" width="160" align="center"></el-table-column>

      <el-table-column label="Operation" width="180" align="center">
        <template slot-scope="scope">
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

    <!-- 分页器 -->
    <div class="pagination-container">
      <MyPage 
        :total="total" 
        :pageSize="pageSize" 
        @changePage="changePage" 
        :current-page="currentPage">
      </MyPage>
    </div>
  </div>
</template>

<script>
import MyPage from '../../components/MyPage.vue'

export default {
  components: {
    MyPage,
  },
  data() {
    return {
      tableData: [],
      total: 5,
      pageSize: 1,
      currentPage: 1,
    }
  },

  methods: {
    editProposal(page) {
      this.$api.editProposal({ page }).then(res => {
        if (res.status == 200) {
          this.tableData = res.data.data;
          this.total = res.data.total;
          this.pageSize = res.data.pageSize;
        }
      });
    },

    changePage(num) {
      this.currentPage = num;
      this.editProposal(num);
    },

    handleDelete(index, row) {
      this.$confirm('This action will permanently delete the feedback, continue or not?', 'Hint', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.$api.delProposal({ fid: row.fid }).then(res => {
          if (res.data.status === 200) {
            this.$message({ type: 'success', message: 'Deleted successfully' });
            location.reload();
          }
        });
      }).catch(() => {
        this.$message({ type: 'info', message: 'Cancelled' });          
      });
    },
  },

  created() {
    this.editProposal(1);
  }
}
</script>

<style scoped>
.outDiv {
  margin-top: 20px;
  width: 100%;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 美化表格 */
.feedback-table {
  border-radius: 12px;
  overflow: hidden;
}

/* 调整反馈内容的样式 */
.feedback-content {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  max-width: 100%;
}

/* 分页器样式优化 */
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

/* 响应式优化 */
@media (max-width: 768px) {
  .feedback-content {
    white-space: normal;
    word-wrap: break-word;
  }
}
</style>