import request from "@/common/request";

// export const lineEditCommit = (params: any) =>
export const upload = (params) =>
  request({
    url: "/api/miniprogram/recovery/commit",
    data: params,
    method: "POST",
  });

// 聊天发送信息
export const postMessage = (params) =>
  request({
    url: "",
    data: params,
    method: "POSt",
  });

//  所有音频(获取所有 微软)
export const getAllVoice = () => {
  request({
    url: "/voice/all-voice",
    method: "GET",
  });
};
// 查询聊天记录
export const getChatHistory = () => {
  request({
    url: "/chat/find-chat-history",
    method: "POST",
  });
};

// 开启聊天   startChat
export const startChat = () => {
  request({
    url: "/chat/start-chat",
    method: "POST",
  });
};


