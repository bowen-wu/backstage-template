import { GlobalModelType } from '@/components/Interface';
import { getPersonAllAuthorizedMenu, resetAccountPassword, uploadFile } from '@/services/global';

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
      const { userId } = payload;
      const response = yield call(getPersonAllAuthorizedMenu, { userId });
      yield put({
        type: 'savePersonAllAuthorizedMenu',
        payload: { ...response },
      });
    },
  },

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
};

export default GlobalModel;
