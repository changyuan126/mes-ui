<template>
  <div class="app-container">
    <!-- 为 ECharts 准备一个定义了宽高的 DOM -->
    <div id="onlineRate" style="width: 100%; height: 150px"></div>
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
      var myChart = echarts.init(document.getElementById("onlineRate"));

      let value = "0%";
      let title = "设备在线率";
      var option = {
        title: [
          {
            text: "{a|" + value + "}\n{c|" + title + "}",
            x: "center",
            top: "35%",
            textStyle: {
              rich: {
                a: {
                  fontSize: 15,
                  color: "#ffffff",
                },
                c: {
                  fontSize: 10,
                  color: "#ffffff",
                  padding: [5, 0],
                },
              },
            },
          },
        ],
        // backgroundColor: "#111",
        polar: {
          radius: ["70%", "95%"],
          center: ["50%", "50%"],
        },
        angleAxis: {
          max: 100,
          show: false,
        },
        radiusAxis: {
          type: "category",
          show: true,
          axisLabel: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
        },
        series: [
          {
            name: "",
            type: "bar",
            roundCap: true,
            barWidth: 90,
            showBackground: true,
            backgroundStyle: {
              color: "rgba(66, 66, 66, .3)",
            },
            // data: [50],
            coordinateSystem: "polar",

            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  {
                    offset: 0,
                    color: "#717171",
                  },
                  {
                    offset: 1,
                    color: "#717171",
                  },
                ]),
              },
            },
          },
          // {
          //     name: '',
          //     type: 'pie',
          //     startAngle: 80,
          //     radius: ['6%'],
          //     hoverAnimation: false,
          //     center: ['50%', '50%'],
          //     itemStyle: {
          //         color: 'rgba(66, 66, 66, .1)',
          //         borderWidth: 1,
          //         borderColor: '#5269EE',
          //     },
          //     data: [100],
          // },
          {
            name: "",
            type: "pie",
            startAngle: 80,
            radius: ["100%"],
            hoverAnimation: false,
            center: ["50%", "50%"],
            itemStyle: {
              color: "rgba(66, 66, 66, .1)",
              borderWidth: 1,
              borderColor: "#5269EE",
            },
            data: [100],
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
