import request from '@/utils/request';
import {LoginParamsType, MethodEnum} from '@/components/Interface';

export async function accountLogin(params: LoginParamsType) {
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

export async function getUserInfo () {
  return request('/sso/user/initUser', {
    method: MethodEnum.POST,
  });
}
