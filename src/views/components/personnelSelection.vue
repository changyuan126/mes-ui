<template>
  <div class="app-containers">
    <p class="title">
      人员选择（<span v-show="isshow == 2">多选</span
      ><span v-show="isshow == 1">单选</span>）
    </p>

    <el-row>
      <el-col :span="6"
        ><div class="grid-content one">
          <!-- 部门的选择 -->
          <el-container>
            <el-header
              class="smallHeader"
              style="height: 40px; line-height: 40px"
              >部门
            </el-header>
            <el-main class="smallmain">
              <el-tree
                v-loading="loading"
                :data="deptOptions"
                :props="defaultProps"
                :expand-on-click-node="false"
                highlight-current
                ref="tree"
                node-key="deptId"
                :filter-node-method="filterNode"
                @node-click="handleNodeClick"
                :default-expand-all="true"
              >
              </el-tree>
            </el-main>
          </el-container>
        </div>
      </el-col>
      <el-col :span="12"
        ><div class="grid-content two">
          <!-- 人员的选择  -->
          <el-row>
            <el-col>
              <el-form
                :model="queryParams"
                ref="queryForm"
                :inline="true"
                label-width="68px"
                style="height: 40px"
              >
                <el-form-item label="姓名" prop="nickName">
                  <el-input
                    v-model.trim="queryParams.userName"
                    placeholder="请输入姓名"
                    clearable
                    size="small"
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
                  <el-button
                    icon="el-icon-refresh"
                    size="mini"
                    @click="resetQuery"
                    >重置</el-button
                  >
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
          <el-row>
            <!-- 多选时 -->
            <div>
              <el-col :span="24" class="tableBox" v-show="isshow == 2">
                <el-table
                  v-loading="loading"
                  ref="checked"
                  :data="userList"
                  tooltip-effect="dark"
                  row-key="userId"
                  style="width: 100%"
                  @select="selectionRow"
                  @select-all="selectionRowAll"
                >
                  <el-table-column
                    type="selection"
                    width="55"
                    :reserve-selection="true"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="nickName"
                    label="人员"
                    show-overflow-tooltip
                  >
                  </el-table-column>
                  <el-table-column
                    prop="sex"
                    label="性别"
                    show-overflow-tooltip
                  >
                    <template slot-scope="scope">
                      <span v-if="scope.row.sex == 0">男</span>
                      <span v-else-if="scope.row.sex == 1">女</span>
                      <span v-else>未知</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="dept.deptName"
                    label="部门"
                    show-overflow-tooltip
                  >
                  </el-table-column>
                </el-table>
              </el-col>
            </div>
            <!-- 单选时 -->
            <div class="wrapBox" v-show="isshow == 1">
              <el-col :span="24" class="tableBox radio">
                <el-table
                  v-loading="loading"
                  ref="radio"
                  :data="userList"
                  tooltip-effect="dark"
                  row-key="userId"
                  style="width: 100%"
                  highlight-current-row
                  @current-change="handleCurrentChange"
                >
                  <el-table-column
                    prop="nickName"
                    label="人员"
                    show-overflow-tooltip
                  >
                  </el-table-column>
                  <el-table-column
                    prop="sex"
                    label="性别"
                    show-overflow-tooltip
                  >
                    <template slot-scope="scope">
                      <span v-if="scope.row.sex == 0">男</span>
                      <span v-else-if="scope.row.sex == 1">女</span>
                      <span v-else>未知</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="dept.deptName"
                    label="部门"
                    show-overflow-tooltip
                  >
                  </el-table-column>
                </el-table>
              </el-col>
            </div>
          </el-row>
        </div>
      </el-col>
      <el-col :span="6"
        ><div class="grid-content three">
          <!-- 已选人员 -->
          <el-container style="padding: 0">
            <el-header
              class="smallHeader"
              style="height: 40px; line-height: 40px"
              >已选人员
              <el-button
                size="small"
                plain
                @click="toggleSelection()"
                class="but1"
                >删除全部</el-button
              >
            </el-header>
            <el-main class="smallmain tableBox">
              <p v-if="selectList.length == 0" class="nodata">暂无数据</p>
              <div class="tagBox" v-else>
                <el-tag
                  class="tag"
                  :key="tag.userId"
                  v-for="tag in selectList"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(tag)"
                >
                  <span class="tagItem">{{ tag.nickName }}</span>
                  <span v-if="tag.sex == 0" class="tagItem">男</span>
                  <span v-else-if="tag.sex == 1" class="tagItem">女</span>
                  <span v-else class="tagItem">未知</span>
                  <span class="tagItem">{{ tag.deptName }}</span>
                </el-tag>
              </div>
            </el-main>
          </el-container>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { treeselect } from "@/api/system/dept";
