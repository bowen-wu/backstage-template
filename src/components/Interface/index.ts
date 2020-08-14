import { Effect } from 'dva';
import { Dispatch, AnyAction, Reducer } from 'redux';
import { CascaderOptionType } from 'antd/lib/cascader';
import { ButtonType } from 'antd/lib/button';
import { MenuDataItem } from '@ant-design/pro-layout';
import { TableProps } from 'antd/lib/table';
import { ReactNode } from 'react';
import { TableRowSelection } from 'antd/lib/table/interface';
import * as React from 'react';
import { RenderedCell } from 'rc-table/lib/interface';
import { TableProps as RcTableProps } from 'rc-table/lib/Table';

/**
 * public start
 */
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

export interface OptionItem {
  label: string;
  value: string | number;
}

export interface ObjectInterface {
  [propsName: string]: any;
}

/**
 * public end
 */

/**
 *  DB interface start
 */
interface SearchInfoItemSpan {
  input?: number;
  select?: number;
  rangePicker?: number;
  monthPicker?: number;
  cascader?: number;
  action?: number;
  actionOffset?: number;
}

export interface SearchInfoItemOption extends OptionItem {
  isDefault?: boolean;
}

export interface SearchInfoItemOptionRequestParams {
  url: string;
  method: MethodEnum;
  listRelatedFieldsPath: string;
  labelField: string;
  valueField: string;
}

export interface SearchInfoItem {
  type: string;
  label: string;
  key: string;
  default?: string | Array<string>;
  pickerFieldList?: Array<string>;
  mode?: 'multiple' | 'tags';

  // TODO: 未检测
  placeholder?: string;
  optionList?: Array<SearchInfoItemOption>;
  optionRequestParams?: SearchInfoItemOptionRequestParams;
  extra?: string;
  cascaderFieldList?: Array<string>;
  disabledDate?: (current: any) => boolean;
}

export interface SearchInfoItemAction {
  text: string;
  type: ButtonType;
  key: string;
}

interface SearchInfoInterface {
  spanItem?: SearchInfoItemSpan;
  searchList: Array<SearchInfoItem>;
  searchActions: Array<SearchInfoItemAction>;
  externalProcessingActionKeyList?: Array<string>;
}

interface TableInfoColumnItem<RecordType = any> {
  title: string;
  dataIndex: string;
  key: string;

  render?: (
    value: any,
    record: RecordType,
    index: number,
  ) => React.ReactNode | RenderedCell<RecordType>;
  fixed?: 'left' | 'right' | boolean;
}

export interface TableInfoActionItem<U = any, K = any> {
  key: string;
  type: ButtonType | string;
  route?: string;
  text?: string;
  depend?: string;
  icon?: ReactNode | null;
  title?: (dependValue: U) => U | ReactNode;
  actionText?: (dependValue: K) => K | ReactNode;
}

interface TableInfoInterface<T = any> extends TableProps<T> {
  keyList: string[];
  columnList: Array<TableInfoColumnItem>;
  actionList: Array<TableInfoActionItem>;
  rowSelection?: TableRowSelection<T>;
  scroll?: RcTableProps<RecordType>['scroll'] & {
    scrollToFirstRowOnChange?: boolean;
  };
}

interface PageInterface {
  currentField: string;
  pageSizeField: string;
  pageIndex: number;
  pageSize: number;
}

export interface DBItemInterface {
  requestUrl: string;
  requestMethod: MethodEnum;
  searchInfo: SearchInfoInterface;
  tableInfo: TableInfoInterface;
  pageObj: PageInterface;

  tableListRelatedFields?: { page: string; total: string };
  detailsUrl?: string;
}

export interface DBInterface {
  [propsName: string]: DBItemInterface;
}

/**
 *  DB interface end
 */

/**
 * component interface start
 */

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

export interface UploadFilePropInterface {
  dispatch: Dispatch<AnyAction>;
  uploadSuccess: (url: string) => void;
  isInit: boolean;
  defaultValue?: string;
  global: GlobalModelState;
  tableList?: TableListModelState;
  user?: UserModelState;
}

export interface PageSearchInfoInterface {
  [propsName: string]: number | string;
}

export interface PageBasicPropsInterface {
  page: string;
  tableList: TableListModelState;
  hasSearchForm?: boolean;
  extraSearchInfo?: object;
  actionsHandle?: (action: TableInfoActionItem, record: any) => void;
  searchActionsHandle?: (
    action: SearchInfoItemAction,
    searchInfo: PageSearchInfoInterface,
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
  actionInPage?: object;
  isResetRowSelection?: boolean;
}

export interface PropsInterface {
  page: string;
  total?: number;
  dataSource?: Array<any>;
  pageChangeHandle?: (currentPage: number, pageSize: number | undefined) => void;
}

export interface TablePropsInterface extends PropsInterface {
  rowSelectionVisible?: boolean;
  actionsHandle?: (action: TableInfoActionItem, searchInfo: object, record?: any) => void;
  onRowSelectionChange?: (selectedRows: Array<ObjectInterface>) => void;
  isReset: boolean;
  columnList?: Array<ObjectInterface>;
  actionInPage?: object;
  pagination?: ObjectInterface | boolean;
  isResetRowSelection: boolean;
}

export interface SearchPropsInterface extends PropsInterface {
  dispatch: Dispatch<AnyAction>;
  actionsHandle?: (action: SearchInfoItemAction, searchInfo: object, record?: any) => void;
  searchForm: SearchFormModelState;
  cascaderOption?: CascaderOptionType[];
  cascaderLoadData?: (selectedOptions: CascaderOptionType[]) => void;
}

/**
 * component interface end
 */

/**
 * Modal interface start
 */

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

export interface TableListModelState {}

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

export interface StateType {
  status?: 'ok' | 'error';
  type?: string;
  currentAuthority?: 'user' | 'guest' | 'admin';
}

export interface CurrentUser {
  token: string;
  username: string;
  username_cn: string;
  role: string;

  avatar?: string;
  group?: Array<any>;
}

export interface UserModelState {
  currentUser: CurrentUser;
  status: StateType;
  userPermissionsMenu: MenuDataItem[];
  userAuthButtonList: string[];
}

/**
 * Modal interface end
 */

export interface LoginParamsType {
  userName: string;
  password: string;
}
