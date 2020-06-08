import request from '@/utils/request';
import {ObjectInterface} from "@/components/Interface";

export async function getOptionListInfo(url: string, method: string, params: ObjectInterface) {
  return request(url, {
    method,
    params,
  });
}
