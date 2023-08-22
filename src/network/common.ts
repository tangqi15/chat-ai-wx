import request from '@/common/request';

/**
 * 小程序登录
 */

export interface LoginParams {
  code: string;
}

// TODO
export const login = (params: LoginParams) =>
  request({
    url: '/',
    data: params,
  });