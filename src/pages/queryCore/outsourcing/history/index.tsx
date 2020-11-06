import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { Spin } from 'antd';
import { connect } from 'umi';
import { ConnectState } from '@/models/connect';

const History = () => {
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <PageHeaderWrapper>
      <Spin spinning={loading} size="large">
        this is queryCore outsourcing History Page
      </Spin>
    </PageHeaderWrapper>
  );
};

export default connect(({ user }: ConnectState) => ({ user }))(History);
