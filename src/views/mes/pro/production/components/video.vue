<template>
  <div>
    <div>
      <div id="playWnd" class="playWnd"></div>
      <div v-show="lodingshow" style="margin: -17px 0">
        <a-spin tip="Loading...">
          <div class="spin-content">插件未启动，正在尝试启动，请稍候...</div>
        </a-spin>
      </div>

      <div v-show="lodingres" class="example">
        <p style="margin: 0; display: inline-block">
          没有检测到插件，请安装插件后重启浏览器！
        </p>
        <a-button class="buttonDetails-class" @click="downloadFile()"
          >下载</a-button
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "monitor",
  data() {
    return {
      // 控制窗口个数
      camlength: "1x1",

      // 插件没有启动的显示样式
      lodingshow: false,
      lodingres: false,
      
    };
  },
 created() {
            // 加载播放实例
            this.initPlugin();
            // 监听resize事件，使插件窗口尺寸跟随DIV窗口变化  
            // vue 的onresize
            $(window).resize(() => {
                if (oWebControl != null) {
                    oWebControl.JS_Resize( $('.map').width(), $('.map').height() - 60);
                }
            });

        },
        // 页面结束的时候关闭显示窗口
        destroyed() {
            if (oWebControl != null) {
                oWebControl.JS_HideWnd();   // 先让窗口隐藏，规避可能的插件窗口滞后于浏览器消失问题
                oWebControl.JS_Disconnect().then(() => {  // 断开与插件服务连接成功
                    },
                    () => {  // 断开与插件服务连接失败
                    });
            }
        },

		 methods: {
            // 修改布局 展示画面
            refusePlay() {
                // 获取区域列表下的摄像机列表  进行布局展示
                SubordinateCam({
                    pageNo: 1,
                    pageSize: 1000,
                    regionIndexCode: this.$route.params.id
                }).then(res => {
                    if (res.data.code == 0) {
                        let shuliang = res.data.data.list.length;
                        if (shuliang == 1 || shuliang == 0) {
                            this.camlength = "1x1"
                        } else if (shuliang > 1 && shuliang <= 4) {
                            this.camlength = "2x2"
                        } else if (shuliang > 4 && shuliang <= 9) {
                            this.camlength = "3x3"
                        } else if (shuliang > 9 && shuliang <= 16) {
                            this.camlength = "4x4"
                        } else if (shuliang > 16 && shuliang <= 25) {
                            this.camlength = "5x5"
                        }
                        // 设置摄像头的布局
                        oWebControl.JS_RequestInterface({
                            funcName: "setLayout",
                            argument: {layout: this.camlength}
                        }).then(() => {
                            // 有监控点就进行播放
                            if (res.data.data.list.length > 0) {
                                this.$message.success('获取成功 监控点数量为' + res.data.data.list.length)
                                res.data.data.list.forEach((item, index) => {
                                    oWebControl.JS_RequestInterface({
                                        funcName: "startPreview",
                                        argument: JSON.stringify({
                                            cameraIndexCode: item.cameraIndexCode,                //监控点编号
                                            streamMode: 0,                         //主子码流标识
                                            transMode: 1,                           //传输协议
                                            gpuMode: 0,                               //是否开启GPU硬解
                                            wndId: index + 1                                     //可指定播放窗口
                                        })
                                    })
                                })
                            } else {
                                this.$message.warning('当前区域无直属监控点区域')
                                // 停止全部的播放
                                let result = JSON.stringify({
                                    "funcName": "stopAllPreview"
                                }, null, 2)
                                this.requestInterface(result);
                            }
                        })
                    } else {
                        this.$message.error('获取失败')
                    }

                })
            },
            // $('.map').width(), $('.map').height() - 60)
            // 创建播放实例
            initPlugin() {
                // eslint-disable-next-line no-undef
                oWebControl = new WebControl({
                    szPluginContainer: "playWnd",                       // 指定容器id
                    iServicePortStart: 15900,                           // 指定起止端口号，建议使用该值
                    iServicePortEnd: 15909,
                    szClassId: "23BF3B0A-2C56-4D97-9C03-0CB103AA8F11",   // 用于IE10使用ActiveX的clsid
                    cbConnectSuccess: () => {                     // 创建WebControl实例成功
                        oWebControl.JS_StartService("window", {         // WebControl实例创建成功后需要启动服务
                            dllPath: "./VideoPluginConnect.dll"         // 值"./VideoPluginConnect.dll"写死
                        }).then(() => {                           // 启动插件服务成功
                            oWebControl.JS_SetWindowControlCallback({   // 设置消息回调
                                cbIntegrationCallBack: this.cbIntegrationCallBack
                            });
                            oWebControl.JS_CreateWnd("playWnd",  $('.map').width(), $('.map').height() - 60).then(() => { //JS_CreateWnd创建视频播放窗口，宽高可设定
                                this.init();  // 创建播放实例成功后初始化
                            });
                        }, () => { // 启动插件服务失败
                        });
                    },
                    cbConnectError: () => { // 创建WebControl实例失败
                        oWebControl = null;
                        // $("#playWnd").html("插件未启动，正在尝试启动，请稍候...");
                        this.lodingshow = true;
                        // eslint-disable-next-line no-undef
                        WebControl.JS_WakeUp("VideoWebPlugin://"); // 程序未启动时执行error函数，采用wakeup来启动程序
                        initCount++;
                        if (initCount < 3) {
                            setTimeout(() => {
                                this.initPlugin();
                            }, 3000)
                        } else {
                            this.lodingshow = false;
                            this.lodingres = true;
                            // $("#playWnd").html("插件启动失败，请检查插件是否安装！");
                        }
                    },
                    cbConnectClose: () => {
                        // 异常断开：bNormalClose = false
                        // JS_Disconnect正常断开：bNormalClose = true
                        oWebControl = null;
                    }
                });
            },

            //初始化
            init() {
                // 获取公钥的方法
                this.getPubKey(() => {
                    ////////////////////////////////// 请自行修改以下变量值	////////////////////////////////////
                    let appkey = admin;                           //综合安防管理平台提供的appkey，必填
                    // 进行相应的加密
                    let secret = "mygymygy.";   //综合安防管理平台提供的secret，必填
                    let ip = "192.168.2.107";                           //综合安防管理平台IP地址，必填
                    let port = "443";                       //综合安防管理平台端口，若启用HTTPS协议，默认443
                    let playMode = 0;                                  //初始播放模式：0-预览，1-回放
                    let snapDir = "D:\\SnapDir";                       //抓图存储路径
                    let videoDir = "D:\\VideoDir";                     //紧急录像或录像剪辑存储路径
                    let layout = "1x1";                                //playMode指定模式的布局
                    let enableHTTPS = 1;                               //是否启用HTTPS协议与综合安防管理平台交互，这里总是填1
                    let encryptedFields = 'secret';					   //加密字段，默认加密领域为secret
                    let showToolbar = 1;                               //是否显示工具栏，0-不显示，非0-显示
                    let showSmart = 1;                                 //是否显示智能信息（如配置移动侦测后画面上的线框），0-不显示，非0-显示
                    let buttonIDs = "0,16,256,257,258,259,260,512,513,514,515,516,768,769";  //自定义工具条按钮
                    let toolBarButtonIDs = "2048,2304,2305,2306,2307,2308,2309,4096,4097,4098,4099,4608,4609"
                    ////////////////////////////////// 请自行修改以上变量值	////////////////////////////////////
                    oWebControl.JS_RequestInterface({
                        funcName: "init",
                        argument: JSON.stringify({
                            appkey: appkey,                            //API网关提供的appkey
                            secret: secret,                            //API网关提供的secret
                            ip: ip,                                    //API网关IP地址
                            playMode: playMode,                        //播放模式（决定显示预览还是回放界面）
                            port: port,                                //端口
                            snapDir: snapDir,                          //抓图存储路径
                            videoDir: videoDir,                        //紧急录像或录像剪辑存储路径
                            layout: layout,                            //布局
                            enableHTTPS: enableHTTPS,                  //是否启用HTTPS协议
                            encryptedFields: encryptedFields,          //加密字段
                            showToolbar: showToolbar,                  //是否显示工具栏
                            showSmart: showSmart,                      //是否显示智能信息
                            buttonIDs: buttonIDs,                       //自定义工具条按钮
                            toolBarButtonIDs:toolBarButtonIDs           //自定义最外层的工具条
                        })
                    }).then(() => {
                        oWebControl.JS_Resize( $('.map').width(), $('.map').height() - 60);  // 初始化后resize一次，规避firefox下首次显示窗口后插件窗口未与DIV窗口重合问题
                        // 加载完成后进行布局的修改 和 摄像头的展示
                        this.refusePlay();
                    });

                });

            },

            //获取公钥
            getPubKey(callback) {
                oWebControl.JS_RequestInterface({
                    funcName: "getRSAPubKey",
                    argument: JSON.stringify({
                        keyLength: 1024
                    })
                }).then((oData) => {
                    console.log(oData);
                    if (oData.responseMsg.data) {
                        pubKey = oData.responseMsg.data;
                        callback()
                    }
                })
            },

            //RSA加密
            setEncrypt(value) {
                // eslint-disable-next-line no-undef
                let encrypt = new JSEncrypt();
                encrypt.setPublicKey(pubKey);
                return encrypt.encrypt(value);
            },

            // 推送消息
            cbIntegrationCallBack(oData) {
                // if (oData.responseMsg.msg.cameraIndexCode != '') {
                //     this.$router.push({name: 'playbackDetails', params: {id: oData.responseMsg.msg.cameraIndexCode}})
                // }
                this.showCBInfo(JSON.stringify(oData.responseMsg));
            },

            // 设置窗口裁剪，当因滚动条滚动导致窗口需要被遮住的情况下需要JS_CuttingPartWindow部分窗口
            setWndCover() {
                let iWidth = $('.map').width();
                let iHeight = $('.map').height() - 60;
                let oDivRect = $("#playWnd").get(0).getBoundingClientRect();

                let iCoverLeft = (oDivRect.left < 0) ? Math.abs(oDivRect.left) : 0;
                let iCoverTop = (oDivRect.top < 0) ? Math.abs(oDivRect.top) : 0;
                let iCoverRight = (oDivRect.right - iWidth > 0) ? Math.round(oDivRect.right - iWidth) : 0;
                let iCoverBottom = (oDivRect.bottom - iHeight > 0) ? Math.round(oDivRect.bottom - iHeight) : 0;

                iCoverLeft = (iCoverLeft > 1200) ? 1200 : iCoverLeft;
                iCoverTop = (iCoverTop > 600) ? 600 : iCoverTop;
                iCoverRight = (iCoverRight > 1200) ? 1200 : iCoverRight;
                iCoverBottom = (iCoverBottom > 600) ? 600 : iCoverBottom;

                oWebControl.JS_RepairPartWindow(0, 0,  $('.map').width(), $('.map').height() - 60);    // 多1个像素点防止还原后边界缺失一个像素条
                if (iCoverLeft != 0) {
                    oWebControl.JS_CuttingPartWindow(0, 0, iCoverLeft, 600);
                }
                if (iCoverTop != 0) {
                    oWebControl.JS_CuttingPartWindow(0, 0, $('.map').width(), iCoverTop);    // 多剪掉一个像素条，防止出现剪掉一部分窗口后出现一个像素条
                }
                if (iCoverRight != 0) {
                    oWebControl.JS_CuttingPartWindow($('.map').width() - iCoverRight, 0, iCoverRight, 600);
                }
                if (iCoverBottom != 0) {
                    oWebControl.JS_CuttingPartWindow(0, 600 - iCoverBottom, $('.map').width(), iCoverBottom);
                }
            },

            // 执行字符串方法
            // value为字符串，JS_RequestInterface仅接收json格式的变量，且需要先解析出argument，并且将argument字段的内容转为字符串
            requestInterface(value) {
                this.isJSON(value);
                let JsonParam = JSON.parse(value);
                let JsonArgument = JsonParam.argument;
                JsonParam.argument = JSON.stringify(JsonArgument);

                oWebControl.JS_RequestInterface(JsonParam).then((oData) => {
                    this.showCBInfo(JSON.stringify(oData ? oData.responseMsg : ''));
                });
            },

            // 显示接口返回的消息及插件回调信息
            showCBInfo(szInfo, type) {
                if (type === 'error') {
                    szInfo = "<div style='color: red;'>" + this.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss") + " " + szInfo + "</div>";
                } else {
                    szInfo = "<div>" + this.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss") + " " + szInfo + "</div>";
                }
                $("#cbInfo").html(szInfo + $("#cbInfo").html());
            },

            // 判断字符串是否为json
            isJSON(str) {
                if (typeof str == 'string') {
                    try {
                        let obj = JSON.parse(str);
                        if (typeof obj == 'object' && obj) {
                            return true;
                        } else {
                            this.showCBInfo("param is not the correct JSON message");
                            return false;
                        }
                    } catch (e) {
                        this.showCBInfo("param is not the correct JSON message");
                        return false;
                    }
                }
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
                    "S": oDate.getMilliseconds()//毫秒
                };
                if (/(y+)/.test(fmt)) {
                    fmt = fmt.replace(RegExp.$1, (oDate.getFullYear() + "").substr(4 - RegExp.$1.length));
                }
                for (let k in o) {
                    if (new RegExp("(" + k + ")").test(fmt)) {
                        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                    }
                }
                return fmt;
            },
            // 下载文件到本地
            downloadFile() {
                var a = document.createElement('a')
                // var blob = new Blob([content])
                // var url = window.URL.createObjectURL(blob)
                a.href = '控件下载地址'
                a.download = '视频插件'
                a.click()
                // window.URL.revokeObjectURL(url)
            },

        }
};
</script>
