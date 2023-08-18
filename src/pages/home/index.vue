<template>
  <!-- <view class="container" :style="{ backgroundImage: 'url(' + modelUrl + ')' }"> -->
  <view class="container">
    <view class="content">
      <view class="headerButton">
        <!-- <van-button size="mini" type="info" @click="settingParameters"
          > -->
          <!-- 当前设置 -->
          <image class="settingImg" src="@/static/imgs/setting.png" @click="settingParameters"></image>
          <!-- </van-button
        > -->
        <van-button size="mini" type="info" @click="settingMineInfo"
          >个人中心</van-button
        >
      </view>
      <!-- 人物模型 -->
      <view class="model" :style="{ backgroundImage: 'url(' + modelUrl + ')' }">
        <!-- <image class="modelImage" :src="modelUrl"></image> -->
        <!-- <van-image
          fit="cover"
          class="modelImage"
          :src="modelUrl"
        /> -->
      </view>

      <!-- 人物参数 -->
      <view class="characterProperty">
       

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
          <van-radio-group v-model="sexRadio" class="sexStyle">
            <van-radio name="1"><view class="colorWhite">女</view></van-radio>
            <van-radio name="2"><view class="colorWhite">男</view></van-radio>
          </van-radio-group>
        </view>
        <!-- 声音模块 -->
        <view
          class=""
          hover-class="none"
          hover-stop-propagation="false"
          v-if="soundShow"
        >
          <!-- 这里放一个声音列表 -->
          <view>
            <!-- 方言 -->
            <!-- 方言还是普通话 -->
            <view class="soundRadio">
              <van-radio-group v-model="radio" @click="soundRadioClick">
                <van-radio name="1"><view class="colorWhite">方言</view></van-radio>
                <van-radio name="2"><view class="colorWhite">普通话</view></van-radio>
              </van-radio-group>
            </view>

            <!-- 声音类型   御女、萝莉 -->
            <!-- 御女 -->
            <view class="soundType">
              <view
                :class="[sexualWomanShow ? 'sexualBorder' : '']"
                @click="sexualClick"
              >
                <image class="rowImage" src="@/static/imgs/sound/type1.webp">
                </image>
                <view
                  class=""
                  hover-class="none"
                  hover-stop-propagation="false"
                >
                  御女
                </view>
              </view>
              <!-- 萝莉 -->
              <view :class="loriShow ? 'sexualBorder' : ''" @click="loriClick">
                <image
                  class="rowImage"
                  src="@/static/imgs/sound/type2.jpeg"
                ></image>
                <view
                  class=""
                  hover-class="none"
                  hover-stop-propagation="false"
                >
                  萝莉
                </view>
              </view>
              <!-- 大妈 -->
              <view :class="auntShow ? 'sexualBorder' : ''" @click="auntClick">
                <image class="rowImage" src="@/static/imgs/sound/type3.webp">
                </image>
                <view
                  class=""
                  hover-class="none"
                  hover-stop-propagation="false"
                >
                  大妈
                </view>
              </view>
            </view>
          </view>
        </view>
        <!-- 性格模块 -->
        <view
          class=""
          hover-class="none"
          hover-stop-propagation="false"
          v-if="characterShow"
        >
          <!--  -->
          <view>例如：暴躁人</view>
          你希望他是什么样的性格:<input type="text" />
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



        <view v-if="registerShow" class="registerMenu">
          <!-- 人物属性 -->
          <view  :class="['rowImageBox', characterAttributesShow ? 'selectedStyle' : '']" @click="characterAttributes">
            <image
              :class="['rowImage']"
              src="@/static/imgs/character/characterMan1.png"
            ></image>
          </view>
          <!-- 声音 -->
          <view  :class="['rowImageBox', soundShow ? 'selectedStyle' : '']" @click="characterSound">
            <image class="rowImage" src="@/static/imgs/sound/sound3.png"></image>
          </view>
          <!-- 性格 -->
          <view  :class="['rowImageBox', characterShow ? 'selectedStyle' : '']" @click="characterCharacter">
            <image
              class="rowImage"
              src="@/static/imgs/makeUp/makeUp4.png"
            ></image>
          </view>
          <!-- AI的经历描述 -->
          <view  :class="['rowImageBox', experienceShow ? 'selectedStyle' : '']" @click="characterExperience">
            <image
              class="rowImage"
              src="@/static/imgs/experience/experience2.png"
            ></image>
          </view>
        </view>
        <view v-if="!registerShow" class="registerMenu">
        <view @click="chatVoice">语音聊天</view>
        <view @click="chatFont">文字聊天</view>
      </view>
      </view>
     
      
       <tabBar :active="0"></tabBar>
    </view>
  </view>
