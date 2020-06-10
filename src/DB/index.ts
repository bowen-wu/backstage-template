// searchItem 的 type === rangePicker 时，default 必须是数组，且 length === 2

import moment from 'moment';
import { getDayStr, getLastMonthStr } from '@/utils/utils';

const lastDayStr = getDayStr(-1);
const isDefault = true;

const pageObj = {
  basePageNum: 1,
  basePageSize: 10,
};

const tableListRelatedFields = {
  total: 'totalCnt',
  data: 'data',
  list: 'list',
};

export default {
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
          needRender: true,
          renderDepend: ['startDate', 'endDate'],
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
};
