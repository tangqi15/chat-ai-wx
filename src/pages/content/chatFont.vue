<template>
  <view class="container">
    <titleHeader :title="title" isBackBtnVisible="true"></titleHeader>
    <!--内容-->
    <view class="scrollContent">
      <scroll-view
        :style="{ height: `${windowHeight}rpx` }"
        id="scrollview"
        scroll-y="true"
        :scroll-top="scrollTop"
        :scroll-with-animation="true"
        class="scroll-view"
      >
        <!-- 聊天主体 -->
        <view id="msglistview" class="chat-body">
          <!-- 聊天记录 -->
          <view v-for="(item, index) in msgList" :key="index">
            <!-- 自己发的消息 -->
            <view class="item self" v-if="item.chatType == 0">
              <!-- 文字内容 -->
              <view class="content right">
                {{ item.content }}
              </view>
              <!-- 头像 -->
              <view class="avatar"> </view>
            </view>
            <!-- 机器人发的消息 -->
            <view class="item Ai" v-if="item.chatType == 1">
              <!-- 头像 -->
              <view class="avatar"> </view>
              <!-- 文字内容 -->
              <view class="content left">
                {{ item.content }}
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
    <!-- 底部消息发送栏 -->
    <!-- 用来占位，防止聊天消息被发送框遮挡 -->
    <view class="chat-bottom">
      <view class="send-msg">
        <view class="uni-textarea">
          <textarea
            v-model="chatMsg"
            maxlength="300"
            :show-confirm-bar="false"
            auto-height
          ></textarea>
        </view>
        <button @click="handleSend" class="send-btn" :disabled="isCanSend">
          发送
        </button>
      </view>
    </view>
  </view>
</template>
<script lang="ts">
import Vue from "vue";
import titleHeader from "@/wxcomponents/common/cus-header.vue";
import { getChatHistory, postMessage } from "@/network/chat";

interface msgListInter {
  chatType: number, // 0: 我发送  1： 接收
  content: string, // 聊天内容
}

