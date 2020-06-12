import {MethodEnum, ObjectInterface, SearchFormModelType} from '@/components/Interface';
import {getOptionListInfo} from '@/services/searchForm';

const SearchForm: SearchFormModelType = {
  namespace: 'searchForm',

  state: {},

  effects: {
    * getOptionList({payload}, {call, put}) {
      const {requestUrl, searchInfo = {}, method = MethodEnum.GET, relatedFields, key, valueField, labelField} = payload;
      const response = yield call(getOptionListInfo, requestUrl, method, searchInfo);
      yield put({
        type: 'saveOptionList',
        payload: {...response, relatedFields, key, valueField, labelField},
      });
    },
  },

  // Action 处理器，处理同步动作，用来算出最新的 State
  reducers: {
    saveOptionList(state, action) {
      const {relatedFields, labelField, valueField} = action.payload;
      const list = action.payload[relatedFields] ? action.payload[relatedFields].map((item: ObjectInterface) => ({label: item[labelField], value: item[valueField]})) : [];
      return {
        ...state,
        [`${action.payload.key}_option_list`]: list,
      };
    },
  },

  // elm@0.17 的新概念，在 dom ready 后执行
  subscriptions: {},
};

export default SearchForm;
