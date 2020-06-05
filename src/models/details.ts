import { DetailsModelType } from '@/components/Interface';
import { getDetailsInfo } from '@/services/details';

const Details: DetailsModelType = {
  namespace: 'details',

  state: {
    info: {},
  },

  /** Action 处理器，处理异步动作
   dva 提供多个 effect 函数内部的处理函数，比较常用的是 call 和 put。
   call：执行异步函数
   put：发出一个 Action，类似于 dispatch
   */
  effects: {
    *getInfo({ payload }, { call, put }) {
      const { detailsUrl, params = {}, method = 'GET', paramsPosition = 'params' } = payload;
      const response = yield call(getDetailsInfo, detailsUrl, method, params, paramsPosition);
      yield put({
        type: 'saveInfo',
        payload: { ...response },
      });
    },
  },

  // Action 处理器，处理同步动作，用来算出最新的 State
  reducers: {
    saveInfo(state, action) {
      return {
        ...state,
        info: action.payload.result,
      };
    },
  },

  // elm@0.17 的新概念，在 dom ready 后执行
  subscriptions: {},
};

export default Details;
