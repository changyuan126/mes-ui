<template>
  <div style="overflow-y: scroll; overflow-x: hidden; height: 100%">
    <section
      style="display: flex; justify-content: space-around; flex-wrap: wrap"
    >
      <span
        class="video_warp_item"
        v-for="(item, index) in liveAddress"
        v-if="index < 3"
        :key="index"
      >
        <div :id="'video-player-' + index"></div>
      </span>
    </section>
  </div>
</template>

<script>
import $ from "jquery"; //  npm i jquery
import EZUIKit from "ezuikit-js";

export default {
  name: "dashboard",
  data() {
    return {
      accessToken: "",
      liveAddress: [],
      diveType: "",
      players: [],
    };
  },

  created() {
    this.getbagndianID();
  },
  methods: {
    // 获取磅点摄像头ID列表
    getbagndianID() {
      const This = this;
      // 获取萤石云的accessToken
      $.ajax({
        url: "https://open.ys7.com/api/lapp/token/get",
        type: "POST",
        dataType: "json",
        data: {
          appKey: "4aea64fb66cd46e8ae2ded25e6dbf5bf", //String	appKey	Y
          appSecret: "9011246f97d2d65ce33ab7c23e7a72de", //	String	appSecret	Y
        },
        cache: false,
        success: function (response) {
          This.accessToken = response.data.accessToken;
          $.ajax({
            url: "https://open.ys7.com/api/lapp/camera/list",
            header: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            type: "POST",
            dataType: "json",
            data: {
              accessToken: This.accessToken, //	String	授权过程获取的access_token	Y
              pageStart: 0,
              pageSize: 10,
            },
            cache: false,
            success: function (response) {
              var arr = [];
              response.data.forEach((item, index) => {
                if (item.channelNo == 3 || item.channelNo == 4) {
                } else {
                  arr.push(item);
                }
              });

              console.log(arr);
              arr.forEach((item, index) => {
                $.ajax({
                  url: "https://open.ys7.com/api/lapp/v2/live/address/get",
                  type: "POST",
                  dataType: "json",
                  data: {
                    accessToken: This.accessToken, //	String	授权过程获取的access_token	Y
                    deviceSerial: item.deviceSerial,
                    channelNo: item.channelNo,
                  },
                  cache: false,
                  success: (response) => {
                    let player = new EZUIKit.EZUIKitPlayer({
                      id: "video-player-" + index, // 视频容器ID
                      accessToken: This.accessToken,
                      url: response.data.url,
                      template: "voice", // simple - 极简版;standard-标准版;security - 安防版(预览回放);voice-语音版; theme-可配置主题；
                      audio: 0, // 是否默认开启声音 0 - 关闭 1 - 开启
                      autoplay: false,
                      width: 190,
                      height: 150,
                    });
                    This.liveAddress.push(player);
                    console.log(This.liveAddress);
                  },
                });
              });
            },
          });
        },
      });
    },
  },
  //销毁视频
  destroyed() {
    for (var j = 0; j < this.players.length; j++) {
      this.liveAddress[j].stop();
    }
  },
};
</script>
