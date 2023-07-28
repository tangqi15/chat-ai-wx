
import request from "@/common/request";


// 用户登录 /user-service/login
export const login = () => {
  request({
    url: "/user-service/login",
    method: "POST",
  });
};

// 注册新用户  /user-service/register
export const register = () => {
  request({
    url: "/user-service/register",
    method: "POST",
  });
};

// 重新设置密码 /user-service/reset-password
export const resetPassword = () => {
  request({
    url: "/user-service/reset-password",
    method: "POST",
  });
};

// 登录  兑换商城  loginShop
export const loginShop = () => {
  request({
    url: "",
    method: "POST",
  });
}