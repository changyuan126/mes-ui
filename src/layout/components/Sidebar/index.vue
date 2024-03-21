<template>
  <div
    :class="{ 'has-logo': showLogo }"
    :style="{
      backgroundColor:
        settings.sideTheme === 'theme-dark'
          ? variables.menuBackground
          : variables.menuLightBackground,
    }"
  >
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar
      :class="settings.sideTheme"
      wrap-class="scrollbar-wrapper"
      style="height: 80%"
    >
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="
          settings.sideTheme === 'theme-dark'
            ? variables.menuBackground
            : variables.menuLightBackground
        "
        :text-color="
          settings.sideTheme === 'theme-dark'
            ? variables.menuColor
            : variables.menuLightColor
        "
        :unique-opened="true"
        :active-text-color="settings.theme"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="(route, index) in sidebarRouters"
          :key="route.path + index"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
    <div
      style="
        height: 10%;
        display: flex;
        justify-content: center;
        align-items: center;
      "
      @click="stop"
    >
      <img src="../../../assets/images/emergencyStop.png" style="width: 90px" />
    </div>
    <div style="height: 10%; width: 100%; font-size: 13px">
      【紧急制动，所有设备全部停止】
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import variables from "@/assets/styles/variables.scss";
import axios from "axios";

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapState(["settings"]),
    ...mapGetters(["sidebarRouters", "sidebar"]),
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    },
  },
  methods: {
    stop() {
      this.$confirm(
        "确定制动后，车间内所有设备将全部紧急停止运行，请谨慎操作! 如确定要进行紧急制动，请点击【确定】按钮!",
        "紧急制动确认",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          axios
            .get("http://192.168.3.53:8077/manage/task/emergencyStop")
            .then((res) => {
              if (res.code === 200) {
                this.$message({
                  message: "紧急制动成功",
                  type: "success",
                });
              } else {
                this.$message({
                  message: "紧急制动失败",
                  type: "error",
                });
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
  },
};
</script>

<style lang="scss">
.el-message-box {
  width: 430px !important;
  border: 0px solid #ebeef5 !important;
}
.el-message-box__header {
  background: #922423 !important;
  color: #fff !important;
}
.el-message-box__title {
  color: #fdf3f7 !important;
}
.el-message-box__content {
  color: #fdf3f7 !important;
  background: #cf3533 !important;
}
</style>
