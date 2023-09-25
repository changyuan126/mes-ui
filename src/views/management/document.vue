<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="文档名称" prop="fileName">
        <el-input
          v-model="queryParams.fileName"
          placeholder="请输入文档名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="项目名称" prop="subjectName">
        <el-input
          v-model="queryParams.subjectName"
          placeholder="请输入项目名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item label="" prop="type">
        <el-select
          v-model="queryParams.type"
          placeholder="请选择"
          clearable
          style="width: 150px"
        >
          <el-option
            v-for="dict in listTypeArr"
            :key="dict.id"
            :label="dict.name"
            :value="dict.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col style="width: 90%">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
            v-hasPermi="['mes:dv:dvsubject:add']"
            >新增</el-button
          >
        </el-col>
        <!-- <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="el-icon-edit"
            size="mini"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['mes:dv:dvsubject:edit']"
            >修改</el-button
          >
        </el-col> -->
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['mes:dv:dvsubject:remove']"
            >删除</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="el-icon-download"
            size="mini"
            @click="handleExport"
            v-hasPermi="['mes:dv:dvsubject:export']"
            >导出</el-button
          >
        </el-col>
      </el-col>
      <!-- <el-col :span="1">
        <el-button type="primary" size="mini" @click="Notificationsettings"
          >文档类型管理</el-button
        >
      </el-col> -->

      <!-- <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar> -->
    </el-row>

    <el-table
      v-loading="loading"
      :data="dvsubjectList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="文档名称" align="center" prop="fileName" />
      <el-table-column label="文档编号" align="center" prop="fileCode" />
      <el-table-column
        label="版本号"
        align="center"
        prop="version"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="文档类型"
        align="center"
        prop="typeName"
        :show-overflow-tooltip="true"
      />
      <!-- <el-table-column label="是否启用" align="center" prop="enableFlag">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.sys_yes_no"
            :value="scope.row.enableFlag"
          />
        </template>
      </el-table-column> -->
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="更新时间"
        align="center"
        prop="updateTime"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-download"
            @click="handleExportArr(scope.row)"
            v-hasPermi="['mes:dv:dvsubject:edit']"
            >导出</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['mes:dv:dvsubject:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['mes:dv:dvsubject:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改设备点检保养项目对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="960px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="文档名称" prop="fileName">
          <el-input v-model="form.fileName" placeholder="请输入文档名称" />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="文档编号" prop="fileCode">
              <el-input v-model="form.fileCode" placeholder="请输入文档编号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="版本号" prop="version">
              <el-input v-model="form.version" placeholder="请输入版本号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="文档类别" prop="typeName">
              <el-select
                v-model="form.typeName"
                placeholder="请选择文档类别"
                clearable
                style="width: 100%"
                @change="typeNameArr($event)"
                value-key="id"
              >
                <el-option
                  v-for="dict in listTypeArr"
                  :key="dict.id"
                  :label="dict.name"
                  :value="dict"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="文件上传:"
              prop="originalName"
              label-width="100px"
            >
              <el-upload
                ref="originalName"
                class="upload-demo"
                :headers="this.headers"
                action="/prod-api/common/uploadMinio"
                :before-remove="beforeRemove"
                :on-change="customUploadChangeImage2"
                :before-upload="beforeUpload"
                :on-exceed="handleExceedImage1"
                accept=".PDF"
                name="file"
                multiple
                :limit="1"
                :file-list="fileList"
              >
                <el-button size="small" type="primary" icon="el-icon-upload2"
                  >点击上传</el-button
                >
                <el-button type="primary" size="small" @click.stop="previewFile"
                  >&nbsp;预览文件</el-button
                >
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="备注" prop="remark">
          <el-input
            type="textarea"
            :rows="4"
            v-model="form.remark"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 文档类型管理 -->
    <!-- <el-dialog
      title="文档类型管理"
      :visible.sync="NotificationsettingsV"
      center
    >
      <el-form ref="documentType" :model="documentType">
        <span>
          <el-form-item label-width="130px" label="新增文档类型名称">
            <el-input
              size="small"
              v-model="addPriceForm.unit"
              style="width: 30%"
            />&nbsp;&nbsp;
            <el-button type="primary" size="small" @click="showAddPrice"
              >添加</el-button
            >
          </el-form-item>
        </span>
        <el-card shadow="never">
          <div slot="header">
            <span>现有文件类型</span>
          </div>
          <el-row>
            <el-col
              :span="6"
              v-for="(item, index) in documentType"
              :key="index"
            >
              <el-form-item label-width="30px">
                <el-input
                  v-model="item.unit"
                  size="small"
                  :disabled="true"
                  :max="99999.99"
                  style="width: 60%"
                />
                <el-button
                  type="danger"
                  plain
                  size="small"
                  icon="el-icon-close"
                  @click.prevent="removeDomain(item)"
                ></el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="NotificationsettingsV = false">取消</el-button>
        <el-button type="primary" @click="validatoProInput">确认</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
import {
  list,
  updateTeam,
  reviseFile,
  delTeam,
  listType,
} from "@/api/management/document";
import { genCode } from "@/api/system/autocode/rule";
import { getToken } from "@/utils/auth";
export default {
  name: "Dvsubject",
  dicts: ["sys_yes_no", "mes_dvsubject_type"],
  data() {
    return {
      // 设置上传的请求头部
      headers: { Authorization: "Bearer " + getToken() },
      autoGenFlag: false,
      // 遮罩层
      loading: false,
      // 选中数组s
      id: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 设备点检保养项目表格数据
      dvsubjectList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        fileName: null,
        type: null,
        ids: null,
      },
      // 表单参数
      form: { typeName: "", type: "", url: "", originalName: "" },
      // 文档类型管理弹框
      // NotificationsettingsV: false,
      // 弹框数据
      documentType: [
        {
          unit: "第一方",
        },
        {
          unit: "第二方",
        },
        {
          unit: "第三方",
        },
        {
          unit: "第四方",
        },
        {
          unit: "第五方",
        },
      ],
      addPriceForm: {
        unit: "",
      },
      // 文件类型列表
      listTypeArr: {},
      fileList: [],
      // 表单校验
      rules: {
        fileName: [
          { required: true, message: "文档名称不能为空", trigger: "blur" },
        ],
        fileCode: [
          { required: true, message: "文档编号不能为空", trigger: "blur" },
        ],
        type: [{ required: true, message: "请选择项目类型", trigger: "blur" }],
        originalName: [
          { required: true, message: "文件上传不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询设备点检保养项目列表 */
    getList() {
      this.loading = true;
      list(this.queryParams).then((response) => {
        this.dvsubjectList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
      listType().then((response) => {
        console.log(response);
        this.listTypeArr = response.rows;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        subjectId: null,
        fileName: null,
        fileCode: null,
        type: null,
        remark: null,
        createTime: null,
        updateTime: null,
        url: null,
        originalName: null,
      };
      this.autoGenFlag = false;
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.id = selection.map((item) => item.id);
      this.queryParams.ids = this.id.join(",");
      console.log(this.queryParams.ids);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.fileList = [];
      listType().then((response) => {
        console.log(response);
        this.listTypeArr = response.rows;
      });
      this.open = true;
      this.title = "新增文档";
    },

    typeNameArr(e) {
      console.log(e);
      this.form.typeName = e.name;
      this.form.type = e.id;
    },

    beforeUpload(e) {
      // console.log(e);
      this.files = e;
    },
    customUploadChangeImage2(files) {
      console.log(files);
      if (files.status === "ready") return;
      if (files.status === "success") {
        const res = files.response || {};
        if (res && res.code === 200) {
          this.form.url = files.response.url;
          this.form.originalName = files.response.originalFileName;
          this.$message({
            type: "success",
            message: "上传成功!",
          });
          this.uploadVisible = false;
        } else {
          this.$message.error("上传失败!");
          this.fileList = [];
        }
      } else {
        this.$message.error("上传失败!");
        this.fileList = [];
      }
    },

    // 删除文件
    beforeRemove(files, fileList) {
      return this.$confirm(`确定移除 ${files.name}？`);
    },

    // 上传按钮 限制图文件大小和类型
    handleChangeUpload(file, fileList) {
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 10MB!");
        return false;
      }
    },
    handleExceedImage1(file, fileList) {
      // console.log(file);
      this.$message.warning(`当前限制上传 1 个文件，以上传 ${file.length} 个`);
    },

    //预览文件
    previewFile() {
      console.log(this.form);
      if (this.form.url != undefined && this.form.url != "") {
        var url = this.form.url;
        window.open(url);
      } else {
        this.$message.warning(`请上传文件`);
      }
    },

    /** 修改按钮操作 */
    handleUpdate(row) {
      console.log(row);
      this.reset();
      this.fileList = [];
      this.form = row;
      var name = {};
      this.$set(name, "name", row.originalName);
      this.fileList.push(name);
      console.log(this.fileList);
      this.form.subjectId = row.id || this.id;
      this.open = true;
      this.title = "修改文档";
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.subjectId != null) {
            reviseFile(this.form).then((response) => {
              if (response.code === 200) {
                this.$notify({
                  title: "修改成功",
                  message: response.msg,
                  type: "success",
                });
                this.open = false;
                this.getList();
              }
            });
          } else {
            updateTeam(this.form).then((response) => {
              if (response.code === 200) {
                this.$notify({
                  title: "新增成功",
                  message: response.msg,
                  type: "success",
                });
                this.open = false;
                this.getList();
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const subjectIds = row.id || this.id;
      this.$modal
        .confirm("是否确认删除当前的数据项？")
        .then(function () {
          return delTeam(subjectIds);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "/cad/file/export",
        {
          ...this.queryParams,
        },
        `calplan_${new Date().getTime()}.xlsx`
      );
    },

    /** 单选导出按钮操作 */
    handleExportArr(e) {
      this.queryParams.ids = e.id;
      this.download(
        "/cad/file/export",
        {
          ...this.queryParams,
        },
        `calplan_${new Date().getTime()}.xlsx`
      );
    },

    // // 文档类型管理弹框
    // Notificationsettings() {
    //   this.addPriceForm = {
    //     unit: "",
    //     type: 1,
    //   };
    //   this.NotificationsettingsV = true;
    //   // reagentsGlance.unitDropDown().then(res => {
    //   //   console.log(res);
    //   //   if (res.code === 200) {
    //   //     this.documentType.measureList = res.result.measureList || [];
    //   //     this.documentType.smallList = res.result.smallList || [];
    //   //     this.documentType.bigList = res.result.bigList || [];
    //   //   }
    //   // });
    // },
    //新增文档类型
    // showAddPrice() {
    //   // if (this.addPriceForm.unit != "") {
    //   //   this.orderForm.bigList.push({
    //   //     unit: this.addPriceForm.unit,
    //   //     type: 1,
    //   //   });
    //   //   reagentsGlance
    //   //     .addReagentUnit({ unit: this.addPriceForm.unit, type: 1 })
    //   //     .then((res) => {
    //   //       console.log(22);
    //   //       if (res.code === 200) {
    //   //         console.log(res);
    //   //         this.$notify({
    //   //           title: "成功",
    //   //           message: res.message,
    //   //           type: "success",
    //   //         });
    //   //         this.orderDialogVisible = false;
    //   //       } else {
    //   //         this.$notify({
    //   //           title: "失败",
    //   //           message: res.message,
    //   //           type: "error",
    //   //         });
    //   //       }
    //   //     });
    //   // } else {
    //   //   this.$message.warning("请录入文档类型");
    //   // }
    // },
    //删除文档类型
    // removeDomain(item) {
    //   // this.$confirm('是否确认删除名称为"' + item.unit + '"的单位?', "警告", {
    //   //   confirmButtonText: "确定",
    //   //   cancelButtonText: "取消",
    //   //   type: "warning",
    //   // }).then(() => {
    //   //   reagentsGlance
    //   //     .removeUnit({
    //   //       id: item.id,
    //   //     })
    //   //     .then((result) => {
    //   //       if (result.code === 200) {
    //   //         var index = this.orderForm.smallList.indexOf(item);
    //   //         if (index !== -1) {
    //   //           this.orderForm.smallList.splice(index, 1);
    //   //         }
    //   //         this.$notify({
    //   //           title: "成功",
    //   //           message: result.message,
    //   //           type: "success",
    //   //         });
    //   //       } else {
    //   //         this.$notify({
    //   //           title: "失败",
    //   //           message: result.message,
    //   //           type: "error",
    //   //         });
    //   //       }
    //   //     });
    //   // });
    // },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-card .el-card__header {
  padding: 10px 20px;
  background: #f3f2f2;
}
</style>
