<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--分类数据-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
            v-model="machineryTypeName"
            placeholder="请输入分类名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container">
          <el-tree
            :data="machineryTypeOptions"
            :props="defaultPropss"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            default-expand-all
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <!--设备数据-->
      <el-col :span="20" :xs="24">
        <el-form
          :model="queryParams"
          ref="queryForm"
          size="small"
          :inline="true"
          v-show="showSearch"
          label-width="68px"
        >
          <el-form-item label="设备编码" prop="machineryCode">
            <el-input
              v-model="queryParams.machineryCode"
              placeholder="请输入设备编码"
              clearable
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="设备名称" prop="machineryName">
            <el-input
              v-model="queryParams.machineryName"
              placeholder="请输入设备名称"
              clearable
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
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
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['mes:dv:machinery:add']"
              >新增</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              plain
              icon="el-icon-edit"
              size="mini"
              :disabled="single"
              @click="handleUpdate"
              v-hasPermi="['mes:dv:machinery:edit']"
              >修改</el-button
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
              v-hasPermi="['mes:dv:machinery:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="info"
              plain
              icon="el-icon-upload2"
              size="mini"
              @click="handleImport"
              v-hasPermi="['mes:dv:machinery:import']"
              >导入</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              v-hasPermi="['mes:dv:machinery:export']"
              >导出</el-button
            >
          </el-col>
          <right-toolbar
            :showSearch.sync="showSearch"
            @queryTable="getList"
          ></right-toolbar>
        </el-row>

        <el-table
          v-loading="loading"
          :data="machineryList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column
            label="设备编码"
            width="120"
            align="center"
            key="machineryCode"
            prop="machineryCode"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                @click="handleView(scope.row)"
                v-hasPermi="['mes:dv:machinery:query']"
                >{{ scope.row.machineryCode }}</el-button
              >
            </template>
          </el-table-column>
          <el-table-column
            label="设备名称"
            min-width="120"
            align="left"
            key="machineryName"
            prop="machineryName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="品牌"
            align="left"
            key="machineryBrand"
            prop="machineryBrand"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="规格型号"
            align="left"
            key="machinerySpec"
            prop="machinerySpec"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="所属车间"
            align="center"
            key="workshopName"
            prop="workshopName"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="设备状态"
            align="center"
            key="status"
            prop="status"
          >
            <template slot-scope="scope">
              <dict-tag
                :options="dict.type.mes_machinery_status"
                :value="scope.row.status"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="创建时间"
            align="center"
            prop="createTime"
            width="160"
          >
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="160"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['mes:dv:machinery:edit']"
                >修改</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['mes:dv:machinery:remove']"
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
      </el-col>
    </el-row>

    <!-- 添加或修改设备对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="960px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="设备编码" prop="machineryCode">
              <el-input
                v-model="form.machineryCode"
                readonly="readonly"
                maxlength="64"
                v-if="optType == 'view'"
              />
              <el-input
                v-model="form.machineryCode"
                placeholder="请输入设备编码"
                maxlength="64"
                v-else
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
                v-if="optType != 'view'"
              >
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备名称" prop="machineryName">
              <el-input
                v-model="form.machineryName"
                maxlength="255"
                readonly="readonly"
                v-if="optType == 'view'"
              />
              <el-input
                v-model="form.machineryName"
                placeholder="请输入设备名称"
                maxlength="255"
                v-else
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="品牌" prop="machineryBrand">
              <el-input
                v-model="form.machineryBrand"
                maxlength="255"
                readonly="readonly"
                v-if="optType == 'view'"
              />
              <el-input
                v-model="form.machineryBrand"
                placeholder="请输入品牌"
                maxlength="255"
                v-else
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备分类" prop="machineryTypeId">
              <treeselect
                v-model="form.machineryTypeId"
                :options="machineryTypeOptions"
                :normalizer="normalizer"
                placeholder="请选择设备类型"
                @select="handleNode"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="ip地址" prop="ip">
              <el-input
                v-model="form.ip"
                maxlength="255"
                readonly="readonly"
                v-if="optType == 'view'"
              />
              <el-input
                v-model="form.ip"
                placeholder="请输入ip地址"
                maxlength="255"
                v-else
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="端口号" prop="port">
              <el-input
                v-model="form.port"
                maxlength="255"
                readonly="readonly"
                v-if="optType == 'view'"
              />
              <el-input
                v-model="form.port"
                placeholder="请输入端口号"
                maxlength="255"
                v-else
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="规格型号" prop="machinerySpec">
              <el-input
                v-model="form.machinerySpec"
                type="textarea"
                maxlength="255"
                readonly="readonly"
                v-if="optType == 'view'"
              />
              <el-input
                v-model="form.machinerySpec"
                type="textarea"
                placeholder="请输入规格型号"
                maxlength="255"
                v-else
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <!-- <el-form-item label="所属车间" prop="workshopName">
              <el-select
                v-model="form.workshopName"
                placeholder="请选择车间"
                style="width: 100%"
                value-key="workshopId"
                @change="handleAccompanyId"
              >
                <el-option
                  v-for="item in workshopOptions"
                  :key="item.workshopId"
                  :label="item.workshopName"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item> -->
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="关联代码程序" prop="idList">
              <el-select
                v-model="form.idList"
                placeholder="请选择关联代码程序"
                clearable
                filterable
                multiple
                style="width: 100%"
              >
                <el-option
                  v-for="dict in listTypeArr"
                  :key="dict.codeId"
                  :label="dict.codeName"
                  :value="dict.codeId"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="异常报警通知" prop="userName">
              <el-input
                style="width: 90%"
                v-model="userName"
                :readonly="true"
              />
              <el-button type="text" @click="addInvolvedUserId"
                >&nbsp;选择通知人</el-button
              >
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input
                v-model="form.remark"
                type="textarea"
                readonly
                v-if="optType == 'view'"
              ></el-input>
              <el-input
                v-model="form.remark"
                type="textarea"
                placeholder="请输入内容"
                v-else
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="cancel" v-if="optType == 'view'"
          >返回</el-button
        >
        <el-button type="primary" @click="submitForm" v-else>确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 物料导入对话框 -->
    <el-dialog
      :title="upload.title"
      :visible.sync="upload.open"
      width="400px"
      append-to-body
    >
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip text-center" slot="tip">
          <div class="el-upload__tip" slot="tip">
            <el-checkbox v-model="upload.updateSupport" />
            是否更新已经存在的设备数据
          </div>
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link
            type="primary"
            :underline="false"
            style="font-size: 12px; vertical-align: baseline"
            @click="importTemplate"
            >下载模板</el-link
          >
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="添加"
      :visible.sync="addInvolvedUserIdVisible"
      center
      width="70%"
    >
      <!-- 人员选择 -->
      <personnelSelection
        ref="checked"
        :inputValue="inputName"
        @getSelectList="getSelectList"
      />
      <div style="margin-top: -97px; text-align: center">
        <el-button @click="addInvolvedUserIdVisible = false">取消</el-button>
        <el-button type="primary" @click="saveInvolvedUserId">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listMachinery,
  getMachinery,
  delMachinery,
  addMachinery,
  updateMachinery,
  listMes,
  UserArr,
  machineryUsers,
} from "@/api/mes/dv/machinery";
import { listMachinerytype } from "@/api/mes/dv/machinerytype";
import { listAllWorkshop } from "@/api/mes/md/workshop";
import { genCode } from "@/api/system/autocode/rule";
import { getToken } from "@/utils/auth";
import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import personnelSelection from "../../../components/personnelSelection.vue";

