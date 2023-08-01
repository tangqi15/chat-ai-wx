<template>
  <view class="content main-height">
    <titleHeader title="个人中心" :isBackBtnVisible="false"></titleHeader>
    <view class="user-info">
      <view class="right-icons flex jus-between">
        <van-icon name="chat-o" size="24" color="#fff" @click="showContactInfo = true"/>
        <van-icon name="service-o" size="24" color="#fff" @click="feedBackClick"/>
      </view>
      <view>
        <van-popup :show="showContactInfo">
          <view class="contact-style ali-center jus-evenly flex-column">
            <text>联系我们</text>
            <text>您在使用过程中遇到任何问题都可以</text>
            <text>添加以下联系方式进行咨询</text>
            <text class="text-style" @click="copy('1')">运营人员QQ: 616992443</text>
            <!-- <text class="text-style" @click="copy('0')">QQ群: 572596123</text> -->
            <van-button round color="#ea880e" @click="showContactInfo = false">我知道了</van-button>
          </view>
        </van-popup>
      </view>
      <view>
        <view class="flex ali-center">
          <img :src="userBasicInfo.avatarUrl || blockImg" alt="" class="image-img" />
          <view class="pl32 flex flex-column mt10">
            <view class="col-fff font40 bold">{{ userBasicInfo.nickName || '用户' }}</view>
            <view class="col-fff font24 mt10" @click="copy('2')"
              >我的推荐码：{{ userBasicInfo.recommendationCode || 0 }}</view
            >
            <view
              class="col-fff font24 mt10"
              @click="updateRecommendationCode"
              v-if="userBasicInfo.busPlatformUserStatus !== 0 || userBasicInfo.canBeRecommended !== false"
              >我的推荐人：{{ userBasicInfo.myRecommenderCode || '请输入推荐人的推荐码' }}</view
            >
          </view>
        </view>
        <view>
          <view class="col-fff font32 bold m20 jus-between">
            <!-- <view>待提现 - ¥ {{ totalIncome.paidMoney || '' }}</view>
            <view>已提现 - ¥ {{ totalIncome.withDrawMoney || '' }}</view> -->
          </view>
        </view>
        <view class="jus-between ali-center col-fff font30 bold mt10 pb32 ml32">
          <van-button type="default" size="small" class="mr20" round @click="showPopup">提现说明</van-button>
          <view class="col-grey mr40" @click="routerToDetails">明细<van-icon name="arrow" /></view>
        </view>
      </view>
    </view>
    <view class="border-triangle"></view>
    <view class="card mr32 ml32 p36" style="margin-top: -45rpx">
      <view>
        <view class="font34 bold">
          我的本期成长值 :  {{ Math.ceil(myInfo.totalPoint) }}
        </view>
        <view class="jus-between ali-center mt20 mb20 font30 bold">
          <van-button type="default" size="small" class="btn-style" round @click="showScorePopup(1)">成长说明</van-button>
          <view class="col-grey" @click="scorePointsInfo">明细<van-icon name="arrow" /></view>
        </view>
      </view>
      <van-divider />
      <view class="flex jus-between font24">
        <view class="view-part" @click="showScorePopup(2)">
          <view class="flex-center">
            <text>变更点</text>
            <van-icon name="question-o" size="14" class="pl5" color="#848080" />
          </view>
          <text class="pt20 font32">{{ myInfo.changePoint }}</text>
        </view>
        <view class="view-part" @click="showScorePopup(3)">
          <view class="flex-center">
            <text>缺陷率</text>
            <van-icon name="question-o" size="14" class="pl5" color="#848080" />
          </view>
          <text class="pt20 font32">{{ myInfo.quality }}</text>
        </view>
        <view class="view-part" @click="showScorePopup(4)">
          <view class="flex-center">
            <text>活跃天数</text>
            <van-icon name="question-o" size="14" class="pl5" color="#848080" />
          </view>
          <text class="pt20 font32">{{ myInfo.onlineDay }}</text>
        </view>
        <view class="view-part" @click="showScorePopup(5)">
          <view class="flex-center">
            <text>影响度</text>
            <van-icon name="question-o" size="14" class="pl5" color="#848080" />
          </view>
          <text class="pt20 font32">{{ myInfo.recommendedNumber }}</text>
        </view>
      </view>
    </view>
    <view class="card mr32 ml32 p36 font24">
      <text class="font34 bold">我的消费积分</text>
      <view class="jus-between mt32" style="heigh: 300rpx">
        <view class="font30 bold">余额：{{ myScore }}</view>
        <view class="font24 col-blue" @click="loginRewardShop">兑换 <van-icon name="arrow" size="28rpx" /> </view>
      </view>
    </view>
    <view class="card mr32 ml32 p36">
      <view class="jus-between ali-center">
        <text class="font34 bold">我的助手</text>
        <view class="font24 col-grey" @click="routerToConfigViews()">{{ operations[5].operationContents[0].content || '' }} <van-icon name="arrow" size="28rpx" /> </view>
      </view>
      <view class="flex flex-column">
        <scroll-view class="pt10 honor-icons" scroll-x enhanced :show-scrollbar="false"
          :scroll-into-view="`honorIcon${ activeIconIndex }`" @scroll="honorChange">
          <image class="honor-icon" id="honorIcon0" />
          <image v-for="(item, index) in gradeList" :key="index"
            :class="['honor-icon', index === activeIconIndex ? 'honor-current' : '' , index === scrollIndex && scrollIndex !== activeIconIndex ? 'honor-scale' : '']"
            :src="item" :id="`honorIcon${ index + 1 }`" />
          <image class="honor-current" :id="`honorIcon${ gradeList.length + 1 }`" />
        </scroll-view>
        <view class="jus-center pt10 font24">
          <view>当前等级: lv{{ myInfo.level }}</view>
        </view>
      </view>
    </view>
    <view class="card mr32 ml32 p36 font24">
      <text class="font34 bold">我的权益</text>
      <view style="heigh: 200rpx" class="flex-center">
        <view>待上线，敬请期待</view>
      </view>
    </view>
    <view class="card mr32 ml32 font24 p36 address">
      <text class="font34 bold">我的地址</text>
      <text class="float-r blue" @click="goAddressInfo">去编辑 ></text>
    </view>
    <tabBar :active="2"></tabBar>
    <van-popup closeable :show="showMoneyInfo" @close="showPopup">
      <scroll-view scroll-y style="height: 1200rpx; margin-top: 80rpx" class="m32" show-scrollbar="false">
        <moneyInfo></moneyInfo>
      </scroll-view>
    </van-popup>
    <recommendDialog ref="recommendDialog" @confirm="back" @cancel="back"></recommendDialog>
    <van-popup :show="showScoreInfo" round custom-style="width: 100%;">
      <score-points v-if="showScoreInfo" :currentNumber="currentNum"></score-points>
      <view class="center mb32" v-if="showScoreInfo">
        <van-button color="linear-gradient(to right, #8ce0e6, #88d0ea)" @click="showScorePopup(1)">我知道了</van-button>
      </view>
    </van-popup>
  </view>
