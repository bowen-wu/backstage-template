import React from 'react';
import { PageLoading } from '@ant-design/pro-layout';
import { connect, ConnectProps, Redirect } from 'umi';
import { stringify } from 'querystring';
import { ConnectState } from '@/models/connect';
import { CurrentUser } from '@/models/user';

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
    this.setState({
      isReady: true,
    });
    const currentUser = JSON.parse(
      window.localStorage.getItem('currentUser') || JSON.stringify({}),
    );
    const { dispatch } = this.props;
    if (dispatch && window.localStorage.getItem('currentUser')) {
      dispatch({
        type: 'user/saveCurrentUser',
        payload: { currentUser },
      });
    }
  }

  render() {
    const { isReady } = this.state;
    const { children, loading, currentUser } = this.props;

    const isLogin = Boolean(currentUser && currentUser[`${TOKEN_FIELD}`]);
    const queryString = stringify({
      redirect: window.location.href,
    });

    if ((!isLogin && loading) || !isReady) {
      return <PageLoading />;
    }

    if (!isLogin) {
      return <Redirect to={`/user/login?${queryString}`} />;
    }
    return children;
  }
}

export default connect(({ user, loading }: ConnectState) => ({
  currentUser: user.currentUser,
  loading: loading.models.user,
}))(SecurityLayout);
