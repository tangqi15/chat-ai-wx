import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import { RootState } from './rootType';

Vue.use(Vuex);

const files = (require as any).context('./modules', true, /\.ts$/);

const modules: StoreOptions<RootState> = {
  state: {
    systemInfo: {},
  },
  mutations: {
    setSystemInfo(state, data) {
      state.systemInfo = data;
    },
  },
  actions: {},
  getters: {
    systemInfo: (state) => state.systemInfo,
  },
};

files.keys().forEach((key: string) => {
  Object.assign(modules.state, files(key).default.state);
  Object.assign(modules.mutations, files(key).default.mutations);
  Object.assign(modules.actions, files(key).default.actions);
  Object.assign(modules.getters, files(key).default.getters);
});

export default new Vuex.Store<RootState>(modules);
