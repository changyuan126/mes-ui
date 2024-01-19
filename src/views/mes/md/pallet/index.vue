<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--数据-->
      <el-col>
        <el-form
          :model="queryParams"
          ref="queryForm"
          size="small"
          :inline="true"
          v-show="showSearch"
          label-width="68px"
        >
          <el-form-item label="托盘编码" prop="palletCode">
            <el-input
              v-model="queryParams.palletCode"
              placeholder="请输入托盘编码"
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
              v-hasPermi="['mes:md:mditem:add']"
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
              v-hasPermi="['mes:md:mditem:edit']"
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
              @click="handleDeleteData"
              v-hasPermi="['mes:md:mditem:remove']"
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
              v-hasPermi="['mes:md:mditem:import']"
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
              v-hasPermi="['mes:md:mditem:export']"
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
          :data="itemList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column
            label="托盘码"
            width="120"
            align="center"
            key="palletCode"
            prop="palletCode"
          >
          </el-table-column>

          <el-table-column
            label="托盘尺寸"
            align="center"
            key="palletSize"
            prop="palletSize"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="动裁承重"
            align="center"
            key="dynamicBear"
            prop="dynamicBear"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              {{ scope.row.dynamicBear + "kg" }}
            </template>
          </el-table-column>
          <el-table-column
            label="静载承重"
            align="center"
            key="staticBear"
            prop="staticBear"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              {{ scope.row.staticBear + "kg" }}
            </template>
          </el-table-column>
          <el-table-column
            label="当前位置"
            align="center"
            key="currentLocation"
            prop="currentLocation"
            :show-overflow-tooltip="true"
          >
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
                v-hasPermi="['mes:md:mditem:edit']"
                >修改</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['mes:md:mditem:remove']"
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

    <!-- 添加或修改物料产品编码对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="960px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="托盘编码" prop="palletCode">
              <el-input
                v-model="form.palletCode"
                readonly="readonly"
                maxlength="64"
                v-if="optType == 'view'"
              />
              <el-input
                v-model="form.palletCode"
                placeholder="请输入托盘编码"
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
            <el-form-item label="托盘尺寸" prop="palletSize">
              <el-input
                v-model="form.palletSize"
                maxlength="255"
                readonly="readonly"
                v-if="optType == 'view'"
              />
              <el-input
                v-model="form.palletSize"
                placeholder="请输入托盘尺寸"
                maxlength="255"
                v-else
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="动载承重" prop="dynamicBear">
              <el-input
                v-model="form.dynamicBear"
                maxlength="255"
                readonly="readonly"
                v-if="optType == 'view'"
              >
                <i
                  slot="suffix"
                  style="
                    font-style: normal;
                    margin-right: 10px;
                    line-height: 30px;
                    color: #1e1e1e;
                  "
                  >kg</i
                >
              </el-input>
              <el-input
                v-model="form.dynamicBear"
                placeholder="请输入动载承重"
                maxlength="255"
                v-else
              >
                <i
                  slot="suffix"
                  style="
                    font-style: normal;
                    margin-right: 10px;
                    line-height: 30px;
                    color: #1e1e1e;
                  "
                  >kg</i
                >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="静载承重" prop="staticBear">
              <el-input
                v-model="form.staticBear"
                maxlength="255"
                readonly="readonly"
                v-if="optType == 'view'"
              >
                <i
                  slot="suffix"
                  style="
                    font-style: normal;
                    margin-right: 10px;
                    line-height: 30px;
                    color: #1e1e1e;
                  "
                  >kg</i
                >
              </el-input>
              <el-input
                v-model="form.staticBear"
                placeholder="请输入静载承重"
                maxlength="255"
                v-else
              >
                <i
                  slot="suffix"
                  style="
                    font-style: normal;
                    margin-right: 10px;
                    line-height: 30px;
                    color: #1e1e1e;
                  "
                  >kg</i
                >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="cancel" v-if="optType == 'view'"
          >返回</el-button
        >
        <el-button type="primary" @click="submitForm" v-else>确 定</el-button>
        <el-button @click="cancel">关 闭</el-button>
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
            是否更新已经存在的用户数据
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
  </div>
</template>

<script>
import {
  listMdItem,
  delMdItem,
  addMdItem,
  updateMdItem,
  findPalletCode,
  batchDeleteProPallet,
} from "@/api/mes/md/pallet";

import { genCode } from "@/api/system/autocode/rule";
import { getToken } from "@/utils/auth";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "Pallet",
  dicts: ["sys_yes_no", "mes_item_product"],
  components: { Treeselect },
  data() {
    return {
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
      itemList: null,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      //弹框的操作类型 view add edit
      optType: undefined,
      //自动生成物料编码标识
      autoGenFlag: false,
      // 日期范围
      dateRange: [],
      //单位列表
      measureOptions: [],
      // 表单参数
      form: {},
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
        url: process.env.VUE_APP_BASE_API + "/mes/md/mditem/importData",
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        palletCode: undefined,
        itemName: undefined,
        itemTypeId: 0,
      },
      // 表单校验
      rules: {
        palletCode: [
          { required: true, message: "托盘编码不能为空", trigger: "blur" },
          {
            max: 64,
            message: "物料/产品编码长度必须小于64个字符",
            trigger: "blur",
          },
        ],
        itemName: [
          { required: true, message: "物托盘尺寸不能为空", trigger: "blur" },
        ],
        unitOfMeasure: [
          { required: true, message: "单位不能为空", trigger: "blur" },
        ],
        itemTypeId: [
          { required: true, message: "物料分类不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询物料编码列表 */
    getList() {
      this.loading = false;
      listMdItem(this.queryParams).then((response) => {
        this.itemList = response.rows;
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
        proPalletId: undefined,
        palletCode: undefined,
        palletSize: undefined,
        dynamicBear: undefined,
        staticBear: undefined,
        currentLocation: undefined,
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
      this.ids = selection.map((item) => item.proPalletId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.optType = "add";
      this.open = true;
      this.title = "新增托盘";
      findPalletCode().then((response) => {
        this.form.palletCode = response.data.palletCode;
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      console.log(row);
      this.reset();
      this.form = row;
      this.open = true;
      this.optType = "edit";
      this.title = "修改";
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.proPalletId != undefined) {
            updateMdItem(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            debugger;
            addMdItem(this.form).then((response) => {
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
      const itemIds = row.proPalletId;
      delMdItem({ proPalletId: itemIds }).then((response) => {
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
    /** 批量删除按钮操作 */
    handleDeleteData() {
      const itemIds = this.ids;
      this.$modal
        .confirm("是否确认删除班次？")
        .then(function () {
          return batchDeleteProPallet(itemIds);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      // this.download(
      //   "mes/md/mditem/export",
      //   {
      //     ...this.queryParams,
      //   },
      //   `user_${new Date().getTime()}.xlsx`
      // );
    },
    /** 导入按钮操作 */
    handleImport() {
      // this.upload.title = "物料/产品导入";
      // this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      // this.download(
      //   "mes/md/mditem/importTemplate",
      //   {},
      //   `md_item_${new Date().getTime()}.xlsx`
      // );
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
    //自动生成物料编码
    handleAutoGenChange(autoGenFlag) {
      if (autoGenFlag) {
        findPalletCode().then((response) => {
          this.form.palletCode = response.data.palletCode;
        });
      } else {
        this.form.palletCode = null;
      }
    },
  },
};
</script>
