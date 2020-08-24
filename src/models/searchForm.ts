import { MethodEnum, ObjectInterface, SearchFormModelType } from '@/components/Interface';
import { getOptionListInfo } from '@/services/searchForm';

const SearchForm: SearchFormModelType = {
  namespace: 'searchForm',

  state: {},

  effects: {
    *getOptionList({ payload }, { call, put }) {
      const {
        requestUrl,
        searchInfo = {},
        method = MethodEnum.GET,
        relatedFieldsPath,
        key,
        valueField,
        labelField,
      } = payload;
      const response = yield call(getOptionListInfo, requestUrl, method, searchInfo);
      yield put({
        type: 'saveOptionList',
        payload: { ...response, relatedFieldsPath, key, valueField, labelField },
      });
    },
  },

  // Action 处理器，处理同步动作，用来算出最新的 State
  reducers: {
    saveOptionList(state, action) {
      const { relatedFieldsPath, labelField, valueField } = action.payload;
      const list = relatedFieldsPath
        .split('/')
        .reduce((result: ObjectInterface, path: string) => result[path], action.payload)
        .map((item: ObjectInterface) => ({
          label: item[labelField],
          value: item[valueField],
        }));
      return {
        ...state,
        [`${action.payload.key}_option_list`]: list || [],
      };
    },
  },
};

export default SearchForm;
