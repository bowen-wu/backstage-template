import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { Spin } from 'antd';
import { connect } from 'umi';
import { ConnectState } from '@/models/connect';
import styles from './index.less';

const History = () => {
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <PageHeaderWrapper className={styles.main}>
      <Spin spinning={loading} size="large">
        this is queryCore outsourcing History Page
      </Spin>
    </PageHeaderWrapper>
  );
};

export default connect(({ user }: ConnectState) => ({ user }))(History);
