import React, { useState, useEffect } from 'react';
import { Spin } from 'antd';
import { connect } from 'dva';
import {CascaderOptionType} from 'antd/lib/cascader';
import TableBasic from '@/components/PrivateComponents/TableBasic';
import SearchForm from '@/components/PrivateComponents/SearchForm';
import {
  ActionInterface,
  PageSearchInfoInterface,
  PageBasicPropsInterface,
  MethodEnum,
  TableActionInterface,
  ExchangeStatusParamsPositionEnum,
  ObjectInterface,
} from '@/components/Interface';
import DBFn from '@/DB';
import { getValidSearchInfo } from '@/utils/utils';
import { ConnectState } from '@/models/connect';

const DB = DBFn();

const PageBasic = (props: PageBasicPropsInterface) => {
  const { page, hasSearchForm = true, extraSearchInfo = {}, dispatch } = props;

  const {
    requestUrl,
    pageObj,
    requestMethod,
    searchInfo: { externalProcessingActionKeyList = [] },
    tableListRelatedFields
  } = DB[page];
  if (!pageObj || !Object.keys(pageObj).length) {
    throw new Error('请传入正确的 pageObj');
  }

  const pageInfo = {[`${pageObj.currentField}`]: pageObj[`${pageObj.currentField}`], [`${pageObj.pageSizeField}`]: pageObj[`${pageObj.pageSizeField}`]};

  const [updateData, setUpdateData] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchInfo, setSearchInfo] = useState<PageSearchInfoInterface>({ ...pageInfo });

  useEffect(() => {
    setLoading(true);
    const loadData = async () => {
      const method = requestMethod || MethodEnum.GET;
      await dispatch({
        type: 'tableList/getTableList',
        payload: { requestUrl, searchInfo: { ...searchInfo, ...extraSearchInfo }, page, method, tableListRelatedFields },
      });
      setLoading(false);
    };
    loadData();
  }, [searchInfo, props.extraSearchInfo, props.page, props.refresh, updateData]);

  const searchActionsHandle = (action: ActionInterface, searchInformation: object) => {
    if (externalProcessingActionKeyList.indexOf(action.key) >= 0) {
      if (props.searchActionsHandle) {
        props.searchActionsHandle(action, (userSearchInfo: PageSearchInfoInterface) => {
          if(userSearchInfo[`${pageObj.pageSizeField}`] && userSearchInfo[`${pageObj.currentField}`]) {
            setSearchInfo(userSearchInfo);
          } else {
            throw new Error(`reset 时需要给最基本的 page 相关字段，${pageObj.pageSizeField} 和 ${pageObj.currentField}！`);
          }
        });
      }
      return;
    }
    if(action.key === 'reset') {
      setSearchInfo({...pageInfo});
    } else {
      setSearchInfo({
        ...searchInfo,
        ...getValidSearchInfo(searchInformation),
      });
    }
  };

  const cascaderLoadData = async (selectedOptions: CascaderOptionType[] | undefined) => {
    if(selectedOptions && props.cascaderLoadData) {
      await props.cascaderLoadData(selectedOptions);
    }
  };

  const tableActionsHandle = async (action: TableActionInterface, record: any) => {
    try {
      setLoading(true);
      const {
        exchangeStatusUrl,
        exchangeStatusParamsKeyObj,
        exchangeStatusKey,
        exchangeStatusParamsPosition = ExchangeStatusParamsPositionEnum.Params,
        exchangeStatusObj = {},
        status = {},
      } = action;
      const params = {};

      Object.keys(exchangeStatusParamsKeyObj).map((paramsKey: string) => {
        params[`${paramsKey}`] =
          paramsKey === exchangeStatusKey
            ? Object.keys(status)
                .map(key => Number(key))
                .filter(item => item !== record[`${exchangeStatusKey}`])[0]
            : record[`${exchangeStatusParamsKeyObj[`${paramsKey}`]}`];
        return null;
      });
      Object.assign(params, exchangeStatusObj);

      await dispatch({
        type: 'tableList/exchangeTableItemActionStatus',
        payload: { exchangeStatusUrl, params, paramsPosition: exchangeStatusParamsPosition },
      });
      setUpdateData(!updateData);
    } catch (error) {
      if (props.actionsHandle) {
        props.actionsHandle(action, record);
      }
    } finally {
      setLoading(false);
    }
  };

  const pageChangeHandle = (currentPage: number, pageSize: number | undefined) => {
    const total = props.tableList ? props.tableList[`${page}_total`] : 0;
    if (pageSize && total > pageSize) {
      setSearchInfo({ ...searchInfo, ...{ [`${pageObj.currentField}`]: currentPage, [`${pageObj.pageSizeField}`]: pageSize } });
    }
  };

  const onRowSelectionChange = (selectedRows: Array<ObjectInterface>) =>
    props.onRowSelectionChange && props.onRowSelectionChange(selectedRows);

  return (
    <Spin spinning={loading} size="large">
      {hasSearchForm ? <SearchForm page={page} actionsHandle={searchActionsHandle} cascaderLoadData={cascaderLoadData} cascaderOption={props.cascaderOption} /> : null}
      <TableBasic
        page={page}
        dataSource={props.tableList ? props.tableList[`${page}_list`] : []}
        total={props.tableList ? props.tableList[`${page}_total`] : 0}
        actionsHandle={tableActionsHandle}
        pageChangeHandle={pageChangeHandle}
        onRowSelectionChange={onRowSelectionChange}
      />
    </Spin>
  );
};

export default connect(({ tableList }: ConnectState) => ({ tableList }))(PageBasic);
