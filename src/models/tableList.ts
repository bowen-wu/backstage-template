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

  reducers: {
    saveTableList(state, action) {
      const tableListRelatedFields =
        action.payload.userTableListRelatedFields || basicTableListRelatedFields;
      const targetListData = tableListRelatedFields.dataPath
        .split('/')
        .reduce((result: ObjectInterface, path: string) => result[path], action.payload)
        .map((item: ObjectInterface, index: number) => ({
          ...item,
          uniqueKey: index,
        }));
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
