<template>
  <view class="container">
    <titleHeader :title="title" isBackBtnVisible="true"></titleHeader>
    <!--内容-->
    <view class="scrollContent">
      <scroll-view
        :scroll-into-view="scrollViewId"
        scroll-y
        style="height: 100%"
      >
        <view class="item-space"></view>
        <!-- <view class="time">晚上 10:04</view> -->
        <view v-for="(item, index) in audioList" :key="index">
          {{ item }}
          <!--撤销-->
          <view v-if="item.msgType === 3" class="cancel">
            <!-- <text v-if="item.source == fromUserId" class="text"
              >你撤回了一条消息</text>
            <text v-else class="text"
              >成员 {{ item.source }} 撤回了一条消息</text
            > -->
          </view>
          <view
            v-else
            class="item flex-row"
            :class="[item.chatType == 0 ? 'right' : 'left']"
          >
            <!--处理头像-->
            <view v-if="item.chatType == 0">
              <image
                v-if="fromUserFace"
                :src="fromUserFace"
                class="face"
              ></image>
              <image v-else src="@/static/img/face.png" class="face"></image>
            </view>
            <view v-else>
              <image
                v-if="item.toUserFace || item.userFace"
                :src="item.toUserFace || item.userFace"
                class="face"
              ></image>
              <image v-else src="@/static/img/face.png" class="face"></image>
            </view>
            <!--语音-->
            <view
              v-if="item.msgType === 1"
              @tap="playVoice(item, index)"
              class="content"
            >
              <image
                v-show="voicePlayingId !== index"
                src="@/static/img/audio.png"
                class="voice-icon"
              ></image>
              <image
                v-show="voicePlayingId === index"
                src="@/static/img/audio-play.gif"
                class="voice-icon"
              ></image>
            </view>
          </view>
        </view>
        <view id="bottom"></view>
      </scroll-view>
    </view>
    <!--输入-->
    <view class="oper flex-row">
      <view
        class="videoChatButton"
        @touchend="handleTouchEnd"
        @touchmove="handleTouchMove"
        @touchstart="handleTouchStart"
        >按住 说话</view
      >
      <!-- <view  @touchstart="startVoice" @touchend="endVoice" class="input" style="text-align: center;">按住 说话</view> -->
    </view>
    <!--语音-->
    <!-- <my-voice v-show="showVoice"></my-voice> -->
    <!-- 语音遮罩层 -->
    <view class="voice-mask" v-show="showVoice">
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
  </view>
</template>

<script lang="ts">
import Vue from "vue";
// import myVoice from "./self-voice.vue";
// import util from "@/static/js/util";
import titleHeader from "@/wxcomponents/common/cus-header.vue";
import upload from "@/common/upload";
import { getChatHistory, postVoice } from "@/network/chat";

const innerAudioContext = uni.createInnerAudioContext();
// uni  提供的全局录音管理器
// const recorderManger = uni.getrecorderManger()
const recorderManger = uni.getRecorderManager();

// interface optionType {
//   toUserName: string;
//   toUserId: string;
// }
interface audioListItem {
  msgType?: number;
  userId?: string;
  modelId?: string;
  sessionId?: string;
  sessionChatId?: string;
  toUserFace?: string;
  userFace?: string;
  voiceUrl: string;
  message?: string;
  chatType?: number; // 0: 我发送  1： 接收
}

