import React, { useState, useEffect } from 'react';
import { Spin } from 'antd';
import { connect } from 'dva';
import TableBasic from '@/components/PrivateComponents/TableBasic';
import SearchForm from '@/components/PrivateComponents/SearchForm';
import {
  ActionInterface,
  PageSearchInfoInterface,
  PageBasicPropsInterface,
  MethodEnum,
  TableActionInterface,
  ExchangeStatusParamsPositionEnum,
} from '@/components/Interface';
import DB from '@/DB';
import { getValidSearchInfo } from '@/utils/utils';
import { ConnectState } from '@/models/connect';

const externalProcessingActionKeyList = ['add'];

const PageBasic = (props: PageBasicPropsInterface) => {
  const { page, hasSearchForm = true, extraSearchInfo = {}, dispatch } = props;

  const { requestUrl, pageObj, requestMethod } = DB[page];
  if(!pageObj || !Object.keys(pageObj).length) {
    throw new Error('请传入正确的 pageObj');
  }

  const [updateData, setUpdateData] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchInfo, setSearchInfo] = useState<PageSearchInfoInterface>({...pageObj});

  useEffect(() => {
    setLoading(true);
    const loadData = async () => {
      const method = requestMethod || MethodEnum.GET;
      await dispatch({
        type: 'tableList/getTableList',
        payload: { requestUrl, searchInfo: { ...searchInfo, ...extraSearchInfo }, page, method },
      });
      setLoading(false);
    };
    loadData();
  }, [searchInfo, props.extraSearchInfo, props.page, props.refresh, updateData]);

  const searchActionsHandle = (action: ActionInterface, searchInformation: object) => {
    if (externalProcessingActionKeyList.indexOf(action.key) >= 0) {
      if (props.searchActionsHandle) {
        props.searchActionsHandle(action);
      }
      return;
    }
    setSearchInfo({
      ...getValidSearchInfo(searchInformation),
      ...{
        pageNum: searchInfo.pageNum,
        pageSize: searchInfo.pageSize,
      },
    });
  };

  const tableActionsHandle = async (action: TableActionInterface, record: any) => {
    try {
      // TODO: 各个 table 的 action 操作
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
      setSearchInfo({ ...searchInfo, ...{ pageNum: currentPage, pageSize } });
    }
  };

  return (
    <Spin spinning={loading} size="large">
      {hasSearchForm ? <SearchForm page={page} actionsHandle={searchActionsHandle} /> : null}
      <TableBasic
        page={page}
        dataSource={props.tableList ? props.tableList[`${page}_list`] : []}
        total={props.tableList ? props.tableList[`${page}_total`] : 0}
        actionsHandle={tableActionsHandle}
        pageChangeHandle={pageChangeHandle}
      />
    </Spin>
  );
};

export default connect(({ tableList }: ConnectState) => ({ tableList }))(PageBasic);
