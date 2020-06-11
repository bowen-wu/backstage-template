import request from '@/utils/request';
import {MethodEnum} from "@/components/Interface";

export async function iAmRequest() {
  return request('/queue/work/summary', {method: MethodEnum.POST,});
}
