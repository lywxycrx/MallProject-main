<template>
  <div class="admin-dashboard">
    <!-- 统计卡片区域 -->
    <div class="stat-cards">
      <el-row :gutter="24">
        <el-col :span="8">
          <div class="stat-card users-card">
            <div class="stat-icon-container">
              <i class="el-icon-s-custom stat-icon"></i>
            </div>
            <div class="stat-info">
              <div class="stat-title">Users</div>
              <div class="stat-value">{{ uNum }}</div>
            </div>
          </div>
        </el-col>

        <el-col :span="8">
          <div class="stat-card products-card">
            <div class="stat-icon-container">
              <i class="el-icon-s-goods stat-icon"></i>
            </div>
            <div class="stat-info">
              <div class="stat-title">Products</div>
              <div class="stat-value">{{ gNum }}</div>
            </div>
          </div>
        </el-col>

        <el-col :span="8">
          <div class="stat-card feedback-card">
            <div class="stat-icon-container">
              <i class="el-icon-s-comment stat-icon"></i>
            </div>
            <div class="stat-info">
              <div class="stat-title">Feedbacks</div>
              <div class="stat-value">{{ fNum }}</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    
    <!-- 反馈管理区域 -->
    <div class="feedback-section">
      <h2 class="section-title">Feedback Management</h2>
      <!-- 使用ref获取组件实例，以便后续可能的操作 -->
      <EditProposal ref="editProposal"></EditProposal>
    </div>
  </div>
</template>

<script>
import EditProposal from '../Admin/EditProposal.vue'

export default {
  components: {
    EditProposal,
  },
  data() {
    return {
      uNum: 0,
      gNum: 0,
      fNum: 0,
    }
  },

  created() {
    this.getUnum('users', 'uid');
    this.getGnum('goods', 'gid');
    this.getFnum('feedback', 'fid');
  },

  methods: {
    getUnum(tableName, column) {
      this.$api.getNum({
        tableName,
        column,
      }).then(res => {
        if (res.status == 200) {
          this.uNum = res.data.num;
        }
      });
    },

    getGnum(tableName, column) {
      this.$api.getNum({
        tableName,
        column,
      }).then(res => {
        if (res.status == 200) {
          this.gNum = res.data.num;
        }
      });
    },

    getFnum(tableName, column) {
      this.$api.getNum({
        tableName,
        column,
      }).then(res => {
        if (res.status == 200) {
          this.fNum = res.data.num;
        }
      });
    },
  }
}
</script>

<style>
/* 注意：这里将scoped移除，以便样式应用到子组件 */
.admin-dashboard {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

/* 统计卡片样式 */
.stat-cards {
  margin-bottom: 30px;
}

.stat-card {
  height: 120px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  padding: 0 25px;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.users-card {
  background: linear-gradient(135deg, #17d0b3 0%, #0fc4a7 100%);
}

.products-card {
  background: linear-gradient(135deg, #4ba2e2 0%, #3896d4 100%);
}

.feedback-card {
  background: linear-gradient(135deg, #0069a7 0%, #005d99 100%);
}

.stat-icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  margin-right: 20px;
}

.stat-icon {
  font-size: 36px;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-title {
  font-size: 18px;
  opacity: 0.9;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 36px;
  font-weight: bold;
}

/* 章节标题样式 */
.section-title {
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
  font-weight: 600;
  text-align: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

/* 反馈部分样式 */
.feedback-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

/* 关键：修改子组件的表格样式 */
.feedback-section .el-table {
  width: 100% !important;
  margin: 0 auto !important;
}

/* 分页居中 */
.feedback-section .el-pagination {
  text-align: center !important;
  margin-top: 20px !important;
  display: flex !important;
  justify-content: center !important;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .stat-card {
    margin-bottom: 15px;
  }
  
  .stat-icon {
    font-size: 30px;
  }
  
  .stat-value {
    font-size: 30px;
  }
}
</style>