<template>
  <!-- <view class="container" :style="{ backgroundImage: 'url(' + imageURL + ')' }"> -->
  <view class="container">
    <view class="content">
      <view class="headerButton">
        <van-button size="mini" type="info" @click="settingParameters"
          >当前设置</van-button
        >
        <!-- <van-button size="mini" type="info" @click="settingMineInfo"
          >个人中心</van-button
        > -->
      </view>
      <!-- 人物模型 -->
      <view class="model" hover-class="none" hover-stop-propagation="false">
        <image class="modelImage" :src="modelUrl"></image>
        <!-- <van-image
          fit="cover"
          class="modelImage"
          :src="modelUrl"
        /> -->
      </view>

      <!-- 人物参数 -->
      <view class="characterProperty">
        <view v-if="registerShow" class="registerMenu">
          <!-- 人物属性 -->
          <view class="" @click="characterAttributes">
            <image
              class="rowImage"
              src="@/static/imgs/character/characterMan1.png"
            ></image>
          </view>
          <!-- 声音 -->
          <view class="" @click="characterSound">
            <image
              class="rowImage"
              src="@/static/imgs/character/characterMan1.png"
            ></image>
          </view>
          <!-- 性格 -->
          <view class="" @click="characterCharacter">
             <image
              class="rowImage"
              src="@/static/imgs/character/characterMan1.png"
            ></image>
          </view>
          <!-- AI的经历描述 -->
          <view class="" @click="characterExperience">
             <image
              class="rowImage"
              src="@/static/imgs/character/characterMan1.png"
            ></image>
          </view>
        </view>

        <!-- 人物 (男、女 )  、
      声音（方言、普通话， 声音类型（例如: 御女、萝莉）可以试听 ）
      性格 （性格描述）、
      AI的经历描述（   AI个人背景信息  ） -->
        <!-- 人物属性 -->
        <view
          class=""
          hover-class="none"
          hover-stop-propagation="false"
          v-if="characterAttributesShow"
        >
          <view> 男 女 </view>
        </view>
        <!-- 声音模块 -->
        <view
          class=""
          hover-class="none"
          hover-stop-propagation="false"
          v-if="soundShow"
        >
          <!-- 这里放一个声音列表 -->
          <view></view>
        </view>
        <!-- 性格模块 -->
        <view
          class=""
          hover-class="none"
          hover-stop-propagation="false"
          v-if="characterShow"
        >
          <!--  -->
          <view>你暴躁么</view>
        </view>
        <!-- 经历描述模块 -->
        <view
          class=""
          hover-class="none"
          hover-stop-propagation="false"
          v-if="experienceShow"
        >
          你希望他有什么经历:<input type="text" />
        </view>
      </view>
      <!-- <tabBar :active="0"></tabBar> -->
      <view class="footButton">
        <view @click="chatVoice">语音聊天</view>
        <view @click="chatFont">文字聊天</view>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import Vue from "vue";
// import tabBar from "@/wxcomponents/common/tab-bar.vue";
export default Vue.extend({
  components: {
    // tabBar,
  },
  data() {
    return {
      href: "https://uniapp.dcloud.io/component/README?id=uniui",
      imageURL: "/static/imgs/lisa.png",
      // src="https://img.yzcdn.cn/vant/cat.jpeg"
      // imageURL: "",
      img: "",
      registerShow: true,
      radio: "1",
      fromUserFace: uni.getStorageSync("userFace"),
      slider: 30, // 滑块

      characterAttributesShow: false, // 人物属性模块
      soundShow: false, // 声音模块
      characterShow: false, // 性格模块
      experienceShow: false, // 经历描述模块


      modelUrl: "/static/imgs/lisa2.png",
    };
  },
  computed: {
    // 动态图时，需要用 computed 加载
    // bgImage() {
    // 	return {
    // 		'background-image': `url()`
    // 	}
    // }
  },
  methods: {
    settingParameters() {
      this.registerShow = !this.registerShow;
    },
    settingMineInfo() {
      uni.navigateTo({ url: `/pages/mine/index` });
    },
    onChange(value: any) {
      this.slider = value.detail;
      console.log(this.slider, "this.slider");
    },
    // 文字聊天
    chatFont() {
      uni.navigateTo({ url: `/pages/content/chatFont` });
    },
    // 语音聊天
    chatVoice() {
      uni.navigateTo({ url: `/pages/content/chatVoice` });
    },

    // 人物属性模块
    characterAttributes() {
      this.resetShow();
      this.characterAttributesShow = true;
    },
    characterSound() {
      this.resetShow();
      this.soundShow = true;
    },
    characterCharacter() {
      this.resetShow();
      this.characterShow = true;
    },
    characterExperience() {
      this.resetShow();
      this.experienceShow = true;
    },
    resetShow() {
      this.soundShow = false;
      this.characterShow = false;
      this.experienceShow = false;
      this.characterAttributesShow = false;
    },
  },
});
</script>

<style lang="scss" scoped>
.container {
  margin-top: 5vh;
  display: flex;
  flex-direction: column;
  height: 95vh;
  // background-size: 100% 100%;
  // background-repeat: no-repeat;
  // background-origin: content-box;
}

.content {
  box-sizing: border-box;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

// 头顶设置
.headerButton {
  height: 10rpx;
  display: flex;
  justify-content: space-around;
}

// 人物参数
.characterProperty {
  flex: 1;
  // margin-top: 60vh;
  // background-color: red;
}

// 人物参数 确认
.characterButton {
  display: flex;
  justify-content: flex-end;
  border-radius: 10px;
}

.custom-button {
  width: 26px;
  color: #fff;
  font-size: 10px;
  line-height: 18px;
  text-align: center;
  border-radius: 100px;
  background-color: green;
}

.footButton {
  display: flex;
  justify-content: space-between;
}

.propItemClass {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 30rpx;
}

.rowImage {
  width: 80rpx;
  height: 80rpx;
  border-radius: 10rpx;
}

.rowSlider {
  flex: 1;
  margin: 0rpx 40rpx;
}

// 人物模型
.model {
  // border: 1px solid darkmagenta;
  width: 100%;
  // height: 100%;
  // padding: 10px;
  // margin: 10px;
}

.modelImage {
  // height: 60%;
  width: 100%;
}

.registerMenu {
  display: flex;
  justify-content: space-around;
}
</style>
