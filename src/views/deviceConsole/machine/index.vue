<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="5"
        ><div class="grid-content bg-purple">
          <div class="grid-content three" style="height: 750px">
            <!-- 已选人员 -->
            <el-container style="padding: 0">
              <el-header
                class="smallHeader"
                style="height: 40px; line-height: 40px"
                >选择设备
              </el-header>
              <el-main class="smallmain tableBox">
                <p v-if="intelligent.length == 0" class="nodata">暂无数据</p>
                <div class="tagBox" v-else>
                  <el-button
                    style="width: 100%"
                    v-for="item in intelligent"
                    :key="item"
                    @click="handleClose(item)"
                    >{{ item.machineryName }}</el-button
                  >
                </div>
              </el-main>
            </el-container>
          </div>
        </div></el-col
      >
      <el-col :span="18"
        ><div class="content">
          <div style="height: 100px">
            <div style="width: 31px; margin-left: 9%">
              <el-image v-if="imgdata" :src="img" style="margin-top: 25px"></el-image>
              <el-image v-else :src="imgs" style="margin-top: 25px;"></el-image>
            </div>
          </div>
          <div style="height: 440px">
            <div style="height: 108px">
              <el-row
                type="flex"
                class="row-bg"
                justify="center"
                style="height: 18px"
              >
                <el-col :span="6"
                  ><div class="grid-content bg-purple" style="margin-left: 22%">
                    {{ intelligentData.feedSpeed }}
                  </div></el-col
                >
                <el-col :span="5"
                  ><div class="grid-content bg-purple-light"></div
                ></el-col>
                <el-col :span="6"
                  ><div class="grid-content bg-purple" style="margin-left: 25%">
                    {{ intelligentData.spindleSpeed }}
                  </div></el-col
                >
              </el-row>
              <el-row
                type="flex"
                class="row-bg"
                justify="center"
                style="margin-top: 6px; height: 18px"
              >
                <el-col :span="6"
                  ><div class="grid-content bg-purple" style="margin-left: 22%">
                    {{ intelligentData.rapidOverride }}
                  </div></el-col
                >
                <el-col :span="5"
                  ><div class="grid-content bg-purple-light"></div
                ></el-col>
                <el-col :span="6"
                  ><div class="grid-content bg-purple" style="margin-left: 25%">
                    {{ intelligentData.spindle }}
                  </div></el-col
                >
              </el-row>
              <el-row
                type="flex"
                class="row-bg"
                justify="center"
                style="margin-top: 7px; height: 18px"
              >
                <el-col :span="6"
                  ><div class="grid-content bg-purple" style="margin-left: 22%">
                    {{ intelligentData.feedRate }}
                  </div></el-col
                >
                <el-col :span="5"
                  ><div class="grid-content bg-purple-light"></div
                ></el-col>
                <el-col :span="6"
                  ><div class="grid-content bg-purple" style="margin-left: 25%">
                    {{ intelligentData.handWheel }}
                  </div></el-col
                >
              </el-row>
            </div>

            <div style="height: 158px">
              <el-row
                type="flex"
                class="row-bg"
                justify="center"
                style="height: 18px"
              >
                <el-col :span="6"
                  ><div class="grid-content bg-purple" style="margin-left: 60%">
                    {{ intelligentData.relativeX }}
                  </div></el-col
                >
                <el-col :span="5"
                  ><div class="grid-content bg-purple-light"></div
                ></el-col>
                <el-col :span="6"
                  ><div class="grid-content bg-purple" style="margin-left: 65%">
                    {{ intelligentData.machineX }}
                  </div></el-col
                >
              </el-row>
              <el-row
                type="flex"
                class="row-bg"
                justify="center"
                style="margin-top: 10px; height: 18px"
              >
                <el-col :span="6"
                  ><div class="grid-content bg-purple" style="margin-left: 60%">
                    {{ intelligentData.relativeY }}
                  </div></el-col
                >
                <el-col :span="5"
                  ><div class="grid-content bg-purple-light"></div
                ></el-col>
                <el-col :span="6"
                  ><div class="grid-content bg-purple" style="margin-left: 65%">
                    {{ intelligentData.machineY }}
                  </div></el-col
                >
              </el-row>
              <el-row
                type="flex"
                class="row-bg"
                justify="center"
                style="margin-top: 15px; height: 18px"
              >
                <el-col :span="6"
                  ><div class="grid-content bg-purple" style="margin-left: 60%">
                    {{ intelligentData.relativeZ }}
                  </div></el-col
                >
                <el-col :span="5"
                  ><div class="grid-content bg-purple-light"></div
                ></el-col>
                <el-col :span="6"
                  ><div class="grid-content bg-purple" style="margin-left: 65%">
                    {{ intelligentData.machineZ }}
                  </div></el-col
                >
              </el-row>
              <el-row
                type="flex"
                class="row-bg"
                justify="center"
                style="margin-top: 12px; height: 18px"
              >
                <el-col :span="6"
                  ><div class="grid-content bg-purple" style="margin-left: 60%">
                    {{ intelligentData.relativeA }}
                  </div></el-col
                >
                <el-col :span="5"
                  ><div class="grid-content bg-purple-light"></div
                ></el-col>
                <el-col :span="6"
                  ><div class="grid-content bg-purple" style="margin-left: 65%">
                    {{ intelligentData.machineA }}
                  </div></el-col
                >
              </el-row>
            </div>

            <div>
              <el-row
                type="flex"
                class="row-bg"
                justify="center"
                style="height: 18px"
              >
                <el-col :span="6"
                  ><div class="grid-content bg-purple" style="margin-left: 60%">
                    {{ intelligentData.absoluteX }}
                  </div></el-col
                >
                <el-col :span="5"
                  ><div class="grid-content bg-purple-light"></div
                ></el-col>
                <el-col :span="6"
                  ><div class="grid-content bg-purple" style="margin-left: 65%">
                    {{ intelligentData.residualX }}
                  </div></el-col
                >
              </el-row>
              <el-row
                type="flex"
                class="row-bg"
                justify="center"
                style="margin-top: 10px; height: 18px"
              >
                <el-col :span="6"
                  ><div class="grid-content bg-purple" style="margin-left: 60%">
                    {{ intelligentData.absoluteY }}
                  </div></el-col
                >
                <el-col :span="5"
                  ><div class="grid-content bg-purple-light"></div
                ></el-col>
                <el-col :span="6"
                  ><div class="grid-content bg-purple" style="margin-left: 65%">
                    {{ intelligentData.residualY }}
                  </div></el-col
                >
              </el-row>
              <el-row
                type="flex"
                class="row-bg"
                justify="center"
                style="margin-top: 15px; height: 18px"
              >
                <el-col :span="6"
                  ><div class="grid-content bg-purple" style="margin-left: 60%">
                    {{ intelligentData.absoluteZ }}
                  </div></el-col
                >
                <el-col :span="5"
                  ><div class="grid-content bg-purple-light"></div
                ></el-col>
                <el-col :span="6"
                  ><div class="grid-content bg-purple" style="margin-left: 65%">
                    {{ intelligentData.residualZ }}
                  </div></el-col
                >
              </el-row>
              <el-row
                type="flex"
                class="row-bg"
                justify="center"
                style="margin-top: 12px; height: 18px"
              >
                <el-col :span="6"
                  ><div class="grid-content bg-purple" style="margin-left: 60%">
                    {{ intelligentData.absoluteA }}
                  </div></el-col
                >
                <el-col :span="5"
                  ><div class="grid-content bg-purple-light"></div
                ></el-col>
                <el-col :span="6"
                  ><div class="grid-content bg-purple" style="margin-left: 65%">
                    {{ intelligentData.residualA }}
                  </div></el-col
                >
              </el-row>
            </div>
          </div>
          <div style="height: 350px">
            <el-row
              type="flex"
              class="row-bg"
              justify="center"
              style="margin-bottom: 15px; height: 50px"
            >
              <el-col :span="6"
                ><div class="grid-content bg-purple" style="margin-left: 40%">
                  <!-- {{1}} -->
                </div></el-col
              >
              <el-col :span="6"
                ><div
                  class="grid-content bg-purple-light"
                  style="margin-left: 20%"
                >
                  <!-- {{ 2 }} -->
                </div></el-col
              >
              <el-col :span="6"
                ><div class="grid-content bg-purple" style="margin-left: 35%">
                  <!-- {{ 3 }} -->
                </div></el-col
              >
              <el-col :span="6"
                ><div
                  class="grid-content bg-purple-light"
                  style="margin-left: 8%"
                >
                  <!-- {{ 4 }} -->
                </div></el-col
              >
            </el-row>

            <el-row
              type="flex"
              class="row-bg"
              justify="center"
              style="margin-bottom: 15px; height: 50px"
            >
              <el-col :span="6"
                ><div class="grid-content bg-purple" style="margin-left: 40%">
                  <!-- {{ 1 }} -->
                </div></el-col
              >
              <el-col :span="6"
                ><div
                  class="grid-content bg-purple-light"
                  style="margin-left: 20%"
                >
                  <!-- {{ 2 }} -->
                </div></el-col
              >
              <el-col :span="6"
                ><div class="grid-content bg-purple" style="margin-left: 35%">
                  <!-- {{ 3 }} -->
                </div></el-col
              >
              <el-col :span="6"
                ><div
                  class="grid-content bg-purple-light"
                  style="margin-left: 8%"
                >
                  <!-- {{ 4 }} -->
                </div></el-col
              >
            </el-row>
            <el-row
              type="flex"
              class="row-bg"
              justify="center"
              style="margin-bottom: 15px; height: 50px"
            >
              <el-col :span="6"
                ><div class="grid-content bg-purple" style="margin-left: 40%">
                  <!-- {{ 1 }} -->
                </div></el-col
              >
              <el-col :span="6"
                ><div
                  class="grid-content bg-purple-light"
                  style="margin-left: 20%"
                >
                  <!-- {{ 2 }} -->
                </div></el-col
              >
              <el-col :span="6"
                ><div class="grid-content bg-purple" style="margin-left: 35%">
                  <!-- {{ 3 }} -->
                </div></el-col
              >
              <el-col :span="6"
                ><div
                  class="grid-content bg-purple-light"
                  style="margin-left: 8%"
                >
                  <!-- {{ 4 }} -->
                </div></el-col
              >
            </el-row>
            <el-row
              type="flex"
              class="row-bg"
              justify="center"
              style="margin-bottom: 15px; height: 50px"
            >
              <el-col :span="6"
                ><div class="grid-content bg-purple" style="margin-left: 40%">
                  <!-- {{ 1 }} -->
                </div></el-col
              >
              <el-col :span="6"
                ><div
                  class="grid-content bg-purple-light"
                  style="margin-left: 20%"
                >
                  <!-- {{ 2 }} -->
                </div></el-col
              >
              <el-col :span="6"
                ><div class="grid-content bg-purple" style="margin-left: 35%">
                  <!-- {{ 3 }} -->
                </div></el-col
              >
              <el-col :span="6"
                ><div
                  class="grid-content bg-purple-light"
                  style="margin-left: 8%"
                >
                  <!-- {{ 4 }} -->
                </div></el-col
              >
            </el-row>

            <el-row
              type="flex"
              class="row-bg"
              justify="center"
              style="margin-bottom: 15px; height: 50px"
            >
              <el-col :span="6"
                ><div class="grid-content bg-purple" style="margin-left: 40%">
                  <!-- {{ 1 }} -->
                </div></el-col
              >
              <el-col :span="6"
                ><div
                  class="grid-content bg-purple-light"
                  style="margin-left: 20%"
                >
                  <!-- {{ 2 }} -->
                </div></el-col
              >
              <el-col :span="6"
                ><div
                  class="grid-content bg-purple-light"
                  style="margin-left: 35%"
                ></div
              ></el-col>
              <el-col :span="12"
                ><div
                  class="grid-content bg-purple-light"
                  style="margin-left: 59%"
                >
                  <el-button
                    type="danger"
                    style="margin-top: 17%; height: 40px"
                    @click="off"
                  ></el-button>
                  <el-button
                    type="success"
                    style="margin-top: 17%; height: 40px; margin-left: 18%"
                    @click="on"
                  ></el-button></div
              ></el-col>
            </el-row>
          </div></div
      ></el-col>
    </el-row>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      intelligent: [],
      intelligentData: {},
      // 遮罩层
      loading: true,
      id: "",
      imgdata:true,
      timer: null,
      img: require("../../../assets/images/close.png"),
      imgs: require("../../../assets/images/open.png"),
    };
  },
  created() {
    this.getList();
  },
  mounted() {
    // 定时刷新
    this.timer = setInterval(() => {
      if (this.id != "") {
        this.setInterval();
      }
    }, 1500);
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      axios
        .get("http://192.168.3.53:8077/manage/device/devices")
        .then((res) => {
          console.log(res);
          this.intelligent = res.data.data;
          this.loading = false;
        });
    },

    handleClose(item) {
      this.id = item.machineryId;
      this.setInterval();
    },

    setInterval() {
      axios
        .get("http://192.168.3.53:8077/manage/modbus/data", {
          params: {
            id: this.id,
          },
        })
        .then((res) => {
          console.log(res.data.data);
          this.intelligentData = res.data.data;
        });
    },

    off() {
      if (this.id != "") {
        axios
          .get("http://192.168.3.53:8077/manage/modbus/operate", {
            params: {
              id: this.id,
              type: 2,
            },
          })
          .then((res) => {
            this.imgdata = true
            this.$modal.msgSuccess("停止成功");
          });
      } else {
        this.$modal.msgSuccess("请选择设备");
      }
    },
    on() {
      if (this.id != "") {
        axios
          .get("http://192.168.3.53:8077/manage/modbus/operate", {
            params: {
              id: this.id,
              type: 1,
            },
          })
          .then((res) => {
            this.imgdata = false
            this.$modal.msgSuccess("启动成功");
          });
      } else {
        this.$modal.msgSuccess("请选择设备");
      }
    },
  },
};
</script>

<style scoped>
.app-containers ::-webkit-scrollbar {
  display: none;
}

.image {
  width: 300px;
  height: 200px;
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
  color: #302933;
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
  background-color: #e0e8f0;
  position: relative;
  color: #7a8289;
  font-weight: 700;
}
.content {
  position: relative;
  width: 70%;
  margin: 0 auto 20px;
  background: url("../../../assets/images/machine.png") no-repeat center;
  background-size: 100% 100%;
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
