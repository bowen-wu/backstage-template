import { MenuDataItem } from '@ant-design/pro-layout';
import { getUserPermissionsMenu, getUserInfo, accountLogin } from '@/services/user';
import { getPageQuery } from '@/utils/utils';
import { history } from 'umi';
import { setAuthority } from '@/utils/authority';
import { Effect, Reducer } from '@@/plugin-dva/connect';

export interface StateType {
  status?: 'ok' | 'error';
  type?: string;
  currentAuthority?: 'user' | 'guest' | 'admin';
}

export interface CurrentUser {
  token: string;
  username: string;

  avatar?: string;
}

export interface UserModelState {
  currentUser: CurrentUser;
  status: StateType;
  userPermissionsMenu: MenuDataItem[];
  userAuthButtonList?: string[];
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    getUserPermissionsMenu: Effect;
    getUserInfo: Effect;
    login: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<UserModelState>;
    saveUserPermissionsMenu: Reducer<UserModelState>;
  };
}

const initState = {
  currentUser: {
    token: '',
    username: '',
    userId: '',
    id: '',
    role: '',
  },
  status: {},
  userPermissionsMenu: [{ path: '' }],
};

const hideInMenuPathList = [''];

const userPermissionsMenu = (menuList: MenuDataItem[]): MenuDataItem[] =>
  menuList.map(item => ({
    ...item,
    hideInMenu: hideInMenuPathList.indexOf(<string>item.path) >= 0,
  }));

const UserModel: UserModelType = {
  namespace: 'user',

  state: initState,

  effects: {
    *login({ payload }, { call, put }) {
      if (FAKE_LOGIN) {
        const token = 'fake_token';
        yield put({
          type: 'saveCurrentUser',
          payload: { currentUser: { [`${TOKEN_FIELD}`]: token, username: payload.username } },
        });
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params as { redirect: string };
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
          }
        }
        history.replace(redirect || '/');
        return;
      }
      const response = yield call(accountLogin, { ...payload });
      if (response.code === REQUEST_SUCCESS_CODE) {
        const token =
          response[REQUEST_SUCCESS_CODE].token || window.localStorage.getItem('token') || '';
        yield put({
          type: 'saveCurrentUser',
          payload: {
            currentUser: {
              username: payload.username,
              ...JSON.parse(response[RESPONSE_DATA_FIELD]),
              [`${TOKEN_FIELD}`]: token,
            },
          },
        });
      }
    },
    *getUserInfo(_, { call, put }) {
      const response = yield call(getUserInfo);
      if (response.code === REQUEST_SUCCESS_CODE) {
        const token = window.localStorage.getItem('token') || '';
        yield put({
          type: 'saveCurrentUser',
          payload: { ...JSON.parse(response[RESPONSE_DATA_FIELD]), token },
        });
      }
    },
    *getUserPermissionsMenu({ payload }, { call, put }) {
      const response = yield call(getUserPermissionsMenu, payload);
      yield put({
        type: 'saveUserPermissionsMenu',
        payload: userPermissionsMenu(response[RESPONSE_DATA_FIELD].menus),
      });
    },
  },

  reducers: {
    saveCurrentUser(state = initState, { payload }) {
      window.localStorage.setItem('currentUser', JSON.stringify(payload.currentUser || {}));
      setAuthority(payload.currentUser ? payload.currentUser.username : '');
      return {
        ...state,
        currentUser: payload.currentUser || {},
      };
    },
    saveUserPermissionsMenu(state = initState, action) {
      return {
        ...state,
        userPermissionsMenu: action.payload || [],
      };
    },
  },
};

export default UserModel;
