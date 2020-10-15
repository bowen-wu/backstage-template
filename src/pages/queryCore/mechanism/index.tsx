import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Spin } from 'antd';
import { ConnectState } from '@/models/connect';
import styles from './index.less';

const Mechanism = () => {
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <PageHeaderWrapper className={styles.main}>
      <Spin spinning={loading} size="large">
        this is Mechanism Page
      </Spin>
    </PageHeaderWrapper>
  );
};

export default connect(({ user }: ConnectState) => ({ user }))(Mechanism);
