import {Effect} from 'dva';
import {Reducer} from 'redux';
import {CascaderOptionType} from 'antd/lib/cascader';
import {getAuditResult, getAuditResultFirst, getAuditResultSecond, iAmRequest} from '@/services/history';
import {ObjectInterface} from "@/components/Interface";

export interface HistoryModelState {
  sumInfo: object;
  auditStatusAndResult: CascaderOptionType[];
}

interface HistoryInterface {
  namespace: 'history';
  state: HistoryModelState;
  effects: {
    getSumInfo: Effect;
    getAuditResult: Effect;
    getAuditResultFirst: Effect;
    getAuditResultSecond: Effect;
  };
  reducers: {
    saveSumInfo: Reducer<HistoryModelState>;
    saveAuditStatusAndResult: Reducer<HistoryModelState>;
  };
}

const initState = {
  sumInfo: {},
  auditStatusAndResult: [],
};

const History: HistoryInterface = {
  namespace: 'history',

  state: initState,

  /** Action 处理器，处理异步动作
   dva 提供多个 effect 函数内部的处理函数，比较常用的是 call 和 put。
   call：执行异步函数
   put：发出一个 Action，类似于 dispatch
   */
  effects: {
    * getSumInfo({payload}, {call, put}) {
      const {a} = payload;
      const res = yield call(iAmRequest, a);
      yield put({
        type: 'saveSumInfo',
        payload: {...res},
      });
    },

    * getAuditResult(_, {call, put}) {
      const res = yield call(getAuditResult);
      yield put({
        type: 'saveAuditStatusAndResult',
        payload: {type: 'result', data: res.data},
      });
    },

    * getAuditResultFirst(_, {call, put}) {
      const res = yield call(getAuditResultFirst);
      yield put({
        type: 'saveAuditStatusAndResult',
        payload: {type: 'first', data: res.data},
      });
    },

    * getAuditResultSecond(_, {call, put}) {
      const res = yield call(getAuditResultSecond);
      yield put({
        type: 'saveAuditStatusAndResult',
        payload: {type: 'second', data: res.data},
      });
    },
  },

  // Action 处理器，处理同步动作，用来算出最新的 State
  reducers: {
    saveSumInfo(state = initState, action) {
      return {
        ...state,
        sumInfo: action.payload.data,
      };
    },
    saveAuditStatusAndResult(state = initState, action) {
      const auditStatusAndResult = (() => {
        const array = action.payload.data.map((item: ObjectInterface) => ({value: item.code, label: item.desc}));
        switch (action.payload.type) {
          case 'result':
            return array.map((item: ObjectInterface) => ({...item, isLeaf: false}));
          case 'first':
            return state.auditStatusAndResult.map(item => ({
              ...item,
              children: array.map((item: ObjectInterface) => ({...item, isLeaf: false})),
              isLeaf: false,
            }));
          case 'second':
            return state.auditStatusAndResult.map((item: CascaderOptionType) => {
              const firstArray = item.children ? item.children.map((secondItem: CascaderOptionType) => ({
                ...secondItem,
                children: array.map((item: ObjectInterface) => ({...item, isLeaf: true})),
                isLeaf: false,
              })) : [];
              return {
                ...item,
                children: firstArray,
              }
            });
        }
      })();
      return {
        ...state,
        auditStatusAndResult
      };
    }
  },
};

export default History;
