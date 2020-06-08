import { Effect } from 'dva';
import { Dispatch, AnyAction, Reducer } from 'redux';
import { MenuDataItem, BasicLayoutProps as ProLayoutProps } from '@ant-design/pro-layout';

export enum ButtonType {
  Primary = 'primary',
  Link = 'link',
  Default = 'default',
  Ghost = 'ghost',
  Dashed = 'dashed',
  Danger = 'danger',
}

export enum MethodEnum {
  POST = 'post',
  GET = 'get',
}

export enum SearchItemControlType {
  Input = 'input',
  Select = 'select',
  RangePicker = 'rangePicker',
  MonthPicker = 'monthPicker',
}

export enum ExchangeStatusParamsPositionEnum {
  Params = 'params',
  Data = 'data',
}

export interface SpanItemInterface {
  input: number;
  select: number;
  RangePicker: number;
  MonthPicker: number;
  action: number;
  actionOffset: number;
}

export interface ExtraActionItemInterface {
  type: ButtonType;
  text: string;
  id: string;
}

export interface BasicInformationInterface {
  title: string;
  pictureLabel: string;
  picSrc?: string;
  contentArr: Array<any>;
  extraActions?: Array<ExtraActionItemInterface>;
}

export interface ItemInterface {
  label: string;
  text: string;
  wrap?: boolean;
}

export interface ExtraInfoInterface {
  title: object | string;
}

export interface ActionInterface {
  key: string;
  text: string;
}

export interface SearchActionInterface extends ActionInterface {
  type: ButtonType;
}

export interface TableActionInterface extends ActionInterface {
  type: ButtonType | string;
  route?: string;
  status?: object;
  depend?: string;
  extraInfo?: ExtraInfoInterface;
  exchangeStatusUrl: string;
  exchangeStatusKey: string;
  exchangeStatusParamsPosition?: ExchangeStatusParamsPositionEnum;
  exchangeStatusParamsKeyObj: object;
  exchangeStatusObj?: object;
}

export interface PageSearchInfoInterface {
  pageNum: number;
  pageSize: number;
  [propsName: string]: number | string;
}

export interface PropsInterface {
  page: string;
  total?: number;
  dataSource?: Array<any>;
  pageChangeHandle?: (currentPage: number, pageSize: number | undefined) => void;
}

export interface TablePropsInterface extends PropsInterface {
  actionsHandle?: (action: TableActionInterface, searchInfo: object, record?: any) => void;
  onRowSelectionChange?: (selectedRows: Array<ObjectInterface>) => void;
}

export interface SearchPropsInterface extends PropsInterface {
  actionsHandle?: (action: SearchActionInterface, searchInfo: object, record?: any) => void;
}

export interface LoginParamsType {
  userName: string;
  password: string;
}

export interface StateType {
  status?: 'ok' | 'error';
  type?: string;
  currentAuthority?: 'user' | 'guest' | 'admin';
}

export interface CurrentUser {
  token: string;
  userName: string;
  userId: string;
  id: string;

  avatar?: string;
  name?: string;
  title?: string;
  group?: string;
  signature?: string;
  tags?: {
    key: string;
    label: string;
  }[];
  unreadCount?: number;
}

export interface HomeInfo {
  userCount: number;
  orderCount: number;
  pusCount: number;
}

export interface UserModelState {
  currentUser: CurrentUser;
  status: StateType;
  userPermissionsMenu: MenuDataItem[];
  homeInfo?: HomeInfo;
}

export interface ObjectInterface {
  [propsName: string]: any;
}

export interface TableListModelState {
  // TODO: 需要增加 total 和 list
  //   manage_user_total?: number;
  //   manage_user_list?: Array<any>;
}

export interface SearchFormModelState {
  // TODO: 需要增加 list
  //    manage_user_list?: Array<any>;
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    login: Effect;
    logout: Effect;
    getUserPermissionsMenu: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<UserModelState>;
    changeLoginStatus: Reducer<StateType>;
    saveUserPermissionsMenu: Reducer<UserModelState>;
  };
  subscriptions?: object;
}

