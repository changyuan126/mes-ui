<template>
  <div class="app-container">
    <!-- 为 ECharts 准备一个定义了宽高的 DOM -->
    <div id="ticketData" style="width: 100%; height: 360px"></div>
  </div>
</template>
<script>
import * as echarts from "echarts";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  components: { echarts, Treeselect },
  props: ["message"], // 声明一个自定义的属性
  data() {
    return {
      echartData: [],
    };
  },
  watch: {
    message: {
      immediate: true,
      handler(val) {
        //  console.log(val,'差点撒旦阿萨=============');
        this.echartData = val;
        //  val.forEach((item) => {
        //   this.getDataNum.push(Number(item.ytdUvNew))
        //   this.getDataTime.push(moment(item.dt).format('YYYY-MM-DD'))
        // })
        this.$nextTick(() => {
          //这里需要重新加载渲染
          this.drawLine();
        });
      },
    },
  },

  mounted() {
    this.drawLine();
  },
  methods: {
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("ticketData"));

      var option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // Use axis to trigger tooltip
            type: "shadow", // 'shadow' as default; can also be 'line' or 'shadow'
          },
        },
        legend: {
          // data: ["已完成", "进行中"],
          top: "5%",
          right: "5%",
          icon: "rect",
          textStyle: {
            color: "#fff",
          },
        },
        grid: {
          top: "20%",
          left: "5%",
          right: "5%",
          bottom: "10%",
          containLabel: true,
        },
        xAxis: {
          type: "value",
          axisLine: {
            lineStyle: {
              color: "rgba(255,255,255,0.8)",
            },
          },
          splitLine: {
            lineStyle: {
              color: "rgba(255,255,255,0.3)", // 分割线颜色
            },
          },
        },
        yAxis: {
          type: "category",
          //   data: ["已签收", "配送中", "已出库", "采购中", "接单中"],
          axisLabel: {
            color: "rgba(255,255,255,0.8)",
          },
        },
        series: [
          {
            name: "计划数量",
            type: "bar",
            stack: "total",
            label: {
              show: true,
            },
            emphasis: {
              focus: "series",
            },
            // data: [121, 828, 144, 368, 390],
            barWidth: 12,
            itemStyle: {
              label: {
                show: true,
              },
              labelLine: {
                show: false,
              },
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: "rgba(7,165,255,0.2)" },
                { offset: 1, color: "rgba(7,165,255,1)" },
              ]),
              borderColor: "rgba(7,165,255,0.7)",
              shadowBlur: 16,
              shadowColor: "rgba(7,165,255,1)",
            },
          },
          {
            name: "产出数量",
            type: "bar",
            stack: "total",
            label: {
              show: true,
            },
            emphasis: {
              focus: "series",
            },
            // data: [271, 132, 413, 210, 521],
            barWidth: 12,
            itemStyle: {
              label: {
                show: true,
              },
              labelLine: {
                show: false,
              },
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: "rgba(41,244,236,0)" },
                { offset: 1, color: "rgba(41,244,236,1)" },
              ]),
              borderColor: "#a2f9f7",
              shadowBlur: 16,
              shadowColor: "#a2f9f7",
            },
          },
        ],
        dataset: {
          source: [
            // { status: "今飞智造2.1订单", value1: 33, value2: 93 },
            // { status: "今飞餐达1.15订单", value1: 53, value2: 32 },
            // { status: "今飞智造1.1订单", value1: 78, value2: 65 },
            // { status: "今飞智适12.15打单", value1: 12, value2: 35 },
            // { status: "今飞智适12.1订单", value1: 90, value2: 52 },
          ],
        },
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  padding: 0px !important;
  min-height: calc(0vh - 0px) !important;
}
</style>
