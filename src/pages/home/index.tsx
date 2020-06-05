import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { Spin } from 'antd';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { PagePropsInterface } from '@/components/Interface';
import styles from './index.less';

const Home = (props: PagePropsInterface) => {
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <PageHeaderWrapper className={styles.main}>
      <Spin spinning={loading} size="large">
        this is Home Page
      </Spin>
    </PageHeaderWrapper>
  );
};

export default connect(({ user }: ConnectState) => ({ user }))(Home);
