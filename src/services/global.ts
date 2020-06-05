import request from '@/utils/request';
import { ObjectInterface } from '@/components/Interface';

// TODO: file 文件类型
export async function uploadFile(data: any) {
  return request('/file/upload', {
    method: 'POST',
    data,
  });
}

export async function resetAccountPassword(params: ObjectInterface) {
  return request('/user/resetPass', {
    method: 'POST',
    params,
  });
}

export async function getPersonAllAuthorizedMenu(params: ObjectInterface) {
  return request('/menu/getListByUserId', { method: 'GET', params });
}
