import request from '@/utils/request';
import {ExchangeTableItemActionStatusInterface, PageSearchInfoInterface} from "@/components/Interface";

export async function getTableListInfo(url: string, method: string, params: PageSearchInfoInterface) {
  return request(url, {
    method,
    params,
  });
}

export async function exchangeTableItemActionStatus(url: string, params: ExchangeTableItemActionStatusInterface, paramsPosition: string) {
  return request(url, {
    method: 'POST',
    [`${paramsPosition}`]: params,
  });
}
