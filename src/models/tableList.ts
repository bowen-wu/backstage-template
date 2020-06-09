import {MethodEnum, TableListModelType, ExchangeStatusParamsPositionEnum} from "@/components/Interface";
import {exchangeTableItemActionStatus, getTableListInfo} from "@/services/tableList";

const TableList: TableListModelType = {
  namespace: 'tableList',

  state: {},

  /** Action 处理器，处理异步动作
   dva 提供多个 effect 函数内部的处理函数，比较常用的是 call 和 put。
   call：执行异步函数
   put：发出一个 Action，类似于 dispatch
   */
  effects: {
    * getTableList({payload}, {call, put}) {
      const {requestUrl, searchInfo, page, method = MethodEnum.GET} = payload;
      const response = yield call(getTableListInfo, requestUrl, method, searchInfo);
      yield put({
        type: 'saveTableList',
        payload: {...response, page},
      });
    },

    * exchangeTableItemActionStatus({payload}, {call}) {
      const {exchangeStatusUrl, params, paramsPosition = ExchangeStatusParamsPositionEnum.Params} = payload;
      yield call(exchangeTableItemActionStatus, exchangeStatusUrl, params, paramsPosition);
    },
  },

  // Action 处理器，处理同步动作，用来算出最新的 State
  reducers: {
    saveTableList(state, action) {
      return {
        ...state,
        [`${action.payload.page}_list`]: action.payload.result || [],
        [`${action.payload.page}_total`]: action.payload.total || 0,
      };
    },
  },

  // elm@0.17 的新概念，在 dom ready 后执行
  subscriptions: {},
};

export default TableList;