import { listUser } from "@/api/system/user";
export default {
  name: "DepUser",
  components: { treeselect, listUser },
  props: ["inputValue"],
  // props: {
  //   // 父组件修改时传过来的数据
  //   inputValue: {
  //     type: Array,
  //     default: function () {
  //       return [];
  //     },
  //   },
  //   // 单选时从父组件传值设置为单选 1 为单选 2为多选（默认）
  //   // show: {
  //   //   type: String,
  //   //   required: false,
  //   //   default: false,
  //   // },
  // },
  data() {
    return {
      // 部门树选项
      deptOptions: undefined,
      defaultProps: {
        children: "children",
        label: "label",
      },
      // 用户表格数据
      userList: null,
      // // 选中的人员
      // nowList: [],
      // 最终选中传给父组件的人员
      selectList: this.inputValue,
      // isshow=1,是单选，2是多选
      isshow: 2,
      // 遮罩层
      loading: true,
      // 表单参数
      form: {},
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10000,
        userName: undefined,
        nickName: undefined,
        mobile: undefined,
        deptId: undefined,
      },
      // 选中的人员
      selectIdList: [],
      addInvolvedUserIdVisible: false,
    };
  },
  watch: {
    inputValue(val) {
      this.selectList = val;
      this.getTreeselect();
      this.$nextTick(() => {});
    },
    // 根据名称筛选部门树
    deptName(val) {
      this.$refs.tree.filter(val);
    },
  },
  created() {
    this.getTreeselect();
    this.$nextTick(() => {});
  },
  mounted() {
    // this.$nextTick(() => {
    //   this.inputValue.forEach((item) => {
    //     this.selectList.push(item);
    //   });
    //   if (this.show) {
    //     this.isshow = this.show;
    //   }
    // });
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  methods: {
    // 单选表格
    handleCurrentChange(val) {
      this.selectList = [val];
      this.$emit("getSelectList", this.selectList);
    },
    // 部门  树形数据
    getTreeselect() {
      treeselect().then((response) => {
        let allobj = {
          id: 0,
          label: "全体人员",
        };
        this.deptOptions = response.data;
        this.queryParams.deptId = this.user.deptId;
        this.deptOptions.unshift(allobj);
        this.loading = false;
        this.getList();
      });
    },

    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },

    // 树形节点单击事件
    handleNodeClick(data) {
      this.queryParams.deptId = data.id;
      this.getList();
    },
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      listUser(this.queryParams).then((response) => {
        this.userList = response.rows;
        this.loading = false;
        this.$refs.checked.clearSelection(); //清除回显
        //  多选表格样式回显
        this.userList.forEach((i) => {
          if (this.selectList != "") {
            this.selectList.forEach((item) => {
              if (i.userId == item.userId) {
                this.isshow == 2
                  ? this.$refs.checked.toggleRowSelection(item) //多选
                  : this.$refs.radio.setCurrentRow(item, true); // 单选高亮某一行
              }
            });
          }
        });
      });
    },
    // 表格===>> 取消选择
    toggleSelection(rows) {
      this.selectList = [];
      this.$refs.checked.clearSelection();
      if (this.isshow == 1) {
        this.$refs.radio.setCurrentRow();
        this.selectList.splice(this.selectList.indexOf(rows), 1);
      }
      this.$emit("getSelectList", this.selectList);
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },

    // 已选人员===>>> 删除
    handleClose(tag) {
      // 多选
      if (this.isshow == 2) {
        this.selectList.splice(this.selectList.indexOf(tag), 1);
        this.$refs.checked.toggleRowSelection(tag, false);
      }
      // 单选
      if (this.isshow == 1) {
        this.$refs.radio.setCurrentRow();
        this.selectList.splice(this.selectList.indexOf(tag), 1);
      }
      if (this.inputValue) {
        this.$refs.checked.toggleRowSelection(tag, false); //多选
        this.getList();
      }
      this.$emit("getSelectList", this.selectList);
    },
    // 判断复选框状态
    selectionRow(selection, row) {
      let selected = selection.length && selection.indexOf(row) !== -1; //为true时选中，为 0（或者false）时未选中
      if (selected) {
        this.selectList.unshift(row);
      } else {
        for (let i = 0; i < this.selectList.length; i++) {
          if (row.userId == this.selectList[i].userId) {
            this.selectList.splice(i, 1);
          }
        }
      }

      this.$emit("getSelectList", this.selectList);
    },
    //表格全选事件
    selectionRowAll(selection) {
      if (selection.length) {
        let list = selection;
        for (let i = 0; i < list.length; i++) {
          for (let j = 0; j < this.selectList.length; j++) {
            if (list[i].userId == this.selectList[j].userId) {
              this.selectList.splice(j, 1);
            }
          }
        }
        list.forEach((item) => {
          this.selectList.unshift(item);
        });
      } else {
        this.getList({ id: this.queryParams.deptId });
        this.userList.forEach((item) => {
          this.selectList.splice(this.selectList.indexOf(item), 1);
        });
      }

      this.submit();
    },
    submit() {
      this.$emit("getSelectList", this.selectList);
    },
    // 父组件关闭事件
    parentHandleclick(e) {
      this.$refs.checked.clearSelection();
    },
  },
};
</script>

