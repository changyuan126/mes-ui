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
      <el-form-item label="" prop="subjectCode">
        <el-input
          v-model="queryParams.subjectCode"
          placeholder="请输入设备编码/名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <!-- <el-form-item label="异常报警类型" label-width="100px" prop="subjectType">
        <el-select
          v-model="queryParams.subjectType"
          placeholder="请选择"
          clearable
          style="width: 150px"
        >
          <el-option
            v-for="dict in dict.type.mes_alarm_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item> -->

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
        label="设备编码"
        align="center"
        prop="machineryCode"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="设备名称"
        align="center"
        prop="machineryName"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="设备类别"
        align="center"
        prop="machineryTypeName"
        :show-overflow-tooltip="true"
      />
      <!-- <el-table-column
        label="异常报警类型"
        align="center"
        prop="warnType"
        :show-overflow-tooltip="true"
      /> -->
      <el-table-column
        label="异常报警内容"
        align="center"
        prop="message"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="异常报警时间"
        align="center"
        prop="warnTime"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="处理状态" align="center" prop="status">
        <template slot-scope="scope">
          <span class="el-table-column-span" v-if="scope.row.status == '0'"
            >未处理</span
          >
          <span class="el-table-column-span-1" v-if="scope.row.status == '1'"
            >已处理未解决</span
          >
          <span class="el-table-column-span-1" v-if="scope.row.status == '2'"
            >已处理已完成</span
          >
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="handleExportArr(scope.row)"
            v-hasPermi="['mes:dv:dvsubject:edit']"
            >查看</el-button
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

    <!-- 查看 -->
    <el-dialog
      :title="title"
      :visible.sync="openQuery"
      center
      width="800px"
      append-to-body
    >
      <el-form ref="form" :model="formQuery" label-width="130px">
        <el-row>
          <el-col :span="11">
            <el-form-item prop="abnormal" label="设备编码:">
              {{ formQuery.machineryCode }}
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item prop="abnormal" label="设备名称:">
              {{ formQuery.machineryName }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item prop="abnormal" label="设备类型:">
              {{ formQuery.machineryTypeName }}
            </el-form-item>
          </el-col>
          <!-- <el-col :span="11">
            <el-form-item prop="abnormal" label="异常报警类型:">
              {{ formQuery.warnType }}
            </el-form-item>
          </el-col> -->
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item prop="abnormal" label="异常报警内容:">
              {{ formQuery.message }}
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item prop="abnormal" label="异常报警时间:">
              {{ formQuery.warnTime }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelQuery">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { list, edit } from "@/api/abnormalityAlarm/machineTool";
import { getToken } from "@/utils/auth";
export default {
  // name: "Dvsubject",
  dicts: ["sys_yes_no", "mes_alarm_type"],
  components: {},
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
      // 查看
      openQuery: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        machineryTypeId: "ROBOT",
      },
      // 表单参数
      form: {
        abnormal: 1,
        status: "",
        top: 0,
      },
      // 查看
      formQuery: {},

      statusArr: [
        {
          label: "未处理",
          value: 0,
        },
        {
          label: "已处理未解决",
          value: 1,
        },
        {
          label: "已处理已完成",
          value: 2,
        },
      ],
      // 表单校验
      rules: {
        abnormal: [
          { required: true, message: "设备是否异常不能为空", trigger: "blur" },
        ],
        status: [
          { required: true, message: "是否解决不能为空", trigger: "blur" },
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
    cancelQuery() {
      this.openQuery = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        abnormal: 1,
        status: "",
        top: 0,
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
    /** 查看 **/
    handleExportArr(row) {
      this.formQuery = row;
      this.openQuery = true;
      this.title = "查看";
    },
    /** 置顶操作 */
    handleDelete(row) {
      console.log(row);
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
