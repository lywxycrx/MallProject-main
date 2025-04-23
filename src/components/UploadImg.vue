<template>
  <div>
    <el-upload 
      :action="uploadUrl"
      ref="upload"
      list-type="picture-card"
      :before-upload="beforeUpload"
      :on-preview="handlePictureCardPreview"
      :on-success="successUpload"
      :on-remove="handleRemove"
      :file-list="fileList">
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
import base from "../api/base.js"

export default {
  props: {
    type: {
      type: String,
      required: true
    },
    gid: {
      type: Number,
      required: true
    },
    initialCarousel: { // 新增属性接收初始图片
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      url: base.uploadUrl,   // 图片地址服务器
      fileList: [],
      dialogImageUrl: '',
      hasT: false,
      dialogVisible: false // 控制对话框的显示
    };
  },

  watch: {
    initialCarousel: {
    immediate: true,
    handler(newVal) {
      if (Array.isArray(newVal) && newVal.length) {
        this.fileList = []; // 清空现有文件列表
        for (let item of newVal) {
          this.fileList.push({ url: item });
        }
        console.log('Updated fileList: ', this.fileList);
      }
    }
  }
  },

  computed: {
    uploadUrl() {
      return `${this.url}?gid=${this.gid}&type=${this.type}`; // 构建 URL
    }
  },

  methods: {
    async handleRemove(file, fileList) {
      console.log(file, fileList);
      if (this.hasT && this.type == 'Thumbnail') {
        this.hasT = false;
      }
      if (this.type == 'Carousel'){
        try {
          const url = file.url.replace('http://localhost:8888', 'upload')
          await fetch('/api/deleteCarousel', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url }),
          });
        } catch (error) {
          console.error('Error while deleting a file:', error);
          this.$message.error('Error while deleting a file');
        }
      }
    },

    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },

    beforeUpload(file) {
      if (this.hasT) {
        this.$message.error('Only one thumbnail can be added');
        return false;
      }

      const isJPG = file.type === 'image/jpeg';
      const isPNG = file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 <= 3;
      if (!(isJPG || isPNG)) {
        this.$message.error('Uploading avatar images can only be in jpg/png format');
      }
      if (!isLt2M) {
        this.$message.error('The size of the uploaded avatar image can not exceed 3MB.');
      }
      if (isPNG) {
        this.$emit('update-image-type', 'png');
      } else if (isJPG) {
        this.$emit('update-image-type', 'jpg');
      }
      
      return (isPNG || isJPG) && isLt2M;
    },

    successUpload(res, file, fileList) {
      console.log('Uploaded successfully！', res, file, fileList);
      this.$message({
        message: 'Uploaded successfully',
        type: 'success'
      });
      if (this.type === 'Thumbnail') {
        this.hasT = true;
        let imgUrl = base.host + '/' + this.type + '/' + this.type + '-' + this.gid + '.' + file.name.substring(file.name.lastIndexOf('.') + 1);
        console.log("uploadimg下的imgUrl:", imgUrl);
        this.$emit('sendImg', imgUrl);
      }
    }
  },
  mounted() {
    // 将初始图片转换为符合el-upload的fileList格式
    console.log('this.initialCarousel: ', this.initialCarousel)
    for(let item of this.initialCarousel){
      console.log(item)
      this.fileList.push({ url: item })
    }
    console.log('this.fileList: ', this.fileList)
  }
}
</script>

<style scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>