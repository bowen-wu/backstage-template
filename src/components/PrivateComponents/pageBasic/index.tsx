import React, { useState, useEffect, useCallback } from 'react';
import { Spin } from 'antd';
import { CascaderOptionType } from 'antd/lib/cascader';
import TableBasic from '@/components/PrivateComponents/TableBasic';
import SearchForm from '@/components/PrivateComponents/SearchForm';
import { connect } from 'umi';
import {
  PageSearchInfoInterface,
  PageBasicPropsInterface,
  MethodEnum,
  ObjectInterface,
  TableInfoActionItem,
  SearchInfoItemAction,
  SearchInfoItem,
  SearchItemControlType,
} from '@/components/Interface';
import DBFn from '@/DB';
import { ConnectState } from '@/models/connect';
import {
  Key,
  SorterResult,
  TableCurrentDataSource,
  TablePaginationConfig,
} from 'antd/lib/table/interface';

const DB = DBFn();

const PageBasic = (props: PageBasicPropsInterface) => {
  const {
    localDataSource,
    rowSelectionVisible,
    page,
    dispatch,
    middleLayout,
    actionInPage,
    hasSearchForm = true,
    extraSearchInfo = {},
    config,
    disabledRequest = true,
  } = props;
  const {
    requestUrl,
    pageObj,
    requestMethod,
    tableListRelatedFields,
    searchInfo: { externalProcessingActionKeyList = [], searchList },
    tableInfo: { pagination = true },
  } = DB[page] || config;

  if (
    pagination &&
    (!pageObj ||
      !Object.keys(pageObj).length ||
      typeof pageObj[`${pageObj.currentField}`] !== 'number' ||
      typeof pageObj[`${pageObj.pageSizeField}`] !== 'number')
  ) {
    throw new Error('请传入正确的 pageObj');
  }

  const pageInfo = pagination
    ? {
        [`${pageObj.currentField}`]: pageObj[`${pageObj.currentField}`],
        [`${pageObj.pageSizeField}`]: pageObj[`${pageObj.pageSizeField}`],
      }
    : {};

  const defaultSearchInfo = {};
  searchList.map((searchItem: SearchInfoItem) => {
    const defaultValue: any = (() => {
      if (searchItem.type === SearchItemControlType.RangePicker && searchItem.default) {
        if (searchItem.default instanceof Array && searchItem.default.length === 2) {
          return [searchItem.default[0], searchItem.default[1]];
        }
        throw new Error('rangePicker default 必须是数组，且 length === 2！');
      }
      return ['', ''];
    })();

    if (
      searchItem.type === SearchItemControlType.RangePicker &&
      (!searchItem.pickerFieldList || searchItem.pickerFieldList.length !== 2)
    ) {
      throw new Error('pickerFieldList 字段必须提供！');
    }
    const cascaderSearchInfo = (() => {
      if (searchItem.type === SearchItemControlType.Cascader) {
        if (searchItem.cascaderFieldList instanceof Array) {
          const cascaderObj = {};
          searchItem.cascaderFieldList.map((cascaderField: string) => {
            cascaderObj[cascaderField] = '';
            return null;
          });
          return cascaderObj;
        }
        throw new Error('请提供正确的 cascaderFieldList 字段！');
      }
      return {};
    })();
    Object.assign(
      defaultSearchInfo,
      cascaderSearchInfo,
      searchItem.type === SearchItemControlType.RangePicker
        ? {
            [`${(searchItem.pickerFieldList as Array<string>)[0]}`]: defaultValue[0],
            [`${(searchItem.pickerFieldList as Array<string>)[1]}`]: defaultValue[1],
          }
        : { [`${searchItem.key}`]: '' },
      searchItem.type === SearchItemControlType.Select &&
        (searchItem.mode === 'multiple' || searchItem.mode === 'tags')
        ? { [`${searchItem.key}`]: [] }
        : {},
    );
    return null;
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [searchInfo, setSearchInfo] = useState<PageSearchInfoInterface>({
    ...pageInfo,
    ...defaultSearchInfo,
  });
  const [isReset, setIsReset] = useState<boolean>(false);

  let dataSource = [];
  if (localDataSource) {
    dataSource = localDataSource;
  } else if (props.tableList) {
    dataSource = props.tableList[`${page}_list`];
  }

  let totalLength = 0;
  if (localDataSource) {
    totalLength = localDataSource.length;
  } else if (props.tableList) {
    totalLength = props.tableList[`${page}_total`];
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const method = requestMethod || MethodEnum.GET;
      await dispatch({
        type: 'tableList/getTableList',
        payload: {
          requestUrl,
          searchInfo: { ...extraSearchInfo, ...searchInfo },
          page,
          method,
          tableListRelatedFields,
        },
      });
      setLoading(false);
    };
    if (disabledRequest) {
      void loadData();
    }
  }, [searchInfo, props.extraSearchInfo, props.page, props.refresh, props.disabledRequest]);

  const onRowSelectionChange = (
    currentSelectedRowKeys: React.Key[],
    selectedRows: Array<ObjectInterface>,
  ) =>
    props.onRowSelectionChange && props.onRowSelectionChange(currentSelectedRowKeys, selectedRows);

  const searchActionsHandle = (action: SearchInfoItemAction, searchInformation: object) => {
    const searchInfoCopy = { ...searchInfo, ...searchInformation };
    const callback = (userSearchInfo: PageSearchInfoInterface) => {
      if (
        pagination &&
        !(userSearchInfo[`${pageObj.pageSizeField}`] && userSearchInfo[`${pageObj.currentField}`])
      ) {
        throw new Error(
          `reset 时需要给最基本的 page 相关字段，${pageObj.pageSizeField} 和 ${pageObj.currentField}！`,
        );
      } else {
        setSearchInfo(userSearchInfo);
      }
    };
    if (externalProcessingActionKeyList.indexOf(action.key) >= 0) {
      if (props.searchActionsHandle) {
        props.searchActionsHandle(action, searchInfoCopy, callback);
      }
      return;
    }
    if (action.key === 'reset') {
      setSearchInfo({ ...pageInfo });
      setIsReset(!isReset);
    } else {
      setSearchInfo(searchInfoCopy);
    }

    if (props.searchActionsHandle) {
      props.searchActionsHandle(action, searchInfoCopy, callback);
    }
  };

  const cascaderLoadData = async (selectedOptions: CascaderOptionType[] | undefined) => {
    if (selectedOptions && props.cascaderLoadData) {
      await props.cascaderLoadData(selectedOptions);
    }
  };

  const tableActionsHandle = async (action: TableInfoActionItem, record: any) => {
    setLoading(true);
    if (props.actionsHandle) {
      await props.actionsHandle(action, record);
    }
    setLoading(false);
  };

  const pageChangeHandle = (currentPage: number, pageSize: number | undefined) => {
    const total = props.tableList ? props.tableList[`${page}_total`] : 0;
    if (pageSize && total > searchInfo[`${pageObj.pageSizeField}`]) {
      setSearchInfo({
        ...searchInfo,
        ...{ [`${pageObj.currentField}`]: currentPage, [`${pageObj.pageSizeField}`]: pageSize },
      });
    }
  };

  const onChange: <RecordType>(
    pagination: TablePaginationConfig,
    filters: Record<string, Key[] | null>,
    sorter: SorterResult<RecordType> | SorterResult<RecordType>[],
    extra: TableCurrentDataSource<RecordType>,
  ) => void = useCallback(
    (currentPagination, filters, sorter, extra): void => {
      if (props.onTableChange) {
        props.onTableChange(currentPagination, filters, sorter, extra);
      }
    },
    [props.onTableChange],
  );

  return (
    <Spin spinning={loading} size="large">
      {hasSearchForm ? (
        <SearchForm
          page={page}
          config={config}
          actionsHandle={searchActionsHandle}
          cascaderLoadData={cascaderLoadData}
          cascaderOption={props.cascaderOption}
        />
      ) : null}
      {middleLayout}
      <TableBasic
        config={config}
        rowSelectionVisible={rowSelectionVisible}
        page={page}
        dataSource={dataSource}
        total={totalLength}
        actionsHandle={tableActionsHandle}
        pageChangeHandle={pageChangeHandle}
        onRowSelectionChange={onRowSelectionChange}
        actionInPage={actionInPage}
        isReset={isReset}
        onChange={onChange}
        pagination={pagination}
      />
    </Spin>
  );
};

export default connect(({ tableList }: ConnectState) => ({ tableList }))(PageBasic);
