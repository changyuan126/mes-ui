<template>
  <div class="app-container">
    <el-row :gutter="10" v-if="optType != 'view'" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['mes:pro:proroute:add']"
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
          v-hasPermi="['mes:pro:proroute:edit']"
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
          v-hasPermi="['mes:pro:proroute:remove']"
          >删除</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="routeprocessList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" fixed prop="orderNum" />
      <el-table-column
        label="工序编码"
        width="120px"
        fixed
        align="center"
        prop="processCode"
      />
      <el-table-column
        label="工序名称"
        width="150px"
        fixed
        align="center"
        prop="processName"
      />
      <el-table-column
        label="下一道工序"
        width="150px"
        align="center"
        prop="nextProcessName"
      />
      <el-table-column
        label="与下一道工序关系"
        width="150px"
        align="center"
        prop="linkType"
      >
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.mes_link_type"
            :value="scope.row.linkType"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="关键工序"
        width="100px"
        align="center"
        prop="keyFlag"
      >
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.sys_yes_no"
            :value="scope.row.keyFlag"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="质检确认"
        width="100px"
        align="center"
        prop="isCheck"
      >
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.sys_yes_no"
            :value="scope.row.isCheck"
          />
        </template>
      </el-table-column>
      <el-table-column label="准备时间" align="center" prop="defaultPreTime" />
      <el-table-column label="等待时间" align="center" prop="defaultSufTime" />
      <el-table-column label="甘特图显示颜色" align="center" prop="colorCode">
        <template slot-scope="scope">
          <el-color-picker
            v-model="scope.row.colorCode"
            disabled
          ></el-color-picker>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        fixed="right"
        width="150px"
        v-if="optType != 'view'"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['mes:pro:proroute:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['mes:pro:proroute:remove']"
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

    <!-- 添加或修改工艺组成对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="1100px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="序号" prop="orderNum">
              <el-input-number
                :min="1"
                v-model="form.orderNum"
                placeholder="请输入序号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="工序类型" prop="processTypeId">
              <treeselect
                v-model="form.processTypeId"
                :options="machineryTypeOptions1"
                :normalizer="normalizer1"
                placeholder="请选择工序类型"
                @select="handleNodeProcess"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="工序" prop="processId">
              <el-select v-model="form.processId" placeholder="请选择工序">
                <el-option
                  v-for="item in processOptions"
                  :key="item.processId"
                  :label="item.processName"
                  :value="item.processId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="与下一道工序关系" prop="linkType">
              <el-tooltip effect="dark" placement="right">
                <div slot="content">
                  <div>F-to-S：当前工序结束生产，下一道工序才可开始生产</div>
                  <div>S-to-F：当前工序开始生产，下一道工序才可结束生产</div>
                  <div>F-to-F：当前工序结束生产，下一道工序才可结束生产</div>
                  <div>S-to-S：当前工序开始生产，下一道工序才可开始生产</div>
                </div>
                <el-select
                  v-model="form.linkType"
                  placeholder="请选择与下一道工序关系"
                >
                  <el-option
                    v-for="dict in dict.type.mes_link_type"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  ></el-option>
                </el-select>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="甘特图显示颜色" prop="colorCode">
              <el-color-picker v-model="form.colorCode"></el-color-picker>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-input
              v-model="form.colorCode"
              maxlength="7"
              placeholder="请输入颜色编码在左侧选择颜色"
            />
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否关键工序" prop="keyFlag">
              <el-tooltip effect="dark" placement="right">
                <div slot="content">
                  <div>
                    是：整个工单的生产进度将根据当前工序的生产报工数量进行更新
                  </div>
                  <div>每个工艺流程只能有一个关键工序</div>
                </div>
                <el-select v-model="form.keyFlag">
                  <el-option
                    v-for="dict in dict.type.sys_yes_no"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  ></el-option>
                </el-select>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否需要质检确认" prop="isCheck">
              <el-tooltip effect="dark" placement="right">
                <div slot="content">
                  <div>是：当前工序报工时需要进行质检确认</div>
                  <div>质检合格数量作为最终生产数量</div>
                </div>
                <el-select v-model="form.isCheck">
                  <el-option
                    v-for="dict in dict.type.sys_yes_no"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  ></el-option>
                </el-select>
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="准备时间" prop="defaultPreTime">
              <el-tooltip
                effect="dark"
                content="当前系统支持的最小时间粒度为1小时"
                placement="right"
              >
                <el-input-number
                  :min="0"
                  :step="1"
                  v-model="form.defaultPreTime"
                  placeholder="请输入准备时间"
                />
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="等待时间" prop="defaultSufTime">
              <el-input-number
                :min="0"
                :step="1"
                v-model="form.defaultSufTime"
                placeholder="请输入等待时间"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row>
          <el-col :span="12">
            <el-form-item label="是否工艺节点" prop="idid">
              <el-radio-group v-model="form.idid">
                <el-radio :label="0">是</el-radio>
                <el-radio :label="1">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row> -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="选择设备类型" prop="machineryTypeId">
              <treeselect
                v-model="form.machineryTypeId"
                :options="machineryTypeOptions"
                :normalizer="normalizer"
                placeholder="请选择设备类型"
                @select="handleNodeClick"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
            v-if="this.form.code == 'CNC' || this.form.code == 'ROBOT'"
          >
            <el-form-item label="选择代码" prop="url">
              <el-select
                v-model="form.originalName"
                value-key="codeId"
                @change="selectSource($event)"
              >
                <el-option
                  v-for="item in machineryList"
                  :key="item.codeId"
                  :label="item.codeName"
                  :value="{ url: item.codeId, originalName: item.code }"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" v-if="this.form.code == 'STORE'">
            <el-form-item label="选择出入库类型" prop="exitType">
              <el-radio-group v-model="form.exitType">
                <el-radio label="0">出库</el-radio>
                <el-radio label="1">入库</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col
            :span="12"
            v-if="
              this.form.code == 'AGV_TRANSMIT' ||
              this.form.code == 'TRANSMIT' ||
              this.form.code == 'ROBOT_TRANSMIT'
            "
          >
            <el-form-item label="传送带转动方向" prop="rotationDirection">
              <el-radio-group v-model="form.rotationDirection">
                <el-radio label="0">正转</el-radio>
                <el-radio label="1">反转</el-radio>
                <el-radio label="2">停止</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="this.form.code == 'ROBOT_TRANSMIT'">
            <el-form-item label="传送带位置" prop="conveyNumber">
              <el-radio-group v-model="form.conveyNumber">
                <el-radio label="1">1号传送带</el-radio>
                <el-radio label="2">2号传送带</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="this.form.code == 'CNC'">
            <el-form-item label="安全门状态" prop="securityDoor">
              <el-radio-group v-model="form.securityDoor">
                <el-radio label="0">开启</el-radio>
                <el-radio label="1">关闭</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" v-if="this.form.code == 'AGV'">
            <el-form-item label="选择线路" prop="lineId">
              <el-select
                v-model="form.lineId"
                placeholder="请选择线路"
                style="width: 100%"
                value-key="proAgvlineId"
              >
                <el-option
                  v-for="item in workshopOptions"
                  :key="item.proAgvlineId"
                  :label="item.lineName"
                  :value="item.proAgvlineId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="this.form.code == 'AGV'">
            <el-form-item label="选择点位" prop="pointId">
              <el-select
                v-model="form.pointId"
                placeholder="请选择点位"
                style="width: 100%"
                value-key="proAgvsiteId"
              >
                <el-option
                  v-for="item in dvsubjectList"
                  :key="item.proAgvsiteId"
                  :label="item.siteName"
                  :value="item.proAgvsiteId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input
                v-model="form.remark"
                type="textarea"
                placeholder="请输入内容"
              />
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
  </div>
</template>

<script>
import { list } from "@/api/management/codeprogram";
import { findProAgvline } from "@/api/mes/dv/route";
import { findProAgvsite } from "@/api/mes/dv/siteConfiguration";
import {
  listRouteprocess,
  getRouteprocess,
  delRouteprocess,
  addRouteprocess,
  updateRouteprocess,
} from "@/api/mes/pro/routeprocess";
import { listProcess } from "@/api/mes/pro/process";
import { getToken } from "@/utils/auth";
import {
  listMachinerytype,
  getMachinerytype,
} from "@/api/mes/dv/machinerytype";
import * as listType from "@/api/mes/pro/processType";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  name: "Routeprocess",
  dicts: ["mes_link_type", "sys_yes_no"],
  components: { Treeselect },
  data() {
    return {
      // 设置上传的请求头部
      headers: { Authorization: "Bearer " + getToken() },
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
      // 工艺组成表格数据
      routeprocessList: [],
      //工序选项
      processOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        routeId: this.routeId,
        processId: null,
        processCode: null,
        processName: null,
        orderNum: null,
        nextProcessId: null,
        nextProcessCode: null,
        nextProcessName: null,
        linkType: null,
        defaultPreTime: null,
        defaultSufTime: null,
        colorCode: null,
      },
      // 设备类型树选项
      machineryTypeOptions: [],
      machineryTypeOptions1: [],
      fileList: [],
      //车间线路
      workshopOptions: [],
      // 站点
      dvsubjectList: [],
      lineName: "",
      pointName: "",
      TypeId: false,
      Typefile: false,
      warehousing: false,
      // 表单参数
      form: {
        originalName: "",
        url: "",
        lineId: "",
        pointId: "",
        code: null,
      },
      machineryList: [],
      // 表单校验
      rules: {
        routeId: [
          { required: true, message: "工艺路线ID不能为空", trigger: "blur" },
        ],
        processId: [
          { required: true, message: "工序ID不能为空", trigger: "blur" },
        ],
        nextProcessId: [
          { required: true, message: "工序ID不能为空", trigger: "blur" },
        ],
        keyFlag: [
          {
            required: true,
            message: "请指定当前工序是否关键工序",
            trigger: "blur",
          },
        ],
        isCheck: [
          {
            required: true,
            message: "请指定当前工序是否需要质检确认",
            trigger: "blur",
          },
        ],
        processTypeId: [
          { required: true, message: "请选择工序类型", trigger: "blur" },
        ],
        idid: [
          { required: true, message: "请选择是否工艺节点", trigger: "blur" },
        ],
      },
    };
  },
  props: {
    routeId: undefined,
    optType: undefined,
  },
  created() {
    this.getList();
    // this.getProcess();
    this.getTreeselect();
    this.getWorkshops();
  },
  methods: {
    /** 查询工艺组成列表 */
    getList() {
      this.loading = true;
      listRouteprocess(this.queryParams).then((response) => {
        this.routeprocessList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // //查询工序信息
    // getProcess() {
    //   listAllProcess().then((response) => {
    //     this.processOptions = response.data;
    //   });
    // },
    getWorkshops() {
      findProAgvline().then((response) => {
        this.workshopOptions = response.rows;
      });
      findProAgvsite().then((response) => {
        this.dvsubjectList = response.rows;
      });
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
      listType.listMachinerytype().then((response) => {
        this.machineryTypeOptions1 = [];
        const data = this.handleTree(
          response.data,
          "processTypeId",
          "parentTypeId"
        )[0];
        this.machineryTypeOptions1.push(data);
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
    /** 转换设备类型数据结构 */
    normalizer1(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.processTypeId,
        label: node.processTypeName,
        children: node.children,
      };
    },
    // 节点单击事件
    handleNodeClick(data) {
      console.log(data);
      if (data.code == "AGV") {
        this.form.originalName = "";
        this.form.url = "";
        this.form.exitType = "";
      } else if (data.code == "STORE") {
        this.form.lineId = "";
        this.form.pointId = "";
        this.form.exitType = "0";
        this.form.originalName = "";
        this.form.url = "";
      } else if (data.code == "CNC" || data.code == "ROBOT") {
        this.form.lineId = "";
        this.form.pointId = "";
        this.form.exitType = "";
      } else {
        this.form.lineId = "";
        this.form.pointId = "";
        this.form.exitType = "";
        this.form.originalName = "";
        this.form.url = "";
      }
      this.form.machineryTypeName = data.machineryTypeName;
      this.form.code = data.code;
      var arr = { machineryTypeId: data.machineryTypeId };
      list(arr).then((response) => {
        this.machineryList = response.data;
      });
    },
    handleNodeProcess(data) {
      var arr = { processTypeId: data.processTypeId };
      listProcess(arr).then((response) => {
        this.processOptions = response.rows;
      });
    },
    selectSource(e) {
      console.log(e);
      this.form.url = e.url;
      this.form.originalName = e.originalName;
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
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
    // 表单重置
    reset() {
      this.form = {
        recordId: null,
        routeId: this.routeId,
        processId: null,
        processCode: null,
        processName: null,
        isCheck: "N",
        keyFlag: "N",
        orderNum: 1,
        nextProcessId: null,
        nextProcessCode: null,
        nextProcessName: null,
        linkType: "FS",
        defaultPreTime: 0,
        defaultSufTime: 0,
        colorCode: "#00AEF3",
        remark: null,
        attr1: null,
        attr2: null,
        attr3: null,
        attr4: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        originalName: null,
        url: null,
        lineId: null,
        pointId: null,
        exitType: "0",
        rotationDirection: "0",
        processTypeId: null,
        code: null,
        securityDoor: null,
      };
      this.fileList = [];
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
      this.ids = selection.map((item) => item.recordId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      if (this.form.code == null) {
        this.TypeId = false;
        this.Typefile = false;
        this.warehousing = false;
        this.form.originalName = "";
        this.form.url = "";
        this.form.exitType = "";
        this.form.lineId = "";
        this.form.pointId = "";
      }
      this.open = true;
      this.title = "添加工艺组成";
      listRouteprocess(this.queryParams).then((response) => {
        this.form.orderNum = response.total + 1;
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      console.log(row);
      this.reset();
      const recordId = row.recordId || this.ids;
      getRouteprocess(recordId).then((response) => {
        this.form = response.data;
        getMachinerytype(row.machineryTypeId).then((response) => {
          this.form.code = response.data.code;
          this.open = true;
          this.title = "修改工艺组成";
        });
      });

      var arr = { machineryTypeId: row.machineryTypeId };
      list(arr).then((response) => {
        this.machineryList = response.data;
      });
      var arr1 = { processTypeId: row.processTypeId };
      listProcess(arr1).then((response) => {
        this.processOptions = response.rows;
      });
      var name = {};
      if (row.originalName != undefined && row.originalName != "") {
        this.$set(name, "name", row.originalName);
        this.fileList.push(name);
      }
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.recordId != null) {
            updateRouteprocess(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addRouteprocess(this.form).then((response) => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const recordIds = row.recordId || this.ids;
      this.$modal
        .confirm('是否确认删除工艺组成编号为"' + recordIds + '"的数据项？')
        .then(function () {
          return delRouteprocess(recordIds);
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
        "mes/pro/routeprocess/export",
        {
          ...this.queryParams,
        },
        `routeprocess_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
