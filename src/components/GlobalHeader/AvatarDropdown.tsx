import { Menu, Spin } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import React from 'react';
import MenuInfo from 'antd/es/menu';
import { connect } from 'dva';
import router from 'umi/router';
import { ConnectProps, ConnectState } from '@/models/connect';
import { CurrentUser } from '@/components/Interface';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import Avatar from '../../assets/avatar.svg';

export interface GlobalHeaderRightProps extends ConnectProps {
  currentUser?: CurrentUser;
  menu?: boolean;
}

interface Event extends MenuInfo {
  key: string;
}

class AvatarDropdown extends React.Component<GlobalHeaderRightProps> {
  onMenuClick = (event: Event) => {
    const { key } = event;

    if (key === 'logout') {
      const { dispatch } = this.props;

      if (dispatch) {
        dispatch({
          type: 'user/logout',
        });
      }
      return;
    }

    router.push(`/account/${key}`);
  };

  render(): React.ReactNode {
    const { currentUser } = this.props;
    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        <Menu.Item key="logout">
          <LogoutOutlined />
          退出登录
        </Menu.Item>
      </Menu>
    );
    return currentUser && currentUser.userName ? (
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <img className={styles.avatar} src={Avatar} alt="" />
          <span className={styles.name}>{currentUser.userName}</span>
        </span>
      </HeaderDropdown>
    ) : (
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    );
  }
}

export default connect(({ user }: ConnectState) => ({
  currentUser: user.currentUser,
}))(AvatarDropdown);
