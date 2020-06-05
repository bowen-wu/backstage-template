import { MenuDataItem } from '@ant-design/pro-layout';
import { stringify } from 'querystring';
import router from 'umi/router';
import { accountLogin, getUserPermissionsMenu, accountLogout } from '@/services/user';
import { getPageQuery } from '@/utils/utils';
import { setAuthority } from '@/utils/authority';
import { UserModelType } from '@/components/Interface';

const initState = {
  currentUser: {
    token: '',
    userName: '',
    userId: '',
    id: '',
  },
  status: {},
  userPermissionsMenu: [{ path: '' }],
};

const hideInMenuPathList = [
  '/manage_user/detail',
];

// TODO: delete childList 属性
const userPermissionsMenu = (menuList: MenuDataItem[]): MenuDataItem[] => menuList.map(item => ({
    ...item,
    children: item.childList ? userPermissionsMenu(item.childList) : [],
    hideInMenu: hideInMenuPathList.indexOf(<string>item.path) >= 0,
  }));

const hasRoutePermissions = (
  allRoutesWithPermissions: MenuDataItem[],
  readyToGoRoute: string,
): boolean =>
  allRoutesWithPermissions.some(route => {
    if (route.path === readyToGoRoute) {
      return true;
    }
    if (route.children) {
      return hasRoutePermissions(route.children, readyToGoRoute);
    }
    return false;
  });

const UserModel: UserModelType = {
  // reducer 在 combine 到 rootReducer 时的 key 值
  namespace: 'user',

  // reducer 的 initialState, Model 当前的状态
  state: initState,

  /** Action 处理器，处理异步动作
   dva 提供多个 effect 函数内部的处理函数，比较常用的是 call 和 put。
   call：执行异步函数
   put：发出一个 Action，类似于 dispatch
   */
  effects: {
    // login
    *login({ payload }, { call, put }) {
      const response = yield call(accountLogin, payload);
      // TODO: 使用 Login successfully 逻辑
      window.location.href = '/';
      return ;

      yield put({
        type: 'changeLoginStatus',
        payload: { ...response, status: response.code === 0 ? 'ok' : 'error' },
      });

      // Login successfully
      if (response.code === 0) {
        const { token: adminToken, userName: adminUserId } = response.result;
        if (window.localStorage.getItem('tokenExpired')) {
          window.localStorage.removeItem('tokenExpired');
        }
        window.localStorage.setItem('adminToken', adminToken);
        window.localStorage.setItem('adminUserId', adminUserId);
        const userPermissionsMenuResponse = yield call(getUserPermissionsMenu, {
          userId: response.result.id,
        });
        yield put({ type: 'saveCurrentUser', payload: response.result });
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params as { redirect: string };
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (
            redirectUrlParams.origin === urlParams.origin &&
            hasRoutePermissions(userPermissionsMenuResponse.result, redirectUrlParams.pathname)
          ) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }
        router.replace(redirect || '/');
      }
    },

    *getUserPermissionsMenu({ payload }, { call, put }) {
      const response = yield call(getUserPermissionsMenu, payload);
      yield put({ type: 'saveUserPermissionsMenu', payload: userPermissionsMenu(response.result) });
    },

    *logout(_, { call, put }) {
      const response = yield call(accountLogout);
      yield put({
        type: 'changeLoginStatus',
        payload: { ...response, status: response.code === 0 ? 'ok' : 'error' },
      });
      window.localStorage.clear();
      const { redirect } = getPageQuery();
      // Note: There may be security issues, please note
      if (window.location.pathname !== '/user/login' && !redirect) {
        router.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
    },
  },

  // Action 处理器，处理同步动作，用来算出最新的 State
  reducers: {
    changeLoginStatus(state, { payload }) {
      window.localStorage.setItem('currentUser', JSON.stringify(payload.result || {}));
      setAuthority(payload.result ? payload.result.userName : '');
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
    saveCurrentUser(state = initState, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    saveUserPermissionsMenu(state = initState, action) {
      // TODO: 保存 action.payload
      return {
        ...state,
        // userPermissionsMenu: action.payload || [],
        userPermissionsMenu: [],
      };
    },
  },

  // elm@0.17 的新概念，在 dom ready 后执行
  subscriptions: {},
};

export default UserModel;
