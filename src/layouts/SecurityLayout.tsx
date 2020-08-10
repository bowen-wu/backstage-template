import React from 'react';
import { connect } from 'dva';
import { PageLoading } from '@ant-design/pro-layout';
import { ConnectState, ConnectProps } from '@/models/connect';
import { CurrentUser } from '@/components/Interface';

const queryString = require('query-string');

interface SecurityLayoutProps extends ConnectProps {
  loading?: boolean;
  currentUser?: CurrentUser;
}

interface SecurityLayoutState {
  isReady: boolean;
}

class SecurityLayout extends React.Component<SecurityLayoutProps, SecurityLayoutState> {
  state: SecurityLayoutState = {
    isReady: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    window.localStorage.setItem('token', queryString.parse(window.location.search).token);

    this.setState({
      isReady: true,
    });

    if (dispatch) {
      dispatch({ type: 'user/getUserInfo' });
    }
  }

  render() {
    const { isReady } = this.state;
    const { children, loading, currentUser } = this.props;
    // todo -> 你可以把它替换成你自己的登录认证规则（比如判断 token 是否存在）,
    console.log('currentUser -> ', currentUser);
    const isLogin = (currentUser && currentUser.token) || true;

    if ((!isLogin && loading) || !isReady) {
      return <PageLoading />;
    }

    if (!isLogin) {
      window.location.href =
        'http://192.168.5.109/sso-web/?origin=http%3A%2F%2F192.168.5.109%2Fauthority-web%2F%3F';
    }
    return children;
  }
}

export default connect(({ user, loading }: ConnectState) => ({
  currentUser: user.currentUser,
  loading: loading.models.user,
}))(SecurityLayout);
