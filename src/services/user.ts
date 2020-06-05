import request from '@/utils/request';
import { getUserPermissionsMenuParams, LoginParamsType } from '@/components/Interface';

export async function accountLogin(params: LoginParamsType) {
  return request('/user/login', {
    method: 'POST',
    params,
  });
}

export async function accountLogout() {
  return request('/user/logout', { method: 'POST' });
}

export async function getUserPermissionsMenu(params: getUserPermissionsMenuParams) {
  return request('/menu/getListByUserId', {
    method: 'GET',
    params,
  });
}