export interface TableListModelType {
  namespace: 'tableList';
  state: TableListModelState;
  effects: {
    getTableList: Effect;
    exchangeTableItemActionStatus: Effect;
  };
  reducers: {
    saveTableList: Reducer<TableListModelState>;
  };
  subscriptions?: object;
}

export interface SearchFormModelType {
  namespace: 'searchForm';
  state: SearchFormModelState;
  effects: {
    getOptionList: Effect;
  };
  reducers: {
    saveOptionList: Reducer<SearchFormModelState>;
  };
  subscriptions?: object;
}

export interface getUserPermissionsMenuParams {
  userId: string;
}

export interface CommodityDetailInterface {
  goodsDetailList: Array<any>;
}

// TODO: 继承那个 Props???
export interface PagePropsInterface extends ProLayoutProps {
  dispatch: Dispatch<AnyAction>;
  tableList?: TableListModelState;
  detailInfo?: CommodityDetailInterface;
  user?: UserModelState;
  details?: DetailsModelState;
  global?: GlobalModelState;
}

export interface UploadFilePropInterface extends PagePropsInterface {
  uploadSuccess: (url: string) => void;
  isInit: boolean;
  defaultValue?: string;
  global: GlobalModelState;
}

export interface ExchangeTableItemActionStatusInterface {}

export interface PageInfoInterface {
  name: string;
  title: string;
}

export interface PageBasicPropsInterface {
  page: string;
  tableList: TableListModelState;
  hasSearchForm?: boolean;
  extraSearchInfo?: object;
  actionsHandle?: (action: ActionInterface, record: any) => void;
  searchActionsHandle?: (action: ActionInterface) => void;
  onRowSelectionChange?: (selectedRows: Array<ObjectInterface>) => void;
  refresh?: Boolean;
  dispatch: Dispatch;
}

export interface TableColumnInterface {
  title: string;
  dataIndex: string;
  key: string;
  render?: (text: any, record: any, index: number) => void;
}

export interface DetailsModelState {
  info: ObjectInterface;
}

export interface DetailsModelType {
  namespace: 'details';
  state: DetailsModelState;
  effects: {
    getInfo: Effect;
  };
  reducers: {
    saveInfo: Reducer<DetailsModelState>;
  };
  subscriptions?: object;
}

export interface ModifyModelState {}

export interface ModifyModelType {
  namespace: 'modify';
  state: ModifyModelState;
  effects: {
    modifyInfo: Effect;
  };
  reducers: {};
  subscriptions?: object;
}

export interface PersonAllAuthorizedMenuInterface extends MenuDataItem {
  id: number;
}

export interface GlobalModelState {
  uploadFileUrl: string;
  collapsed: boolean;
  allRoleList: Array<ObjectInterface>;
  personAllAuthorizedMenu: PersonAllAuthorizedMenuInterface[];
  allLabelList: Array<ObjectInterface>;
}

export interface GlobalModelType {
  namespace: 'global';
  state: GlobalModelState;
  effects: {
    uploadFile: Effect;
    resetAccountPassword: Effect;
    getPersonAllAuthorizedMenu: Effect;
  };
  reducers: {
    saveUploadFileUrl: Reducer<GlobalModelState>;
    initUploadFileUrl: Reducer<GlobalModelState>;
    changeLayoutCollapsed: Reducer<GlobalModelState>;
    savePersonAllAuthorizedMenu: Reducer<GlobalModelState>;
  };
  subscriptions: {};
}

export interface RichTextEditorPropsInterface {
  title: string;
  htmlContent: string;
  saveEditorContentHandle: (htmlContent: string) => void;
}

export interface ZoomPicturePropsInterface {
  pictureSrc: string;
  onCancelHandle?: () => void;
}
