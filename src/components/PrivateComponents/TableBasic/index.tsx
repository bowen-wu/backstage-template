import React, { useState, useEffect } from 'react';
import Link from 'umi/link';
import { Table, Popconfirm } from 'antd';
import DBFn from '@/DB';
import { TablePropsInterface, ObjectInterface, TableInfoActionItem } from '../../Interface';
import styles from './index.less';

const DB = DBFn();

export default (props: TablePropsInterface) => {
  const {
    page,
    dataSource,
    total,
    actionInPage = {},
    columnList: userColumnList,
    rowSelectionVisible = false,
  } = props;
  const {
    tableInfo: {
      columnList,
      actionList,
      scroll = {},
      keyList = [],
      rowSelection: userRowSelection,
    },
  } = DB[page];

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const onRowSelectionChange = (
    nowSelectedRowKeys: React.Key[],
    selectedRows: Array<ObjectInterface>,
  ) => {
    setSelectedRowKeys(nowSelectedRowKeys);
    if (props.onRowSelectionChange) {
      props.onRowSelectionChange(selectedRows);
    }
  };

  const rowSelection = userRowSelection
    ? { ...userRowSelection, onChange: onRowSelectionChange, selectedRowKeys }
    : undefined;

  useEffect(() => {
    onRowSelectionChange([], []);
  }, [props.isReset, props.isResetRowSelection]);

  const onPageInfoChange = (currentPage: number, pageSize: number | undefined) =>
    props.pageChangeHandle && props.pageChangeHandle(currentPage, pageSize);

  const action = {
    title: '操作',
    key: 'action',
    dataIndex: 'action',
    fixed: columnList.some((column: any) => !!column.fixed) ? 'right' : false,
    render: (text: string, record: any) => (
      <span>
        {actionList.map((actionItem: TableInfoActionItem) => {
          const { route = '', actionText = '', title = '' } = (() => {
            if (actionItem.depend) {
              return {
                actionText:
                  actionItem.actionText && actionItem.depend
                    ? actionItem.actionText(record[actionItem.depend])
                    : '',
                title:
                  actionItem.title && actionItem.depend
                    ? actionItem.title(record[actionItem.depend])
                    : '',
              };
            }
            return {
              route: actionItem.route,
              actionText: actionItem.text || '详情',
            };
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

  const columns = [...columnList, actionInPage, actionList.length ? action : {}];
  const pagination = (() => {
    const initPagination = {
      total,
      pageSizeOptions: ['10', '20', '30', '40'],
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: () => `共 ${total} 条记录`,
      onChange: onPageInfoChange,
      onShowSizeChange: onPageInfoChange,
    };
    if (props.pagination === false) {
      return false;
    }
    if (props.pagination === true) {
      return initPagination;
    }
    return props.pagination || initPagination;
  })();
  return (
    <div className={styles.container}>
      <Table
        columns={userColumnList || columns}
        dataSource={dataSource}
        scroll={scroll}
        rowSelection={rowSelectionVisible ? rowSelection : undefined}
        pagination={pagination}
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
