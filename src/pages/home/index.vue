<template>
	<view class="container">
		<view class="content">
		<view class="headerButton">
			<van-button size="mini" type="info" @click="settingParameters">设置</van-button>
			<!-- <van-button size="mini" type="info">切换</van-button> -->
		</view>
		<!-- 虚拟人物 -->
		<view>
			<img class="image-img" src="/static/imgs/lisa.png" alt="">
		</view>
		<!-- 人物参数 -->
		<view class="flex-center">
			<view v-if="registerShow">
				<van-field name="radio" label="性别">
					<template #input>
						<van-radio-group v-model="radio" direction="horizontal">
							<van-radio name="1">男</van-radio>
							<van-radio name="2">女</van-radio>
						</van-radio-group>
					</template>
				</van-field>
				<van-field name="radio" label="性别">
					<template #input>
						<van-radio-group v-model="radio" direction="horizontal">
							<van-radio name="1">男</van-radio>
							<van-radio name="2">女</van-radio>
						</van-radio-group>
					</template>
				</van-field>
				<van-field name="radio" label="性别">
					<template #input>
						<van-radio-group v-model="radio" direction="horizontal">
							<van-radio name="1">男</van-radio>
							<van-radio name="2">女</van-radio>
						</van-radio-group>
					</template>
				</van-field>
<!-- 				<view>
					<span>年龄:</span>
					{{slider}}
				</view>
				<van-slider v-model="slider" active-color="#ee0a24" bar-height="4px" :min="0" :max="50"
					@change="onChange">
					<template #button>
						<view class="custom-button">{{ slider }}</view>
					</template>
				</van-slider> -->
				<view class="button">
					<van-button size="mini" type="info">确定</van-button>
				</view>
			</view>
		</view>
	</view>
		<!-- <tabBar :active="0"></tabBar> -->
		<view class="footButton">
			<view>语音聊天</view>
			<view>文字聊天</view>
		</view>
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
				href: 'https://uniapp.dcloud.io/component/README?id=uniui',
				img: '',
				registerShow: false,
				radio: '1',
				slider: 30, // 滑块
			}
		},
		onLoad(options) {
		},
		computed: {
		},
		methods: {
			settingParameters() {
				this.registerShow = !this.registerShow;
			},
			onChange(value) {
				this.slider = value.detail;
			},
		}
	})
</script>


<style lang="scss" scoped>
	.container {
		margin-top: 5vh;
		display: flex;
		flex-direction: column;
		height: 95vh;
	}

	.content {
		// padding-top: 20px;
		box-sizing: border-box;
		// display: flex;
		// flex-direction: column;
		// background: #F0F5F9;
		// height: 100vh;
		// color: #071A3A;
		// flex: 1;
		flex-grow: 1;
		// background-color: #ee0a24;
	}

	.headerButton {
	  height: 10rpx;
		display: flex;
		justify-content: space-around;
	}

	.image-img {
	  width: 100%;
	  height: 100%;
		background-color: aqua;
	}
	.custom-button {
		width: 26px;
		color: #fff;
		font-size: 10px;
		line-height: 18px;
		text-align: center;
		// background-color: #ee0a24;
		border-radius: 100px;
	}

	.button {
		display: flex;
		justify-content: flex-end;
		border-radius: 10px;
	}

	.footButton {
		display: flex;
		justify-content: space-between;
	}
</style>