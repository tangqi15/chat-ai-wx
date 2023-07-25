<script>
	import Vue from 'vue';

	export default Vue.extend({
		onLaunch: function() {
			console.warn('当前组件仅支持 uni_modules 目录结构 ，请升级 HBuilderX 到 3.1.0 版本以上！')
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	})
</script>

<style lang="scss">
	// 引入公共样式  TODO  配置 webpack  loader.js 
	// @import '../wxcomponents/common/styles/common.scss';
</style>