import { RequestParams, ResponseData } from "./type";

// 环境
const env = process.env.NODE_ENV;

const app = 'https://4ec1-210-12-115-79.ngrok-free.app';
const baseUrl = env === "production" ? "url1" : app;

function getToken() {
  // getStorage： 从本地缓存 异步获取指定 key 内容
  // getStorageSync: 从本地缓存  同步 获取
  return uni.getStorageSync("token") || "";
}

function getOpenid() {
  return uni.getStorageSync("openid") || "";
}
const getNewToken = () => {
  uni.login({
    success: async (res) => {
      if (res.code) {
        const options: any = {
          // 登录接口  TODO
          url: ``,
          data: { code: res.code },
          success: (res: ResponseData) => {
            if (res.data.code === "0") {
              uni.setStorageSync("token", res.data.data.token);
              uni.setStorageSync("openid", res.data.data.openId);
              // TODO  请求未请求成功的接口数组
              // refresh();
            } else {
              uni.showToast({
                title: "登录失败,请稍后再试",
                icon: "none",
              });
            }
          },
          fail: () => {
            uni.showToast({
              title: "登录失败，请稍等再试",
              // 不显示图标，此时 title 文本在小程序最多可显示两行。
              icon: "none",
            });
          },
        };
        uni.request(options);
      }
    },
  });
};

// 初始化  请求头
const reqHeaders = {
  // 缓存   max-age = 0  不缓存 与  no-cache 相同
  "Cache-Control": "max-age=0",
  Pragma: "no-cache",
  Accept: "application/json",
  "Content-Type": "application/json;charset=UTF-8",
  "x-requested-with": "fetch",
  token: "",
  openid: "",
};

// request 封装
export default async function request(params: RequestParams) {
  // eslint-disable-next-line no-param-reassign
  params.url =
    params.url.indexOf("http") !== -1 ? params.url : baseUrl + params.url;

  // 获取 token
  reqHeaders.token = getToken();
  // 获取 openid
  reqHeaders.openid = getOpenid();

  // 请求为什么要往  Promise 里面放
  return new Promise((resolve, reject) => {
    let options: any = {
      url: "",
      header: reqHeaders,
      success: (res: ResponseData) => {
        const { data } = res;
        // 成功
        if (data.code === "0") {
          resolve(data.data);
        } else if (data.status === 0) {
          resolve(data.result);
        } else if (data.code === "10000") {
          // 未登录、登录失败
          // 未请求成功接口缓存， 重新登录， 重新进行接口请求。  调用了好几个接口，重新登录重新请求。
          // TODO

          // 登录
          getNewToken();
        }
      },
      fail: (err: ResponseData) => {
        uni.showToast({
          title: "请求失败",
          icon: "error",
        });
        reject(err);
      },
    };

    options = Object.assign(options, params);
    uni.request(options);
  });
}
