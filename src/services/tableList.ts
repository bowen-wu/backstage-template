import request from '@/utils/request';
import { MethodEnum, PageSearchInfoInterface } from '@/components/Interface';

export async function getTableListInfo(
  url: string,
  method: MethodEnum,
  params: PageSearchInfoInterface,
) {
  return request(
    url,
    Object.assign({ method }, method === MethodEnum.POST ? { data: params } : { params }),
  );
}
