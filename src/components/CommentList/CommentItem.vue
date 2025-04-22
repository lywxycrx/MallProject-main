<template>
    <div class="itemDiv">
        <div class="header">
            <h4>{{cItem.username}}</h4>
            <el-rate
              v-model="cItem.rate"
              disabled
              show-score
              text-color="#ff9900"
              score-template="{value}"
            ></el-rate>
            <el-button type="danger" class="delete-button" @click="handleDelete" v-if="(isMyComment)||(state == 1)">{{ $t('orders.actions.delete') }}</el-button>
        </div>
        <div class="box">
            <p>{{cItem.content}}</p>
            <span>{{cItem.time}}</span>
        </div>
        <div v-if="cItem.time2" class="box">
            <span v-if="daysDifference">{{ $t('comment.after') }}{{ daysDifference }}{{ $t('comment.days') }}</span>{{ $t('comment.followUp:') }}
            <p>{{cItem.content2}}</p>
            <span>{{cItem.time2}}</span>
        </div>
        <div v-if="(!cItem.time2)&&(isMyComment)" class="box">
            <el-button type="primary" icon="el-icon-edit" @click="addComment">{{ $t('comment.followUp') }}</el-button>
        </div>
    </div>
</template>

<script>

import store from '../../store/index'

export default {
    name: 'CommentList',
    props: {
        cItem: {
            type: Object,
            default() {
                return {}
            }
        }
    },

    data() {
        return {
            state: store.state.loginModule.userinfo.type,
        };
    },

    computed: {
        daysDifference() {
            const d1 = new Date(this.cItem.time);
            const d2 = new Date(this.cItem.time2);
            const timeDiff = Math.abs(d2 - d1);
            return Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // 1天 = 1000毫秒 * 60秒 * 60分钟 * 24小时
        },
        isMyComment() {
            return store.state.loginModule.userinfo.uid == this.cItem.uid
        }
    },

    mounted() {
        // console.log('列表：', this.cItem)
    },

    methods: {
        handleDelete(){
            this.$confirm('This action will permanently delete the comment, continue or not.?', 'Next', {
                confirmButtonText: 'Confirm',
                cancelButtonText: 'Cancel',
                type: 'warning'
            }).then(() => {
                this.$api.delComment({
                    cid: this.cItem.cid
                }).then(res => {
                    if(res.data.status === 200) {
                        this.$message({
                        type: 'success',
                        message: 'Deleted successfully'
                    })
                        window.location.reload();
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: 'Cancelled'
                });          
            });
        },
        addComment(){
            this.$emit('addComment')
        }
    },
};
</script>

<style scoped>
.itemDiv {
    height: auto; /* 自适应高度 */
    width: 99%;
    margin: auto;
    margin-top: 3px;
    padding: 10px; /* 添加内边距 */
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column; /* 垂直排列 */
}

.header {
    display: flex;
    justify-content: space-between; /* 头部内容左右对齐 */
    align-items: center; /* 垂直居中 */
}

.itemDiv h4 {
    margin: 0; /* 去掉默认外边距 */
}

.box {
    border: 1px solid #e0e0e0; /* 边框 */
    padding: 10px; /* 内边距 */
    margin-top: 10px; /* 顶部间距 */
    border-radius: 4px; /* 边角圆润 */
    background-color: #e4e4e4; /* 背景颜色 */
}
.delete-button:hover {
    background-color: #ff7875; /* 悬停时背景颜色变化 */
}

.high-contrast-mode .box {
    background-color: #484848;
}
</style>