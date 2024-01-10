<template>
  <div class="app-container">
    <el-card header="工厂信息维护" shadow="never" style="min-height:600px">
      <div style="width: 98%;margin:0 auto">
        <el-form ref="contractForm" :model="contractForm" :rules="contractRules" label-width="110px">
          <el-row>
            <el-col :span="12">
              <el-form-item prop="organName" label="工厂名称:" label-width="165px">
                <el-input v-model="contractForm.organName" :disabled="isEdit" maxlength="20" style="width: 350pxpx" placeholder="请录入工厂名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="organJurPerson" label="法定代表人:">
                <el-input v-model="contractForm.organJurPerson" style="width: 350pxpx" maxlength="10" placeholder="请录入法人" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="organPhone" label="工厂联系方式:" label-width="165px">
                <el-input v-model="contractForm.organPhone" style="width: 350pxpx" maxlength="15" placeholder="请录入工厂联系方式" />
              </el-form-item>
            </el-col>
            <!-- <el-col :span="12">
              <el-form-item prop="userName" label="用户名:" >
                <el-input v-model="contractForm.userName" style="width: 350pxpx" maxlength="30" placeholder="请录入用户名" />
              </el-form-item>
            </el-col> -->
            <el-col :span="12">
              <el-form-item prop="taxNumber" label="统一社会信用代码:" label-width="165px">
                <el-input v-model="contractForm.taxNumber" :disabled="isEdit" style="width: 350pxpx" maxlength="20" placeholder="请录入统一社会信用代码" />
              </el-form-item>
            </el-col>
          </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item  label="工厂顶图:" label-width="165px">
                  <el-upload
                    class="inline-block"
                    action="/prod-api/common/uploadMinio"
                    list-type="picture-card"
                    :headers="headers"
                    :auto-upload="false"
                    :on-success="handlerSuccess"
                    :on-change="changeLogo"
                    :on-remove="showLogo"
                    accept="jpeg,jpg,png"
                    name="file"
                    ref="upload"
                    :limit="1"
                  >
                    <img
                      v-show="isShow"
                      width="100%"
                      :src="this.contractForm.picture"
                    />
                    <!-- <i slot="default" class="el-icon-plus"></i> -->
                  </el-upload>
                  <span style="display:inline-block;position: relative;top: 60px;left:20px"><el-button plain @click="uploadImg" >上传</el-button></span>
                  <div style="color: red">注 ：您最多只能上传一张图片,图片尺寸为1000px*40px,并且图片大小不能超过2M</div>
                </el-form-item>
              </el-col>
            </el-row>
          <el-row>
            <el-col :span="24" style="text-align:center;">
              <el-button type="primary" @click="confirm"> 保 存 </el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
  import * as ownerServer from '@/api/ownerContract'
  import { getToken } from "@/utils/auth";
  export default {
    data() {
      return {
        headers: {
        Authorization: "Bearer " + getToken()
        },
        isShow:true,
        contractForm: {
          id: '',
          organName: '',
          contControlId: 'HT001',
          address: '',
          postCode: '',
          jurPerson: '',
          agentPerson: '',
          telFax: '',
          bankName: '',
          bankNo: '',
          taxNumber: ''
        },
        isEdit: false,
        contractRules: {
          organName: [{ required: true, message: '请录入工厂名称', trigger: 'blur' }],
          organJurPerson: [{ required: true, message: '请录入法定代表人', trigger: 'blur' }],
          organPhone: [{ required: true, message: '请录入工厂联系方式', trigger: 'blur' }],
          userName: [{ required: true, message: '请录入用户名', trigger: 'blur' }],
        },
        fileFormats:["jpep","png","jpg"],

      }
    },
    created() {
      this.getOwnInfo()
    },
    methods: {
      changeLogo(file){
        const isLt2M = file.size / 1024 / 1024 < 2;
        let suffixFile=file.name.substring(file.name.lastIndexOf("\.")+1);
        if (!this.fileFormats.includes(suffixFile)){
          this.$refs.upload.clearFiles();
          this.$message.error('上传图片格式只能是.jpg,.jpeg,.png');
        }else if(!isLt2M){
          this.$refs.upload.clearFiles();
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }else{
          let vue=this;
          let url = window.URL || window.webkitURL;
          let img = new Image();
          img.src = url.createObjectURL(file.raw);
          img.onload=function () {
            if(!(this.width==1000&&this.height==40)){
              vue.$refs.upload.clearFiles();
              vue.$message.error('图片尺寸必须是1000*40的图片');
            }else{
              vue.isShow=false;
            }
          }
        }
      },
      showLogo(){
        this.isShow=true;
      },
      handlerSuccess(companyImg) {
        console.log(companyImg);
        this.contractForm.picture = companyImg.fileName;
      },
      uploadImg() {
        if (this.$refs.upload.uploadFiles.length>0){
          this.$refs.upload.submit()
        }else{
          this.$message.error('请先选择图片');
        }
      },
      beforeLogoUpload(file) {
        // console.log(file);
        // const isJPG = file.type === 'image/jpeg';
        // const isLt2M = file.size / 1024 / 1024 < 2;
        //
        // if (!isJPG) {
        //   this.$message.error('上传头像图片只能是 JPG 格式!');
        // }
        // if (!isLt2M) {
        //   this.$message.error('上传头像图片大小不能超过 2MB!');
        // }
        // return isJPG && isLt2M;
      },
      getOwnInfo() {
          ownerServer.getOrganInfo().then(res => {
            if (res.code === 200 && res.data) {
              this.contractForm = res.data;
              this.$store.commit("companyImg/SET_LOGO",this.$store.getters.sysBaseUrl + '/reportImg/' + this.contractForm.picture);
              this.$store.commit("companyImg/SET_IS_LOGO",true);
              this.isEdit = true;
            }
          })
      },
      confirm() {
        this.$refs.contractForm.validate(valid => {
          if (valid) {
            this.contractForm.contControlId = 'HT001'
            if (!this.isEdit) {
              ownerServer.modifyOwnerContBaseById(this.contractForm).then(result => {
                if (result.code === 200) {
                  this.$notify({
                    title: '成功',
                    message: result.message,
                    type: 'success'
                  })
                  this.getOwnInfo()
                } else {
                  this.$notify({
                    title: '失败',
                    message: result.message,
                    type: 'error'
                  })
                }
              })
            } else {
              ownerServer.modifyOwnerContBaseById(this.contractForm).then(result => {
                if (result.code === 200) {
                  this.$notify({
                    title: '成功',
                    message: result.msg,
                    type: 'success'
                  })
                } else {
                  this.$notify({
                    title: '失败',
                    message: result.msg,
                    type: 'error'
                  })
                }
              })
            }
          } else {
            this.$message.error('请录入完整信息')
          }
        })
      }
    }
  }
</script>

<style scoped>

  ::v-deep .el-card .el-card__header {
    padding: 15px 20px;
    background: #F3F2F2;
  }
  .inline-block {
    display: inline-block;
    /*border: 1px solid black;*/
  }

  /*::v-deep .el-upload{*/
  /*width: 500px;*/
  /*}*/
</style>
