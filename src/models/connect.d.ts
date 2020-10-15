import { MenuDataItem } from '@ant-design/pro-layout';
import { RouterTypes } from 'umi';
import {
  StateType,
  TableListModelState,
  UserModelState,
  GlobalModelState,
  SearchFormModelState,
} from '@/components/Interface';

import { DragState } from '@/models/drag';
import { DefaultSettings as SettingModelState } from '../../config/defaultSettings';

export { GlobalModelState, SettingModelState, UserModelState };

export interface Loading {
  global: boolean;
  effects: { [key: string]: boolean | undefined };
  models: {
    global?: boolean;
    menu?: boolean;
    setting?: boolean;
    user?: boolean;
    login?: boolean;
  };
}

export interface ConnectState {
  global: GlobalModelState;
  loading: Loading;
  settings: SettingModelState;
  user: UserModelState;
  login: StateType;
  tableList: TableListModelState;
  searchForm: SearchFormModelState;
  dragState: DragState;
}

export interface Route extends MenuDataItem {
  routes?: Route[];
}

/**
 * @type T: Params matched in dynamic routing
 */
export interface ConnectProps<T = {}> extends Partial<RouterTypes<Route, T>> {
  dispatch?: Dispatch<AnyAction>;
}
