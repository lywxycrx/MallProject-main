<template>
    <div>
        <el-dialog
        :title="title"
        :visible.sync="dialogVisible"
        :update="update"
        width="50%"> 

             <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="Name" prop="name">
                  <el-input v-model="ruleForm.name"></el-input>
                </el-form-item>

                <el-form-item label="Price" prop="price" style="float: left;">
                  <el-input v-model="ruleForm.price"></el-input>
                </el-form-item>

                <el-form-item label="Inventory" prop="stock">
                  <el-input v-model="ruleForm.stock"></el-input>
                </el-form-item>

                <el-form-item label="Category" prop="type" style="float: left;">
                    <el-select v-model="ruleForm.type" placeholder="Please select a category">
                      <el-option label="Latest" value="0"></el-option>
                      <el-option label="Popular" value="1"></el-option>
                      <el-option label="Recommended" value="2"></el-option>
                      <el-option label="Sale" value="3"></el-option>
                      <el-option label="Hot" value="4"></el-option>
                      <el-option label="Limited Stock" value="5"></el-option>
                    </el-select>
                </el-form-item>

                <!-- <el-form-item label="Rating" prop="score">
                    <el-select v-model="ruleForm.score" placeholder="Please rate">
                      <el-option label="1" value="1"></el-option>
                      <el-option label="2" value="2"></el-option>
                      <el-option label="3" value="3"></el-option>
                      <el-option label="4" value="4"></el-option>
                      <el-option label="5" value="5"></el-option>
                    </el-select>
                </el-form-item> -->

                <el-form-item label="Parameters" prop="parameter">
                  <el-input type="textarea"
                  maxlength="500"
                  show-word-limit  
                  v-model="ruleForm.parameter"></el-input>
                </el-form-item>

                <el-form-item label="Description" prop="introduction">
                  <el-input type="textarea" 
                  maxlength="300"
                  show-word-limit 
                  v-model="ruleForm.introduction"></el-input>
                </el-form-item>


                <el-form-item label="Thumbnail">
                  <span v-if="update">
                    <img :src="existingThumbnail" alt="Existing Image" height="130" width="130"/>
                    Replacement of thumbnails (up to one)
                  </span>
                  <UploadImg type="Thumbnail" :gid="ruleForm.gid" @sendImg = "sendImg" @update-image-type="forwardImageType"></UploadImg>
                  
                  <span slot="footer" class="dialog-footer">
                      <el-button type="primary">Confirm</el-button>
                      <el-button @click="dialogVisibleImg = false">Cancel</el-button>
                  </span>
                </el-form-item>

                <el-form-item label="Carousel">
                  
                  <UploadImg type="Carousel" :gid="ruleForm.gid" :initialCarousel="CarouselList"@sendImg = "sendImg"></UploadImg>
                    
                  <span slot="footer" class="dialog-footer">
                      <el-button type="primary">Confirm</el-button>
                      <el-button @click="dialogVisibleImg = false">Cancel</el-button>
                  </span>
                </el-form-item>

                <el-dialog
                title="提示"
                :visible.sync="dialogVisibleImg"
                width="30%"
                append-to-body>
                    <span slot="footer" class="dialog-footer">
                        <el-button type="primary">Confirm</el-button>
                        <el-button @click="dialogVisibleImg = false">Cancel</el-button>
                    </span>
                </el-dialog>

                <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')" 
                style="float: right; margin-top: 30px">Upload</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import { number } from 'echarts';
import UploadImg from '../../components/UploadImg.vue'

