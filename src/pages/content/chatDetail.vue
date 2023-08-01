<template>
  <view class="content">
    <titleHeader :title="title" isBackBtnVisible="true"></titleHeader>
    <!-- 2 - 当前用户的语音  语音列表-->
    <view v-for="(item, index) in audioList" :key="index">
      <!-- <view class="chat-voice-right" :style="{width:handleVoiceWidth(item.message.length)}" v-if="item.types === '2'" @tap="handleVoicePlay(item)"> -->
      <view
        class="chat-voice-right"
        :style="{ width: handleVoiceWidth(item.message.length) }"
        @tap="handleVoicePlay(item)"
      >
        <view class="chat-voice-right-inner">
          <!-- 时长 -->
          <text decode="true" class="chat-voice-length-right">{{
            item.message.length
          }}</text>
          <!-- 语音条主体 -->
          <text class="chat-voice-second-right"></text>
          <!-- 语音图标 -->
          <image src="/static/imgs/voice-right.png" class="voice-img"></image>
        </view>
        <!-- 向右三角形 -->
        <view class="trangle trangle-right"></view>
      </view>
    </view>

    <!-- 语音遮罩层 -->
    <view class="voice-mask" v-show="mask">
      <!--语音条 -->
      <!-- <view class="voice-bar voice-del" :class="{voiceDel:needCancel}" :style={width:getVoiceBarWidth} > -->
      <view class="voice-bar voice-del" :class="{ voiceDel: needCancel }">
        <!-- <img src="../static/icon/wave.png" class="voice-volume" :class="{volumeDel:needCancel}"></img> -->
        <view class="trangle-bottom" :class="{ trangleDel: needCancel }"></view>
      </view>
      <!-- 底部区域 -->
      <view class="voice-send">
        <!-- 取消和转文字图标 -->
        <view class="voice-middle-wrapper">
          <!-- 取消 -->
          <view class="voice-left-wrapper">
            <view class="cancel-del" :class="{ delTip: needCancel }"
              >松开 取消</view
            >
            <view
              class="voice-middle-inner close"
              :class="{ bigger: needCancel }"
            >
              <!-- <img src="../static/icon/close-grey.png" class="close-icon"></img> -->
              <text class="wen">取消</text>
            </view>
          </view>
          <!-- 转文字 -->
          <view class="voice-middle-inner to-text">
            <text class="wen">文</text>
            <!-- <image src="" class="wen"></image> -->
          </view>
          <view class="send-tip" :class="{ sendTipNone: needCancel }"
            >松开 发送</view
          >
        </view>
        <!-- 底部语音按钮 -->
        <view class="mask-bottom">
          <!-- <img src="../static/icon/voice-left.png"></img> -->
          <view>我是一个语音</view>
        </view>
      </view>
    </view>

    <!-- 文字语音功能 -->
    <view class="bottomContent" v-if="activeName === 'videoChat'">
      <img
        src="/static/imgs/fontChat.png"
        class="close-icon"
        @click="toFontChat"
      />
      <button
        size="mini"
        class="f3"
        @touchend="handleTouchEnd"
        @touchmove="handleTouchMove"
        @touchstart="handleTouchStart"
      >
        按住说话
      </button>
    </view>
    <view class="bottomContent" v-if="activeName === 'fontChat'">
      <img
        src="/static/imgs/videoChat.png"
        class="close-icon"
        @click="toVideoChat"
      />
      <input
        class="uni-input f3"
        :adjust-position="false"
        :auto-height="true"
        v-model="inputValue"
        @focus="focusTextarea"
        @blur="blurTextarea"
      />
    </view>
  </view>
</template>