</template>

<script lang="ts">
import Vue from 'vue';
import tabBar from "@/wxcomponents/common/tab-bar.vue";
import titleHeader from '@/wxcomponents/common/cus-header.vue';
import { loginShop } from '@/network/user';
import { mapGetters } from 'vuex';

export default Vue.extend({
	components: {
		titleHeader, tabBar
  },
  data() {
    return {
      nickName: '',
      avatarUrl: '',
      myInfo: {
        // 影响度
        recommendedNumber: 0,
        // 活跃度
        onlineDay: 0,
        // 缺陷率
        quality: 0,
        // 变更点
        changePoint: 0,
        // 我的积分
        totalPoint: 0,
        level: 0,
        honorPictureName: 'grade0',
      },
      activeIconIndex: 0,
      scrollIndex: -1,
      gradeList: [
        '/static/imgs/grade0.png',
        '/static/imgs/grade1.png',
        '/static/imgs/grade2.png',
        '/static/imgs/grade3.png',
        '/static/imgs/grade4.png',
        '/static/imgs/grade5.png',
        '/static/imgs/grade6.png',
        '/static/imgs/grade7.png',
      ],
      blockImg: '/static/imgs/blockHead.png',
      totalIncome: {
        paidMoney: '0',
        withDrawMoney: '0',
      },
      showMoneyInfo: false,
      showContactInfo: false, // 联系我们弹框展示
      showScoreInfo: false, // 积分popup
      currentNum: 0,
      myScore: 0, // 我的积分
    };
  },
  computed: {
    ...mapGetters(['userBasicInfo', 'operations']),
  },
  mounted() {
  },
  methods: {
    routerToConfigViews() {},
    toChildrenPages() {
      uni.showToast({
        title: '功能暂未开通！',
        icon: 'none',
      });
    },
    // 收支明细跳转
    routerToDetails() {
      uni.navigateTo({
        url: '/pages/mine/details',
      });
    },
    // 复制
    copy(val: any) {
      let data = this.userBasicInfo.recommendationCode; // 我的推荐码
      if (val === '0') {
        data = '572596123'; //  QQ群
      } else if (val === '1') {
        data = '616992443'; // 运营人员QQ
      }
      uni.setClipboardData({
        data,
        success() {
          uni.showToast({ title: '已复制' });
        },
      });
    },
    showPopup() {
      this.showMoneyInfo = !this.showMoneyInfo;
    },
    // 推荐码更新
    updateRecommendationCode() {
      if (this.userBasicInfo.canBeRecommended) {
        (this as any).$refs.recommendDialog.toggle();
      }
    },
    // 我要反馈
    feedBackClick() {
      uni.navigateTo({
        url: '/pages/mine/allFeedBack',
      });
    },
    // 我要上报
    checkMyReportTask() {
      uni.navigateTo({
        url: '/pages/mine/myReportTask',
      });
    },
    // 荣誉icon滚动，滚动中心单位放大1.2倍
    honorChange(e: any) {
      // active:inactive宽高比4: 3
      const { scrollWidth, scrollLeft } = e.detail;
      // 根据activeIconIndex计算当前滑动到哪个元素
      const inactiveIconWidth = scrollWidth / (this.gradeList.length + 1 + 4 / 3);
      const activeWidth = (inactiveIconWidth * 4) / 3;
      const activeBegin = (this.activeIconIndex + 1) * inactiveIconWidth;
      const activeEnd = activeBegin + activeWidth - 15;
      let scrollIndex = -1;
      if (scrollLeft < activeBegin) {
        scrollIndex = Math.round(scrollLeft / inactiveIconWidth);
      } else if (scrollLeft > activeBegin && scrollLeft < activeEnd) {
        scrollIndex = this.activeIconIndex + 1;
      } else if (scrollLeft > activeEnd) {
        scrollIndex = Math.round((scrollLeft - activeWidth) / inactiveIconWidth) + 1;
      }
      if (scrollIndex >= 0 && scrollIndex !== this.scrollIndex) {
        this.scrollIndex = scrollIndex;
      }
    },
    // 我的地址
    goAddressInfo() {
      uni.navigateTo({
        url: '/pages/mine/myAddressInfo',
      });
    },
    showScorePopup(val: number) {
      this.showScoreInfo = !this.showScoreInfo;
      this.currentNum = val;
    },
    scorePointsInfo() {
      uni.showToast({
        title: '开发中，待上线',
        icon: 'none',
      });
    },
    // 登录积分商城
    async loginRewardShop() {
      const data: any = await loginShop();
      if (!data.hasUcAccount) {
        // 未注册
        uni.showModal({
          title: '登录失败',
          content: '您尚未注册平台权限，请注册平台权限',
          confirmText: '去注册',
          cancelText: '暂不注册',
          success: (res) => {
            res.confirm && uni.navigateTo({
              url: '/pages/index/bindUserInfo',
            });
          },
        });
        return;
      }
      if (!data.hasAddress) {
        uni.showModal({
          title: '地址信息缺失',
          content: '您尚未填写地址信息，请填写邮寄地址',
          confirmText: '去填写',
          cancelText: '暂不填写',
          success: (res) => {
            res.confirm && this.goAddressInfo();
          },
        });
        return;
      }
      if (data.mbcTicket) {
        uni.navigateTo({ url: `/pages/busFansCircle/rewardShop?ticket=${data.mbcTicket}` });
      }
    },
    // 纠错-线路编辑
    checkLineEdit() {
      uni.navigateTo({
        url: '/pages/line-edit/edit-list',
      });
    }
  },
});
</script>

