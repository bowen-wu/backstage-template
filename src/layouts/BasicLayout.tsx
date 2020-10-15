import ProLayout, {
  MenuDataItem,
  BasicLayoutProps as ProLayoutProps,
  Settings,
  DefaultFooter,
} from '@ant-design/pro-layout';
import React, { useEffect } from 'react';
import { Result, Button } from 'antd';
import { connect, Link, Dispatch } from 'umi';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import { ConnectState, UserModelState } from '@/models/connect';
import { getAuthorityFromRouter } from '@/utils/utils';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Container from '@/components/PrivateComponents/Drag/Container';
import logo from '../assets/logo.svg';

const noMatch = (
  <Result
    status="403"
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary">
        <Link to="/user/login">Go Login</Link>
      </Button>
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
    // user: {
    //   userPermissionsMenu,
    //   currentUser: { id: userId },
    // },
  } = props;

  useEffect(() => {
    // TODO: 获取用户的有权限的菜单
    // dispatch({
    //   type: 'user/getUserPermissionsMenu',
    //   payload: { userId },
    // });
  }, []);

  const handleMenuCollapse = (payload: boolean): void => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  };

  const authorized = getAuthorityFromRouter(props.route.routes, location.pathname || '/') || {
    authority: undefined,
  };

  const proLayoutElement = (
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

        return <Link to={menuItemProps.path as string}>{defaultDom}</Link>;
      }}
      breadcrumbRender={(routers = []) => {
        if (routers.length && routers[0].path === '/manage_system') {
          routers.shift();
        }
        return routers;
      }}
      itemRender={(route, params, routes, paths) => {
        const last = routes.indexOf(route) === routes.length - 1;
        return !last ? (
          <Link to={`/${paths[paths.length - 1]}`}>{route.breadcrumbName}</Link>
        ) : (
          <span>{route.breadcrumbName}</span>
        );
      }}
      footerRender={() => <DefaultFooter links={false} copyright={`2020-${SYSTEM_NAME}`} />}
      menuDataRender={(menuList: MenuDataItem[]): MenuDataItem[] => {
        return menuList;

        // TODO: 使用 userPermissionsMenu
        // return userPermissionsMenu;
      }}
      rightContentRender={() => <RightContent />}
      {...props}
      {...settings}
    >
      <Authorized authority={authorized!.authority} noMatch={noMatch}>
        {children}
      </Authorized>
    </ProLayout>
  );

  return NEED_DRAG ? (
    <DndProvider backend={HTML5Backend}>
      <Container>{proLayoutElement}</Container>
    </DndProvider>
  ) : (
    proLayoutElement
  );
};

export default connect(({ global, settings, user }: ConnectState) => ({
  user,
  collapsed: global.collapsed,
  settings,
}))(BasicLayout);
