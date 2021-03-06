import React, { ReactNode } from 'react';
import { Effect } from 'dva';
import { Dispatch, AnyAction, Reducer } from 'redux';
import { CascaderOptionType } from 'antd/lib/cascader';
import { ButtonType } from 'antd/lib/button';
import { MenuDataItem } from '@ant-design/pro-layout';
import { TableProps } from 'antd/lib/table';
import {
  CompareFn,
  Key,
  SorterResult,
  SortOrder,
  TableCurrentDataSource,
  TablePaginationConfig,
  TableRowSelection,
} from 'antd/lib/table/interface';
import { RenderedCell } from 'rc-table/lib/interface';
import { TableProps as RcTableProps } from 'rc-table/lib/Table';
import { OptionCoreData } from 'rc-select/lib/interface';

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
  InputNumber = 'inputNumber',
}

export interface OptionItem extends OptionCoreData {
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
  extraSearchInfo?: ObjectInterface;
}

export interface SearchInfoItem {
  type: string;
  label: string;
  key: string;
  default?: string | number | string[] | number[] | ReadonlyArray<string>;
  pickerFieldList?: Array<string>;
  rangePickerDateFormat?: string;
  mode?: 'multiple' | 'tags';
  min?: number;
  max?: number;
  placeholder?: string;

  // TODO: 未检测
  optionList?: Array<SearchInfoItemOption>;
  optionRequestParams?: SearchInfoItemOptionRequestParams;
  extra?: string;
  cascaderFieldList?: Array<string>;
  disabledDate?: (current: any) => boolean;
  [propsName: string]: any;
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

  render?: (value: any, record: RecordType, index: number) => ReactNode | RenderedCell<RecordType>;
  fixed?: 'left' | 'right' | boolean;
  sorter?: boolean | CompareFn<RecordType> | { compare: CompareFn<RecordType>; multiple: number };
  sortDirections?: SortOrder[];
}

export interface TableInfoActionItem<U = any, K = any, RecordType = any> {
  key: string;
  type: ButtonType | string;
  route?: string;
  text?: string;
  depend?: string;
  icon?: ReactNode | null;
  title?: (dependValue: U) => U | ReactNode;
  actionText?: (dependValue: K) => K | ReactNode;
  render?: (value: any, record: RecordType, index: number) => ReactNode | RenderedCell<RecordType>;
}

interface TableInfoInterface<T = any, RecordType extends object = any> extends TableProps<T> {
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
  [propsName: string]: number | string;
}

export interface DBItemInterface {
  requestUrl: string;
  requestMethod: MethodEnum;
  searchInfo: SearchInfoInterface;
  tableInfo: TableInfoInterface;
  pageObj: PageInterface;

  tableListRelatedFields?: { dataPath: string; totalPath: string };
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

export interface PageBasicPropsInterface<RecordType extends object = any> {
  page: string;
  tableList: TableListModelState;
  dispatch: Dispatch;

  config?: DBItemInterface;
  hasSearchForm?: boolean;
  extraSearchInfo?: object;
  actionsHandle?: (action: TableInfoActionItem, record: any) => void;
  searchActionsHandle?: (
    action: SearchInfoItemAction,
    searchInfo: PageSearchInfoInterface,
    callback: (searchInfo: PageSearchInfoInterface) => void,
  ) => void;
  onRowSelectionChange?: (
    selectedRowKeys: React.Key[],
    selectedRows: Array<ObjectInterface>,
  ) => void;
  refresh?: Boolean;
  cascaderOption?: CascaderOptionType[];
  cascaderLoadData?: (selectedOptions: CascaderOptionType[]) => void;
  middleLayout?: any;
  rowSelectionVisible?: boolean;
  localDataSource?: Array<ObjectInterface>;
  actionInPage?: object;
  onTableChange?: (
    pagination: TablePaginationConfig,
    filters: Record<string, Key[] | null>,
    sorter: SorterResult<RecordType> | SorterResult<RecordType>[],
    extra: TableCurrentDataSource<RecordType>,
  ) => void;
  disabledRequest?: boolean;
}

export interface PropsInterface {
  page: string;
  total?: number;
  dataSource?: Array<any>;
  pageChangeHandle?: (currentPage: number, pageSize: number | undefined) => void;
}

export interface TablePropsInterface<RecordType extends object = any> extends PropsInterface {
  isReset: boolean;

  rowSelectionVisible?: boolean;
  config?: DBItemInterface;
  actionsHandle?: (action: TableInfoActionItem, searchInfo: object, record?: any) => void;
  onRowSelectionChange?: (
    selectedRowKeys: React.Key[],
    selectedRows: Array<ObjectInterface>,
  ) => void;
  columnList?: Array<TableInfoColumnItem>;
  actionInPage?: object;
  pagination?: ObjectInterface | boolean;
  onChange?: (
    pagination: TablePaginationConfig,
    filters: Record<string, Key[] | null>,
    sorter: SorterResult<RecordType> | SorterResult<RecordType>[],
    extra: TableCurrentDataSource<RecordType>,
  ) => void;
}

export interface SearchPropsInterface extends PropsInterface {
  dispatch: Dispatch<AnyAction>;
  config?: DBItemInterface;
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
