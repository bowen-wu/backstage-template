import {MenuDataItem} from '@ant-design/pro-layout';
import {getUserPermissionsMenu, getUserInfo} from '@/services/user';
import {UserModelType} from '@/components/Interface';

const initState = {
  currentUser: {
    token: '',
    userName: '',
    userId: '',
    id: '',
  },
  status: {},
  userPermissionsMenu: [{path: ''}],
};

const hideInMenuPathList = [''];

const userPermissionsMenu = (menuList: MenuDataItem[]): MenuDataItem[] => menuList.map(item => ({
  ...item,
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
    * getUserInfo(_, {call, put}) {
      const response = yield call(getUserInfo);
      console.log('response -> ', JSON.parse(response.result));
      if (response.code === '0') {
        const token = window.localStorage.getItem('token') || '';
        yield put({type: 'saveCurrentUser', payload: {...JSON.parse(response.result), token}});
      }
    },
    * getUserPermissionsMenu({payload}, {call, put}) {
      const response = yield call(getUserPermissionsMenu, payload);
      yield put({type: 'saveUserPermissionsMenu', payload: userPermissionsMenu(response.result.menus)});
    },
  },

  // Action 处理器，处理同步动作，用来算出最新的 State
  reducers: {
    saveCurrentUser(state = initState, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    saveUserPermissionsMenu(state = initState, action) {
      return {
        ...state,
        userPermissionsMenu: action.payload || [],
      };
    },
  },

  // elm@0.17 的新概念，在 dom ready 后执行
  subscriptions: {},
};

export default UserModel;
