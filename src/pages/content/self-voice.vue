<template>
	<view class="voice">
		<view class="voice-items">
			<view class="voice-item" v-for="item in 7" :key="item"></view>
		</view>
		<view class="voice-title">录音中...</view>
	</view>
</template>

<script>
</script>

<style lang="scss" scoped>
@keyframes voiceAnimation{
	0%{height: 10%;}
	20%{height: 50%;}
	50%{height: 100%;}
	80%{height: 50%;}
	100%{height: 0%;}
}
.voice{
	width: 320rpx;
	height: 240rpx;
	transform: translate3d(-50%, -70%, 0);
	background: rgba(0,0,0,0.5);
	border-radius: 10rpx;
	padding-top: 60rpx;
	position: fixed;
	left: 50%;
	top: 50%;
	z-index: 999;
}
.voice .voice-items{
	width: 280rpx;
	height: 80rpx;
	margin: 0 auto;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
}
.voice .voice-items .voice-item{
	width: 4rpx;
	height: 100%;
	margin: 0 6rpx;
	background-color: #CCC;
}
.voice .voice-items .voice-item:nth-child(1){
	animation: voiceAnimation 0.6s infinite 0.1s;
}
.voice .voice-items .voice-item:nth-child(2){
	animation: voiceAnimation 0.6s infinite 0.3s;
}
.voice .voice-items .voice-item:nth-child(3){
	animation: voiceAnimation 0.6s infinite 0.6s;
}
.voice .voice-items .voice-item:nth-child(4){
	animation: voiceAnimation 0.6s infinite 0.1s;
}
.voice .voice-items .voice-item:nth-child(5){
	animation: voiceAnimation 0.6s infinite 0.3s;
}
.voice .voice-items .voice-item:nth-child(6){
	animation: voiceAnimation 0.6s infinite 0.6s;
}
.voice .voice-items .voice-item:nth-child(7){
	animation: voiceAnimation 0.6s infinite 0.1s;
}
.voice .voice-title{
	color: #fff;
	font-size: 24rpx;
	margin-top: 30rpx;
	text-align: center;
}
</style>