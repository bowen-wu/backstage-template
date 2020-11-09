import React from 'react';
import { ConnectState } from '@/models/connect';
import { connect } from '@@/plugin-dva/exports';
import { Form, Input, Button } from 'antd';
import { Dispatch } from 'umi';
import { LockOutlined, UserOutlined } from '@ant-design/icons/lib';
import scopedClasses from '@/utils/scopedClasses';
import './index.less';

const sc = scopedClasses('login');

export interface LoginParamsType {
  username: string;
  password: string;
}

const layout = {
  wrapperCol: { span: 24 },
};

interface LoginProps {
  dispatch: Dispatch;
}

const Login = (props: LoginProps) => {
  const { dispatch } = props;
  const onFinish = async (values: LoginParamsType) => {
    await dispatch({
      type: 'user/login',
      payload: values,
    });
  };

  return (
    <div className={sc()}>
      <Form
        className={sc('form')}
        {...layout}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item name="username" rules={[{ required: true, message: '请输入用户名!' }]}>
          <Input prefix={<UserOutlined />} placeholder="用户名" className={sc('input')} />
        </Form.Item>

        <Form.Item name="password" rules={[{ required: true, message: '请输入密码!' }]}>
          <Input.Password prefix={<LockOutlined />} placeholder="密码" className={sc('input')} />
        </Form.Item>

        <div className={sc('tips')}>忘记密码请联系管理人员</div>

        <Form.Item>
          <Button className={sc('action')} type="primary" htmlType="submit">
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default connect(({ login, loading }: ConnectState) => ({
  userLogin: login,
  submitting: loading.effects['user/login'],
}))(Login);
