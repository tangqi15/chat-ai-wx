const env = process.env.NODE_ENV;


const app = 'https://4ec1-210-12-115-79.ngrok-free.app';
const baseUrl = env === "production" ? "url1" : app;

const upload = function (url: string) {
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: `${baseUrl}/upload/update-voice-file`,
      filePath: url,
      name: 'file',
      header: { token: uni.getStorageSync('token') },
      success: (res: any) => {
        const data: any = JSON.parse(res.data);
        console.log(data, 'data');
        if (data.code !== 0) {
          uni.showToast({
            title: '文件上传失败',
            icon: 'error',
          });
          reject(data.data);
        } else {
          resolve(data.data);
        }
      },
    });
  });
};

export default upload;
