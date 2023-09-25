<template>
  <div class="app-container">
    <!-- 切换 -->
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="异常报警" name="1">
        <abnormalAlarm />
      </el-tab-pane>
      <el-tab-pane label="历史异常报警" name="2">
        <historicalAnomalyAlarm />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import abnormalAlarm from "./abnormalAlarm.vue";
import historicalAnomalyAlarm from "./historicalAnomalyAlarm.vue";

export default {
  components: { abnormalAlarm, historicalAnomalyAlarm },
  data() {
    return {
      //默认tab切换为1
      activeName: "1",
    };
  },
  methods: {
    //点击tab切换
    handleClick() {
      this.activeName = "2";
    },
  },
};
</script>

<style scoped lang="scss">
.clearfix {
  line-height: 40px;
  display: flex;
}
</style>
