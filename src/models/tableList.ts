import { MethodEnum, ObjectInterface, TableListModelType } from '@/components/Interface';
import { getTableListInfo } from '@/services/tableList';

const basicTableListRelatedFields = {
  total: 'total',
  data: 'data',
  list: 'list',
};

const TableList: TableListModelType = {
  namespace: 'tableList',

  state: {},

  /** Action 处理器，处理异步动作
   dva 提供多个 effect 函数内部的处理函数，比较常用的是 call 和 put。
   call：执行异步函数
   put：发出一个 Action，类似于 dispatch
   */
  effects: {
    *getTableList({ payload }, { call, put }) {
      const {
        requestUrl,
        searchInfo,
        page,
        method = MethodEnum.GET,
        tableListRelatedFields: userTableListRelatedFields,
      } = payload;
      const response = yield call(getTableListInfo, requestUrl, method, searchInfo);
      yield put({
        type: 'saveTableList',
        payload: { ...response, page, userTableListRelatedFields },
      });
    },
  },

  // Action 处理器，处理同步动作，用来算出最新的 State
  reducers: {
    saveTableList(state, action) {
      const tableListRelatedFields =
        action.payload.userTableListRelatedFields || basicTableListRelatedFields;
      const targetListData = tableListRelatedFields.dataPath
        .split('/')
        .reduce((result: ObjectInterface, path: string) => result[path], action.payload);
      const targetDataTotal = tableListRelatedFields.totalPath
        .split('/')
        .reduce((result: ObjectInterface, path: string) => result[path], action.payload);
      return {
        ...state,
        [`${action.payload.page}_list`]: targetListData || [],
        [`${action.payload.page}_total`]: targetDataTotal || 0,
      };
    },
  },
};

export default TableList;
