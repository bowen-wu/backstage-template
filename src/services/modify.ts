import request from '@/utils/request';
import { ObjectInterface } from '@/components/Interface';

export async function modifyInfo(
  url: string,
  method: string,
  params: ObjectInterface,
  paramsPosition: string,
) {
  return request(url, {
    method,
    [`${paramsPosition}`]: params,
  });
}