<script lang="ts">
import Vue from "vue";
import tabBar from "@/wxcomponents/common/tab-bar.vue";
import titleHeader from "@/wxcomponents/common/cus-header.vue";
export default Vue.extend({
  components: {
    tabBar,
    titleHeader,
  },
  data() {
    return {
      title: "我是张三",
      mask: false, // 语音弹窗
      timer: null, // 定时器
      length: 0, // 录音长度
      startX: 0, // 手指在按钮的初始位置X
      startY: 0, // 手指在按钮的初始位置Y
      needCancel: false, // 语音取消发送
      recorderManger: null, // 录音工具
      innerAudioContext: null, // 音频播放
      audioList: [], // 语音数组
      activeName: "fontChat",
      inputValue: "",
    };
  },
  onLoad(options) {
    // uni  提供的全局录音管理器
    this.recorderManger = uni.getRecorderManager();

    // 语音播放
    this.innerAudioContext = uni.createInnerAudioContext();
  },
  computed: {
    // 计算语音条宽度
    getVoiceBarWidth() {
      return 230 + this.length * 4 + "rpx";
    },
  },
  methods: {
    onChange(value) {
      this.slider = value.detail;
    },
    handleTouchStart(e) {
      this.mask = true; // 打开语音 弹窗
      this.recorderManger.start();
      this.length = 1;
      // 位置  用来判断  滑动到哪里， 取消发送语音
      this.startX = e.touches[0].pageX;
      this.startY = e.touches[0].pageY;
      // 启动一个定时器，超过一分钟， 结束录制
      this.timer = setInterval(() => {
        this.length += 1;
        if (this.length >= 60) {
          clearInterval(this.timer);
          this.handleTouchEnd();
        }
      }, 1000);
    },
    handleTouchMove(e) {
      if (
        this.startX - e.touches[0].pageX > 14 &&
        this.startY - e.touches[0].pageY > 50
      ) {
        this.needCancel = true;
      } else {
        this.needCancel = false;
      }
    },
    // 发送语音
    handleTouchEnd() {
      this.mask = false;
      clearInterval(this.tiemr);
      this.recorderManger.stop();
      this.recorderManger.onStop((res) => {
        const message = {
          voice: res.tempFilePath,
          length: this.length,
        };
        if (!this.needCancel) {
          this.inputSubmit(message, 2);
        }
        this.needCancel = false;
      });
    },
    // 语音 处理  发送接口
    inputSubmit(message, types) {
      // console.log(message);
      this.audioList.push({
        message,
        types,
      });
    },
    // 处理语音长度
    handleVoiceWidth(lenght) {
      lenght = lenght - 1;
      let Lmin = 138;
      let Lmax = 366;
      let barCanChangeLen = Lmax - Lmin;

      // 11秒以内的语音
      if (lenght < 11) {
        // VoicePlayTimes 为10秒时，正好为可变长度的一半
        let timeLength = Lmin + lenght * 0.05 * barCanChangeLen + "rpx";
        console.log(timeLength);
        return timeLength;
      } else {
        // 12-60秒的语音
        return (
          Lmin +
          0.5 * barCanChangeLen +
          (lenght - 10) * 0.01 * barCanChangeLen +
          "rpx"
        );
      }
    },
    // 播放语音
    handleVoicePlay(item) {
      item.isFirstPlay = false;
      this.innerAudioContext.src = item.message.voice;
      this.isPlay = !this.isPlay;
      this.isPlay
        ? this.innerAudioContext.play()
        : this.innerAudioContext.stop();
      this.innerAudioContext.onEnded(() => {
        this.isPlay = false;
      });
      this.innerAudioContext.onStop(() => {
        this.isPlay = false;
      });
    },
    toFontChat() {
      this.activeName = "fontChat";
    },
    toVideoChat() {
      this.activeName = "videoChat";
    },
    focusTextarea(e) {
      this.inputBottom = e.detail.height;
    },
    blurTextarea(e) {
      this.inputBottom = 0;
    },
  },
});
</script>

<style lang="scss" scoped>
/* 通用样式 */
.content {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background: #f0f5f9;
  height: 100vh;
  color: #071a3a;
}

