import { GlobalModelType } from '@/components/Interface';
import {
  getPersonAllAuthorizedMenu,
  resetAccountPassword,
  uploadFile,
} from '@/services/global';

const initState = {
  uploadFileUrl: '',
  collapsed: true,
  allRoleList: [],
  personAllAuthorizedMenu: [{ path: '', id: 0 }],
  allLabelList: [],
};

const GlobalModel: GlobalModelType = {
  namespace: 'global',

  state: initState,

  /** Action 处理器，处理异步动作
   dva 提供多个 effect 函数内部的处理函数，比较常用的是 call 和 put。
   call：执行异步函数
   put：发出一个 Action，类似于 dispatch
   */
  effects: {
    *uploadFile({ payload }, { call, put }) {
      const { data } = payload;
      const response = yield call(uploadFile, data);
      yield put({
        type: 'saveUploadFileUrl',
        payload: { ...response },
      });
    },
    *resetAccountPassword({ payload }, { call }) {
      const { id } = payload;
      yield call(resetAccountPassword, { id });
    },

    *getPersonAllAuthorizedMenu({ payload }, { call, put }) {
      console.log('global');
      const { userId } = payload;
      const response = yield call(getPersonAllAuthorizedMenu, { userId });
      yield put({
        type: 'savePersonAllAuthorizedMenu',
        payload: { ...response },
      });
    },
  },

  // Action 处理器，处理同步动作，用来算出最新的 State
  reducers: {
    changeLayoutCollapsed(state = initState, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    saveUploadFileUrl(state = initState, { payload }) {
      return {
        ...state,
        uploadFileUrl: payload.result,
      };
    },
    initUploadFileUrl(state = initState) {
      return {
        ...state,
        uploadFileUrl: '',
      };
    },
    savePersonAllAuthorizedMenu(state = initState, { payload }) {
      return {
        ...state,
        personAllAuthorizedMenu: payload.result,
      };
    },
  },

  // elm@0.17 的新概念，在 dom ready 后执行
  subscriptions: {},
};

export default GlobalModel;
