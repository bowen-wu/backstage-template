/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { notification } from 'antd';
import router from 'umi/router';
import { stringify } from 'querystring';
import { getPageQuery } from '@/utils/utils';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理程序
 */
const errorHandler = (error: { response: Response }): Response => {
  const { response } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;

    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  } else if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }
  return response;
};

/**
 * 基础参数
 */
const baseUrl = 'http://192.168.203.176:8081';
const basePrefix = '/audit-manager';

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  errorHandler, // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
  prefix: `${baseUrl}${basePrefix}`, // 前缀, 用于覆盖统一设置的prefix
});

/**
 * request 拦截器
 */
request.interceptors.request.use((url, options) => ({
  options: {
    ...options,
    headers: {
      Authorization: window.localStorage.getItem('token') || '',
    },
  },
}));

request.interceptors.response.use(async response => {
  // TODO: response interceptors
  const data = await response.clone().json();
  if (data.code === 3 && window.localStorage.getItem('tokenExpired') !== 'expired') {
    window.localStorage.setItem('tokenExpired', 'expired');
    notification.error({
      message: `登陆过期，请重新登录！`,
      description: data.errorMsg,
    });
    window.localStorage.clear();
    const { redirect } = getPageQuery();
    if (window.location.pathname !== '/user/login' && !redirect) {
      router.replace({
        pathname: '/user/login',
        search: stringify({
          redirect: window.location.href,
        }),
      });
    }
  }
  if (data.code === 2 || data.code === 1) {
    notification.error({
      message: `${data.errorMsg}`,
    });
  }
  return response;
});

export default request;
