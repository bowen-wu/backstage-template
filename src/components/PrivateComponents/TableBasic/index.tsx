import React from 'react';
import Link from 'umi/link';
import { Table, Popconfirm } from 'antd';
import DBFn from '@/DB';
import { TablePropsInterface, TableActionInterface, ObjectInterface } from '../../Interface';
import styles from './index.less';

const DB = DBFn();

export default (props: TablePropsInterface) => {
  const { page, dataSource, total } = props;
  const {
    tableInfo: {
      columnList,
      actionList,
      scroll = {},
      keyList = [],
      rowSelection: userRowSelection,
    },
  } = DB[page];

  const onPageInfoChange = (currentPage: number, pageSize: number | undefined) =>
    props.pageChangeHandle && props.pageChangeHandle(currentPage, pageSize);

  const action = {
    title: '操作',
    key: 'action',
    dataIndex: 'action',
    fixed: columnList.some((column: any) => !!column.fixed) ? 'right' : false,
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
                .map((key: string) => record[key] && `${key}=${record[key]}`)
                .filter((str: string) => Boolean(str))
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

  const onRowSelectionChange = (selectedRowKeys: string, selectedRows: Array<ObjectInterface>) =>
    props.onRowSelectionChange && props.onRowSelectionChange(selectedRows);

  const rowSelection = userRowSelection
    ? Object.assign({}, userRowSelection, { onChange: onRowSelectionChange })
    : null;
  const columns = [...columnList, actionList.length ? action : {}];
  return (
    <div className={styles.container}>
      <Table
        columns={columns}
        dataSource={dataSource}
        scroll={scroll}
        rowSelection={rowSelection}
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
