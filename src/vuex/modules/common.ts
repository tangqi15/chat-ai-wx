import { MutationTree, ActionTree, GetterTree, Module } from 'vuex';
import { RootState, CommonState } from '../rootType';

const state: CommonState = {
  userState: {},
};

const actions: ActionTree<CommonState, RootState> = {

};

const mutations: MutationTree<CommonState> = {
}

const getters: GetterTree<CommonState, RootState> = {
  userState: (state: CommonState) => state.userState,
};



const common: Module<CommonState, RootState> = {
  state,
  mutations,
  actions,
  getters,
};

export default common;
