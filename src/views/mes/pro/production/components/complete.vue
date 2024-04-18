<template>
  <div class="app-container">
    <!-- 为 ECharts 准备一个定义了宽高的 DOM -->
    <div id="completeData" style="width: 100%; height: 360px"></div>
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
      var myChart = echarts.init(document.getElementById("completeData"));

      var option = {
        tooltip: {
          //提示框组件
          trigger: "axis",
          formatter: "{b}<br />{a0}: {c0}<br />{a1}: {c1}",
          axisPointer: {
            type: "shadow",
            label: {
              backgroundColor: "#6a7985",
            },
          },
          textStyle: {
            color: "#fff",
            fontStyle: "normal",
            fontFamily: "微软雅黑",
            fontSize: 12,
          },
        },
        grid: {
          left: "5%",
          right: "4%",
          bottom: "6%",
          top: 60,
          padding: "0 0 10 0",
          containLabel: true,
        },
        legend: {
          //图例组件，颜色和名字
          right: 10,
          top: 20,
          itemGap: 16,
          itemWidth: 18,
          itemHeight: 10,
          data: [
            {
              name: "实际完成工单数",
              //icon:'image://../wwwroot/js/url2.png', //路径
            },
            {
              name: "计划工单数",
            },
          ],
          textStyle: {
            color: "#a8aab0",
            fontStyle: "normal",
            fontFamily: "微软雅黑",
            fontSize: 12,
          },
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: true, //坐标轴两边留白
            data: [
              // "2023-07",
              // "2023-08",
              // "2023-09",
              // "2023-10",
              // "2023-11",
              // "2023-12",
              // "2024-01",
              // "2024-02",
              // "2024-03",
              // "2024-04",
            ],
            axisLabel: {
              //坐标轴刻度标签的相关设置。
              interval: 0, //设置为 1，表示『隔一个标签显示一个标签』
              margin: 15,
              textStyle: {
                color: "#078ceb",
                fontStyle: "normal",
                fontFamily: "微软雅黑",
                fontSize: 12,
              },
            },
            axisTick: {
              //坐标轴刻度相关设置。
              show: false,
            },
            axisLine: {
              //坐标轴轴线相关设置
              lineStyle: {
                color: "#fff",
                opacity: 0.2,
              },
            },
            splitLine: {
              //坐标轴在 grid 区域中的分隔线。
              show: false,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            splitNumber: 5,
            axisLabel: {
              textStyle: {
                color: "#a8aab0",
                fontStyle: "normal",
                fontFamily: "微软雅黑",
                fontSize: 12,
              },
            },
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: ["#fff"],
                opacity: 0.06,
              },
            },
          },
        ],
        series: [
          {
            name: "实际完成工单数",
            type: "bar",
            // data: [4.9, 7.3, 9.2, 5.6, 7.7, 5.6, 4.2, 3.6, 6, 6.4],
            barWidth: 10,
            barGap: 0, //柱间距离
            label: {
              //图形上的文本标签
              normal: {
                show: true,
                position: "top",
                textStyle: {
                  color: "#a8aab0",
                  fontStyle: "normal",
                  fontFamily: "微软雅黑",
                  fontSize: 12,
                },
              },
            },
            itemStyle: {
              //图形样式
              normal: {
                barBorderRadius: [5, 5, 0, 0],
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 1,
                      color: "rgba(127, 128, 225, 0.7)",
                    },
                    {
                      offset: 0.9,
                      color: "rgba(72, 73, 181, 0.7)",
                    },
                    {
                      offset: 0.31,
                      color: "rgba(0, 208, 208, 0.7)",
                    },
                    {
                      offset: 0.15,
                      color: "rgba(0, 208, 208, 0.7)",
                    },
                    {
                      offset: 0,
                      color: "rgba(104, 253, 255, 0.7)",
                    },
                  ],
                  false
                ),
              },
            },
          },
          {
            name: "计划工单数",
            type: "bar",
            // data: [2.9, 5, 4.4, 2.7, 5.7, 4.6, 1.2, 2.7, 4.8, 6.0],
            barWidth: 10,
            barGap: 0.2, //柱间距离
            label: {
              //图形上的文本标签
              normal: {
                show: true,
                position: "top",
                textStyle: {
                  color: "#a8aab0",
                  fontStyle: "normal",
                  fontFamily: "微软雅黑",
                  fontSize: 12,
                },
              },
            },
            itemStyle: {
              //图形样式
              normal: {
                barBorderRadius: [5, 5, 0, 0],
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 1,
                      color: "rgba(127, 128, 225, 0.7)",
                    },
                    {
                      offset: 0.9,
                      color: "rgba(72, 73, 181, 0.7)",
                    },
                    {
                      offset: 0.25,
                      color: "rgba(226, 99, 74, 0.7)",
                    },
                    {
                      offset: 0,
                      color: "rgba(253, 200, 106, 0.7)",
                    },
                  ],
                  false
                ),
              },
            },
          },
        ],
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