.bottomContent {
  // text-align: center;
  border-radius: 20rpx;
  margin-top: auto;
  margin-left: 40rpx;
  margin-right: 40rpx;
  // margin: auto 40rpx 0;
  display: flex;
  justify-content: center;

  img {
    width: 60rpx;
    height: 60rpx;
  }
}

.f3 {
  flex: 3;
  display: flex;
  justify-content: center;
  align-items: center;
}

.header-button {
  display: flex;
  justify-content: space-around;
}

/* .image-img {
	  width: 100%;
	  height: 100%;
	} */
.custom-button {
  width: 26px;
  color: #fff;
  font-size: 10px;
  line-height: 18px;
  text-align: center;
  background-color: #ee0a24;
  border-radius: 100px;
}

.button {
  display: flex;
  justify-content: center;
  border-radius: 10px;
}

.input {
  display: flex;
  justify-content: center;
  border: 1px solid radio;
}

.videoInput {
  display: flex;
  justify-content: center;
  border: 1px solid radio;
}

.voice-mask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  /* display: flex;
			flex-direction: column;
			justify-content: flex-end;
			align-items: center; */
  background-color: rgba(0, 0, 0, 0.8);
}

.voice-bar {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -30%);
  /* width: 230rpx; */
  height: 150rpx;
  background-color: #51ff50;
  border-radius: 26rpx;
  margin-bottom: 220rpx;
}

.voiceDel {
  left: 80rpx;
  top: 50%;
  width: 170rpx !important;
  transform: translateX(0%);
  transform: translateY(-30%);
  background-color: red;
}

.voice-volume {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 160rpx;
  height: 36rpx;
}

.volumeDel {
  width: 80rpx;
}

.trangle-bottom {
  position: absolute;
  bottom: -38rpx;
  left: 50%;
  transform: translateX(-50%);
  border-width: 20rpx;
  border-style: solid;
  border-color: #51ff50 transparent transparent transparent;
}

.trangleDel {
  border-color: red transparent transparent transparent;
}

.voice-send {
  position: absolute;
  bottom: 0;
  width: 100%;
}

.voice-middle-wrapper {
  width: 100%;
  display: flex;
  position: relative;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 40rpx;
}

.voice-left-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
}

.cancel-del {
  display: none;
}

.delTip {
  display: block;
  color: #bfbfbf;
  margin: 0 22rpx 18rpx 0;
}

.voice-middle-inner {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.2);
  width: 140rpx;
  height: 140rpx;
  border-radius: 50%;
}

.close {
  transform: rotate(350deg);
  margin-left: 80rpx;
}

.bigger {
  width: 170rpx;
  height: 170rpx;
}

.to-text {
  transform: rotate(10deg);
  margin-right: 80rpx;
}

.close-icon {
  width: 80rpx;
  height: 80rpx;
}

.wen {
  font-size: 40rpx;
  color: #bfbfbf;
}

.send-tip {
  position: absolute;
  left: 50%;
  bottom: 0rpx;
  transform: translate(-50%, 36%);
  color: #bfbfbf;
}

.sendTipNone {
  display: none;
}

.mask-bottom {
  position: relative;
  width: 100%;
  height: 190rpx;
  border-top: #bababb 8rpx solid;
  border-radius: 300rpx 300rpx 0 0;
  background-image: linear-gradient(#949794, #e1e3e1);
}

.mask-bottom image {
  position: absolute;
  width: 60rpx;
  height: 60rpx;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
}

.chat-voice-right {
  text-align: right;
  float: right;
  display: flex;
  align-items: center;
}

.chat-voice-right-inner {
  background-color: #51ff50;
}
.voice-img {
  width: 60rpx;
  height: 40rpx;
}

.trangle-right {
  width: 0;
  height: 0;
  border-top: 15rpx solid transparent;
  border-bottom: 15rpx solid transparent;
  border-left: 15rpx solid #000000;
}
</style>