export default {
  components: {
      UploadImg,
    },

    props: {
      title: {
        type: String,
        default: 'Add product'
      },
      rowData: {
        type: Object,
        default: function() {
          return {}
        }
      },
      update: {
        type: Boolean,
        required: true
      },
      addpid: {
        type: Number,
        default: 0
      }
    },

    data() {
        return {
        dialogVisible: false,
        dialogVisibleImg: false,    // 上传图片弹窗
        imgUrl: '',
        fomate: '', // 图片格式

        ruleForm: {
          gid: '',
          name: '',
          type: '',
          score: '',
          stock: '',
          price: '',
          parameter: '', 
          introduction: '',
        },
        existingThumbnail: '',
        CarouselList: [],

        rules: {
          name: [
            { required: true, message: 'Please enter the product name', trigger: 'blur' },
            
          ],
          price: [
            { required: true, message: 'Please enter the product price', trigger: 'blur' },
            
          ],
          type: [
            { required: true, message: 'Please enter the product category', trigger: 'blur' },
            
          ],
          score: [
            { required: true, message: 'Please rate the product', trigger: 'blur' },
            
          ],
          stock: [
            { required: true, message: 'Please enter the product inventory', trigger: 'blur' },
            
          ],
          parameter: [
            { required: true, message: 'Please enter the product parameter', trigger: 'blur' },
            
          ],
          introduction: [
            { required: true, message: 'Please enter the product description', trigger: 'blur' },
            
          ],
        }
      };
    },
    // mounted() {
    //   console.log('mounted')
    //   this.ruleForm.gid = this.addpid
    //   console.log(this.ruleForm.gid)
    // },
    watch: {
      rowData(val) {
        console.log('触发监听器', val)
        this.ruleForm = val;
        // try{
        //   this.existingThumbnail = 'http://localhost:8888/Thumbnail/Thumbnail-' + this.ruleForm.gid + '.jpg'
        //   console.log(this.existingThumbnail)
        // }catch(err){
        //   this.existingThumbnail = 'http://localhost:8888/Thumbnail/Thumbnail-' + this.ruleForm.gid + '.png'
        //   console.log(this.existingThumbnail)
        // }
        fetch(this.existingThumbnail = 'http://localhost:8888/Thumbnail/Thumbnail-' + this.ruleForm.gid + '.jpg')
          .then(response => {
            if (response.status === 404) {
              // 如果返回 404，则替换为 PNG 格式的图片
              this.existingThumbnail = 'http://localhost:8888/Thumbnail/Thumbnail-' + this.ruleForm.gid + '.png';
            }
            console.log(this.existingThumbnail);
          })
          .catch(error => {
            console.error('请求出错:', error);
          });
        
        this.fetchCarousel()
        console.log(this.CarouselList)
      },
      addpid(newVal) {
        console.log('addpid changed to:', newVal);
        this.ruleForm.gid = this.addpid
      }
    },

    methods: {
      // 关闭弹窗时发送的事件
      handleDialogClose() {
          this.$emit('changeDialog')
        },

      // 获取图片地址
      sendImg(val, type) {
        console.log('显示图片路径', val)
        this.imgUrl = val
      },
      forwardImageType(imageType) {
        console.log("fomate: ", imageType)
        this.fomate = imageType
      },

      fetchCarousel() {
          fetch(`/api/getCarouselImages/${this.ruleForm.gid}`) // 传递参数
            .then(response => response.json())
            .then(data => {
              this.images = data.map(fileName => {
                const imagePath = `http://localhost:8888/Carousel/${fileName}`;
                this.CarouselList.push(imagePath);
                // return imagePath;
              });
            }).catch(error => {
              console.error("获取图片失败:", error);
            });
        },

        submitForm(formName) {
        this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log('进入提交阶段')
          let {gid, name, price, type, score, parameter, introduction, stock} = this.ruleForm;
          let imgUrl = `http://localhost:8888/Thumbnail/Thumbnail-${gid}.${this.fomate}`
          console.log('img:', imgUrl)
          if (this.title === 'Edit product') {
            // if(this.imgUrl != ''){        // 判断是否重新上传图片，若重新上传则重新赋值图片地址
            //   console.log(this.imgUrl)
            //   img = this.imgUrl;
            // }
            this.$api.updateGoods({gid, name, price, type, score, parameter, introduction, imgUrl, stock})
            .then((res) => {
              if(res.status == 200){
                this.$message({
                  type: 'success',
                  message: '修改成功'
                })
                setTimeout(() => {
                  history.go(0)
                }, 700);
              }else {
                this.$message({
                  type: 'error',
                  message: '修改失败'
                })
                return false;
              }
            })
          }else{
            console.log('添加商品')
            console.log(this.addpid)
            let imgUrl = `http://localhost:8888/Thumbnail/Thumbnail-${this.addpid}.${this.fomate}`//this.imgUrl;
            this.$api.addGoods({gid, name, price, type, score, parameter, introduction, imgUrl, stock, method: 'add'})
            .then((res) => {
              if(res.status == 200){
                this.$message({
                  type: 'success',
                  message: '添加成功' 
                })
                setTimeout(() => {
                  history.go(0)
                }, 700);
              }
            }) 
          }
        } else {
          console.log('添加失败');
          return false;
        }
        });
      },  
    }
}
</script>

<style scoped>
  .demo-ruleForm {
    left: 5% !important;
  }

  ::v-deep .el-form-item__content {
    display: flex;
    justify-content: start;
  }

  ::v-deep .el-upload--picture-card {
    width: 130px;
    height: 130px;
  }

</style>