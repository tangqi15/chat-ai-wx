<!-- TODO -->
<template>
	<view class="content">
		<titleHeader :title="title"></titleHeader>

		<van-tabs v-model="active">
		  <van-tab title="标签 1">内容 1</van-tab>
		  <van-tab title="标签 2">内容 2</van-tab>
		  <van-tab title="标签 3">内容 3</van-tab>
		  <van-tab title="标签 4">内容 4</van-tab>
		</van-tabs>
		
	</view>
</template>

<script>
	import Vue from 'vue';
	import titleHeader from '@/wxcomponents/common/cus-header.vue';
	import tabBar from '@/wxcomponents/common/tab-bar.vue';

	export default Vue.extend({
		components: {
			titleHeader,
			tabBar,
		},
		data() {
			return {
				title: '聊天列表',
			};
		},
		methods: {
			// 进入聊天详情
			openDetail(item) {
				console.log(item, 'item');
				// 通过id  查询语音列表
			  uni.navigateTo({ url: `/pages/content/chatDetail?data=${item.id}` });
			}
		}
	})
</script>

<style lang="scss" scoped>
/* 通用样式 */
.content {
    box-sizing: border-box;
	display: flex;
	flex-direction: column;
	background: #F0F5F9;
	height: 100vh;
    color: #071A3A;
}
</style>