<template>
	<view class="container" @tap="togglePicker(0)">
		<titleHeader :title="title" isBackBtnVisible="true"></titleHeader>
		<!--内容-->
		<view class="scrollContent">
			<scroll-view :scroll-into-view="scrollViewId" scroll-y style="height: 100%;">
				<view class="item-space"></view>
				<!-- <view class="time">晚上 10:04</view> -->
				<view v-for="(item, index) in audioList" :key="index">
					<!--撤销-->
					<view v-if="item.msgType == 'cancel'" class="cancel">
						<text v-if="item.source == fromUserId" class="text">你撤回了一条消息</text>
						<text v-else class="text">成员 {{ item.source }} 撤回了一条消息</text>
					</view>
					<view v-else class="item flex-row" :class="[item.source == fromUserId ? 'right' : 'left']">
						<!--处理头像-->
						<view v-if="item.source == fromUserId">
							<image v-if="fromUserFace" :src="fromUserFace" class="face"></image>
							<image v-else src="@/static/img/face.png" class="face"></image>
						</view>
						<view v-else>
							<image v-if="item.toUserFace || item.userFace" :src="item.toUserFace || item.userFace" class="face"></image>
							<image v-else src="@/static/img/face.png" class="face"></image>
						</view>
						<!--语音-->
						<view v-if="item.msgType == 'voice'" @tap="playVoice(item)" class="content">
							<image v-show="voicePlayingId != item.message.id" src="@/static/img/audio.png" class="voice-icon"></image>
							<image v-show="voicePlayingId == item.message.id" src="@/static/img/audio-play.gif" class="voice-icon"></image>
						</view>
					</view>
				</view>
				<view id="bottom"></view>
			</scroll-view>
		</view>
		<!--输入-->
		<view class="oper flex-row" @tap.prevent.stop="">
			<view
			  class="videoChatButton"
				@touchend="handleTouchEnd"
				@touchmove="handleTouchMove"
				@touchstart="handleTouchStart"
				>按住 说话</view>
			<!-- <view  @touchstart="startVoice" @touchend="endVoice" class="input" style="text-align: center;">按住 说话</view> -->
		</view>
		<!--语音-->
		<!-- <my-voice v-show="showVoice"></my-voice> -->
		<!-- 语音遮罩层 -->
		<view class="voice-mask" v-show="showVoice">
			<!--语音条 -->
			<!-- <view class="voice-bar voice-del" :class="{voiceDel:needCancel}" :style={width:getVoiceBarWidth} > -->
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
	</view>
</template>

