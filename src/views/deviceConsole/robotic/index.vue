<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="5"
        ><div class="grid-content bg-purple">
          <div class="grid-content three" style="height: 750px">
            <!-- 选择设备 -->
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
      <el-col :span="14"
        ><div class="grid-content bg-purple">
          <div>
            <el-image :src="img"></el-image>
          </div>
          <div
            style="
              border: 1px solid rgb(217 216 216);
              height: 60px;
              width: 30%;
              border-radius: 30px;
              margin-left: 32%;
            "
          ></div>
          <div
            style="
              border: 1px solid rgb(217, 216, 216);
              height: 100px;
              width: 30%;
              border-radius: 50px;
              margin-left: 32%;
              margin-top: 2%;
              background: rgba(204, 204, 221, 0.2);
            "
          >
            <div style="margin-top: 9%">
              <el-row type="flex" class="row-bg" justify="center">
                <el-col :span="4"
                  ><div class="grid-content bg-purple">
                    <div v-if="elimage">
                      <el-button @click="elbutton"
                        ><el-image
                          :src="sd"
                          style="width: 20px; height: 20px"
                        ></el-image
                      ></el-button>
                      <p
                        style="
                          margin: auto;
                          margin-left: 25%;
                          font-size: 14px;
                          color: #9e9e9e;
                        "
                      >
                        上电
                      </p>
                    </div>
                    <div v-else>
                      <el-button @click="buttonto">
                        <el-image
                          :src="xd"
                          style="width: 20px; height: 20px"
                        ></el-image>
                      </el-button>
                      <p
                        style="
                          margin: auto;
                          margin-left: 25%;
                          font-size: 14px;
                          color: #9e9e9e;
                        "
                      >
                        下电
                      </p>
                    </div>
                  </div></el-col
                >
                <el-col :span="6"
                  ><div class="grid-content bg-purple-light"></div
                ></el-col>
                <el-col :span="5"
                  ><div class="grid-content bg-purple">
                    <div>
                      <el-button>
                        <el-image
                          :src="fw"
                          style="width: 20px; height: 20px"
                        ></el-image>
                      </el-button>
                      <p
                        style="
                          margin: auto;
                          margin-left: 25%;
                          font-size: 14px;
                          color: #9e9e9e;
                        "
                      >
                        复位
                      </p>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </div></el-col
      >
      <el-col :span="4"><div class="grid-content bg-purple">2</div></el-col>
    </el-row>
  </div>
</template>

<script>
import { listMachinery } from "@/api/mes/dv/machinery";
import { listMachinerytype } from "@/api/mes/dv/machinerytype";
import axios from "axios";
export default {
  data() {
    return {
      intelligent: [],
      intelligentData: {},
      // 遮罩层
      loading: true,
      id: "",
      imgdata: true,
      timer: null,
      machineryTypeOptions: [],
      machinerydata: {
        pageNum: 1,
        pageSize: 10,
        machineryTypeId: "",
      },
      elimage: true,
      img: require("../../../assets/images/robotic.png"),
      sd: require("../../../assets/images/shangdian.png"),
      xd: require("../../../assets/images/weishangdian.png"),
      fw: require("../../../assets/images/fuwei-02.png"),
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
    // 通过$once来监听定时器，在beforeDestroy钩子可以被清除。
    this.$once("hook:beforeDestroy", () => {
      clearInterval(this.timer);
    });
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      // axios
      //   .get("http://192.168.3.53:8077/manage/device/devices")
      //   .then((res) => {
      //     this.intelligent = res.data.data;
      //     this.loading = false;
      //   });

      listMachinerytype().then((response) => {
        var data = "";
        response.data.forEach((item) => {
          if (item.machineryTypeCode == "M_TYPE_002") {
            data = item.machineryTypeId;
          }
        });
        this.machinerydata.machineryTypeId = data;
        this.listMachineryitem();
      });
    },

    listMachineryitem() {
      listMachinery(this.machinerydata).then((response) => {
        response.rows.forEach((item) => {
          if (item.ip != null) {
            this.intelligent.push(item);
          }
        });
        console.log(this.intelligent);
        this.loading = false;
      });
    },

    handleClose(item) {
      this.id = item.machineryId;
      this.setInterval();
    },

    setInterval() {
      //   axios
      //     .get("http://192.168.3.53:8077/manage/modbus/data", {
      //       params: {
      //         id: this.id,
      //       },
      //     })
      //     .then((res) => {
      //       console.log(res.data.data);
      //       this.intelligentData = res.data.data;
      //     });
    },

    elbutton() {
      this.elimage = false;
    },

    buttonto() {
      this.elimage = true;
    },

    off() {
      //   if (this.id != "") {
      //     axios
      //       .get("http://192.168.3.53:8077/manage/modbus/operate", {
      //         params: {
      //           id: this.id,
      //           type: 2,
      //         },
      //       })
      //       .then((res) => {
      //         this.imgdata = true;
      //         this.$modal.msgSuccess("停止成功");
      //       });
      //   } else {
      //     this.$message({
      //       message: "请选择设备",
      //       type: "warning",
      //     });
      //   }
    },
    on() {
      //   if (this.id != "") {
      //     axios
      //       .get("http://192.168.3.53:8077/manage/modbus/operate", {
      //         params: {
      //           id: this.id,
      //           type: 1,
      //         },
      //       })
      //       .then((res) => {
      //         this.imgdata = false;
      //         this.$modal.msgSuccess("启动成功");
      //       });
      //   } else {
      //     this.$message({
      //       message: "请选择设备",
      //       type: "warning",
      //     });
      //   }
    },
  },
};
</script>

<style lang="scss" scoped>
.app-containers ::-webkit-scrollbar {
  display: none;
}

::-webkit-scrollbar {
  width: 0 !important;
}
::-webkit-scrollbar {
  width: 0 !important;
  height: 0;
}

.el-button + .el-button {
  margin-left: 0px !important;
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
