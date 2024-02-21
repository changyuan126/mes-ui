<template>
  <div class="app-container">
    <!-- 为 ECharts 准备一个定义了宽高的 DOM -->
    <div id="defectiveData" style="width: 100%; height: 310px"></div>
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
      var myChart = echarts.init(document.getElementById("defectiveData"));

      var scale = 1;
      var echartData = [
        {
          value: 50,
          name: "材料不良",
        },
        {
          value: 100,
          name: "工序不良",
        },
        {
          value: 300,
          name: "尺寸不良",
        },
        {
          value: 50,
          name: "其他不良",
        },
      ];
      var rich = {
        yellow: {
          color: "#fff",
          fontSize: 14 * scale,
          padding: [5, 4],
          align: "center",
        },
        total: {
          color: "#49dff0",
          fontSize: 24 * scale,
          align: "center",
        },
        white: {
          color: "#fff",
          align: "center",
          fontSize: 14 * scale,
          padding: [5, 0],
        },
        blue: {
          color: "#49dff0",
          fontSize: 12 * scale,
          align: "center",
        },
        hr: {
          borderColor: "#0b5263",
          width: "100%",
          borderWidth: 1,
          height: 0,
        },
      };
      var option = {
        title: {
          text: "不良品总数",
          left: "center",
          top: "53%",
          padding: [20, 0],
          textStyle: {
            color: "#fff",
            fontSize: 16 * scale,
            align: "center",
          },
        },
        legend: {
          selectedMode: false,
          formatter: function (name) {
            var total = 0; //各科正确率总和
            var averagePercent; //综合正确率
            echartData.forEach(function (value, index, array) {
              total += value.value;
            });
            return "{total|" + total + "}";
          },
          data: [echartData[0].name],
          // data: ['高等教育学'],
          // itemGap: 50,
          left: "center",
          top: "center",
          icon: "none",
          align: "center",
          textStyle: {
            color: "#fff",
            fontSize: 16 * scale,
            rich: rich,
          },
        },
        series: [
          {
            name: "不良品总数",
            type: "pie",
            radius: ["42%", "50%"],
            hoverAnimation: false,
            color: [
              "#c487ee",
              "#deb140",
              "#49dff0",
              "#034079",
              "#6f81da",
              "#00ffb4",
            ],
            label: {
              normal: {
                formatter: function (params, ticket, callback) {
                  var total = 0; //考生总数量
                  var percent = 0; //考生占比
                  echartData.forEach(function (value, index, array) {
                    total += value.value;
                  });
                  percent = ((params.value / total) * 100).toFixed(1);
                  return (
                    "{white|" +
                    params.value +
                    "}\n{hr|}\n{yellow|" +
                    params.name +
                    "}\n"
                  );
                },
                rich: rich,
              },
            },
            labelLine: {
              normal: {
                length: 55 * scale,
                length2: 0,
                lineStyle: {
                  color: "#0b5263",
                },
              },
            },
            data: echartData,
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
