import { Effect } from 'dva';
import { Reducer } from 'redux';
import {iAmRequest} from "@/services/history";

export interface HistoryModelState {
  sumInfo: object;
}

interface HistoryInterface {
  namespace: 'history';
  state: HistoryModelState;
  effects: {
    getSumInfo: Effect;
  };
  reducers: {
    saveSumInfo: Reducer<HistoryModelState>
  };
}

const History: HistoryInterface = {
  namespace: 'history',

  state: {
    sumInfo: {},
  },

  /** Action 处理器，处理异步动作
   dva 提供多个 effect 函数内部的处理函数，比较常用的是 call 和 put。
   call：执行异步函数
   put：发出一个 Action，类似于 dispatch
   */
  effects: {
    * getSumInfo({payload}, {call, put}) {
      const {a} = payload;
      const res = yield call(iAmRequest, a);
      console.log('res -> ', res);
      yield put({
        type: 'saveSumInfo',
        payload: {...res}
      })
    }
  },

  // Action 处理器，处理同步动作，用来算出最新的 State
  reducers: {
    saveSumInfo(state, action) {
      return {
        ...state,
        sumInfo: action.payload.data,
      }
    }
  },
};

export default History;
