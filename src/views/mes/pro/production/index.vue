<template>
  <div class="shopping-classify">
    <div class="right-menu" id="container">
      <!-- 头 -->
      <div style="height: 10%">
        <el-row type="flex" justify="space-between" style="height: 100%">
          <el-col :span="10">
            <div
              class="grid-content bg-purple"
              style="display: flex; flex-direction: row-reverse"
            >
              <!-- <svg-icon
                :icon-class="isFullscreen ? 'exit-fullscreen' : 'fullscreen'"
                style="
                  width: 20px;
                  height: 20px;
                  color: #f4deb0;
                  margin: 0% -70% 1% 0%;
                "
                @click="buttoncli"
              /> -->
              <img
                @click="buttoncli"
                style="height: 40px; margin: 5% 4.3% 0% 0%"
                src="../../../../assets/images/return.png"
              /></div
          ></el-col>
          <el-col
            :span="5"
            style="
              display: flex;
              flex-direction: column;
              justify-content: space-evenly;
              align-items: center;
            "
            ><div style="color: #fff; font-size: 30px; font-weight: 700">
              {{ this.title }}
            </div>
            <div
              style="color: rgb(9 207 255); font-size: 18px; margin-bottom: 4%"
            >
              <span>{{ this.dateYear }}</span> {{ this.dateDay }}
              <span>{{ this.dateWeek }}</span>
            </div>
          </el-col>
          <el-col :span="10"
            ><div class="grid-content bg-purple" style="display: flex">
              <img
                style="height: 40px; margin: 5% 0% 0% 4%"
                src="../../../../assets/images/biaotixiugai.png"
                @click="handleChange"
              />
            </div>
          </el-col>
        </el-row>
      </div>
      <!-- 第一部分 -->
      <div style="height: 15%">
        <div>
          <el-row>
            <el-col
              :span="24"
              style="color: #fff; font-size: 30px; font-weight: 700"
            >
              <div
                style="
                  display: flex;
                  justify-content: center;
                  margin-top: -10px;
                  margin-bottom: 20px;
                "
              >
                <el-radio-group v-model="radio4" size="mini">
                  <el-radio-button :label="1">今日</el-radio-button>
                  <el-radio-button :label="2">昨日</el-radio-button>
                  <el-radio-button :label="3">本周</el-radio-button>
                  <el-radio-button :label="4">本月</el-radio-button>
                </el-radio-group>
              </div></el-col
            >
          </el-row>
        </div>
        <div>
          <el-row
            :gutter="24"
            style="color: #fff; font-size: 30px; font-weight: 700"
          >
            <el-col :span="4"
              ><div
                class="grid-content bg-purple"
                style="margin: 10% 10% 10% 27%"
              >
                0
              </div></el-col
            >
            <el-col :span="4"
              ><div
                class="grid-content bg-purple"
                style="margin: 10% 10% 10% 35%"
              >
                0
              </div></el-col
            >
            <el-col :span="4"
              ><div
                class="grid-content bg-purple"
                style="margin: 10% 10% 10% 37%"
              >
                0
              </div></el-col
            >
            <el-col :span="4"
              ><div
                class="grid-content bg-purple"
                style="margin: 10% 10% 10% 44%"
              >
                0
              </div></el-col
            >
            <el-col :span="4"
              ><div
                class="grid-content bg-purple"
                style="margin: 10% 10% 10% 47%"
              >
                0
              </div></el-col
            >
            <el-col :span="4"
              ><div
                class="grid-content bg-purple"
                style="margin: 10% 10% 10% 60%"
              >
                0
              </div></el-col
            >
          </el-row>
        </div>
      </div>

      <!-- 第二部分 -->
      <div style="height: 75%">
        <div style="height: 50%; display: flex">
          <div style="width: 45%">
            <ticket :message="this.ticketData" />
          </div>
          <div style="width: 24%; margin-top: 50px">
            <defective :message="this.defectiveData" />
          </div>
          <div style="width: 30%; margin-top: 50px">
            <ezuikit></ezuikit>
          </div>
        </div>
        <div style="height: 50%; display: flex">
          <div style="width: 45%">
            <complete :message="this.completeData" />
          </div>
          <div style="width: 55%; margin-top: 50px">
            <el-row :gutter="32" style="padding: 16px 16px 0">
              <!-- <el-card> -->
              <el-table
                :data="workorderList"
                row-key="workorderId"
                default-expand-all
                :tree-props="{
                  children: 'children',
                  hasChildren: 'hasChildren',
                }"
              >
                <el-table-column
                  label="工单号"
                  width="150"
                  align="center"
                  prop="sourceCode"
                />
                <el-table-column
                  label="工单名称"
                  align="center"
                  width="150"
                  prop="clientName"
                  :show-overflow-tooltip="true"
                />
                <el-table-column
                  label="产品名称"
                  width="150"
                  align="center"
                  prop="productCode"
                />
                <el-table-column
                  label="产出数量"
                  width="150px"
                  align="center"
                  prop="productName"
                  :show-overflow-tooltip="true"
                />
                <el-table-column label="进度" align="center" width="275px">
                  <template slot-scope="scope">
                    <el-progress
                      :text-inside="true"
                      :stroke-width="20"
                      :percentage="
                        parseFloat(
                          (
                            (scope.row.quantityProduced / scope.row.quantity) *
                            100
                          ).toFixed(2)
                        )
                      "
                    ></el-progress>
                  </template>
                </el-table-column>
                <el-table-column
                  label="实际开始时间"
                  align="center"
                  prop="requestDate"
                  width="180"
                >
                  <template slot-scope="scope">
                    <span>{{
                      parseTime(scope.row.requestDate, "{y}-{m}-{d}")
                    }}</span>
                  </template>
                </el-table-column>
              </el-table>
              <!-- </el-card> -->
            </el-row>
          </div>
        </div>
      </div>

      <!--标题修改-->
      <el-dialog :visible.sync="titleVisible" append-to-body width="30%">
        <el-form ref="installForm" :model="installForm" label-width="80px">
          <el-form-item label="标题修改">
            <el-input
              maxlength="11"
              show-word-limit
              v-model="installForm.name"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="titleVisible = false">取消</el-button>
          <el-button type="primary" @click="sumitInstall">确认</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