<style scoped>
.app-containers ::-webkit-scrollbar {
  display: none;
}

.one,
.three,
.two {
  height: 510px;
  width: 100%;
  overflow: scroll;
  border: solid 1px #dadada;
}
.one {
  width: 95%;
}
.two {
  border: 1px solid transparent;
}
.three {
  width: 99%;
  box-sizing: border-box;
  margin-left: 5%;
}
.title {
  line-height: 24px;
  font-size: 18px;
  color: #303133;
  padding-bottom: 5px;
  border-bottom: solid 1px #dadada;
  margin-bottom: 15px;
  margin-top: -23px;
}
.el-main,
.smallmain {
  padding: 0;
}

.smallHeader {
  background-color: #1890ff;
  position: relative;
  color: #fff;
  font-weight: 700;
}
.but1 {
  position: absolute;
  right: 20px;
  top: 4px;
}
.open,
.smallmain >>> .el-tree-node:focus > .el-tree-node__content {
  background-color: #83bff8 !important;
}
.smallmain >>> .el-tree-node__content:hover {
  background-color: #dadada;
}
.smallmain
  >>> .el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content {
  background-color: #83bff8;
}
.tableBox >>> .el-table {
  margin: 0;
}
.radio {
  position: relative;
}
.nodata {
  width: 100%;
  text-align: center;
  line-height: 40px;
  height: 40px;
}
.tagBox {
  width: 100%;
}
.tag {
  width: 100%;
  height: 38px;
}
.tagItem {
  display: inline-block;
  width: calc(100% / 3.2);
  text-align: center;
  margin-top: 5px;
  /* 单行文本溢出省略号 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
::v-deep .el-tag .el-icon-close {
  top: -9px;
}
.wrapBox >>> .el-table__body tr.current-row > td {
  background-color: #83bff8 !important;
}
.wrapBox >>> .el-table tbody tr:hover > td {
  background-color: #dadada;
}
::v-deep .el-tag {
  margin-left: 0px;
}
</style>
