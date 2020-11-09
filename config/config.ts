import routes from './routes';
import { defineConfig } from 'umi';
import * as path from 'path';

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
  lessLoader: {
    modifyVars: {
      // 或者可以通过 less 文件覆盖（文件路径为绝对路径）
      hack: `true; @import "~antd/es/style/themes/default.less"; @import "${path.resolve(
        __dirname,
        '../src/assets/styles/_mixin.less',
      )}"; @import "${path.resolve(__dirname, '../src/assets/styles/_variable.less')}"`,
    },
  },
  routes,
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
  sass: {},
  manifest: {
    basePath: '/',
  },
});
