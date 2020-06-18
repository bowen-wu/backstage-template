/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout, {
  MenuDataItem,
  BasicLayoutProps as ProLayoutProps,
  Settings,
  DefaultFooter,
} from '@ant-design/pro-layout';
import React, { useEffect } from 'react';
import Link from 'umi/link';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import { Result, Button } from 'antd';
import Authorized from '@/utils/Authorized';
import { ConnectState, UserModelState } from '@/models/connect';
import { getAuthorityFromRouter } from '@/utils/utils';
import logo from '../assets/logo.png';

const noMatch = (
  <Result
    status="403"
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary" onClick={() => window.location.href = 'http://192.168.5.109/sso-web/?origin=http%3A%2F%2F192.168.5.109%2Fauthority-web%2F%3F'}>Go Login</Button>
    }
  />
);

export interface BasicLayoutProps extends ProLayoutProps {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
  route: ProLayoutProps['route'] & {
    authority: string[];
  };
  settings: Settings;
  dispatch: Dispatch;
  user: UserModelState;
}

export type BasicLayoutContext = { [K in 'location']: BasicLayoutProps[K] } & {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
};
const BasicLayout: React.FC<BasicLayoutProps> = props => {
  const {
    dispatch,
    children,
    settings,
    location = { pathname: '/' },
    user: {userPermissionsMenu,},
  } = props;

  useEffect(() => {
    dispatch({type: 'user/getUserPermissionsMenu'});
  }, []);

  const handleMenuCollapse = (payload: boolean): void => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  }; // get children authority

  // @ts-ignore
  const authorized = getAuthorityFromRouter(props.route.routes, location.pathname || '/') || {
    authority: undefined,
  };
  return (
    <ProLayout
      logo={logo}
      menuHeaderRender={(logoDom, titleDom) => (
        <Link to="/">
          {logoDom}
          {titleDom}
        </Link>
      )}
      onCollapse={handleMenuCollapse}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl || menuItemProps.children) {
          return defaultDom;
        }

        return <Link to={(menuItemProps.path as string)}>{defaultDom}</Link>;
      }}
      breadcrumbRender={(routers = []) => {
        if (routers.length && routers[0].path === '/manage_system') {
          routers.shift();
        }
        return routers;
      }}
      itemRender={(route, params, routes, paths) => {
        console.log('routes -> ', routes);
        const last = routes.indexOf(route) === routes.length - 1;
        return !last ? (
          <Link to={`/${paths[paths.length - 1]}`}>{route.breadcrumbName}</Link>
        ) : (
          <span>{route.breadcrumbName}</span>
        );
      }}
      footerRender={() => <DefaultFooter links={false} copyright="TEMPLATE" />}
      menuDataRender={() => userPermissionsMenu}
      // TIPS: header 右侧用户 () => RightContent
      rightContentRender={() => null}
      {...props}
      {...settings}
    >
      <Authorized authority={authorized!.authority} noMatch={noMatch}>
        {children}
      </Authorized>
    </ProLayout>
  );
};

export default connect(({ global, settings, user }: ConnectState) => ({
  user,
  collapsed: global.collapsed,
  settings,
}))(BasicLayout);
