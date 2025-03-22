<template>
    <div>
        <el-dialog
            title="Comment"
            :visible.sync="dialogVisible"
            width="70%"
            :before-close="handleClose">
            
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="内容" prop="content">
                  <el-input type="textarea" v-model="ruleForm.content"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submit('ruleForm')">Publish</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import store from '../store/index'

export default {
    inject: ['reload'],
    name: 'Addcomments',
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
                content:''
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
    
    
        submit(formName) {
            this.$refs[formName].validate((valid) => {
                if(valid) {
                    console.log('Moving to the submission stage')
                    let content = this.ruleForm.content;
                    let gid = this.gid
                    let uid = store.state.loginModule.userinfo.uid

                    this.$api.addComments({gid, uid, content})
                    .then((res) => {
                    if(res.status == 200){
                        this.$message({
                        message: 'Publish Successfully',
                        type: 'success'
                        });
                        setTimeout(() => {
                            this.reload()
                        }, 700);
                    }else {
                        this.$message.error('Failed to publish');
                        return false; 
                        }
                    });
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