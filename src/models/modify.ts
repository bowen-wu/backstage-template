import { ModifyModelType } from '@/components/Interface';
import { modifyInfo } from '@/services/modify';

const Modify: ModifyModelType = {
  namespace: 'modify',

  state: {
    info: {},
  },

  effects: {
    *modifyInfo({ payload }, { call }) {
      const { modifyUrl, params = {}, method = 'POST', paramsPosition = 'data' } = payload;
      yield call(modifyInfo, modifyUrl, method, params, paramsPosition);
    },
  },

  reducers: {},
};

export default Modify;
