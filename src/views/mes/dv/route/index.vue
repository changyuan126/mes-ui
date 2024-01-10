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
      <el-form-item label="线路名称" prop="lineName">
        <el-input
          v-model="queryParams.lineName"
          placeholder="请输入线路名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否启用" prop="enableFlag">
        <el-select
          v-model="queryParams.enableFlag"
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
            >新增线路</el-button
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
        <!-- <el-col :span="1.5">
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
        </el-col> -->
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
      <el-table-column
        label="AGV线路编码"
        width="120"
        align="center"
        prop="lineCode"
      />
      <el-table-column label="AGV线路名称" align="center" prop="lineName" />
      <el-table-column label="所属车间" align="center" prop="workshopName" />
      <el-table-column label="是否启用" align="center" prop="enableFlag">
        <template slot-scope="scope">
          <span class="el-table-column-span" v-if="scope.row.enableFlag == 'Y'"
            >是</span
          >
          <span
            class="el-table-column-span-1"
            v-if="scope.row.enableFlag == 'N'"
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
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="AGV线路编码" prop="lineCode">
              <el-input
                v-model="form.lineCode"
                placeholder="请输入AGV线路编码"
                maxlength="64"
              />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label-width="80">
              <el-switch
                v-model="autoGenFlag"
                active-color="#13ce66"
                active-text="自动生成"
                @change="handleAutoGenChange(autoGenFlag)"
              >
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label-width="120px"
              label="AGV线路名称"
              prop="lineName"
            >
              <el-input
                v-model="form.lineName"
                placeholder="请输入AGV线路名称"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="所属车间" prop="workshopId">
              <el-select
                v-model="form.workshopId"
                placeholder="请选择车间"
                style="width: 100%"
                value-key="workshopId"
              >
                <el-option
                  v-for="item in workshopOptions"
                  :key="item.workshopId"
                  :label="item.workshopName"
                  :value="item.workshopId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否启用" prop="enableFlag">
              <el-radio-group v-model="form.enableFlag">
                <el-radio label="Y">是</el-radio>
                <el-radio label="N">否</el-radio>
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
  findProAgvline,
  findLineCode,
  addProAgvline,
  updateProAgvline,
  deleteProAgvline,
} from "@/api/mes/dv/route";
import { listAllWorkshop } from "@/api/mes/md/workshop";
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
        lineName: null,
        enableFlag: null,
      },
      //车间选项
      workshopOptions: [],
      // 表单参数
      form: {},
      whetherEnabled: [
        {
          value: "Y",
          label: "是",
        },
        {
          value: "N",
          label: "否",
        },
      ],
      // 表单校验
      rules: {
        lineCode: [
          { required: true, message: "AGV线路编码不能为空", trigger: "blur" },
        ],
        workshopId: [
          { required: true, message: "所属车间不能为空", trigger: "blur" },
        ],
        lineName: [
          { required: true, message: "AGV线路名称不能为空", trigger: "blur" },
        ],
        enableFlag: [
          { required: true, message: "是否启用不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 列表 */
    getList() {
      this.loading = true;
      findProAgvline(this.queryParams).then((response) => {
        this.dvsubjectList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    getWorkshops() {
      listAllWorkshop().then((response) => {
        this.workshopOptions = response.data;
      });
    },
    // 取消按钮
    cancel() {
      this.reset();
      this.getList();
      this.open = false;
    },
    // 表单重置
    reset() {
      this.form = {
        subjectId: null,
        proAgvlineId: null,
        lineCode: null,
        lineName: null,
        workshopId: null,
        enableFlag: "Y",
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
      this.id = selection.map((item) => item.proAgvlineId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.getWorkshops();
      this.open = true;
      this.title = "新增AGV线路";
      findLineCode().then((response) => {
        this.form.lineCode = response.data.lineCode;
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getWorkshops();
      this.form = row;
      this.form.subjectId = row.proAgvlineId;
      this.open = true;
      this.title = "修改AGV线路";
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.subjectId != null) {
            updateProAgvline(this.form).then((response) => {
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
            addProAgvline(this.form).then((response) => {
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
      deleteProAgvline({ proAgvlineId: row.proAgvlineId }).then((response) => {
        this.$modal
          .confirm("是否确认删除当前的数据项？")
          .then(() => {
            if (response.code === 200) {
              this.$notify({
                title: "删除成功",
                message: response.msg,
                type: "success",
              });
              this.getList();
            }
          })
          .catch(() => {});
      });
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
    //自动生成物料编码
    handleAutoGenChange(autoGenFlag) {
      if (autoGenFlag) {
        findLineCode().then((response) => {
          this.form.lineCode = response.data.lineCode;
        });
      } else {
        this.form.lineCode = null;
      }
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
