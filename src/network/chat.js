import request from '@/common/request';

// export const lineEditCommit = (params: any) =>
export const upload = (params) =>
  request({
    // url: '/api/miniprogram/edit/commitTask',
    url: '/api/miniprogram/recovery/commit',
    data: params,
    method: 'POST',
  });

  export const postMessage = (params) =>
    request({
      // url: '/api/miniprogram/edit/commitTask',
      url: '/api/miniprogram/recovery/commit',
      data: params,
      method: 'POST',
    });