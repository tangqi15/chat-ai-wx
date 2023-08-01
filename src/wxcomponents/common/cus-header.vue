<!-- NavBar 导航栏 -->
<template>
	  <view class="header bg-fff">
		<!-- safe-area-inset-top  开启顶部安全区适配 -->
		<van-nav-bar :title="title" class="header-bar" safe-area-inset-top fixed :border="true" placeholder>
			<!-- 插槽 自定义左侧 TODO-->
			<!-- <view #left> -->
			<template #left>
				<van-icon v-if="isBackBtnVisible" name="arrow-left" class="mr20 p20" @click="back" />
			  </template>
			<!-- 插槽 自定义右侧 -->
			<!-- <view solt="right">
			</view> -->
		<!-- 	 <template #right>
			    <van-icon name="search" size="18" />
			  </template> -->
		</van-nav-bar>
	</view>
</template>
<script lang="ts">
	import Vue from 'vue';
	export default Vue.extend({
		props: {
			title: { default: '标题' },
			isBackBtnVisible: { default: false }
		},
		data() {
			return {}
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1,
				});
			},
		}
	})
</script>
<style lang="scss" scoped>
	.header {
	  z-index: 999;
	}
	
	.header-bar {
	  width: 100vw;
	}
	
	.flex {
	    display: flex;
	}
	.mr20 {
	    margin-right: 20rpx;
	}
	.p20 {
	    padding: 20rpx;
	}
	
	.bg-fff {
	    background-color: #fff;
	}
</style>