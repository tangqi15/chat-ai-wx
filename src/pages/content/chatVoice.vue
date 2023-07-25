<template>
	<!-- 语音遮罩层 -->
	<view class="voice-mask" v-show="mask">
		<!--语音条 -->
		<!-- <view class="voice-bar voice-del" :class="{voiceDel:needCancel}" :style={width:getVoiceBarWidth}> -->
		<view class="voice-bar voice-del" :class="{voiceDel:needCancel}">
			<!-- <img src="../static/icon/wave.png" class="voice-volume" :class="{volumeDel:needCancel}"></img> -->
			<view class="trangle-bottom" :class="{trangleDel:needCancel}"></view>
		</view>
		<!-- 底部区域 -->
		<view class="voice-send">
			<!-- 取消和转文字图标 -->
			<view class="voice-middle-wrapper">
				<!-- 取消 -->
				<view class="voice-left-wrapper">
					<view class="cancel-del" :class="{delTip:needCancel}">松开 取消</view>
					<view class="voice-middle-inner close" :class="{bigger:needCancel}">
						<!-- <img src="../static/icon/close-grey.png" class="close-icon"></img> -->
						<text class="wen">取消</text>
					</view>
				</view>
				<!-- 转文字 -->
				<view class="voice-middle-inner to-text">
					<text class="wen">文</text>
					<!-- <image src="" class="wen"></image> -->
				</view>
				<view class="send-tip" :class="{sendTipNone:needCancel}">松开 发送</view>
			</view>
			<!-- 底部语音按钮 -->
			<view class="mask-bottom">
				<!-- <img src="../static/icon/voice-left.png"></img> -->
				<view>我是一个语音</view>
			</view>
		</view>
	</view>

</template>

<script>
	import Vue from 'vue';
	export default Vue.extend({
		data() {
			props: {
				mask: Boolean;
				isBackBtnVisible: Boolean
			}
			return {
				timer: null, // 定时器
				length: 0, // 录音长度
				startX: 0, // 手指在按钮的初始位置X
				startY: 0, // 手指在按钮的初始位置Y
				needCancel: false, // 语音取消发送
				recorderManger: null, // 录音工具
				innerAudioContext: null, // 音频播放
				audioList: [], // 语音数组
			}
		},
		onLoad(options) {
			// uni  提供的全局录音管理器
			this.recorderManger = uni.getRecorderManager();

			// 语音播放
			this.innerAudioContext = uni.createInnerAudioContext();
		},
		computed: {
			// 计算语音条宽度
			getVoiceBarWidth() {
				return (230 + this.length * 4) + 'rpx';
			}
		},
		methods: {
			settingParameters() {
				this.registerShow = !this.registerShow;
				console.log(this.registerShow, 'ccccc');
			},
			onChange(value) {
				this.slider = value.detail;
			},
			handleTouchStart(e) {

				console.log('1', '按下啦啦啦啦');
				this.mask = true; // 打开语音 弹窗
				this.recorderManger.start();
				this.length = 1;
				// 位置  用来判断  滑动到哪里， 取消发送语音
				this.startX = e.touches[0].pageX;
				this.startY = e.touches[0].pageY;
				// 启动一个定时器，超过一分钟， 结束录制
				this.timer = setInterval(() => {
					this.length += 1;
					if (this.length >= 60) {
						clearInterval((this.timer));
						this.handleTouchEnd();
					}
				}, 1000)
			},
			handleTouchMove(e) {
				console.log('2', '按下并且移动');
				if (this.startX - e.touches[0].pageX > 14 && this.startY - e.touches[0].pageY > 50) {
					this.needCancel = true;
				} else {
					this.needCancel = false;
				}
			},
			// 发送语音
			handleTouchEnd() {
				console.log('3', '松开');
				this.mask = false;
				clearInterval(this.tiemr);
				this.recorderManger.stop();
				this.recorderManger.onStop((res) => {
					console.log(res, 'resresresresres');
					const message = {
						voice: res.tempFilePath,
						length: this.length
					};
					if (!this.needCancel) {
						this.inputSubmit(message, 2);
					}
					this.needCancel = false;
				})
			},
			// 语音 处理  发送接口
			inputSubmit(message, types) {
				// console.log(message);
				this.audioList.push({
					message,
					types
				})
			},
			// 处理语音长度
			handleVoiceWidth(lenght) {
				lenght = lenght - 1;
				let Lmin = 138;
				let Lmax = 366
				let barCanChangeLen = Lmax - Lmin;

				// 11秒以内的语音
				if (lenght < 11) {
					// VoicePlayTimes 为10秒时，正好为可变长度的一半
					return (Lmin + lenght * 0.05 * barCanChangeLen) + 'rpx';
				} else {
					// 12-60秒的语音
					return (Lmin + 0.5 * barCanChangeLen + (lenght - 10) * 0.01 * barCanChangeLen) + 'rpx';
				}
			},
			// 播放语音
			handleVoicePlay(item) {
				item.isFirstPlay = false;
				this.innerAudioContext.src = item.message.voice;
				this.isPlay = !this.isPlay;
				this.isPlay ? this.innerAudioContext.play() : this.innerAudioContext.stop();
				this.innerAudioContext.onEnded(() => {
					this.isPlay = false;
				})
				this.innerAudioContext.onStop(() => {
					this.isPlay = false;
				})
			},
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

	.headerButton {
		display: flex;
		justify-content: space-around;
	}

	/* .image-img {
	  width: 100%;
	  height: 100%;
	} */
	.custom-button {
		width: 26px;
		color: #fff;
		font-size: 10px;
		line-height: 18px;
		text-align: center;
		background-color: #ee0a24;
		border-radius: 100px;
	}

	.button {
		display: flex;
		justify-content: flex-end;
		border-radius: 10px;
	}




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
		border-color: #51FF50 transparent transparent transparent;
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
		border-top: #BABABB 8rpx solid;
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
</style>