// 装饰器方式
export default Vue.extend({
  components: { titleHeader },
  data() {
    return {
      title: "文字记录",
      //滚动距离
      scrollTop: 0,
      //发送的消息
      chatMsg: "",
      // 接口拉取的消息队列
      msgList: [] as Array<msgListInter>,
      isCanSend: false, // 是否可以继续发送
      userId: "135b4947f1644b76b9d5c614782fc84a",
      modelId: "64a561d1f51062cd3d0fb178",
    };
  },
  computed: {
    windowHeight() :any {
      return this.rpxTopx(uni.getSystemInfoSync().windowHeight) - 28;
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    // 初始化调用
    init() {
      // 拉取  聊天记录
      this.getChatHistorys();
    },
    async getChatHistorys() {
      let params = {
        pageNo: 1,
        pageSize: 10,
        param: {
          userId: this.userId,
          modelId: this.modelId,
        },
      };

      try {
        getChatHistory(params)
          .then((data: any) => {
            this.msgList = data;
          })
          .catch((fail) => {
            console.log(fail);
          });
      } catch (e) {
        console.log(e, "没有发送成功");
      }
    },
    // px转换成rpx
    rpxTopx(px: any) {
      let deviceWidth = wx.getSystemInfoSync().windowWidth;
      let rpx = (750 / deviceWidth) * Number(px);
      return Math.floor(rpx);
    },
    // 发送消息
    handleSend() {
      //如果消息不为空
      if (!this.chatMsg || !/^\s+$/.test(this.chatMsg)) {
        console.log(this.chatMsg, 'this.chatMsg');
        uni.showToast({
          title: '发送不能为空',
          icon: 'error',
        });
        return;
      } else {
        this.msgList.push({
          chatType: 0,
          content: this.chatMsg,
        });
        this.chatMsg = "";
      }
      let param = {
        sessionChatId: "",
        userId: this.userId,
        modelId: this.modelId,
        message: this.chatMsg,
      };
      this.isCanSend = true;
      postMessage(param).then((data: any) => {
        this.chatMsg = "";
        // 在异步返回之前  不允许继续发送
        this.msgList.push(data);
        // 回复的信息
        this.isCanSend = false;
      });
    },
  },
});
</script>
<style lang="scss" scoped>
$chatContentbgc: #c2dcff;
$sendBtnbgc: #4f7df5;

view,
button,
text,
input,
textarea {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.scrollContent {
  overflow-y: scroll;
  transition: all 0.1s ease;
  flex: 1;
  // height: 100vh;
  // height: calc(100vh - 88rpx - 110rpx - var(--status-bar-height) + 20rpx);

  /* #ifdef MP-WEIXIN */
  // height: calc(100vh - 88rpx - var(--status-bar-height) - 20rpx);
  /* #endif */
  /* #ifdef H5 */
  // height: calc(100vh - 88rpx - 110rpx - var(--status-bar-height));
  /* #endif */
}

/* 聊天消息 */
.container {
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .scroll-view {
    ::-webkit-scrollbar {
      display: none;
      width: 0 !important;
      height: 0 !important;
      -webkit-appearance: none;
      background: transparent;
      color: transparent;
    }

    // background-color: orange;
    background-color: #f6f6f6;

    .chat-body {
      display: flex;
      flex-direction: column;
      padding-top: 23rpx;
      // background-color:skyblue;

      .self {
        justify-content: flex-end;
      }

      .item {
        display: flex;
        padding: 23rpx 30rpx;
        // background-color: greenyellow;

        .right {
          background-color: $chatContentbgc;
        }

        .left {
          background-color: #ffffff;
        }

        // 聊天消息的三角形
        .right::after {
          position: absolute;
          display: inline-block;
          content: "";
          width: 0;
          height: 0;
          left: 100%;
          top: 10px;
          border: 12rpx solid transparent;
          border-left: 12rpx solid $chatContentbgc;
        }

        .left::after {
          position: absolute;
          display: inline-block;
          content: "";
          width: 0;
          height: 0;
          top: 10px;
          right: 100%;
          border: 12rpx solid transparent;
          border-right: 12rpx solid #ffffff;
        }

        .content {
          position: relative;
          max-width: 486rpx;
          border-radius: 8rpx;
          word-wrap: break-word;
          padding: 24rpx 24rpx;
          margin: 0 24rpx;
          border-radius: 5px;
          font-size: 32rpx;
          font-family: PingFang SC;
          font-weight: 500;
          color: #333333;
          line-height: 42rpx;
        }

        .avatar {
          display: flex;
          justify-content: center;
          width: 78rpx;
          height: 78rpx;
          background: $sendBtnbgc;
          border-radius: 8rpx;
          overflow: hidden;

          image {
            align-self: center;
          }
        }
      }
    }
  }

  /* 底部聊天发送栏 */
  .chat-bottom {
    width: 100%;
    height: 177rpx;
    background: #f4f5f7;

    .send-msg {
      display: flex;
      align-items: flex-end;
      padding: 16rpx 30rpx;
      width: 100%;
      min-height: 177rpx;
      position: fixed;
      bottom: 0;
      background: #ededed;
    }

    .uni-textarea {
      padding-bottom: 70rpx;

      textarea {
        width: 537rpx;
        min-height: 75rpx;
        max-height: 500rpx;
        background: #ffffff;
        border-radius: 8rpx;
        font-size: 32rpx;
        font-family: PingFang SC;
        color: #333333;
        line-height: 43rpx;
        padding: 5rpx 8rpx;
      }
    }

    .send-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 70rpx;
      margin-left: 25rpx;
      width: 128rpx;
      height: 75rpx;
      background: $sendBtnbgc;
      border-radius: 8rpx;
      font-size: 28rpx;
      font-family: PingFang SC;
      font-weight: 500;
      color: #ffffff;
      line-height: 28rpx;
    }
  }
}
</style>
