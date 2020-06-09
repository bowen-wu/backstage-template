import request from '@/utils/request';
import {
  ExchangeStatusParamsPositionEnum,
  ExchangeTableItemActionStatusInterface,
  MethodEnum,
  PageSearchInfoInterface,
} from '@/components/Interface';

export async function getTableListInfo(url: string, method: MethodEnum, params: PageSearchInfoInterface) {
  return request(url, Object.assign({method}, method === MethodEnum.POST ? {data: params} : {params}));
}

export async function exchangeTableItemActionStatus(url: string, params: ExchangeTableItemActionStatusInterface, paramsPosition: ExchangeStatusParamsPositionEnum) {
  return request(url, {
    method: 'POST',
    [`${paramsPosition}`]: params,
  });
}
