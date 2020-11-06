import request from '@/utils/request';
import { MethodEnum } from '@/components/Interface';
import { LoginParamsType } from '@/pages/user/login';

export async function accountLogin(params: LoginParamsType) {
  // TODO: 登录接口未定
  return request('/user/login', {
    method: 'POST',
    params,
  });
}

export async function accountLogout() {
  return request('/user/logout', { method: 'POST' });
}

export async function getUserPermissionsMenu() {
  return request('/sso/menus/initMenus', {
    method: MethodEnum.POST,
  });
}

export async function getUserInfo() {
  return request('/sso/user/initUser', {
    method: MethodEnum.POST,
  });
}
