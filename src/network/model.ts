import request from "@/common/request";

// 模型相关接口

// 新增模型   addModel
export const addModel = () => {
  request({
    url: "/chat/model-prompt/add-model",
    method: "POST",
  });
};



// 更新模型   startChat
export const updateModel = () => {
  request({
    url: "/chat/model-prompt/update-model",
    method: "POST",
  });
};