import axios from "axios";
import { listWorkorder } from "@/api/mes/pro/workorder";

// import * as statisServer from "@/api/statistics";
// import { getInfo } from "@/api/user";
import screenfull from "screenfull";
import defective from "./components/defective.vue";
import complete from "./components/complete.vue";
import ticket from "./components/ticket.vue";
import ezuikit from "./components/video.vue";

export default {
  components: { defective, complete, ticket, ezuikit, dayjs },
  data() {
    return {
      dateDay: null,
      dateYear: null,
      dateWeek: null,
      weekday: [
        "星期日",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
      ],
      timer: null,

      rtSp1: "",
      screenfull: false,
      title: "生产监控分析",
      titleVisible: false,
      installForm: { name: "" },
      taskForm: {
        total_num: 0, // 采样任务百分比 （完成/总数量）
        completed_num: 0,
        incompleted_num: 0,
      },
      lineChartData: {},
      totalarr: 0, // 求和
      month: "", //获取当月合同
      Contracts: "",
      barquantity: [],
      completeData: [],
      ticketData: [],
      defectiveData: [],
      workorderList: [],
      signarr: [],
      detection: [],
      reports: "",
      issue: "1",
      accumulation: true,
      thisYear: false,
      isFullscreen: false,
      radio4: 1,
      monitorPoints: [],
    };
  },

  created() {
    this.timer = setInterval(() => {
      const date = dayjs(new Date());
      this.dateDay = date.format("HH:mm:ss");
      this.dateYear = date.format("YYYY-MM-DD");
      this.dateWeek = date.format(this.weekday[date.day()]);
    }, 1000);

    // 监听事件
    window.addEventListener("resize", this.onresize);
    this.getList();
    this.findTasks();
    this.findContactList();
    this.findSampleClass();
    this.findvalid();
    this.findSortContNumList();
    this.NumberReports();
    this.factorNumber();
  },

  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    // 取消监听事件
    window.removeEventListener("resize", this.onresize);
  },
  methods: {
    // 监听是否全屏状态
    onresize(event) {
      // 利用屏幕分辨率和window对象的内高度来判断兼容IE
      let winFlag = window.innerHeight === window.screen.height;
      // 利用window全屏标识来判断 -- IE无效
      let isFull = window.fullScreen || document.webkitIsFullScreen;

      if (isFull === undefined) {
        this.isFullscreen = winFlag;
      } else {
        this.isFullscreen = winFlag || isFull;
      }
      // console.log(winFlag); // true全屏   false不是全屏
    },
    buttoncli() {
      const element = document.getElementById("container");
      if (!screenfull) {
        this.$message({
          message: "浏览器不能全屏，安装其他版本试试",
          type: "warning",
        });
        return false;
      }
      screenfull.toggle(element);
      this.findSampleClass();
      this.findSortContNumList();
      this.factorNumber();
    },

    buttoncliArr() {
      const element = document.getElementById("container");
      if (!screenfull) {
        this.$message({
          message: "浏览器不能全屏，安装其他版本试试",
          type: "warning",
        });
        return false;
      }
      screenfull.toggle(element);
    },

    getList() {
      // listWorkorder(this.queryParams).then((response) => {
      //   this.workorderList = response.data;
      // });
    },

    // 任务
    findTasks() {
      //   statisServer.findCompleteTask({ type: 1 }).then(res => {
      //     if (res.code === 200) {
      //       const taskForm = res.result.find(i => i.name === "报告编制任务");
      //       this.taskForm.total_num = taskForm.totalCnt;
      //       this.taskForm.completed_num = Number(
      //         taskForm.totalCnt - taskForm.completeCnt
      //       ).toFixed(0);
      //       this.taskForm.incompleted_num = taskForm.completeCnt;
      //     }
      //   });
    },
    //合同总数
    findContactList() {
      //   statisServer.findValidContractsForPass11Month().then(res => {
      //     if (res.code === 200) {
      //       this.lineChartData = res.result || [];
      //       // 求和
      //       this.lineChartData.contactNum.forEach(item => {
      //         this.totalarr += item;
      //       });
      //       //获取当月合同
      //       this.month = this.lineChartData.contactNum.pop();
      //     }
      //   });
    },

    //样品类别
    findSampleClass() {
      //   statisServer.findStoredSampleClassificationCnt({ limit: 6 }).then(res => {
      //     if (res.code === 200) {
      //       var arr = [];
      //       var barData = res.result.xNameData;
      //       var barquantity = res.result.xValData;
      //       //
      //       barData.forEach((item, i) => {
      //         arr.push({
      //           name: item,
      //           value: barquantity[i]
      //         });
      //       });
      //       this.barquantity = arr;
      //     }
      //   });
    },

    findvalid() {
      //   statisServer.findValidContracts({ type: 0 }).then(res => {
      //     if (res.code === 200) {
      //       this.Contracts = res.result.cusSum;
      //     }
      //   });
    },
    //签合同排名
    findSortContNumList() {
      //   statisServer.findSortContNum({ type: 1, limit: 5 }).then(res => {
      //     if (res.code === 200) {
      //       var arr = [];
      //       var barData = res.result.xNameData;
      //       var barquantity = res.result.xValData;
      //       //
      //       barData.forEach((item, i) => {
      //         arr.push({
      //           code: item,
      //           fundPost: barquantity[i]
      //         });
      //       });
      //       arr.sort((a, b) => {
      //         return b.fundPost - a.fundPost;
      //       }); //升序
      //       this.signarr = arr.slice(0, 10);
      //     }
      //   });
    },
    //签发报告数
    NumberReports() {
      //   statisServer.getReport({ type: this.issue }).then(res => {
      //     if (res.code === 200) {
      //       this.reports = res.result;
      //     }
      //   });
    },
    //因子数
    factorNumber() {
      //   statisServer.detectorFactor().then(res => {
      //     if (res.code === 200) {
      //       var arr = res.result;
      //       arr.sort((a, b) => {
      //         return b.value - a.value;
      //       }); //升序
      //       this.detection = arr.slice(0, 10);
      //     }
      //   });
    },

    handleChange() {
      this.titleVisible = true;
    },
    //修改确认
    sumitInstall() {
      //   statisServer.updateName(this.installForm).then(res => {
      //     if (res.code === 200) {
      //       this.$notify({
      //         title: "修改成功",
      //         message: res.message,
      //         type: "success"
      //       });
      //       this.titleVisible = false;
      //       this.getList();
      //     }
      //   });
    },
    accumulationClick() {
      this.issue = 2;
      this.accumulation = false;
      this.thisYear = true;
      this.NumberReports();
    },
    thisYearClick() {
      this.issue = 1;
      this.accumulation = true;
      this.thisYear = false;
      this.NumberReports();
    },
  },
};
</script>

<style lang="scss" scoped>
#container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  background: url("../../../../assets/images/scjk.png") center center no-repeat;
  background-size: 100% 100%;
}
.row-bg-1 {
  height: 70px;
  color: #fff;
  text-align: center;
}
.row-bg-3 {
  height: 100%;
  text-align: center;
  color: #fff;
  font-size: 20px;
  font-weight: 700;
}
.row-bg-4 {
  color: #8bdbe6;
  font-size: 25px;
  margin-top: 27%;
  font-weight: 500;
}
.row-bg-5 {
  height: 365px;
  text-align: center;
  color: #fff;
  font-size: 20px;
  font-weight: 700;
}

::v-deep .el-table {
  background-color: transparent; /* 背景透明 */
}

::v-deep .el-table th {
  color: #979bb4; /* 字体颜色 */
  font-size: 16px;
  background-color: transparent; /* 背景透明 */
  border: 0;
  height: 30px;
  line-height: 30px;
}
::v-deep .el-table tr,
.el-table td {
  color: #e5dada;
  font-size: 12px;
  background-color: transparent; /* 背景透明 */
  border: 0;
  height: 30px;
  line-height: 30px;
}
/* 上面两个背景色透明才能让table的背景透明少一个都不行 */
</style>
