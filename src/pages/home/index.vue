<template>
  <view class="container" :style="{ backgroundImage: 'url(' + imageURL + ')' }">
    <view class="content">
      <view class="headerButton">
        <van-button size="mini" type="info" @click="settingParameters"
          >设置</van-button
        >
      </view>
      <!-- 人物参数 -->
      <view class="characterProperty">
        <view v-if="registerShow">
          <van-field name="radio" label="性别">
            <template #input>
              <van-radio-group v-model="radio" direction="horizontal">
                <van-radio name="1">男</van-radio>
                <van-radio name="2">女</van-radio>
              </van-radio-group>
            </template>
          </van-field>
          <van-field name="radio" label="性别">
            <template #input>
              <van-radio-group v-model="radio" direction="horizontal">
                <van-radio name="1">男</van-radio>
                <van-radio name="2">女</van-radio>
              </van-radio-group>
            </template>
          </van-field>
          <van-field name="radio" label="性别">
            <template #input>
              <van-radio-group v-model="radio" direction="horizontal">
                <van-radio name="1">男</van-radio>
                <van-radio name="2">女</van-radio>
              </van-radio-group>
            </template>
          </van-field>
          <!-- 				<view>
					<span>年龄:</span>
					{{slider}}
				</view>
				<van-slider v-model="slider" active-color="#ee0a24" bar-height="4px" :min="0" :max="50"
					@change="onChange">
					<template #button>
						<view class="custom-button">{{ slider }}</view>
					</template>
				</van-slider> -->
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

<script>
import Vue from "vue";
import tabBar from "@/wxcomponents/common/tab-bar.vue";
export default Vue.extend({
  components: {
    tabBar,
  },
  data() {
    return {
      href: "https://uniapp.dcloud.io/component/README?id=uniui",
      imageURL: '/static/imgs/lisa.png',
      // imageURL: "",
      img: "",
      registerShow: false,
      radio: "1",
      slider: 30, // 滑块
    };
  },
  onLoad(options) {},
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
    onChange(value) {
      this.slider = value.detail;
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
	margin-top: 5vh;
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
}



.footButton {
  display: flex;
  justify-content: space-between;
}
</style>
