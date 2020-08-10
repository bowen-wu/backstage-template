import { Effect } from 'dva';
import { Dispatch, AnyAction, Reducer } from 'redux';
import { CascaderOptionType } from 'antd/lib/cascader';
import { ButtonType } from 'antd/lib/button';
import { MenuDataItem, BasicLayoutProps as ProLayoutProps } from '@ant-design/pro-layout';

export enum MethodEnum {
  POST = 'post',
  GET = 'get',
  DELETE = 'delete', // delete与get参数放在query中
  PUT = 'put', // put与post参数放在body中
}

export enum SearchItemControlType {
  Input = 'input',
  Select = 'select',
  RangePicker = 'rangePicker',
  MonthPicker = 'monthPicker',
  Cascader = 'cascader',
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
  status?: (dependValue: any) => string;
  depend?: string;
  extraInfo?: (dependValue: any) => string;
  exchangeStatusUrl?: string;
  exchangeStatusKey?: string;
  exchangeStatusParamsPosition?: ExchangeStatusParamsPositionEnum;
  exchangeStatusParamsKeyObj?: object;
  exchangeStatusObj?: object;
}

export interface PageSearchInfoInterface {
  [propsName: string]: number | string;
}

export interface PropsInterface {
  page: string;
  total?: number;
  dataSource?: Array<any>;
  pageChangeHandle?: (currentPage: number, pageSize: number | undefined) => void;
}

export interface TablePropsInterface extends PropsInterface {
  rowSelectionVisible?: boolean;
  actionsHandle?: (action: TableActionInterface, searchInfo: object, record?: any) => void;
  onRowSelectionChange?: (selectedRows: Array<ObjectInterface>) => void;
  isReset: boolean;
  columnList?: Array<ObjectInterface>;
  actionInPage?: object;
  pagination?: ObjectInterface | boolean;
  isResetRowSelection: boolean;
}

export interface SearchPropsInterface extends PropsInterface {
  dispatch: Dispatch<AnyAction>;
  actionsHandle?: (action: SearchActionInterface, searchInfo: object, record?: any) => void;
  searchForm: SearchFormModelState;
  cascaderOption?: CascaderOptionType[];
  cascaderLoadData?: (selectedOptions: CascaderOptionType[]) => void;
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
  username: string;
  username_cn: string;
  userid: number;
  role: string;

  avatar?: string;
  group?: Array<any>;
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
  userAuthButtonList: string[];
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
  [propsName: string]: Array<any>;
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    getUserPermissionsMenu: Effect;
    getUserInfo: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<UserModelState>;
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

export interface CommodityDetailInterface {
  goodsDetailList: Array<any>;
}

// TODO: 继承那个 Props???
export interface PagePropsInterface extends ProLayoutProps {
  dispatch: Dispatch<AnyAction>;
  tableList?: TableListModelState;
  detailInfo?: CommodityDetailInterface;
  user?: UserModelState;
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
  searchActionsHandle?: (
    action: ActionInterface,
    callback: (searchInfo: PageSearchInfoInterface) => void,
  ) => void;
  onRowSelectionChange?: (selectedRows: Array<ObjectInterface>) => void;
  refresh?: Boolean;
  dispatch: Dispatch;
  cascaderOption?: CascaderOptionType[];
  cascaderLoadData?: (selectedOptions: CascaderOptionType[]) => void;
  middleLayout?: any;
  rowSelectionVisible?: boolean;
  localDataSource?: Array<object>;
  actionInpage?: object;
  isResetRowSelection?: boolean;
}

export interface TableColumnInterface {
  title: string;
  dataIndex: string;
  key: string;
  render?: (text: any, record: any, index: number) => void;
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
  width?: string | number;
}
