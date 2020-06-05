import React from 'react';
import Link from 'umi/link';
import { Table, Popconfirm } from 'antd';
import { PropsInterface, TableActionInterface } from '../../Interface';
import DB from '@/DB';
import styles from './index.less';

const keyList = ['id', 'gid', 'ggid', 'rid'];

export default (props: PropsInterface) => {
  const { page, dataSource, total } = props;
  const {tableInfo: { columnList, actionList }} = DB[page];

  const onPageInfoChange = (currentPage: number, pageSize: number | undefined) =>
    props.pageChangeHandle && props.pageChangeHandle(currentPage, pageSize);

  const action = {
    title: '操作',
    key: 'action',
    dataIndex: 'action',
    render: (text: string, record: any) => (
      <span>
        {actionList.map((actionItem: TableActionInterface) => {
          const { route = '', actionText = '', title = '' } = (() => {
            switch (actionItem.key) {
              case 'status':
                return {
                  actionText:
                    actionItem.status && actionItem.depend
                      ? actionItem.status[record[actionItem.depend]]
                      : '',
                  title:
                    actionItem.extraInfo && actionItem.depend
                      ? actionItem.extraInfo.title[record[actionItem.depend]]
                      : '',
                };
              default:
                return {
                  route: actionItem.route,
                  actionText: actionItem.text || '详情',
                  title: actionItem.extraInfo && actionItem.extraInfo.title,
                };
            }
          })();
          if (actionText) {
            if (route) {
              const href = `${route}?${keyList
                .map(key => record[key] && `${key}=${record[key]}`)
                .filter(str => Boolean(str))
                .join('&')}`;
              return (
                <Link key={actionItem.key} className={styles.actionItem} to={href}>
                  {actionText}
                </Link>
              );
            }
            if (actionItem.type === 'popConfirm') {
              return (
                <Popconfirm
                  key={actionItem.key}
                  title={title}
                  onConfirm={() => props.actionsHandle && props.actionsHandle(actionItem, record)}
                >
                  <span className={styles.actionItem} style={{ color: '#FF5400' }}>
                    {actionText}
                  </span>
                </Popconfirm>
              );
            }
            return (
              <span
                key={actionItem.key}
                className={styles.actionItem}
                style={{ color: '#FF5400' }}
                onClick={() => props.actionsHandle && props.actionsHandle(actionItem, record)}
              >
                {actionText}
              </span>
            );
          }
          return null;
        })}
      </span>
    ),
  };

  const columns = [...columnList, actionList.length ? action : {}];
  return (
    <div className={styles.container}>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={{
          total,
          pageSizeOptions: ['1', '10', '20', '30', '40'],
          showSizeChanger: true,
          showTotal: () => `共 ${total} 条记录`,
          onChange: onPageInfoChange,
          onShowSizeChange: onPageInfoChange,
        }}
        rowKey={record =>
          keyList.reduce(
            (result: string, key: string) =>
              record[`${key}`] ? `${result}-${record[`${key}`]}` : result,
            '',
          )
        }
      />
    </div>
  );
};
