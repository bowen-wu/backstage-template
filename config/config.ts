import routes from './routes';
import { utils } from 'umi';

const { winPath } = utils;

export default {
  hash: true,
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  dva: {
    hmr: true,
  },
  locale: {
    default: 'zh-CN',
    baseNavigator: true,
  },
  pwa: false,
  targets: {
    ie: 11,
  },
  routes,
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
  lessLoader: {
    javascriptEnabled: true,
  },
  cssLoader: {
    modules: {
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
          const arr = winPath(antdProPath)
            .split('/')
            .map((a: string) => a.replace(/([A-Z])/g, '-$1'))
            .map((a: string) => a.toLowerCase());
          return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
        }
        return localName;
      },
    },
  },
  manifest: {
    basePath: '/',
  },
};