<script>
import myVoice from './self-voice.vue'
import util from '@/static/js/util'
import titleHeader from '@/wxcomponents/common/cus-header.vue';
import { postVoice } from "@/network/chat";
const innerAudioContext = uni.createInnerAudioContext()
// uni  提供的全局录音管理器
// const recorderManger = uni.getrecorderManger()
const recorderManger = uni.getRecorderManager()
export default{
	components: { myVoice, titleHeader },
	data(){
		return {
			util,
			isEdit: true,
			isFocus: false,
			showEmoji: false,
			showFile: false,
			showVoice: false,
			scrollHeight: 'auto',		// 内容区域高度
			statusBarHeight: 0,		// 状态栏高度
			scrollViewId: '',		// 滚动到最底部
			voicePlayingId: '',		// 正在播放的消息ID
			audioList: [],
			socketMsgQueue: [], // 消息队列
			fromUserId: uni.getStorageSync('userId'),
			fromUserFace: uni.getStorageSync('userFace'),
			toUserId: '',
			toUserName: '',
		}
	},
	onLoad(option){
		// 初始化内容高度
		this.setScrollHeight()
		
		// 初始化状态栏高度
		uni.getSystemInfo({
			success: res=>{
				this.statusBarHeight = res.statusBarHeight
			}
		})
		
		// 结束录音
		recorderManger.onStop(res => {
			console.log('执行到这里了么');
			this.upload(res.tempFilePath)
		})
		
		// 结束播放
		innerAudioContext.onEnded(res=>{
			this.voicePlayingId = ''
		})
		
		// 设置标题
		uni.setNavigationBarTitle({ title: option.toUserName })
		
		// 获取参数
		this.toUserId = option.toUserId
		this.toUserName = option.toUserName
		
		// 获取消息记录
		this.getList()
		
		// 监听webSocket消息
		// this.$xbcim.onmessage(data=>{
		// 	// 只接受单聊消息
		// 	if(data.type != 'single') return
			
		// 	// 处理数据
		// 	data.id = data.extra.id
		// 	data.userFace = data.extra.userFace
		// 	this.list.push(data)
		// 	this.initScrollBar()
		// })
	},
	onHide(){
		innerAudioContext.stop()
	},
	// onBackPress(){
	// 	if(this.showFile || this.showEmoji){
	// 		this.showFile = false
	// 		this.showEmoji = false
	// 		this.setScrollHeight(0)
	// 		return true
	// 	}
	// 	return false
	// },
	methods: {
		// 初始化滚动
		initScrollBar(){
			setTimeout(()=>{
				this.scrollViewId = ''
				setTimeout(()=>{
					this.scrollViewId = 'bottom'
					setTimeout(()=>{this.scrollViewId = ''}, 100)
				}, 100)
			}, 100)
		},
		// 设置scroll的高度
		setScrollHeight(descHeight=0){
			// #ifdef MP-WEIXIN
			this.scrollHeight = `calc(100vh - 110rpx - ${descHeight}px)`
			// #endif
			// #ifdef APP-PLUS
			this.scrollHeight = `calc(100vh - 110rpx - ${descHeight}px)`
			// #endif
			// #ifdef H5
			this.scrollHeight = `calc(100vh - 110rpx - 88rpx - ${descHeight}px)`
			// #endif
		},
		// 切换选择
		togglePicker(height=0, type=''){
			this.showEmoji = false
			this.showFile = false
			let status = height >0 ? true : false
			
			switch(type){
				case 'emoji':
					this.showEmoji = status; break
				case 'file':
					this.showFile = status; break
			}
			
			setTimeout(()=>{
				this.setScrollHeight(height)
				this.initScrollBar()
			}, 50)
		},
		handleTouchStart(e) {
				this.showVoice = true; // 打开语音 弹窗
				console.log(this.showVoice, 'this.showVoice');
				recorderManger.start();
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
				if (this.startX - e.touches[0].pageX > 14 && this.startY - e.touches[0].pageY > 50) {
					this.needCancel = true;
				} else {
					this.needCancel = false;
				}
			},
			// 发送语音
			handleTouchEnd() {
				console.log('执行到这里了');
				this.showVoice = false;
				clearInterval(this.tiemr);
				recorderManger.stop();
				recorderManger.onStop((res) => {
					console.log(res, 'res44444444444444');
					const message = {
						id: '1',
						content: res.tempFilePath,
						length: this.length
					};
					if (!this.needCancel) {
						this.inputSubmit(message, 'voice');
					}
					this.needCancel = false;
				})
			},
			// 语音 处理  发送接口
			inputSubmit(message, msgType) {
				// console.log(message);
				this.audioList.push({
					message,
					msgType
				})
				
				postVoice().then(() => {
					
				})
			},
		// 开始录音
		startVoice(){
			this.showVoice = true
			recorderManger.start()
		},
		// 结束录音
		endVoice(){
			this.showVoice = false
			recorderManger.stop()
		},
		// 上传
		upload(filePath){
			this.util.loading('上传中')
			// 上传路劲  TODO
			url = '';
			uni.uploadFile({
				url: url,
				name: 'file',
				filePath,
				formData: {
					userId: this.fromUserId
				},
				header: this.util.getHeader(),
				success: res=>{
					uni.hideLoading()
					let data = JSON.parse(res.data)
					this.pushMessage(data.data, 'voice')
				},
				fail: err=>{
					uni.hideLoading()
				}
			})
		},
		// 播放录音
		playVoice(item){
			if(this.voicePlayingId){
				this.voicePlayingId = ''
			}else{
				this.voicePlayingId = item.message.id
				innerAudioContext.src = item.message.content
				innerAudioContext.play()
			}
		},
		// 长按
		longPress(msg){
			let data = {
				type: 'single',
				source: this.fromUserId,
				dest: this.toUserId,
				timestamp: new Date().getTime(),
				msg: {
					id: msg.id,
					fromUserId: msg.fromUserId,
					toUserId: msg.toUserId,
					type: 'cancel',
					content: msg.content
				}
			}
			
			// 撤销发送消息
			uni.sendSocketMessage({
				data: JSON.stringify(data),
				success: res=>{
					// 撤销本地消息
					this.audioList = this.audioList.map(item=>{
						item.type = item.id == msg.id ? 'cancel' : item.type
						return item
					})
				}
			})
		},
		// 推送消息
		pushMessage(content, type='text', cb=()=>{}){
			
			// 组合消息体：需要保存在本地数据库的数据
			let msgData = {
				fromUserId: this.fromUserId,
				userFace: uni.getStorageSync('userFace'),
				toUserId: this.toUserId,
				type,
				content
			}
			
			// 加入信息
			this.list.push({
				source: this.fromUserId,
				target: this.toUserId,
				content: msgData.content,
				userFace: uni.getStorageSync('userFace'),
				type: 'single',
				msgType: type
			})
			
			// 初始化滚动条
			this.initScrollBar()
			cb ? cb() : this.togglePicker(0, 'file')
			
			// var apiUrl = 'voice/all-voice';
			request(apiUrl);
			// postMessage(apiUrl);
			// uni.request({
			// 	url: apiUrl,
			// 	data: {
			// 		"key": 'free',
			// 		"msg": encodeURI(content),
			// 		"appid": 'wx07c87b31ee791408'
			// 	},
			// 	success: (res) => {
			// 		console.log('request success:', res);
			// 		// 加入信息
			// 		this.list.push({
			// 			source: this.fromUserId+1,
			// 			target: this.toUserId,
			// 			content: res.data.content,
			// 			userFace: uni.getStorageSync('userFace'),
			// 			type: 'single',
			// 			msgType: type
			// 		})
					
			// 		// 初始化滚动条
			// 		this.initScrollBar()
			// 		cb ? cb() : this.togglePicker(0, 'file')
			// 	},
			// 	fail: (err) => {
			// 		console.log('request fail333', err);
			// 		uni.showModal({
			// 			content: err.errMsg,
			// 			showCancel: false
			// 		})
			// 	}
			// });
		},
		// 获取记录
		getList(){
			setTimeout(()=>{
				this.scrollViewId = 'bottom'
				setTimeout(()=>{this.scrollViewId = ''}, 100)
			}, 100)
			// uni.request({
			// 	url: this.$api.getSingleRecord,
			// 	data: {
			// 		fromUserId: this.fromUserId,
			// 		toUserId: this.toUserId
			// 	},
			// 	header: this.util.getHeader(),
			// 	success: res=>{
			// 		this.list = res.data.data.map(item=>{
			// 			if(['voice', 'image'].includes(item.type)){
			// 				item.content = this.$api.staticPath+item.content
			// 			}
			// 			if(item.toUserFace){
			// 				item.toUserFace = this.$api.staticPath+item.toUserFace
			// 			}
						
			// 			// 为了和socket的字段一致，此处做一个转换；
			// 			// 数据表字段可以直接设置为source、target和msgType
			// 			item.source = item.fromUserId
			// 			item.target = item.toUserId
			// 			item.msgType = item.type
			// 			return item
			// 		})
					
			// 		this.scrollViewId = ''
					
			// 	}
			// })
		}
	}
}
</script>