export default {
  name: "Machinery",
  dicts: ["sys_yes_no", "mes_machinery_status"],
  components: { Treeselect, personnelSelection },
  data() {
    return {
      //自动生成编码
      autoGenFlag: false,
      optType: undefined,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 物料产品表格数据
      machineryList: [],
      // 弹出层标题
      title: "",
      // 设备类型树选项
      machineryTypeOptions: [],
      //车间选项
      workshopOptions: [],
      // 是否显示弹出层
      open: false,
      // 设备类型名称
      machineryTypeName: undefined,
      //自动生成物料编码标识
      autoGenFlag: false,
      // 表单参数
      form: {
        idList: "",
        workshopCode: "",
        workshopName: "",
        workshopId: "214",
      },
      defaultPropss: {
        children: "children",
        label: "machineryTypeName",
      },
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/mes/dv/machinery/importData",
      },
      machineryIdsArr: null,
      listTypeArr: {},
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        machineryCode: null,
        machineryName: null,
        machineryBrand: null,
        machinerySpec: null,
        machineryTypeId: null,
        machineryTypeCode: null,
        machineryTypeName: null,
        workshopId: null,
        workshopCode: null,
        workshopName: null,
        status: null,
      },

      addInvolvedUserIdVisible: false,
      // 部门名称
      deptName: undefined,
      // 部门树选项
      deptOptions: undefined,
      defaultProps: {
        children: "children",
        label: "label",
      },
      userName: undefined,

      UserAdd: {
        userIds: [],
        machineryId: "",
      },

      inputName: "",

      queryParamsdata: {},

      // 表单校验
      rules: {
        machineryCode: [
          { required: true, message: "设备编码不能为空", trigger: "blur" },
          { max: 64, message: "设备编码长度必须小于64个字符", trigger: "blur" },
        ],
        machineryName: [
          { required: true, message: "设备名称不能为空", trigger: "blur" },
        ],
        // workshopId: [
        //   { required: true, message: "车间不能为空", trigger: "blur" },
        // ],
        machineryTypeId: [
          { required: true, message: "设备分类不能为空", trigger: "blur" },
        ],
        // workshopName: [
        //   { required: true, message: "所属车间不能为空", trigger: "blur" },
        // ],
      },
    };
  },
  watch: {
    // 根据设备分类名称筛选分类树
    machineryTypeName(val) {
      this.$refs.tree.filter(val);
    },
  },
  created() {
    this.getList();
    this.getTreeselect();
  },
  methods: {
    /** 查询物料编码列表 */
    getList() {
      this.loading = true;
      listMachinery(this.queryParams).then((response) => {
        this.machineryList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    getWorkshops() {
      listAllWorkshop().then((response) => {
        this.workshopOptions = response.data;
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
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.machineryTypeName.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.machineryTypeId = data.machineryTypeId;
      this.queryParamsdata = data;
      this.handleQuery();
    },
    // 节点单击事件
    handleNode(data) {
      console.log(data);
      this.form.machineryTypeName = data.machineryTypeName;
      this.form.machineryTypeCode = data.code;
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        machineryId: null,
        machineryCode: null,
        machineryName: null,
        machineryBrand: null,
        machinerySpec: null,
        machineryTypeId: null,
        machineryTypeCode: null,
        machineryTypeName: null,
        workshopId: "214",
        workshopCode: null,
        workshopName: null,
        status: "STOP",
        remark: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        idList: "",
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
      this.ids = selection.map((item) => item.machineryId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    // 查询明细按钮操作
    handleView(row) {
      this.reset();
      this.getTreeselect();
      this.getWorkshops();
      const machineryId = row.machineryId || this.ids;
      getMachinery(machineryId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "查看设备信息";
        this.optType = "view";
      });
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.getTreeselect();
      this.getWorkshops();
      this.userName = "";
      this.inputName = "";
      // if (this.queryParamsdata.machineryTypeId != 0) {
      //   this.form = this.queryParamsdata;
      // }
      this.optType = "add";
      this.open = true;
      this.title = "新增设备";
      genCode("MACHINERY_CODE").then((response) => {
        this.form.machineryCode = response;
      });
    },

    saveInvolvedUserId() {
      this.addInvolvedUserIdVisible = false;
      // this.$emit("getSelectList", this.selectList);
    },

    //选择车间
    handleAccompanyId(val) {
      this.form.workshopCode = val.workshopCode;
      this.form.workshopName = val.workshopName;
      this.form.workshopId = val.workshopId;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      this.getWorkshops();
      const machineryId = row.machineryId || this.ids;
      getMachinery(machineryId).then((response) => {
        this.form = response.data;
        let arr = response.data.cadCodeMachineryList.map((item) => item.codeId);
        this.form.idList = arr;
        this.open = true;
        this.title = "修改设备";
        this.optType = "edit";
      });
      this.UserAdd.machineryId = row.machineryId;
      machineryUsers(this.UserAdd).then((response) => {
        this.userName = response.data.map((item) => item.nickName);
        this.inputName = response.data;
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.machineryId != undefined) {
            updateMachinery(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.exceptionAlert();
              this.open = false;
              this.getList();
            });
          } else {
            addMachinery(this.form).then((response) => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
              if (response.data != null) {
                this.UserAdd.machineryId = response.data;
                this.exceptionAlert();
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const machineryIds = row.machineryId || this.ids;
      this.$modal
        .confirm("确认删除数据项？")
        .then(function () {
          return delMachinery(machineryIds);
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
        "mes/dv/machinery/export",
        {
          ...this.queryParams,
        },
        `user_${new Date().getTime()}.xlsx`
      );
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "设备导入";
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      this.download(
        "mes/dv/machinery/importTemplate",
        {},
        `md_item_${new Date().getTime()}.xlsx`
      );
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert(
        "<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" +
          response.msg +
          "</div>",
        "导入结果",
        { dangerouslyUseHTMLString: true }
      );
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },
    //自动生成编码
    handleAutoGenChange(autoGenFlag) {
      if (autoGenFlag) {
        genCode("MACHINERY_CODE").then((response) => {
          this.form.machineryCode = response;
        });
      } else {
        this.form.machineryCode = null;
      }
    },

    // 添加授权使用人
    addInvolvedUserId() {
      this.addInvolvedUserIdVisible = true;
      // this.$refs.checked.addInvolvedUserId(); // 这样可以直接访问子组件方法,用ref拿子组件方法
    },

    //子组件传的数据
    getSelectList(value) {
      this.userName = "";
      this.userName = value.map((item) => item.nickName);
      this.UserAdd.userIds = value.map((item) => item.userId);
    },

    //新增设备关联通知人
    exceptionAlert() {
      UserArr(this.UserAdd).then((response) => {
        // this.$modal.msgSuccess("新增设备关联通知人成功");
      });
    },
  },
};
</script>
