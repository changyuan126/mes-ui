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
      <el-form-item label="代码名称" prop="subjectCode">
        <el-input
          v-model="queryParams.subjectCode"
          placeholder="请输入代码名称"
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
      <el-form-item label="" prop="subjectType">
        <el-select
          v-model="queryParams.subjectType"
          placeholder="请选择"
          clearable
          style="width: 150px"
        >
          <el-option
            v-for="dict in dict.type.mes_dvsubject_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
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

      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="dvsubjectList"
      @selection-change="handleSelectionChange"
      :header-cell-style="{
        background: '#eef1f6',
        color: '#606266',
        'text-align': 'center',
      }"
      stripe
      style="width: 100%"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        label="代码程序名称"
        align="center"
        prop="codeName"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="代码程序编号"
        align="center"
        prop="code"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="版本号"
        align="center"
        prop="version"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="所属设备类型"
        align="center"
        prop="machineryTypeName"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="关联设备"
        align="center"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <span
            v-for="(val, index) in scope.row.cadCodeMachineryList"
            :key="index"
          >
            <span class="apostrophe">{{ val.machineryName }}，</span>
          </span>
        </template>
      </el-table-column>
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

    <!-- 添加或修改对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="960px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="代码名称" prop="codeName">
          <el-input v-model="form.codeName" placeholder="请输入代码名称" />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="代码编号" prop="code">
              <el-input v-model="form.code" placeholder="请输入代码编码" />
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
            <el-form-item
              label="所属设备类别"
              label-width="120px"
              prop="machineryTypeId"
            >
              <treeselect
                v-model="form.machineryTypeId"
                :options="machineryTypeOptions"
                :normalizer="normalizer"
                placeholder="请选择所属分类"
                :disable-branch-nodes="true"
                @select="handleNodeClick"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="代码上传" prop="" label-width="100px">
              <el-upload
                ref="codeName"
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

        <el-form-item label="关联设备" prop="machineryIdsArr">
          <el-select
            v-model="machineryIdsArr"
            placeholder="请选择关联设备"
            clearable
            filterable
            multiple
            style="width: 100%"
            value-key="machineryId"
            @change="handleAccompanyId"
          >
            <el-option
              v-for="dict in listTypeArr"
              :key="dict.machineryId"
              :label="dict.machineryName"
              :value="dict"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  list,
  updateTeam,
  reviseFile,
  delTeam,
  listMachinery,
} from "@/api/management/codeprogram";
import { genCode } from "@/api/system/autocode/rule";
import { getToken } from "@/utils/auth";
import { listMachinerytype } from "@/api/mes/dv/machinerytype";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  name: "Dvsubject",
  dicts: ["sys_yes_no", "mes_dvsubject_type"],
  components: { Treeselect },
  data() {
    return {
      // 设置上传的请求头部
      headers: { Authorization: "Bearer " + getToken() },
      autoGenFlag: false,
      // 遮罩层
      loading: false,
      // 选中数组s
      ids: [],
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
        ids: null,
        subjectCode: null,
        subjectName: null,
        subjectType: null,
        subjectContent: null,
        subjectStandard: null,
        enableFlag: null,
        machineryTypeId: null,
      },
      machineryIdsArr: null,
      // 表单参数
      form: {
        subjectId: null,
        machineryTypeId: null,
        url: "",
        originalName: "",
        machineryIds: "",
        machineryTypeName: "",
      },
      fileList: [],
      listTypeArr: {},
      // 设备类型树选项
      machineryTypeOptions: [],
      machineryName: [],
      // 表单校验
      rules: {
        codeName: [
          { required: true, message: "代码名称不能为空", trigger: "blur" },
        ],
        code: [
          { required: true, message: "代码编码不能为空", trigger: "blur" },
        ],
        version: [
          { required: true, message: "版本号不能为空", trigger: "blur" },
        ],
        machineryTypeId: [
          { required: true, message: "所属设备类别不能为空", trigger: "blur" },
        ],
        machineryIds: [
          { required: true, message: "关联设备不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
    this.getTreeselect();
  },
  methods: {
    /** 查询设备点检保养项目列表 */
    getList() {
      this.loading = true;
      list(this.queryParams).then((response) => {
        this.dvsubjectList = response.data;
        this.total = response.data.length;
        this.loading = false;
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
        machineryTypeId: null,
        url: "",
        originalName: "",
        machineryIds: "",
        machineryTypeName: "",
      };
      this.autoGenFlag = true;
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
      this.ids = selection.map((item) => item.codeId);
      this.queryParams.ids = this.ids.join(",");
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.fileList = [];
      this.machineryIdsArr = {};
      this.listTypeArr = {};
      this.open = true;
      this.title = "新增代码";
    },

    /** 查询设备类型下拉树结构 */
    getTreeselect() {
      listMachinerytype().then((response) => {
        this.machineryTypeOptions = [];
        const data = this.handleTree(
          response.data,
          "machineryTypeId",
          "parentTypeId"
        )[0];
        this.machineryTypeOptions.push(data);
      });
    },

    /** 转换设备类型数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.machineryTypeId,
        label: node.machineryTypeName,
        children: node.children,
      };
    },

    // 节点单击事件
    handleNodeClick(data) {
      this.machineryIdsArr = [];
      this.form.machineryTypeName = data.machineryTypeName;
      let arr = {
        pageNum: 1,
        pageSize: 9999,
        machineryTypeId: null,
      };
      arr.machineryTypeId = data.machineryTypeId;

      listMachinery(arr).then((response) => {
        this.listTypeArr = response.rows;
      });
    },

    //选择关联的设备
    handleAccompanyId(val) {
      var arrid = [];
      for (var item of val) {
        arrid.push(item.machineryId);
        this.form.machineryIds = arrid.join(",");
      }
    },

    beforeUpload(e) {
      // console.log(e);
      this.files = e;
    },
    customUploadChangeImage2(files) {
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
      if (this.form.url != undefined && this.form.url != "") {
        var url = this.form.url;
        window.open(url);
      } else {
        this.$message.warning(`请上传文件`);
      }
    },

    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.fileList = [];
      this.machineryIdsArr = {};
      this.form = row;
      var name = {};
      if (row.originalName != undefined && row.originalName != "") {
        this.$set(name, "name", row.originalName);
        this.fileList.push(name);
      }
      let arr = {
        pageNum: 1,
        pageSize: 9999,
        machineryTypeId: null,
      };
      arr.machineryTypeId = row.machineryTypeId;
      listMachinery(arr).then((response) => {
        this.listTypeArr = response.rows;
      });
      let arr1 = row.cadCodeMachineryList.map((item) => item.machineryName);
      this.machineryIdsArr = arr1;
      let arr2 = row.cadCodeMachineryList.map((item) => item.machineryId);
      this.form.machineryIds = arr2.join(",");
      this.form.subjectId = row.codeId || this.ids;
      this.open = true;
      this.title = "修改代码";
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
                this.listTypeArr = {};
                this.machineryIdsArr = {};
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
                this.listTypeArr = {};
                this.machineryIdsArr = {};
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
      const subjectIds = row.codeId || this.ids;
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
        "/cad/code/export",
        {
          ...this.queryParams,
        },
        `calplan_${new Date().getTime()}.xlsx`
      );
    },

    /** 单选导出按钮操作 */
    handleExportArr(e) {
      this.queryParams.ids = e.codeId;
      this.download(
        "/cad/code/export",
        {
          ...this.queryParams,
        },
        `calplan_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-card .el-card__header {
  padding: 10px 20px;
  background: #f3f2f2;
}
::v-deep .el-table {
  .cell {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
