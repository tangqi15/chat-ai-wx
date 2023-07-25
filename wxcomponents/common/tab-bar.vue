<template>
  <van-tabbar :active="active" placeholder fixed>
    <van-tabbar-item @click="homePicked">
      <image slot="icon" :src="icon[0].normal" mode="aspectFit" class="itemBar" />
      <image slot="icon-active" :src="icon[0].active" mode="aspectFit" class="itemBar" />
      主页
    </van-tabbar-item>
    <van-tabbar-item @click="contentPicked">
      <image slot="icon" :src="icon[1].normal" mode="aspectFit" class="itemBar" />
      <image slot="icon-active" :src="icon[1].active" mode="aspectFit" class="itemBar" />
      内容
    </van-tabbar-item>
    <van-tabbar-item @click="minePicked">
      <image slot="icon" :src="icon[2].normal" mode="aspectFit" class="itemBar" />
      <image slot="icon-active" :src="icon[2].active" mode="aspectFit" class="itemBar" />
      我的
    </van-tabbar-item>
  </van-tabbar>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  data() {
    return {
      icon: [
	  {
		normal: '/static/imgs/home.png',
		active: '/static/imgs/homeselect.png',
	  },
        {
          normal: '/static/imgs/content.png',
          active: '/static/imgs/contentselect.png',
        },
        {
          normal: '/static/imgs/mine.png',
          active: '/static/imgs/mineselect.png',
        },
      ],
    };
  },
  props: {
    active: {
      type: Number,
      default() {
        return 1;
      },
    },
  },
  components: {
  },
  computed: {
  },
  methods: {
	  // 首页
    homePicked() {
      uni.switchTab({
        url: '/pages/home/index',
      });
    },
    contentPicked() {
      uni.switchTab({
        url: '/pages/content/index',
      });
    },
    minePicked() {
      uni.switchTab({
        url: '/pages/mine/index',
      });
    },
  },
});
</script>
<style lang="scss">
	.itemBar {
		width: 30px;
		height: 18px
	}
</style>
