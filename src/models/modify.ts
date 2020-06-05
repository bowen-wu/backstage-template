import {ModifyModelType} from "@/components/Interface";
import {modifyInfo} from "@/services/modify";

const Modify: ModifyModelType = {
  namespace: 'modify',

  state: {
    info: {},
  },

  /** Action 处理器，处理异步动作
   dva 提供多个 effect 函数内部的处理函数，比较常用的是 call 和 put。
   call：执行异步函数
   put：发出一个 Action，类似于 dispatch
   */
  effects: {
    * modifyInfo({payload}, {call}) {
      const {modifyUrl, params = {}, method = 'POST', paramsPosition = 'data'} = payload;
      yield call(modifyInfo, modifyUrl, method, params, paramsPosition);
    },
  },

  // Action 处理器，处理同步动作，用来算出最新的 State
  reducers: {},

  // elm@0.17 的新概念，在 dom ready 后执行
  subscriptions: {},
};

export default Modify;