</template>

<script lang="ts">
import Vue from "vue";
import tabBar from "@/wxcomponents/common/tab-bar.vue";
export default Vue.extend({
  components: {
    tabBar,
  },
  data() {
    return {
      href: "https://uniapp.dcloud.io/component/README?id=uniui",
      imageURL: "/static/imgs/lisa2.png",
      // src="https://img.yzcdn.cn/vant/cat.jpeg"
      // imageURL: "",
      img: "",
      registerShow: true,
      radio: "1", // 是否方言
      sexRadio: '2', // 性别男女
      fromUserFace: uni.getStorageSync("userFace"),
      slider: 30, // 滑块

      characterAttributesShow: false, // 人物属性模块
      soundShow: false, // 声音模块
      characterShow: false, // 性格模块
      experienceShow: false, // 经历描述模块

      modelUrl: "/static/imgs/lisa2.png",

      sexualWomanShow: false,
      loriShow: false,
      auntShow: false,
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
      this.resetShow();
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
      let temp = this.characterAttributesShow;
      this.resetShow();
      this.characterAttributesShow = temp;
      this.characterAttributesShow = !this.characterAttributesShow;
    },
    // 声音模块点击
    characterSound() {
      let temp = this.soundShow;
      this.resetShow();
      this.soundShow = temp;
      this.soundShow = !this.soundShow;
    },
    // 性格模块点击
    characterCharacter() {
      let temp = this.characterShow;
      this.resetShow();
      this.characterShow = temp;
      this.characterShow = !this.characterShow;
    },
    // AI的经历描述
    characterExperience() {
      let temp = this.experienceShow;
      this.resetShow();
      this.experienceShow = temp;
      this.experienceShow = !this.experienceShow;
    },
    resetShow() {
      this.soundShow = false;
      this.characterShow = false;
      this.experienceShow = false;
      this.characterAttributesShow = false;
    },
    soundRadioClick(val: any) {
      console.log(val, "val");
    },
    // 御女类型点击
    sexualClick() {
      let temp = this.sexualWomanShow;
      this.resetSound();
      this.sexualWomanShow = temp;
      this.sexualWomanShow = !this.sexualWomanShow;
    },
    // 萝莉类型点击
    loriClick() {
      let temp = this.loriShow;
      this.resetSound();
      this.loriShow = temp;
      this.loriShow = !this.loriShow;
    },
    // 大妈类型点击
    auntClick() {
      let temp = this.auntShow;
      this.resetSound();
      this.auntShow = temp;
      this.auntShow = !this.auntShow;
    },
    resetSound() {
      this.loriShow = false;
      this.auntShow = false;
      this.sexualWomanShow = false;
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
  position: absolute;
  bottom: 40px;
  // left: 100px;
  width: 100%;
  background-color: rgb(85 0 0 / 40%);
  color: white;
  // border-radius: 30px 30px 0px 0px;
  // flex: 1;
  // margin-top: 60vh;
  // background: opacity;
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
  margin-bottom: 20px;
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
}

.rowSlider {
  flex: 1;
  margin: 0rpx 40rpx;
}

// 人物模型
.model {
  // TODO  渐变色
  background-color: rgb(176, 160, 198);
  width: 100%;
  height: 100%;
  background-position: center;
  background-origin: content-box;
}
.modelImage {
  width: 100%;
  height: 380px;
}

.registerMenu {
  display: flex;
  justify-content: space-around;
  margin: 10px 0px;
}

.soundRadio {
  display: flex;
}
.soundType {
  display: flex;
  justify-content: space-around;
}

.sexualBorder {
  border: 10px solid gray;
  border-radius: 10px;
}

.sexStyle {
  display: flex;
}


.rowImageBox {
  // box-sizing: border-box;
  border: 2px solid rgba(85, 0, 0, 0);
  padding: 2px;
}

.selectedStyle {
  // border: 10px solid rgb(176, 160, 198);
  // border: 10px solid rgb(176, 160, 198);
  border-color: rgb(176, 160, 198);
  border-radius: 30px;
  background-color: rgb(176, 160, 198);
}



.settingImg {
  width: 50rpx;
  height: 50rpx;
  z-index: 999;
}


.colorWhite {
  color: white;
}
</style>
