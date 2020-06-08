import {SearchFormModelType} from "@/components/Interface";
import {getOptionListInfo} from "@/services/searchForm";

const SearchForm: SearchFormModelType = {
  namespace: 'searchForm',

  state: {},

  effects: {
    * getOptionList({payload}, {call, put}) {
      const {requestUrl, searchInfo, page, method = 'GET'} = payload;
      const response = yield call(getOptionListInfo, requestUrl, method, searchInfo);
      yield put({
        type: 'saveOptionList',
        payload: {...response, page},
      });
    },
  },

  // Action 处理器，处理同步动作，用来算出最新的 State
  reducers: {
    saveOptionList(state, action) {
      return {
        ...state,
        [`${action.payload.page}_list`]: action.payload.result || [],
      };
    },
  },

  // elm@0.17 的新概念，在 dom ready 后执行
  subscriptions: {},
};

export default SearchForm;
