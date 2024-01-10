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
      <el-form-item label="类型名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入类型名称"
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
      <el-form-item label="是否启用" prop="active">
        <el-select
          v-model="queryParams.active"
          placeholder="请选择是否启用"
          clearable
          style="width: 150px"
        >
          <el-option
            v-for="dict in whetherEnabled"
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
        <!-- <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="el-icon-download"
            size="mini"
            @click="handleExport"
            v-hasPermi="['mes:dv:dvsubject:export']"
            >导出</el-button
          >
        </el-col> -->
      </el-col>

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
      <el-table-column label="文档类型名称" align="center" prop="name" />
      <el-table-column label="是否启用" align="center" prop="active">
        <template slot-scope="scope">
          <span class="el-table-column-span" v-if="scope.row.active == '0'"
            >是</span
          >
          <span class="el-table-column-span-1" v-if="scope.row.active == '2'"
            >否</span
          >
        </template>
      </el-table-column>
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
        <el-row>
          <el-col :span="12">
            <el-form-item label-width="120px" label="文档类型名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入文档类型名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否启用" prop="active">
              <!-- <el-radio-group v-model="form.enableFlag">
                <el-radio
                  v-for="dict in dict.type.sys_yes_no"
                  :key="dict.value"
                  :label="dict.value"
                  >{{ dict.label }}</el-radio
                >
              </el-radio-group> -->

              <el-radio-group v-model="form.active">
                <el-radio :label="0">是</el-radio>
                <el-radio :label="2">否</el-radio>
              </el-radio-group>
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
  </div>
</template>

<script>
import {
  list,
  updateTeam,
  reviseFile,
  delTeam,
} from "@/api/management/documentType";
import { genCode } from "@/api/system/autocode/rule";
export default {
  name: "Dvsubject",
  dicts: ["sys_yes_no", "mes_dvsubject_type"],
  data() {
    return {
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
        name: null,
        active: null,
      },
      // 表单参数
      form: {
        subjectId: null,
        active: 0,
      },
      whetherEnabled: [
        {
          value: "0",
          label: "是",
        },
        {
          value: "2",
          label: "否",
        },
      ],
      // 表单校验
      rules: {
        name: [
          { required: true, message: "文档类型名称不能为空", trigger: "blur" },
        ],
        active: [
          { required: true, message: "是否启用不能为空", trigger: "blur" },
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
        name: null,
        active: 0,
        remark: null,
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
      this.id = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "新增代码";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.form = row;
      this.form.subjectId = row.id;
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
      //   this.download(
      //     "dv/dvsubject/export",
      //     {
      //       ...this.queryParams,
      //     },
      //     `dvsubject_${new Date().getTime()}.xlsx`
      //   );
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-card .el-card__header {
  padding: 10px 20px;
  background: #f3f2f2;
}

.el-table-column-span {
  background-color: #e8f4ff;
  border-color: #d1e9ff;
  color: #1890ff;
  display: inline-block;
  padding: 0 15px;
  line-height: 30px;
  font-size: 12px;
  border-width: 1px;
  border-style: solid;
  border-radius: 4px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  white-space: nowrap;
}
.el-table-column-span-1 {
  background-color: #ffeded;
  border-color: #ffdbdb;
  color: #ff4949;
  display: inline-block;
  padding: 0 15px;
  line-height: 30px;
  font-size: 12px;
  border-width: 1px;
  border-style: solid;
  border-radius: 4px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  white-space: nowrap;
}
</style>
