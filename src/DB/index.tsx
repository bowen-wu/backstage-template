// searchItem 的 type === rangePicker 时，default 必须是数组，且 length === 2

import { getDayStr } from '@/utils/utils';
import { DBInterface, MethodEnum } from '@/components/Interface';

const lastDayStr = getDayStr(-1);

export const pageObj = {
  currentField: 'pageIndex',
  pageSizeField: 'pageSize',
  pageIndex: 1,
  pageSize: 10,
};

const DB: DBInterface = {
  queryCoreOutsourcingHistory: {
    requestUrl: '',
    requestMethod: MethodEnum.POST,
    searchInfo: {
      spanItem: {
        input: 6,
        actionOffset: 4,
        action: 2,
      },
      searchList: [
        {
          type: 'input',
          label: 'userId',
          key: 'userId',
        },

        {
          type: 'input',
          label: '联系人手机号',
          key: 'mobile',
        },
        {
          type: 'input',
          label: '姓名',
          key: 'name',
        },
      ],
      searchActions: [
        {
          text: '搜 索',
          type: 'primary',
          key: 'search',
        },
      ],
    },
    tableInfo: {
      scroll: {
        x: 'max-content',
      },
      actionList: [
        {
          key: 'view',
          type: 'Link',
          text: '查看',
        },
      ],
      keyList: [],
      columnList: [
        {
          title: '序号',
          dataIndex: 'userId',
          key: 'userId',
        },
        {
          title: 'APP',
          dataIndex: 'userName',
          key: 'userName',
        },
        {
          title: '委外时账龄段',
          dataIndex: 'finalRoute',
          key: 'finalRoute',
        },
        {
          title: '批次号',
          dataIndex: 'userLoaningType',
          key: 'userLoaningType',
        },
        {
          title: '委案日期',
          dataIndex: 'auditStatus',
          key: 'auditStatus',
        },
        {
          title: '结束日',
          dataIndex: 'sysUserName',
          key: 'sysUserName',
        },
        {
          title: '催收机构',
          dataIndex: 'applyAmount',
          key: 'applyAmount',
        },
        {
          title: 'userId',
          dataIndex: 'createTime',
          key: 'createTime',
        },
        {
          title: '姓名',
          dataIndex: 'waitTime',
          key: 'waitTime',
        },
        {
          title: '委案金额',
          dataIndex: 'dataImportStatusVOList',
          key: 'dataImportStatusVOList',
        },
        {
          title: '委外时逾天数',
          dataIndex: 'a',
          key: 'a',
        },
        {
          title: '总回款金额',
          dataIndex: 'b',
          key: 'b',
        },
        {
          title: '最后回款时间',
          dataIndex: 'c',
          key: 'c',
        },
        {
          title: '最后回款金额',
          dataIndex: 'd',
          key: 'd',
        },
      ],
    },
    pageObj,
  },
  queryCoreOutsourcingRepaymentQuery: {
    requestUrl: '',
    requestMethod: MethodEnum.POST,
    searchInfo: {
      spanItem: {
        rangePicker: 6,
        select: 3,
        input: 3,
        actionOffset: 1,
        action: 2,
      },
      searchList: [
        {
          type: 'rangePicker',
          label: '还款日期',
          key: 'order_create_time',
          pickerFieldList: ['auditTimeStart', 'auditTimeEnd'],
          default: [lastDayStr, lastDayStr],
        },
        {
          type: 'select',
          label: 'APP',
          key: 'APP',
        },
        {
          type: 'select',
          label: '发起方',
          key: 'mobile',
        },
        {
          type: 'select',
          label: '交易结果',
          key: 'name',
        },
        {
          type: 'input',
          label: 'userId',
          key: 'userId',
        },
        {
          type: 'select',
          label: '催收机构',
          key: 'mechanism',
        },
      ],
      searchActions: [
        {
          text: '搜 索',
          type: 'primary',
          key: 'search',
        },
      ],
    },
    tableInfo: {
      scroll: {
        x: 'max-content',
      },
      keyList: [],
      columnList: [
        {
          title: '还款时间',
          dataIndex: 'userId',
          key: 'userId',
        },
        {
          title: '金额',
          dataIndex: 'userName',
          key: 'userName',
        },
        {
          title: '还款账户',
          dataIndex: 'finalRoute',
          key: 'finalRoute',
        },
        {
          title: '还款渠道',
          dataIndex: 'userLoaningType',
          key: 'userLoaningType',
        },
        {
          title: '还款状态',
          dataIndex: 'auditStatus',
          key: 'auditStatus',
        },
        {
          title: '备注',
          dataIndex: 'sysUserName',
          key: 'sysUserName',
        },
        {
          title: '发起方',
          dataIndex: 'applyAmount',
          key: 'applyAmount',
        },
        {
          title: 'userId',
          dataIndex: 'createTime',
          key: 'createTime',
        },
        {
          title: '姓名',
          dataIndex: 'waitTime',
          key: 'waitTime',
        },
        {
          title: '催收机构',
          dataIndex: 'dataImportStatusVOList',
          key: 'dataImportStatusVOList',
        },
      ],
      actionList: [
        {
          key: 'view',
          type: 'Link',
          text: '查看',
        },
      ],
    },
    pageObj,
  },
  mechanismHistory: {
    requestUrl: '',
    requestMethod: MethodEnum.POST,
    searchInfo: {
      spanItem: {
        input: 6,
        actionOffset: 4,
        action: 2,
      },
      searchList: [
        {
          type: 'input',
          label: 'userId',
          key: 'userId',
        },

        {
          type: 'input',
          label: '手机号',
          key: 'mobile',
        },
        {
          type: 'input',
          label: '姓名',
          key: 'name',
        },
      ],
      searchActions: [
        {
          text: '搜 索',
          type: 'primary',
          key: 'search',
        },
      ],
    },
    tableInfo: {
      scroll: {
        x: 'max-content',
      },
      keyList: [],
      columnList: [
        {
          title: '序号',
          dataIndex: 'userId',
          key: 'userId',
        },
        {
          title: 'APP',
          dataIndex: 'userName',
          key: 'userName',
        },
        {
          title: '委外时逾期天数',
          dataIndex: 'finalRoute',
          key: 'finalRoute',
        },
        {
          title: '批次号',
          dataIndex: 'userLoaningType',
          key: 'userLoaningType',
        },
        {
          title: '委案日期',
          dataIndex: 'auditStatus',
          key: 'auditStatus',
        },
        {
          title: '结束日',
          dataIndex: 'sysUserName',
          key: 'sysUserName',
        },
        {
          title: 'userId',
          dataIndex: 'createTime',
          key: 'createTime',
        },
        {
          title: '姓名',
          dataIndex: 'waitTime',
          key: 'waitTime',
        },
        {
          title: '委案金额',
          dataIndex: 'dataImportStatusVOList',
          key: 'dataImportStatusVOList',
        },
        {
          title: '催收员',
          dataIndex: 'a',
          key: 'a',
        },
        {
          title: '总回款金额',
          dataIndex: 'b',
          key: 'b',
        },
      ],
      actionList: [
        {
          key: 'view',
          type: 'Link',
          text: '查看',
        },
      ],
    },
    pageObj,
  },
  MechanismGroupManagement: {
    requestUrl: '',
    requestMethod: MethodEnum.POST,
    searchInfo: {
      spanItem: {
        input: 6,
        select: 6,
        actionOffset: 8,
        action: 4,
      },
      searchList: [
        {
          type: 'input',
          label: '小组',
          key: 'group',
        },

        {
          type: 'select',
          label: '组员',
          key: 'mobile',
        },
      ],
      searchActions: [
        {
          text: '搜 索',
          type: 'primary',
          key: 'search',
        },
      ],
    },
    tableInfo: {
      scroll: {
        x: 'max-content',
      },
      keyList: [],
      columnList: [
        {
          title: '小组',
          dataIndex: 'userId',
          key: 'userId',
        },
        {
          title: '小组成员',
          dataIndex: 'userName',
          key: 'userName',
        },
        {
          title: '状态',
          dataIndex: 'finalRoute',
          key: 'finalRoute',
        },
      ],
      actionList: [
        {
          key: 'view',
          type: 'Link',
          text: '查看',
        },
        {
          key: 'edit',
          type: 'Link',
          text: '编辑',
        },
        {
          key: 'delete',
          type: 'Link',
          text: '删除',
        },
        {
          key: 'status',
          type: 'popConfirm',
          depend: 'status',
          icon: null,
          title: (dependValue: string) =>
            dependValue === '0' ? '你确定要禁用该用户吗?' : '你确定要启用该用户吗?',
          actionText: (dependValue: string) => (dependValue === '0' ? '禁用' : '启用'),
        },
      ],
    },
    pageObj,
  },
};

export default () => DB;
