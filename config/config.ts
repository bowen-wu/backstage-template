import { IConfig, IPlugin } from 'umi-types';
import defaultSettings from './defaultSettings';

import slash from 'slash2';

const { pwa } = defaultSettings;

const plugins: IPlugin[] = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      locale: {
        enable: false,
        default: 'zh-CN',
        baseNavigator: true,
      },
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
        webpackChunkName: true,
        level: 3,
      },
      pwa: pwa
        ? {
            workboxPluginMode: 'InjectManifest',
            workboxOptions: {
              importWorkboxFrom: 'local',
            },
          }
        : false,
    },
  ],
  [
    'umi-plugin-pro-block',
    {
      moveMock: false,
      moveService: false,
      modifyRequest: true,
      autoAddMenu: true,
    },
  ],
];

export default {
  plugins,
  hash: true,
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/zh/guide/router.html
  routes: [
    {
      path: '/user',
      component: '../layouts/UserLayout',
      name: 'user',
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './user/login',
        },
      ],
    },
    {
      path: '/',
      name: 'root',
      component: '../layouts/SecurityLayout',
      routes: [
        {
          path: '/',
          component: '../layouts/BasicLayout',
          routes: [
            {
              path: '/',
              redirect: '/home',
            },
            {
              name: '首页',
              path: '/home',
              component: './home',
            },
            {
              name: '查询中心',
              path: '/queryCore',
              routes: [
                {
                  name: '委外管理员',
                  path: '/queryCore/outsourcing',
                  routes: [
                    {
                      name: '委案历史',
                      path: '/queryCore/outsourcing/history',
                      component: './queryCore/outsourcing/history',
                    },
                    {
                      name: '还款查询',
                      path: '/queryCore/outsourcing/repaymentQuery',
                      component: './queryCore/outsourcing/repaymentQuery',
                    },
                  ],
                },
                {
                  name: '机构管理员',
                  path: '/queryCore/mechanism',
                  component: './queryCore/mechanism',
                },
              ],
            },
            {
              component: './404',
            },
          ],
        },
        {
          component: './404',
        },
      ],
    },
    {
      component: './404',
    },
  ],
  theme: {
    'primary-color': '#FF5400',
  },
  define: {
    SYSTEM_NAME: '系统名称',
    REQUEST_EXPIRED_CODE: 10002,
    REQUEST_SUCCESS_CODE: 0,
    TOKEN_FIELD: 'token',
    NEED_DRAG: true,
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (
      context: {
        resourcePath: string;
      },
      _: string,
      localName: string,
    ) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }

      const match = context.resourcePath.match(/src(.*)/);

      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map((a: string) => a.replace(/([A-Z])/g, '-$1'))
          .map((a: string) => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }

      return localName;
    },
  },
  manifest: {
    basePath: '/',
  },
} as IConfig;
