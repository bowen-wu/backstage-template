import request from '@/utils/request';
import { MethodEnum } from '@/components/Interface';

export async function iAmRequest() {
  return request('/queue/work/summary', { method: MethodEnum.POST });
}

export async function getAuditResult() {
  return request('/basic/auditResult', { method: MethodEnum.GET });
}

export async function getAuditResultFirst() {
  return request('/basic/auditResult/reason1', { method: MethodEnum.GET });
}

export async function getAuditResultSecond() {
  return request('/basic/auditResult/reason2', { method: MethodEnum.GET });
}
