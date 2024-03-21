<template>
  <div class="videoMain" ref="playWndBox">
    <div
      id="playWnd"
      class="playWnd"
      :style="{
        height: playWndHeight + 'px',
        width: playWndWidth + 'px',
      }"
    ></div>
  </div>
</template>

<script>
export default {
  name: "HikVideo",
  data() {
    return {
      // 视频盒子的高度
      playWndHeight: "",
      // 视频盒子的宽度
      playWndWidth: "",
      oWebControl: null,
      initCount: 0,
      pubKey: "",
      cameraIndexCode: "", // 这里面是监控点编号
      objData: {
        appkey: "", //海康平台提供的appkey
        ip: "", //平台地址
        secret: "", //海康平台提供的secret
        port: 443,
        playMode: 0, // 0 预览 1回放
        layout: "2x2", //页面展示的模块数【16】
      },
    };
  },
  mounted() {
    // 首次加载时的到父容器的高度
    this.playWndHeight = this.$refs.playWndBox.clientHeight;
    // 首次加载时的到父容器的宽度
    this.playWndWidth = this.$refs.playWndBox.clientWidth;

    // 初始化播放器插件
    this.$nextTick(() => {
      this.initPlugin();
    });

    // 监听scroll事件，使插件窗口尺寸跟随DIV窗口变化
    window.addEventListener("scroll", () => {
      if (this.oWebControl != null) {
        this.oWebControl.JS_Resize(
          this.$refs.playWndBox.clientWidth,
          this.$refs.playWndBox.clientHeight
        );
        this.setWndCover();
      }
    });

    // 监听resize事件，使插件窗口尺寸跟随DIV窗口变化
    window.addEventListener("resize", (e) => {
      if (this.oWebControl != null) {
        this.oWebControl.JS_Resize(
          this.$refs.playWndBox.clientWidth,
          this.$refs.playWndBox.clientHeight
        );
        this.setWndCover();
      }
    });
  },
  destroyed() {
    if (this.oWebControl != null) {
      // 先让窗口隐藏，规避可能的插件窗口滞后于浏览器消失问题
      this.oWebControl.JS_HideWnd();
      // 销毁当前播放的视频
      this.oWebControl.JS_RequestInterface({ funcName: "destroyWnd" });
      // 断开与插件服务连接
      this.oWebControl.JS_Disconnect();
    }
  },
  methods: {
    // 创建播放实例
    initPlugin() {
      let that = this;
      this.oWebControl = null;
      that.oWebControl = new WebControl({
        szPluginContainer: "playWnd", // 指定容器id
        iServicePortStart: 15900, // 指定起止端口号，建议使用该值
        iServicePortEnd: 15909,
        szClassId: "23BF3B0A-2C56-4D97-9C03-0CB103AA8F11", // 用于IE10使用ActiveX的clsid
        cbConnectSuccess: () => {
          // 创建WebControl实例成功
          that.oWebControl
            .JS_StartService("window", {
              // WebControl实例创建成功后需要启动服务
              // 值"./VideoPluginConnect.dll"写死
              dllPath: "./VideoPluginConnect.dll",
            })
            .then(
              function () {
                // 设置消息回调
                that.oWebControl.JS_SetWindowControlCallback({
                  cbIntegrationCallBack: that.cbIntegrationCallBack,
                });
                //JS_CreateWnd创建视频播放窗口，宽高可设定
                that.oWebControl
                  .JS_CreateWnd("playWnd", 2040, 945, { bEmbed: true })
                  //注：2040,945这是我本人项目视频盒子的大小，你们要根据自己视频盒子的大小进行修改，不然初始化插件的时候会有空白闪烁。
                  .then(function () {
                    // 创建播放实例成功后初始化
                    that.init();
                  });
              },
              function () {
                // 启动插件服务失败
              }
            );
        },
        // 创建WebControl实例失败
        cbConnectError: function () {
          that.oWebControl = null;
          // alert('插件未启动，正在尝试启动，请稍候...')
          // that.$message.warning("插件未启动，正在尝试启动，请稍候...");
          // 程序未启动时执行error函数，采用wakeup来启动程序
          window.WebControl.JS_WakeUp("VideoWebPlugin://");
          that.initCount++;
          if (that.initCount < 3) {
            setTimeout(function () {
              that.initPlugin();
            }, 3000);
          } else {
            // that.messageBox = true
            // alert('插件启动失败，请安装插件并重新启动！')
            // that.downloadHikVideo()
            // setTimeout(function () {
            //     that.messageBox = false
            // }, 5000)
            // setTimeout(function () {
            //     alert('插件启动失败，请检查插件是否安装！')
            //     that.$message({
            //         message: '插件启动失败，请检查插件是否安装！ \n 插件下载地址：https://www.baidu.com',
            //         type: 'warning'
            //     });
            // }, 5000)
          }
        },
        cbConnectClose: () => {
          // 异常断开：bNormalClose = false
          // JS_Disconnect正常断开：bNormalClose = true
          // console.log("cbConnectClose");
          that.oWebControl = null;
        },
      });
    },
    // 初始化
    init(callback) {
      let that = this;
      that.getPubKey(() => {
        let appkey = that.objData.appkey; //综合安防管理平台提供的appkey，必填
        let secret = that.setEncrypt(that.objData.secret); //综合安防管理平台提供的secret，必填
        let ip = that.objData.ip; //综合安防管理平台IP地址，必填
        let playMode = that.objData.playMode; //初始播放模式：0-预览，1-回放
        let port = that.objData.port; //综合安防管理平台端口，若启用HTTPS协议，默认443
        let snapDir = "D:\\SnapDir"; //抓图存储路径
        let videoDir = "D:\\VideoDir"; //紧急录像或录像剪辑存储路径
        let layout = that.objData.layout; //playMode指定模式的布局
        let enableHTTPS = 1; //是否启用HTTPS协议与综合安防管理平台交互，这里总是填1
        let encryptedFields = "secret"; //加密字段，默认加密领域为secret
        let showToolbar = 1; //是否显示工具栏，0-不显示，非0-显示
        let showSmart = 1; //是否显示智能信息（如配置移动侦测后画面上的线框），0-不显示，非0-显示
        let buttonIDs =
          "0,16,256,257,258,259,260,512,513,514,515,516,517,768,769"; //自定义工具条按钮
        // var toolBarButtonIDs = "2049,2304" // 工具栏上自定义按钮
        that.oWebControl
          .JS_RequestInterface({
            funcName: "init",
            argument: JSON.stringify({
              appkey: appkey, //API网关提供的appkey
              secret: secret, //API网关提供的secret
              ip: ip, //API网关IP地址
              playMode: playMode, //播放模式（决定显示预览还是回放界面）
              port: port, //端口
              snapDir: snapDir, //抓图存储路径
              videoDir: videoDir, //紧急录像或录像剪辑存储路径
              layout: layout, //布局
              enableHTTPS: enableHTTPS, //是否启用HTTPS协议
              encryptedFields: encryptedFields, //加密字段
              showToolbar: showToolbar, //是否显示工具栏
              showSmart: showSmart, //是否显示智能信息
              buttonIDs, //自定义工具条按钮
            }),
          })
          .then(function (oData) {
            that.oWebControl.JS_Resize(that.playWndWidth, that.playWndHeight); // 初始化后resize一次，规避firefox下首次显示窗口后插件窗口未与DIV窗口重合问题
            if (callback) {
              callback();
            }
            // 隐藏
            // that.oWebControl.JS_HideWnd()
          });
      });
    },
    // 获取公钥
    getPubKey(callback) {
      let that = this;
      this.oWebControl
        .JS_RequestInterface({
          funcName: "getRSAPubKey",
          argument: JSON.stringify({
            keyLength: 1024,
          }),
        })
        .then(function (oData) {
          if (oData.responseMsg.data) {
            that.pubKey = oData.responseMsg.data;
            callback();
          }
        });
    },
    // RSA 加密
    setEncrypt(value) {
      let that = this;
      let encrypt = new window.JSEncrypt();
      encrypt.setPublicKey(that.pubKey);
      return encrypt.encrypt(value);
    },
    // 回调的消息
    cbIntegrationCallBack(oData) {
      let { responseMsg: type } = oData;
      if (type === "error") {
      } else {
      }
    },
    // 视频预览功能
    previewVideo(data) {
      let that = this;
      let cameraIndexCode = data; // 获取输入的监控点编号值，必填
      let streamMode = 0; // 主子码流标识：0-主码流，1-子码流
      let transMode = 0; // 传输协议：0-UDP，1-TCP
      let gpuMode = 0; // 是否启用GPU硬解，0-不启用，1-启用
      let wndId = -1; // 播放窗口序号（在2x2以上布局下可指定播放窗口）
      // console.log(cameraIndexCode, "-------cameraIndexCode-");

      that.oWebControl.JS_RequestInterface({
        funcName: "startPreview",
        argument: JSON.stringify({
          cameraIndexCode: cameraIndexCode.trim(), // 监控点编号
          streamMode: streamMode, // 主子码流标识
          transMode: transMode, // 传输协议
          gpuMode: gpuMode, // 是否开启GPU硬解
          wndId: wndId, // 可指定播放窗口
        }),
      });
    },
    // 停止全部预览
    stopAllPreview() {
      this.oWebControl.JS_RequestInterface({
        funcName: "stopAllPreview",
      });
    },
    // 格式化时间
    dateFormat(oDate, fmt) {
      let o = {
        "M+": oDate.getMonth() + 1, //月份
        "d+": oDate.getDate(), //日
        "h+": oDate.getHours(), //小时
        "m+": oDate.getMinutes(), //分
        "s+": oDate.getSeconds(), //秒
        "q+": Math.floor((oDate.getMonth() + 3) / 3), //季度
        S: oDate.getMilliseconds(), //毫秒
      };
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          (oDate.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
      }
      for (let k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length == 1
              ? o[k]
              : ("00" + o[k]).substr(("" + o[k]).length)
          );
        }
      }
      return fmt;
    },

    // 设置窗口裁剪，当因滚动条滚动导致窗口需要被遮住的情况下需要JS_CuttingPartWindow部分窗口
    setWndCover() {
      var iWidth = $(window).width();
      var iHeight = $(window).height();
      var oDivRect = $("#playWnd").get(0).getBoundingClientRect();

      var iCoverLeft = oDivRect.left < 0 ? Math.abs(oDivRect.left) : 0;
      var iCoverTop = oDivRect.top < 0 ? Math.abs(oDivRect.top) : 0;
      var iCoverRight =
        oDivRect.right - iWidth > 0 ? Math.round(oDivRect.right - iWidth) : 0;
      var iCoverBottom =
        oDivRect.bottom - iHeight > 0
          ? Math.round(oDivRect.bottom - iHeight)
          : 0;

      iCoverLeft = iCoverLeft > 2041 ? 2041 : iCoverLeft;
      iCoverTop = iCoverTop > 945 ? 945 : iCoverTop;
      iCoverRight = iCoverRight > 2041 ? 2041 : iCoverRight;
      iCoverBottom = iCoverBottom > 945 ? 945 : iCoverBottom;

      this.oWebControl.JS_RepairPartWindow(0, 0, 2041, 946); // 多1个像素点防止还原后边界缺失一个像素条
      if (iCoverLeft != 0) {
        this.oWebControl.JS_CuttingPartWindow(0, 0, iCoverLeft, 946);
      }
      if (iCoverTop != 0) {
        this.oWebControl.JS_CuttingPartWindow(0, 0, 2041, iCoverTop); // 多剪掉一个像素条，防止出现剪掉一部分窗口后出现一个像素条
      }
      if (iCoverRight != 0) {
        this.oWebControl.JS_CuttingPartWindow(
          2041 - iCoverRight,
          0,
          iCoverRight,
          946
        );
      }
      if (iCoverBottom != 0) {
        this.oWebControl.JS_CuttingPartWindow(
          0,
          946 - iCoverBottom,
          2041,
          iCoverBottom
        );
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.videoMain {
  width: 100%;
  height: 100%;
}
</style>