export default Vue.extend({
  // components: { myVoice, titleHeader },
  components: { titleHeader },
  data() {
    return {
      title: "语音记录",
      isEdit: true,
      isFocus: false,
      showFile: false,
      showVoice: false,
      needCancel: false,
      scrollHeight: "auto", // 内容区域高度
      statusBarHeight: 0, // 状态栏高度
      scrollViewId: "", // 滚动到最底部
      voicePlayingId: 0, // 正在播放的消息ID
      audioList: [] as Array<audioListItem>,
      socketMsgQueue: [], // 消息队列
      fromUserId: uni.getStorageSync("userId"),
      fromUserFace: uni.getStorageSync("userFace"),
      toUserId: "",
      toUserName: "",
      length: 0, // 语音条长度
      startX: 0,
      startY: 0,
      timer: {}, // 定时器
      // TODO  临时数据
      userId: "135b4947f1644b76b9d5c614782fc84a",
      modelId: "64a561d1f51062cd3d0fb178",
    };
  },
  mounted() {
    // 初始化内容高度
    this.setScrollHeight();
    // 初始化状态栏高度
    uni.getSystemInfo({
      success: (res) => {
        this.statusBarHeight = res.statusBarHeight || 0;
      },
    });
    // 获取消息记录
    this.getChatHistorys();
  },
  methods: {
    // 初始化滚动
    initScrollBar() {
      setTimeout(() => {
        this.scrollViewId = "";
        setTimeout(() => {
          this.scrollViewId = "bottom";
          setTimeout(() => {
            this.scrollViewId = "";
          }, 100);
        }, 100);
      }, 100);
    },
    // 设置scroll的高度
    setScrollHeight(descHeight = 0) {
      // #ifdef MP-WEIXIN
      this.scrollHeight = `calc(100vh - 110rpx - ${descHeight}px)`;
      // #endif
      // #ifdef APP-PLUS
      this.scrollHeight = `calc(100vh - 110rpx - ${descHeight}px)`;
      // #endif
      // #ifdef H5
      this.scrollHeight = `calc(100vh - 110rpx - 88rpx - ${descHeight}px)`;
      // #endif
    },
    handleTouchStart(e: any) {
      this.showVoice = true; // 打开语音 弹窗
      recorderManger.start({ format: "mp3" });
      this.length = 1;
      // 位置  用来判断  滑动到哪里， 取消发送语音
      this.startX = e.touches[0].pageX;
      this.startY = e.touches[0].pageY;
      // 启动一个定时器，超过一分钟， 结束录制
      this.timer = setInterval(() => {
        this.length += 1;
        if (this.length >= 60) {
          // clearInterval(this.timer);
          this.handleTouchEnd();
        }
      }, 1000);
    },
    handleTouchMove(e: any) {
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
      this.showVoice = false;
      // clearInterval(this.timer);
      recorderManger.stop();
      recorderManger.onStop((res) => {
        const message = {
          // id: String(new Date().getTime()),
          content: res.tempFilePath,
        };
        if (!this.needCancel) {
          this.pushMessage(message, 1);
        }
        this.needCancel = false;
      });
    },
    // 语音 处理  发送接口
    async pushMessage(message: any, msgType: any) {
      // 上传文件  得到上传的地址
      const voiceUrl: any = await upload(message.content);

      let param = {
        msgType,
        chatType: 0,
        // userId: uni.getStorageSync("userId"),
        useId: this.userId,
        modelId: this.modelId,
        sessionId: "",
        sessionChatId: "",
        length: this.length,
        voiceUrl,
      };

      console.log(param, "param");

      // 初始化滚动条
      // this.initScrollBar();
      // 接口
      try {
        postVoice(param)
          .then((data: any) => {
            if (data.success) {
              // 前端数组 暂存
              this.audioList.push(param);
            }
          })
          .catch((fail) => {
            console.log(fail, "没有发送成功");
          });
      } catch (e) {
        console.log(e, "没有发送成功");
      }
    },
    // 开始录音
    startVoice() {
      this.showVoice = true;
      recorderManger.start({ format: "mp3" });
    },
    // 结束录音
    endVoice() {
      this.showVoice = false;
      recorderManger.stop();
    },
    // 播放录音
    playVoice(item: audioListItem, index: number) {
      if (this.voicePlayingId) {
        this.voicePlayingId = 0;
      } else {
        this.voicePlayingId = index;
        innerAudioContext.src = item.voiceUrl;
        innerAudioContext.play();
      }
    },
    // 长按消息 撤回消息
    longPress(msg: any) {
      let data = {
        type: "single",
        source: this.fromUserId,
        dest: this.toUserId,
        timestamp: new Date().getTime(),
        msg: {
          id: msg.id,
          fromUserId: msg.fromUserId,
          toUserId: msg.toUserId,
          type: "cancel",
          content: msg.content,
        },
      };

      // 撤销发送消息
      uni.sendSocketMessage({
        data: JSON.stringify(data),
        success: () => {
          // 撤销本地消息
          this.audioList = this.audioList.map((item: any) => {
            item.type = item.id == msg.id ? "cancel" : item.type;
            return item;
          });
        },
      });
    },
    // 获取记录
    async getChatHistorys() {
      let params = {
        pageNo: 1,
        pageSize: 10,
        param: {
          userId: this.userId,
          modelId: this.modelId,
          chatMethod: 1, // 0文字 1语音
        },
      };
      console.log('ccccccccccccccc');
      
      try {
        getChatHistory(params)
          .then((data: any) => {
            console.log(data, 'dataccccccccc');
            
            this.audioList = data;
          })
          .catch((fail) => {
            console.log(fail, '...............');
          });
      } catch (e) {
        console.log(e, "获取记录失败");
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.flex-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.container {
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* #ifdef H5 */
.container {
  height: calc(100vh - 88rpx);
}
/* #endif */

.status_bar,
.container,
.header,
.emoji,
.file {
  background-color: #f3f3f3;
}
.header {
  border-bottom: 2rpx solid #eee;

  .center {
    font-weight: bold;
  }
}
.map {
  width: 60%;
  height: 300rpx;
  background-color: #fff !important;

  &::before {
    border-right: 30rpx solid #fff !important;
  }

  .title {
    height: 80rpx;
    font-size: 28rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .box {
    width: 100%;
    height: 170rpx;
    margin-top: 10rpx;
  }
}
.emoji {
  height: 400rpx;
  padding: 0 0 20rpx 20rpx;
  position: relative;

  .list {
    width: 100%;
    height: 400rpx;
    padding: 20rpx 0;
    overflow-y: auto;

    .item {
      float: left;
      display: block;
      height: 60rpx;
      line-height: 60rpx;
      width: calc(100% / 12);
      margin-right: 20rpx;
    }
  }
}
.file {
  padding: 30rpx 20rpx;

  .list {
    overflow: hidden;
    padding-left: 10rpx;
    justify-content: flex-start;
  }

  .item {
    float: left;
    width: 110rpx;
    height: 110rpx;
    border-radius: 10rpx;
    margin-right: 40rpx;
    background-color: #fff;

    .icon {
      width: 50rpx;
    }

    .text {
      font-size: 24rpx;
      margin-top: 4rpx;
    }
  }
}
.oper {
  height: 110rpx;
  padding: 0 20rpx;
  box-sizing: border-box;
  border-top: 2rpx solid #eee;
  border-bottom: 2rpx solid #eee;

  .input {
    height: 68rpx;
    line-height: 68rpx;
    padding: 0 20rpx;
    font-size: 28rpx;
    border-radius: 10rpx;
    background-color: #fff;
    width: calc(100% - 120rpx - 20rpx);
  }

  .videoChatButton {
    height: 68rpx;
    line-height: 68rpx;
    padding: 0 20rpx;
    font-size: 28rpx;
    border-radius: 10rpx;
    background-color: #fff;
    width: calc(100% - 120rpx - 20rpx);
    text-align: center;
  }
  .icon {
    width: 60rpx;
    height: 60rpx;
  }
  .btn {
    color: #fff;
    width: 90rpx;
    height: 52rpx;
    font-size: 24rpx;
    line-height: 52rpx;
    text-align: center;
    border-radius: 10rpx;
    background-color: #2ba245;
  }
}
.scrollContent {
  overflow-y: auto;
  transition: all 0.1s ease;
  flex: 1;

  .item-space {
    height: 30rpx;
  }

  .time {
    color: #666;
    font-size: 24rpx;
    text-align: center;
    margin-bottom: 20rpx;
  }

  .cancel {
    width: 100%;
    height: 40rpx;
    text-align: center;
    margin-bottom: 30rpx;

    .text {
      color: #999;
      font-size: 24rpx;
    }
  }

  .item {
    margin: 0 30rpx 30rpx;
    align-items: flex-start;
    justify-content: flex-start;

    .face {
      width: 80rpx;
      height: 80rpx;
      border-radius: 10rpx;
    }

    .content {
      color: #000;
      font-size: 32rpx;
      // min-height: 80rpx;
      border-radius: 10rpx;
      padding: 20rpx 24rpx;
      background-color: #fff;
      word-break: break-all;
      word-wrap: break-word;
      max-width: calc(100% - 100rpx - 120rpx);
      position: relative;

      &::before {
        content: "";
        width: 0;
        height: 0;
        border-right: 30rpx solid #fff;
        border-top: 20rpx solid transparent;
        border-bottom: 20rpx solid transparent;
        position: absolute;
        top: 24rpx;
      }

      .voice-icon {
        width: 32rpx;
        height: 40rpx;
        margin-right: 180rpx;
        margin-bottom: -8rpx;
      }
    }

    &.left {
      .face {
        margin-right: 30rpx;
      }
      .content::before {
        left: -20rpx;
      }
    }

    &.right {
      flex-direction: row-reverse;
      .face {
        margin-left: 30rpx;
      }
      .content {
        background-color: #a0ea6f;

        &::before {
          right: -20rpx;
          transform: rotate(180deg);
          border-right: 30rpx solid #a0ea6f;
        }

        .voice-icon {
          margin-right: 0;
          margin-left: 180rpx;
          transform: rotate(180deg);
        }
      }
    }
  }

  #bottom {
    height: 0;
  }
}

// 语音
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
