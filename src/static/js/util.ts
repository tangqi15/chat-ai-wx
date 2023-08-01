type StatusState = "success" | "loading" | "error" | "none" | "fail" | "exception";

const util = {
	loading(title='加载中'){
		uni.showLoading({ title })
	},
	toast(title = '', icon: StatusState = 'none'){
		return uni.showToast({ title, icon })
	},
	getHeader(){
		return {
			'Authorization': uni.getStorageSync('userToken')
		}
	}
}
export default util;