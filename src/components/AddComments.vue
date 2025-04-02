<template>
    <div>
        <el-dialog
            title="Comment"
            :visible.sync="dialogVisible"
            width="70%"
            :before-close="handleClose">
            
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item :label="$t('comment.content')" prop="content">
                  <el-input type="textarea" v-model="ruleForm.content"></el-input>
                </el-form-item>
                <el-form-item :label="$t('comment.rating')" prop="content">
                    <rating @rating-selected="onRatingSelected"></rating>
                </el-form-item>
            </el-form>
            
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submit('ruleForm')">{{$t('comment.publish')}}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import store from '../store/index'
import Rating from './Rating.vue'

export default {
    inject: ['reload'],
    name: 'Addcomments',
    components: {
        Rating
    },
    props: {
        dialogVisible: {
            type: Boolean,
            default() {
                return false;
            }
        },

        gid: {
            type: String,
            default() {
                return '';
            }
        },
    },

    data() {
        return {
            ruleForm: {
                content:'',
                rating: 0,
            },

            rules: {
                content: [
                    { required: true, message: 'Please enter a comment', trigger: 'blur' },
                    
                ],
            }
      }
    },

    methods: {
        // 弹窗关闭时触发的事件
        handleClose(){
            console.log('Close event triggered')
            // this.dialogVisible = false
            this.$emit('changeDialog')
        },
    
        onRatingSelected(rating) {
            this.rating = rating;
            console.log(this.rating)
        },
        submit(formName) {
            this.$refs[formName].validate((valid) => {
                if(valid) {
                    console.log('Moving to the submission stage')
                    let content = this.ruleForm.content;
                    let gid = this.gid
                    let uid = store.state.loginModule.userinfo.uid
                    let rating = this.rating
                    this.$api.addComments({gid, uid, content, rating})
                    .then((res) => {
                        console.log('res: ', res)
                        if(res.data.status == 200){
                            this.$message({
                                message: this.$t('comment.publishSuccessfully'),
                                type: 'success'
                            });
                            setTimeout(() => {
                                this.reload()
                                this.$message({
                                message: this.$t('comment.publishSuccessfully'),
                                type: 'success'
                            });
                            }, 700);
                        }else {
                            this.$message({
                                message: this.$t('comment.publishFailed'),
                                type: 'error',
                                iconClass: 'el-icon-warning'
                            });
                            setTimeout(() => {
                                this.reload()
                                this.$message({
                                    message: this.$t('comment.publishFailed'),
                                    type: 'error',
                                    iconClass: 'el-icon-warning'
                                });
                            }, 700);
                            return false; 
                        }
                    }).catch((err) => {
                        console.log(err)
                    })
                }else {
                    return false
                }
            });
        }
        

    }
}
</script>

<style lang="scss" scoped>

</style>