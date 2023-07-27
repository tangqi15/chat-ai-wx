<template>
	<view>
		<tabBar :active="2"></tabBar>
	</view>
</template>

<script>
    import Vue from 'vue';
	import tabBar from '@/wxcomponents/common/tab-bar.vue';

	export default Vue.extend({
		components: {
		    tabBar,
		  },
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	})
</script>


<style lang="scss" scoped>
/* 通用样式 */
.content {
	margin-top: 100rpx;
    box-sizing: border-box;
	display: flex;
	flex-direction: column;
	background: #F0F5F9;
	height: 100vh;
    color: #071A3A;
}
</style>
