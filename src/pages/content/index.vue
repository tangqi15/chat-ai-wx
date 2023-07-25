<template>
	<view class="content">
		<titleHeader :title="title"></titleHeader>

		<view>
			<!-- vue 页面级滚动，可能会卡顿 -->
			<!-- 这里使用 原生 组件滚动，在滚出屏幕外后，系统会回收不可以见区域的渲染那内存资源 -->
			<uni-list :border="true">
				<uni-list-chat
					title="张三"
					avatar=""
					note="您收到一条新的消息"
					time="2020-02-02 20:20"
					clickable
					:avatar-circle="true"
					v-for="(item,index) in chatLength"
					:key="index"
					@click="openDetail(item)"/>
			</uni-list>
		</view>


		<tabBar :active="1"></tabBar>
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
				// chatLength: 5 // 列表长度
				chatLength: [{
					id: 1
				}, {
					id: 2
				}, {
					id: 3
				}, {
					id: 4
				}]
			}
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