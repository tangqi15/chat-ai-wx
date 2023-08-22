import { MutationTree, GetterTree, Module } from 'vuex';
import { RootState } from '../rootType';
interface UserInfo {
  userBasicInfo: object;
}

const state: UserInfo = {
  userBasicInfo: {},
};

const mutations: MutationTree<UserInfo> = {
  // 设置用户基本信息
  setUserBasicInfo(state, data) {
    state.userBasicInfo = data;
  },
};

const getters: GetterTree<UserInfo, RootState> = {
  userBasicInfo: (state: UserInfo) => state.userBasicInfo,
};

const userInfo: Module<UserInfo, RootState> = {
  state,
  mutations,
  getters,
};

export default userInfo;
