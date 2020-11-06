import routes from './routes';
import { defineConfig } from 'umi';

export default defineConfig({
  hash: true,
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  dva: {
    hmr: true,
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
    RESPONSE_DATA_FIELD: 'data',
    FAKE_LOGIN: true,
  },
  ignoreMomentLocale: true,
  lessLoader: {
    modifyVars: {
      // 或者可以通过 less 文件覆盖（文件路径为绝对路径）
      hack: `true; @import "~antd/es/style/themes/default.less";`,
    },
  },
  sass: {},
  chainWebpack: config => {
    const oneOfsMap = config.module.rule('sass').oneOfs.values();
    oneOfsMap.forEach(item => {
      item
        .use('sass-resources-loader')
        .loader('sass-resources-loader')
        .options({
          /**
           * scss 全局文件
           * 注意：此处是 ./src/**
           */
          resources: [
            './src/assets/styles/_variable.scss',
            './src/assets/styles/_mixin.scss',
            './src/assets/styles/_zIndex.scss',
            './src/assets/styles/_function.scss',
          ],
        })
        .end();
    });
  },
  manifest: {
    basePath: '/',
  },
});
