// searchItem 的 type === rangePicker 时，default 必须是数组，且 length === 2

import React from 'react';
import moment from 'moment';
import { getDayStr, getLastMonthStr } from '@/utils/utils';
import {MethodEnum} from "@/components/Interface";

const lastDayStr = getDayStr(-1);
const isDefault = true;

const pageObj = {
  currentField: 'pageIndex',
  pageSizeField: 'pageSize',
  pageIndex: 1,
  pageSize: 10,
};

const tableListRelatedFields = {
  total: 'totalCnt',
  data: 'data',
  list: 'list',
};

export default () => ({
  home: {
    detailsUrl: '',
    requestUrl: '',
    requestMethod: '',
    searchInfo: {
      searchList: [
        {
          type: '',
          label: '',
          key: '',
        },
      ],
      searchActions: [
        {
          text: '查询',
          type: 'primary',
          key: 'search',
        },
      ],
    },
    tableInfo: {
      columnList: [
        {
          title: '用户ID',
          dataIndex: 'id',
          key: 'id',
          needRender: true,
          enumerate: {
            1: '首页',
            2: '发现页',
          },
        },
      ],
      actionList: [
        {
          key: 'status',
          depend: 'islock',
          type: 'popconfirm',
          exchangeStatusUrl: '/app/user/lockUnlock',
          exchangeStatusParamsKeyObj: { appUserId: 'id', islock: 'islock' },
          exchangeStatusKey: 'islock',
          extraInfo: {
            title: {
              0: '你确定要停用该用户么？',
              1: '你确定要启用该用户么',
            },
          },
          status: {
            0: '停用',
            1: '启用',
          },
        },
        {
          route: '/manage_user/detail',
          key: 'detail',
        },
      ],
    },
    pageObj,
  },
  open_queue: {
    requestUrl: '',
    searchInfo: {
      spanItem: {
        input: 4,
        monthPicker: 5,
        action: 3,
      },
      searchList: [
        {
          type: 'rangePicker',
          label: '选择创建日期',
          key: 'order_create_time',
          pickerFieldList: ['auditTimeStart', 'auditTimeEnd'],
          default: [lastDayStr, lastDayStr],
        },
        {
          type: 'monthPicker',
          label: '结算周期',
          key: 'settlement_cycle',
          default: getLastMonthStr(),
          disabledDate: (current: any) => current && current >= moment().startOf('month'),
        },
        {
          type: 'input',
          label: '用户信息',
          key: 'userInfo',
        },
        {
          type: 'select',
          label: '信审员',
          key: 'letter-examiner',
          optionList: [
            {
              value: 'none',
              label: '请选择',
              isDefault,
            },
            {
              value: 'test',
              label: 'test',
            },
            {
              value: 'admin',
              label: 'admin',
            },
          ],
        },
      ],
      searchActions: [
        {
          text: '查询',
          type: 'primary',
          key: 'search',
        },
        {
          text: '重置',
          type: 'primary',
          key: 'reset',
        },
      ],
    },
    tableInfo: {
      scroll: {
        x: 1200
      },
      columnList: [
        {
          title: 'test',
          dataIndex: 'test',
          key: 'test',
        },
        {
          title: '用户ID',
          dataIndex: 'id',
          key: 'id1',
        },
        {
          title: '用户ID222',
          dataIndex: 'id',
          key: 'id2',
        },
        {
          title: '用户ID',
          dataIndex: 'id',
          key: 'id3',
        },
        {
          title: '用户ID',
          dataIndex: 'id',
          key: 'id4',
        },
        {
          title: '用户ID',
          dataIndex: 'id',
          key: 'id5',
        },
        {
          title: '用户ID',
          dataIndex: 'id',
          key: 'id6',
        },
        {
          title: '用户ID',
          dataIndex: 'id',
          key: 'id7',
        },
        {
          title: '用户ID',
          dataIndex: 'id',
          key: 'id8',
        },
        {
          title: '用户ID',
          dataIndex: 'id',
          key: 'id9',
        },
        {
          title: '用户ID',
          dataIndex: 'id',
          key: 'id10',
        },
        {
          title: '用户ID',
          dataIndex: 'id',
          key: 'id11',
        },
        {
          title: '用户ID',
          dataIndex: 'id',
          key: 'id12',
        },
      ],
      actionList: [
        {
          key: 'status',
          depend: 'islock',
          type: 'popconfirm',
          exchangeStatusUrl: '/app/user/lockUnlock',
          exchangeStatusParamsKeyObj: { appUserId: 'id', islock: 'islock' },
          exchangeStatusKey: 'islock',
          extraInfo: {
            title: {
              0: '你确定要停用该用户么？',
              1: '你确定要启用该用户么',
            },
          },
          status: {
            0: '停用',
            1: '启用',
          },
        },
        {
          route: '/manage_user/detail',
          key: 'detail',
        },
      ],
    },
    pageObj,
  },
  history: {
    detailsUrl: '',
    requestMethod: MethodEnum.POST,
    requestUrl: '/queue/history/list',
    searchInfo: {
      externalProcessingActionKeyList: ['reset'],
      spanItem: {
        select: 6,
        input: 6,
        rangePicker: 8,
      },
      searchList: [
        {
          type: 'rangePicker',
          label: '审核时间',
          key: 'date',
          pickerFieldList: ['auditTimeStart', 'auditTimeEnd'],
        },
        {
          type: 'input',
          label: '用户ID',
          key: 'userId',
        },
        {
          type: 'input',
          label: '用户姓名',
          key: 'userName',
        },
        {
          type: 'input',
          label: '用户手机号',
          key: 'mobile',
        },
        {
          type: 'select',
          label: '信审员',
          key: 'sysUserId',
          optionList: [
            {
              value: '1',
              label: '李四',
            },
            {
              value: '2',
              label: '张三',
            },
          ],
        },
        {
          type: 'select',
          label: '用户类型',
          key: 'userLoaningType',
          // requestUrl: '/basic/userLoaningType',
          optionList: [
            {
              value: '1',
              label: '贷前',
            },
            {
              value: '2',
              label: '贷后',
            },
          ],
        },
        {
          type: 'select',
          label: '是否复核打回',
          key: 'recheckCallback',
          optionList: [
            {
              value: '1',
              label: '是',
            },
            {
              value: '2',
              label: '否',
            },
          ],
        },
        {
          type: 'select',
          label: '是否复核',
          key: 'recheck',
          optionList: [
            {
              value: '1',
              label: '是',
            },
            {
              value: '2',
              label: '否',
            },
          ],
        },
        {
          type: 'input',
          label: '复核原因',
          key: 'recheckReason',
        },
        {
          type: 'select',
          label: '路由',
          key: 'finalRoute',
          optionList: [
            {
              value: '1',
              label: '路由1',
            },
            {
              value: '2',
              label: '路由2',
            },
          ],
        },
        {
          type: 'select',
          label: '信审审核状态',
          key: 'userInfo9',
          optionList: [
            {
              isDefault,
              value: '1',
              label: '默认',
            },
            {
              value: '2',
              label: '通过',
            },
            {
              value: '3',
              label: '取消',
            },
            {
              value: '4',
              label: '拒绝',
            },
          ],
        },
        {
          type: 'select',
          label: '审核结果一级原因',
          key: 'userInfo10',
          optionList: [],
        },
        {
          type: 'select',
          label: '审核结果二级原因',
          key: 'userInfo11',
          optionList: [],
        },
      ],
      searchActions: [
        {
          text: '查询',
          type: 'primary',
          key: 'search',
        },
        {
          text: '重置',
          type: '',
          key: 'reset',
        },
      ],
    },
    tableInfo: {
      scroll: {
        x: 'max-content',
      },
      keyList: [],
      actionList: [],
      columnList: [
        {
          fixed: true,
          title: '用户ID',
          dataIndex: 'userId',
          key: 'userId',
        },
        {
          fixed: true,
          title: '姓名',
          dataIndex: 'userName',
          key: 'userName',
        },
        {
          title: '申请时间',
          dataIndex: 'createTime',
          key: 'createTime',
        },
        {
          title: '申请额度',
          dataIndex: 'applyAmount',
          key: 'applyAmount',
        },
        {
          title: '调整后额度',
          dataIndex: 'auditAmount',
          key: 'auditAmount',
        },
        {
          title: '放款金额',
          dataIndex: 'loanAmount',
          key: 'loanAmount',
        },
        {
          title: '路由',
          dataIndex: 'finalRoute',
          key: 'finalRoute',
        },
        {
          title: '用户类型',
          dataIndex: 'userLoaningType',
          key: 'userLoaningType',
        },
        {
          title: '信审人员',
          dataIndex: 'sysUserName',
          key: 'sysUserName',
        },
        {
          title: '订单状态',
          dataIndex: 'orderStatus',
          key: 'orderStatus',
        },
        {
          title: '信审审核状态',
          dataIndex: 'jobResult',
          key: 'jobResult',
        },
        {
          title: '取消或拒绝一级原因',
          dataIndex: 'auditResultReason1',
          key: 'auditResultReason1',
        },
        {
          title: '取消或拒绝二级原因',
          dataIndex: 'auditResultReason2',
          key: 'auditResultReason2',
        },
        {
          title: '审核时间',
          dataIndex: 'auditTime',
          key: 'auditTime',
        },
        {
          title: '是否复核',
          dataIndex: 'reCheck',
          key: 'reCheck',
        },
        {
          title: '是否复核打回',
          dataIndex: 'recheckStatus',
          key: 'recheckStatus',
        },
        {
          title: '复合原因',
          dataIndex: 'recheckReason',
          key: 'recheckReason',
        },
        {
          title: '复合员',
          dataIndex: 'recheckSysUser',
          key: 'recheckSysUser',
        },
        {
          title: '复合时间',
          dataIndex: 'recheckTime',
          key: 'recheckTime',
        },
      ],
    },
    tableListRelatedFields,
    pageObj,
  },
  reviewQueue: {
    requestUrl: '/queue/recheck/list',
    requestMethod: MethodEnum.POST,
    searchInfo: {
      spanItem: {
        select: 8,
        input: 6,
      },
      searchList: [
        {
          type: 'input',
          label: '用户ID',
          key: 'userId',
        },

        {
          type: 'input',
          label: '用户姓名',
          key: 'userName',
        },
        {
          type: 'input',
          label: '用户手机号',
          key: 'mobile',
        },
        {
          type: 'select',
          label: '路由',
          key: 'finalRoute',
          optionList: [
            {
              value: '1',
              label: '路由1',
            },
            {
              value: '2',
              label: '路由2',
            },
          ],
        },
        {
          type: 'select',
          label: '信审人员',
          key: 'sysUserId',
          optionList: [
            {
              value: '1',
              label: '张三',
            },
            {
              value: '2',
              label: '李四',
            },
          ],
        },
      ],
      searchActions: [
        {
          text: '查询',
          type: 'primary',
          key: 'reviewQueueSearch',
        },
        {
          text: '重置',
          type: '',
          key: 'reviewQueueReset',
        },
      ],
    },
    tableInfo: {
      scroll: {
        x: 'max-content',
      },
      actionList: [],
      keyList: [],
      columnList: [
        {
          fixed: true,
          title: '用户ID',
          dataIndex: 'userId',
          key: 'userId',
        },
        {
          title: '姓名',
          dataIndex: 'userName',
          key: 'userName',
        },
        {
          title: '申请额度',
          dataIndex: 'applyAmount',
          key: 'applyAmount',
        },
        {
          title: '路由',
          dataIndex: 'finalRoute',
          key: 'finalRoute',
        },
        {
          title: '用户类型',
          dataIndex: 'userLoaningType',
          key: 'userLoaningType',
        },

        {
          title: '信审人员',
          dataIndex: 'sysUserName',
          key: 'sysUserName',
        },
        {
          title: '审核时间',
          dataIndex: 'auditTime',
          key: 'auditTime',
        },
        {
          title: '审核提交结果',
          dataIndex: 'auditResult',
          key: 'auditResult',
        },
        {
          title: '复核原因',
          dataIndex: 'recheckReason',
          key: 'recheckReason',
        },
      ],
    },
    pageObj,
  },
  auditQueue: {
    requestUrl: '/queue/audit/list',
    requestMethod: MethodEnum.POST,
    searchInfo: {
      spanItem: {
        select: 6,
        input: 6,
      },
      searchList: [
        {
          type: 'input',
          label: '用户ID',
          key: 'userId',
        },

        {
          type: 'input',
          label: '用户姓名',
          key: 'userName',
        },
        {
          type: 'input',
          label: '用户手机号',
          key: 'mobile',
        },
        {
          type: 'select',
          label: '信审人员',
          key: 'sysUserId',
          optionList: [
            {
              value: '1',
              label: '张三',
            },
            {
              value: '2',
              label: '李四',
            },
          ],
        },
        {
          type: 'select',
          label: '路由',
          key: 'finalRoute',
          optionList: [
            {
              value: '1',
              label: '路由1',
            },
            {
              value: '2',
              label: '路由2',
            },
          ],
        },
        {
          type: 'select',
          label: '信审审核状态',
          key: 'auditStatus',
          optionList: [
            {
              value: '1',
              label: '未分派',
            },
            {
              value: '2',
              label: '待审核',
            },
            {
              value: '2',
              label: '审核中',
            },
          ],
        },
        {
          type: 'select',
          label: '用户类型',
          key: 'userLoaningType',
          optionList: [
            {
              value: '1',
              label: '贷中',
            },
            {
              value: '2',
              label: '贷前',
            },
            {
              value: '2',
              label: '贷后',
            },
          ],
        },
        {
          type: 'rangePicker',
          label: '创建时间',
          key: 'date',
          pickerFieldList: ['auditTimeStart', 'auditTimeEnd'],
        },
      ],
      searchActions: [
        {
          text: '查询',
          type: 'primary',
          key: 'reviewQueueSearch',
        },
        {
          text: '重置',
          type: '',
          key: 'reviewQueueReset1',
        },
        {
          text: '分派',
          type: 'primary',
          key: 'reviewQueueReset2',
        },
        {
          text: '拒绝',
          type: 'primary',
          key: 'reviewQueueReset3',
        },
        {
          text: '取消',
          type: 'primary',
          key: 'reviewQueueReset4',
        },
      ],
    },
    tableInfo: {
      scroll: {
        x: 'max-content',
      },
      actionList: [],
      keyList: [],
      columnList: [
        {
          fixed: true,
          title: '用户ID',
          dataIndex: 'userId',
          key: 'userId',
        },
        {
          title: '姓名',
          dataIndex: 'userName',
          key: 'userName',
        },
        {
          title: '路由',
          dataIndex: 'finalRoute',
          key: 'finalRoute',
        },
        {
          title: '用户类型',
          dataIndex: 'userLoaningType',
          key: 'userLoaningType',
        },
        {
          title: '信审审核状态',
          dataIndex: 'auditStatus',
          key: 'auditStatus',
        },
        {
          title: '信审员',
          dataIndex: 'sysUserName',
          key: 'sysUserName',
        },
        {
          title: '申请额度',
          dataIndex: 'applyAmount',
          key: 'applyAmount',
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          key: 'createTime',
        },
        {
          title: '等候时间',
          dataIndex: 'waitTime',
          key: 'waitTime',
        },
        {
          title: '资料补录情况',
          dataIndex: 'dataImportStatusVOList',
          key: 'dataImportStatusVOList',
        },
      ],
    },
    pageObj,
  },
});