<style lang="scss" scoped>
	.flex-row{
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}
.container{
	height: 100vh;
	overflow: hidden;
}

/* #ifdef H5 */
.container{
	height: calc(100vh - 88rpx);
}
/* #endif */

.status_bar,
.container,
.header,
.emoji,
.file{
	background-color: #F3F3F3;
}
.header{
	border-bottom: 2rpx solid #EEE;
	
	.center{
		font-weight: bold;
	}
}
.map{
	width: 60%;
	height: 300rpx;
	background-color: #FFF !important;
	
	&::before{
		border-right: 30rpx solid #FFF !important;
	}
	
	.title{
		height: 80rpx;
		font-size: 28rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}
	
	.box{
		width: 100%;
		height: 170rpx;
		margin-top: 10rpx;
	}
}
.emoji{
	height: 400rpx;
	padding: 0 0 20rpx 20rpx;
	position: relative;
	
	.list{
		width: 100%;
		height: 400rpx;
		padding: 20rpx 0;
		overflow-y: auto;
		
		.item{
			float: left;
			display: block;
			height: 60rpx;
			line-height: 60rpx;
			width: calc(100% / 12);
			margin-right: 20rpx;
		}
	}
}
.file{
	padding: 30rpx 20rpx;
	
	.list{
		overflow: hidden;
		padding-left: 10rpx;
		justify-content: flex-start;
	}
	
	.item{
		float: left;
		width: 110rpx;
		height: 110rpx;
		border-radius: 10rpx;
		margin-right: 40rpx;
		background-color: #FFF;
		
		.icon{
			width: 50rpx;
		}
		
		.text{
			font-size: 24rpx;
			margin-top: 4rpx;
		}
	}
}
.oper{
	height: 110rpx;
	padding: 0 20rpx;
	box-sizing: border-box;
	border-top: 2rpx solid #EEE;
	border-bottom: 2rpx solid #EEE;
	
	.input{
		height: 68rpx;
		line-height: 68rpx;
		padding: 0 20rpx;
		font-size: 28rpx;
		border-radius: 10rpx;
		background-color: #fff;
		width: calc(100% - 120rpx - 20rpx);
	}

	.videoChatButton {
		height: 68rpx;
		line-height: 68rpx;
		padding: 0 20rpx;
		font-size: 28rpx;
		border-radius: 10rpx;
		background-color: #fff;
		width: calc(100% - 120rpx - 20rpx);
		text-align: center;
	}
	.icon{
		width: 60rpx;
		height: 60rpx;
	}
	.btn{
		color: #fff;
		width: 90rpx;
		height: 52rpx;
		font-size: 24rpx;
		line-height: 52rpx;
		text-align: center;
		border-radius: 10rpx;
		background-color: #2BA245;
	}
}
.scrollContent{
	overflow-y: auto;
	transition: all 0.1s ease;
	height: calc(100vh - 88rpx - 110rpx - var(--status-bar-height) - 20rpx);
	
	/* #ifdef MP-WEIXIN */
	height: calc(100vh - 88rpx - var(--status-bar-height));
	/* #endif */
	/* #ifdef H5 */
	height: calc(100vh - 88rpx - 110rpx - var(--status-bar-height));
	/* #endif */
	
	.item-space{
		height: 30rpx;
	}
	
	.time{
		color: #666;
		font-size: 24rpx;
		text-align: center;
		margin-bottom: 20rpx;
	}
	
	.cancel{
		width: 100%;
		height: 40rpx;
		text-align: center;
		margin-bottom: 30rpx;
		
		.text{
			color: #999;
			font-size: 24rpx;
		}
	}
	
	.item{
		margin: 0 30rpx 30rpx;
		align-items: flex-start;
		justify-content: flex-start;
		
		.face{
			width: 80rpx;
			height: 80rpx;
			border-radius: 10rpx;
		}
		
		.content{
			color: #000;
			font-size: 32rpx;
			// min-height: 80rpx;
			border-radius: 10rpx;
			padding: 20rpx 24rpx;
			background-color: #fff;
			word-break: break-all;
			word-wrap: break-word;
			max-width: calc(100% - 100rpx - 120rpx);
			position: relative;
			
			&::before{
				content: '';
				width: 0;
				height: 0;
				border-right: 30rpx solid #FFF;
				border-top: 20rpx solid transparent;
				border-bottom: 20rpx solid transparent;
				position: absolute;
				top: 24rpx;
			}
			
			.voice-icon{
				width: 32rpx;
				height: 40rpx;
				margin-right: 180rpx;
				margin-bottom: -8rpx;
			}
		}
		
		&.left{
			.face{
				margin-right: 30rpx;
			}
			.content::before{
				left: -20rpx;
			}
		}
		
		&.right{
			flex-direction: row-reverse;
			.face{
				margin-left: 30rpx;
			}
			.content{
				background-color: #A0EA6F;
				
				&::before{
					right: -20rpx;
					transform: rotate(180deg);
					border-right: 30rpx solid #A0EA6F;
				}
				
				.voice-icon{
					margin-right: 0;
					margin-left: 180rpx;
					transform: rotate(180deg);
				}
			}
		}
	}
	
	#bottom{
		height: 0;
	}
}


// 语音
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



	.chat-voice-right {
		text-align: right;
		float: right;
		display: flex;
		align-items: center;
	}

	.chat-voice-right-inner {
		background-color: #51FF50;
	}
	.voice-img {
		width: 60rpx;
		height: 40rpx;
	}

	.trangle-right {
		width: 0;
		height: 0;
		border-top: 15rpx solid transparent;
		border-bottom: 15rpx solid transparent;
		border-left: 15rpx solid #000000;
	}
</style>