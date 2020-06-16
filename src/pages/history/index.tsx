import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import {CascaderOptionType} from 'antd/lib/cascader';
import { Spin } from 'antd';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import PageBasic from '@/components/PrivateComponents/pageBasic';
import {ActionInterface, PagePropsInterface} from '@/components/Interface';
import styles from './index.less';
import {HistoryModelState} from "@/models/history";

interface HistoryPropsInterface extends PagePropsInterface{
  historyModel: HistoryModelState;
}

const History = (props: HistoryPropsInterface) => {
  const {dispatch} = props;
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(false);
    const getCascaderOption = async () => {
      await dispatch({type: 'history/getAuditResult'});
      await dispatch({type: 'history/getAuditResultFirst'});
      dispatch({type: 'history/getAuditResultSecond'});
    };
    getCascaderOption();
  }, []);

  const searchActionsHandle = (action: ActionInterface) => {
    console.log(action);
  };

  const cascaderLoadData = async (selectedOptions: CascaderOptionType[] | undefined) => {
    if(selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1];
      targetOption.loading = true;

      targetOption.loading = false;
    }
  };

  return (
    <PageHeaderWrapper className={styles.main}>
      <Spin spinning={loading} size="large">
        <PageBasic page="history" searchActionsHandle={searchActionsHandle} cascaderLoadData={cascaderLoadData} cascaderOption={props.historyModel.auditStatusAndResult} />
      </Spin>
    </PageHeaderWrapper>
  );
};

export default connect(({ user, history }: ConnectState) => ({ user, historyModel: history }))(History);