<style lang="scss" scoped>
.main-height {
  height: 100%;
}
.p36 {
  padding: 36rpx;
}

.mr40 {
  margin-right: 40rpx;
}

.mt36 {
  margin-top: 36rpx;
}

.w80 {
  width: 80rpx;
}

.pl48 {
  padding-left: 48rpx;
}

.view-part {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.user-info {
  position: relative;
  // height: 360rpx;
  height: 280rpx;
  background: #3855d6;
  padding: 6rpx 25rpx 0 40rpx;
}

.right-icons {
  position: absolute;
  top: 22rpx;
  right: 22rpx;
  width: 115rpx;
}

.image-img {
  width: 108rpx;
  height: 108rpx;
}

.grade-img {
  width: 60rpx;
  height: 62rpx;
}

.icon-img {
  width: 40rpx;
  height: 40rpx;
}

.icon-title {
  font-size: 20rpx;
  color: #071a3a;
  padding-top: 2rpx;
}

.user-phone {
  margin-top: 12rpx;
  font-size: 26rpx;
  color: #ffffff;
}

.border-triangle {
  border-style: solid;
  border-width: 60rpx 50rpx 0px 50rpx;
  border-color: #3855d6 transparent transparent transparent;
}

.integral-num {
  font-weight: bold;
  font-size: 44rpx;
}

.honor-icon {
  width: 141rpx;
  height: 75rpx;
  opacity: 0.4;
}

.honor-current {
  width: 188rpx;
  height: 100rpx;
  opacity: 1;
}

.honor-icons {
  width: 450rpx;
  align-self: center;
  white-space: nowrap;
}

.contact-style {
  width: 660rpx;
  height: 530rpx;
}

.img-style {
  width: 60rpx;
  height: 60rpx;
}

.honor-scale {
  transform: scale(1.3);
}

.text-style {
  color: #ea880e;
}

.blue {
  color: #449ee7;
}

.address {
  height: 48rpx;
  line-height: 48rpx;
}

.btn-style  ::v-deep .van-button--round {
  background: #ece9e9;
}
</style>
