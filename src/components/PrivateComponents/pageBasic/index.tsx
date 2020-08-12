import React, { useState, useEffect } from 'react';
import { Spin } from 'antd';
import { connect } from 'dva';
import { CascaderOptionType } from 'antd/lib/cascader';
import TableBasic from '@/components/PrivateComponents/TableBasic';
import SearchForm from '@/components/PrivateComponents/SearchForm';
import {
  PageSearchInfoInterface,
  PageBasicPropsInterface,
  MethodEnum,
  ObjectInterface,
  TableInfoActionItem,
  SearchInfoItemAction,
} from '@/components/Interface';
import DBFn from '@/DB';
import { ConnectState } from '@/models/connect';

const DB = DBFn();

const PageBasic = (props: PageBasicPropsInterface) => {
  const {
    localDataSource,
    rowSelectionVisible,
    page,
    hasSearchForm = true,
    extraSearchInfo = {},
    dispatch,
    middleLayout,
    actionInPage,
  } = props;

  const {
    requestUrl,
    pageObj,
    requestMethod,
    searchInfo: { externalProcessingActionKeyList = [] },
    tableListRelatedFields,
  } = DB[page];
  if (!pageObj || !Object.keys(pageObj).length) {
    throw new Error('请传入正确的 pageObj');
  }

  const pageInfo = {
    [`${pageObj.currentField}`]: pageObj[`${pageObj.currentField}`],
    [`${pageObj.pageSizeField}`]: pageObj[`${pageObj.pageSizeField}`],
  };

  const [loading, setLoading] = useState<boolean>(true);
  const [searchInfo, setSearchInfo] = useState<PageSearchInfoInterface>({ ...pageInfo });
  const [isReset, setIsReset] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    const loadData = async () => {
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
    loadData();
  }, [searchInfo, props.extraSearchInfo, props.page, props.refresh]);

  const onRowSelectionChange = (selectedRows: Array<ObjectInterface>) =>
    props.onRowSelectionChange && props.onRowSelectionChange(selectedRows);

  const searchActionsHandle = (action: SearchInfoItemAction, searchInformation: object) => {
    const searchInfoCopy = { ...searchInfo, ...searchInformation };
    const callback = (userSearchInfo: PageSearchInfoInterface) => {
      if (userSearchInfo[`${pageObj.pageSizeField}`] && userSearchInfo[`${pageObj.currentField}`]) {
        setSearchInfo(userSearchInfo);
      } else {
        throw new Error(
          `reset 时需要给最基本的 page 相关字段，${pageObj.pageSizeField} 和 ${pageObj.currentField}！`,
        );
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
  return (
    <Spin spinning={loading} size="large">
      {hasSearchForm ? (
        <SearchForm
          page={page}
          actionsHandle={searchActionsHandle}
          cascaderLoadData={cascaderLoadData}
          cascaderOption={props.cascaderOption}
        />
      ) : null}
      {middleLayout}
      <TableBasic
        rowSelectionVisible={rowSelectionVisible}
        page={page}
        dataSource={dataSource}
        total={totalLength}
        actionsHandle={tableActionsHandle}
        pageChangeHandle={pageChangeHandle}
        onRowSelectionChange={onRowSelectionChange}
        isReset={isReset}
        actionInPage={actionInPage}
        isResetRowSelection={props.isResetRowSelection || false}
      />
    </Spin>
  );
};

export default connect(({ tableList }: ConnectState) => ({ tableList }))(PageBasic);
