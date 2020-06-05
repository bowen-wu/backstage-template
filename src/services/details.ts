import request from '@/utils/request';
import {PageSearchInfoInterface} from "@/components/Interface";

export async function getDetailsInfo(url: string, method: string, params: PageSearchInfoInterface, paramsPosition: string) {
  return request(url, {
    method,
    [`${paramsPosition}`]: params,
  });
}
