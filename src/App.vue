<script>
import Vue from "vue";
import { mapMutations } from "vuex";
import { login } from "@/network/common";
import { ResponseData } from "./type";


export default Vue.extend({
  onLaunch: function () {
    console.warn(
      "当前组件仅支持 uni_modules 目录结构 ，请升级 HBuilderX 到 3.1.0 版本以上！"
    );
    console.log("App Launch");
    // 登录
    this.login();
  },
  onShow: function () {
    console.log("App Show");
  },
  onHide: function () {
    console.log("App Hide");
  },
  methods: {
    ...mapMutations(["setUserBasicInfo"]),
    login() {
      uni.login({
        success: (res) => {
          if (res.code) {
            login({ code: res.code }).then((res: ResponseData) => {
              uni.setStorageSync("token", res.token);
              uni.setStorageSync("openid", res.openId);
              // 当前人物基本设置信息
              this.setUserBasicInfo(res);
            });
          } else {
            console.log(`登录失败！${res.errMsg}`);
          }
        },
      });
    },
  },
});
</script>

<style lang="scss">
// 引入公共样式  TODO  配置 webpack  loader.js
// @import '../wxcomponents/common/styles/common.scss';
</style>
