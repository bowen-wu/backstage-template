// searchItem 的 type === rangePicker 时，default 必须是数组，且 length === 2

const pageObj = {
  basePageNum: 1,
  basePageSize: 10,
};

export default {
  manage_user: {
    detailsUrl: '',
    requestUrl: '',
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
    ...pageObj,
  },
  span_item: {
    input: 5,
    select: 8,
  },
};
