import { AnyAction } from 'redux';
import { MenuDataItem } from '@ant-design/pro-layout';
import { RouterTypes } from 'umi';
import { DefaultSettings as SettingModelState } from '../../config/defaultSettings';
import {
  DetailsModelState,
  StateType,
  TableListModelState,
  UserModelState,
  GlobalModelState,
  SearchFormModelState,
} from '@/components/Interface';
import { AuditQueueState } from './auditQueue';
import { WorkingScheduleState } from './workingSchedule';

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
  searchForm: SearchFormModelState,
  details: DetailsModelState;
  auditQueueState: AuditQueueState;
  workingScheduleState: WorkingScheduleState;
  history: HistoryModelState;
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
