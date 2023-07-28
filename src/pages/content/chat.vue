<template>
	<view class="container" @tap="togglePicker(0)">
		<!--内容-->
		<view class="scroll" :style="{height: scrollHeight}">
			<scroll-view :scroll-into-view="scrollViewId" scroll-y style="height: 100%;">
				<view class="item-space"></view>
				<!-- <view class="time">晚上 10:04</view> -->
				<view v-for="(item, index) in list" :key="index">
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
						<!--文本-->
						<view v-if="item.msgType == 'text'" @longpress="longPress(item)" class="content flex-row">{{ item.content }}</view>
						<!--图片-->
						<image v-if="item.msgType == 'image'" @longpress="longPress(item)" :src="item.content" mode="widthFix" style="width: 320rpx;"></image>
						<!--地图-->
						<view v-if="item.msgType == 'map'" class="content map" @tap="openLocation(item.content)">
							<view class="title">{{ item.content.address }}</view>
							<map class="box"
								:latitude="item.content.latitude" 
								:longitude="item.content.longitude"
								:markers="[{latitude: item.content.latitude, longitude: item.content.longitude, iconPath: '@/static/img/marker.png'}]" 
								@tap="openLocation(item.content)"
							></map>
						</view>
						<!--语音-->
						<view v-if="item.msgType == 'voice'" @tap="playVoice(item)" class="content">
							<image v-show="voicePlayingId != item.id" src="@/static/img/audio.png" class="voice-icon"></image>
							<image v-show="voicePlayingId == item.id" src="@/static/img/audio-play.gif" class="voice-icon"></image>
						</view>
					</view>
				</view>
				<view id="bottom"></view>
			</scroll-view>
		</view>
		<!--输入-->
		<view class="oper flex-row" @tap.prevent.stop="">
			<!--语音切换-->
			<image v-if="isEdit" @tap="toggleEdit(false)" src="@/static/img/voice-circle.png" class="icon"></image>
			<image v-else @tap="toggleEdit(true)" src="@/static/img/keyboard.png" class="icon"></image>
			<!--语音切换-->
			<input v-if="isEdit" @focus="inputFocus" :focus="isFocus" :cursor-spacing="8" :adjust-position="false" type="text" v-model="content" class="input" placeholder="请输入内容"/>
			<view v-else @touchstart="startVoice" @touchend="endVoice" class="input" style="text-align: center;">按住 说话</view>
			<!--表情-->
			<image @tap="togglePicker(200, 'emoji')" src="@/static/img/emoji.png" class="icon"></image>
			<!--发送-->
			<view @touchend.prevent="send" v-show="content" class="btn">发送</view>
			<!--附件-->
			<image @tap="togglePicker(86, 'file')" v-show="!content" src="@/static/img/add.png" class="icon"></image>
		</view>
		<!--表情-->
		<view v-show="showEmoji" class="emoji" @tap.prevent.stop="">
			<view class="list">
				<view class="item" @tap="content += item" v-for="(item, index) in emojis" :key="index">{{ item }}</view>
			</view>
		</view>
		<!--附件-->
		<view v-show="showFile" class="file" @tap.prevent.stop="">
			<view class="list flex-row">
				<view class="item flex-column" @tap="uploadImage(['album'])">
					<image src="@/static/img/album.png" mode="widthFix" class="icon"></image>
					<view class="text">相册</view>
				</view>
				<view class="item flex-column" @tap="uploadImage(['camera'])">
					<image src="@/static/img/photo.png" mode="widthFix" class="icon"></image>
					<view class="text">拍照</view>
				</view>
				<view class="item flex-column" @tap="getLocation">
					<image src="@/static/img/location.png" mode="widthFix" class="icon"></image>
					<view class="text">位置</view>
				</view>
			</view>
		</view>
		<!--语音-->
		<my-voice v-show="showVoice"></my-voice>
	</view>
</template>

<script>
import myVoice from './self-voice.vue'
import util from '@/static/js/util'
import { postMessage } from '@/network/chat';
const innerAudioContext = uni.createInnerAudioContext()
const recorderManager = uni.getRecorderManager()
export default{
	components: { myVoice },
	data(){
		return {
			util,
			emojis: [],
			isEdit: true,
			isFocus: false,
			showEmoji: false,
			showFile: false,
			showVoice: false,
			scrollHeight: 'auto',		// 内容区域高度
			statusBarHeight: 0,		// 状态栏高度
			scrollViewId: '',		// 滚动到最底部
			voicePlayingId: '',		// 正在播放的消息ID
			content: '',
			list: [],
			socketOpen: false,
			socketMsgQueue: [],
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
		recorderManager.onStop(res => {
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
		this.emojis = ['😀','😃','😄','😁','😆','😅','🤣','😂','🙂','🙃','😉','😊','😇','🥰','😍','🤩','😘','😗']
		
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
	onBackPress(){
		if(this.showFile || this.showEmoji){
			this.showFile = false
			this.showEmoji = false
			this.setScrollHeight(0)
			return true
		}
		return false
	},
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
		// 监听输入聚焦
		inputFocus(e){
			this.setScrollHeight(e.detail.height)
			this.initScrollBar()
			
			uni.onKeyboardHeightChange(res=>{
				this.setScrollHeight(res.height)
				this.initScrollBar()
			})
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
		// 切换语音与编辑
		toggleEdit(bool){
			this.isEdit = bool
			this.isFocus = bool
			this.setScrollHeight(0)
		},
		// 开始录音
		startVoice(){
			this.showVoice = true
			recorderManager.start()
		},
		// 结束录音
		endVoice(){
			this.showVoice = false
			recorderManager.stop()
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
				this.voicePlayingId = item.id
				innerAudioContext.src = item.content
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
			
			uni.sendSocketMessage({
				data: JSON.stringify(data),
				success: res=>{
					// 撤销本地消息
					this.list = this.list.map(item=>{
						item.type = item.id == msg.id ? 'cancel' : item.type
						return item
					})
				}
			})
		},
		// 获取位置
		getLocation(){
			uni.getLocation({
				success: res=>{
					let { latitude,longitude } = res
					uni.chooseLocation({
						latitude,
						longitude,
						success: chooseRes=>{
							this.pushMessage(JSON.stringify(chooseRes), 'map')
						}
					})
				}
			})
		},
		// 打开位置
		openLocation(content){
			let { latitude,longitude } = JSON.parse(content)
			uni.openLocation({ latitude, longitude })
		},
		// 发送图片
		uploadImage(sourceType = ['album']){
			uni.chooseImage({
				sourceType,
				success: chooseImageRes=>{
					const tempFilePaths = chooseImageRes.tempFilePaths;
					
					tempFilePaths.forEach(temp=>{
						this.util.loading('上传中')
						uni.uploadFile({
							url: this.upload,
							filePath: temp,
							formData: {
								userId: this.fromUserId
							},
							name: 'file',
							header: this.util.getHeader(),
							success: uploadRes=>{
								uni.hideLoading()
								let data = JSON.parse(uploadRes.data)
								this.pushMessage(data.data, 'image')
							},
							fail: err=>{
								uni.hideLoading()
							}
						})
					})
				}
			})
		},
		// 发送消息
		send(){
			this.pushMessage(this.content, 'text', ()=>{
				this.content = ''
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
			// 发送消息
			postMessage(apiUrl);
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
		justify-content: space-between;
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
		width: calc(100% - 120rpx - 20rpx - 40rpx - 60rpx);
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
.scroll{
	overflow-y: auto;
	transition: all 0.1s ease;
	height: calc(100vh - 88rpx - 110rpx - var(--status-bar-height));
	
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
</style>