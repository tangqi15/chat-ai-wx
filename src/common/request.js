// 环境
const env = process.env.NODE_ENV;

// https://7083-210-12-115-83.ngrok-free.app
const base_url = env === 'production' ? '正式域名' : 'https://372a-210-12-115-83.ngrok-free.app';

function getToken() {
	// getStorage： 从本地缓存 异步获取指定 key 内容
	// getStorageSync: 从本地缓存  同步 获取 
	return uni.getStorageSync('token') || '';
}

function getOpenid() {
	return uni.getStorageSync('openid') || '';
}
const getNewToken = () => {
	uni.login({
		success: async (res) => {
			if (res.code) {
				const options = {
					// 登录接口  TODO
					url: ``,
					data: { code: res.code },
					success: (res) => {
						if (res.data.code === '0') {
							uni.setStorageSync('token', res.data.data.token);
							uni.setStorageSync('openid', res.data.data.openId);
							// TODO  请求未请求成功的接口数组
							// refresh();
						} else {
							uni.showToast({
								title: '登录失败,请稍后再试',
								icon: 'none',
							});
						}
					},
					fail: () => {
						uni.showToast({
							title: '登录失败，请稍等再试',
							// 不显示图标，此时 title 文本在小程序最多可显示两行。
							icon: 'none'
						})
					}
				}
				uni.request(options);
			} else {

			}
		}
	})
}

// 初始化  请求头
const reqHeaders = {
	// 缓存   max-age = 0  不缓存 与  no-cache 相同
	'Cache-Control': 'max-age=0',
	Pragma: 'no-cache',
	Accept: 'application/json',
	'Content-Type': 'application/json;charset=UTF-8',
	'x-requested-with': 'fetch',
	token: '',
	openid: '',
};

// request 封装
export default async function request(params, header = null) {
	  // eslint-disable-next-line no-param-reassign
	params.url = params.url.indexOf('http') !== -1 ? params.url : base_url + params.url;

	// 获取 token
	reqHeaders.token = getToken();
	// 获取 openid
	reqHeaders.openid = getOpenid();

	return new Promise((resolve, reject) => {
    let options = {
      url: '',
      header: reqHeaders,
      success: (res) => {
        const { data } = res;
        if (data.code === 0) {
          resolve(data.data);
        }
      },
      fail: (err) => {
        uni.showToast({
          title: '请求失败',
          icon: 'error',
        });
        reject(err);
      },
    };
    if (header) {
      options.header = Object.assign(options.header, header);
    }
    options = Object.assign(options, params);
    uni.request(options);
  });
}
