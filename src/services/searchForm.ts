import request from '@/utils/request';
import {MethodEnum, ObjectInterface} from '@/components/Interface';

export async function getOptionListInfo(url: string, method: MethodEnum, params: ObjectInterface) {
  return request(url, Object.assign({method}, method === MethodEnum.POST ? {data: params} : {params}));
}
