<template>
  <view class="container" :style="{ backgroundImage: 'url(' + imageURL + ')' }">
    <view class="content">
      <view class="headerButton">
        <van-button size="mini" type="info" @click="settingParameters"
          >当前设置</van-button
        >
        <van-button size="mini" type="info" @click="settingMineInfo"
          >个人中心</van-button
        >
      </view>
      <!-- 人物参数 -->
      <view class="characterProperty">
        <view v-if="registerShow">
          <view>
            <view class="propItemClass">
              <view class="" hover-class="none" hover-stop-propagation="false">
                性别：
              </view>
              <image class="rowImage" src="@/static/img/face.png"></image>
              <view class="rowSlider" hover-class="none" hover-stop-propagation="false">
                  <van-slider v-model="slider" active-color="#ee0a24" bar-height="4px" :min="0" :max="50"
                      @change="onChange">
                  </van-slider>
              </view>
              <view>
                {{ slider }}
              </view>
            </view>
            <view class="propItemClass">
              <view class="" hover-class="none" hover-stop-propagation="false">
                年龄：
              </view>
              <image class="rowImage" src="@/static/img/face.png"></image>
              <view class="rowSlider" hover-class="none" hover-stop-propagation="false">
                  <van-slider v-model="slider" active-color="#ee0a24" bar-height="4px" :min="0" :max="50"
                      @change="onChange">
                  </van-slider>
              </view>
              <view>
                {{ slider }}
              </view>
            </view>
          </view>
          <view class="propItemClass">
              <view class="" hover-class="none" hover-stop-propagation="false">
                年龄：
              </view>
              <image class="rowImage" src="@/static/img/face.png"></image>
              <view class="rowSlider" hover-class="none" hover-stop-propagation="false">
                  <van-slider v-model="slider" active-color="#ee0a24" bar-height="4px" :min="0" :max="50"
                      @change="onChange">
                  </van-slider>
              </view>
              <view>
                {{ slider }}
              </view>
            </view>
            <view class="characterButton">
            <van-button size="mini" type="info">确定</van-button>
          </view>
          </view>
      </view>
    </view>
    <!-- <tabBar :active="0"></tabBar> -->
    <view class="footButton">
      <view @click="chatVoice">语音聊天</view>
      <view @click="chatFont">文字聊天</view>
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
      imageURL: '/static/imgs/lisa.png',
      // imageURL: "",
      img: "",
      registerShow: false,
      radio: "1",
			fromUserFace: uni.getStorageSync('userFace'),
      slider: 30, // 滑块
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
      console.log(this.slider, 'this.slider');
    },
    // 文字聊天
    chatFont() {
      uni.navigateTo({ url: `/pages/content/chatFont` });
    },
    // 语音聊天
    chatVoice() {
      uni.navigateTo({ url: `/pages/content/chatVoice` });
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
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-origin: content-box;
}

.content {
  box-sizing: border-box;
  flex-grow: 1;
}
// 头顶设置
.headerButton {
  height: 10rpx;
  display: flex;
  justify-content: space-around;
}

// 人物参数
.characterProperty {
	margin-top: 60vh;
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
</style>
