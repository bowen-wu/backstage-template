import React, { useState, useEffect } from 'react';
import Link from 'umi/link';
import { Table, Popconfirm } from 'antd';
import DBFn from '@/DB';
import { TablePropsInterface, TableActionInterface, ObjectInterface } from '../../Interface';
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

  const [selectedRowKeys, setSelectedRowKeys] = useState<string>('');

  const onRowSelectionChange = (
    nowSelectedRowKeys: string,
    selectedRows: Array<ObjectInterface>,
  ) => {
    setSelectedRowKeys(nowSelectedRowKeys);
    if (props.onRowSelectionChange) {
      props.onRowSelectionChange(selectedRows);
    }
  };

  const rowSelection = userRowSelection
    ? { ...userRowSelection, onChange: onRowSelectionChange, selectedRowKeys }
    : null;

  useEffect(() => {
    onRowSelectionChange('', []);
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
        {actionList.map((actionItem: TableActionInterface) => {
          const { route = '', actionText = '', title = '' } = (() => {
            if (actionItem.depend) {
              return {
                actionText:
                  actionItem.status && actionItem.depend
                    ? actionItem.status(record[actionItem.depend])
                    : '',
                title:
                  actionItem.extraInfo && actionItem.depend
                    ? actionItem.extraInfo(record[actionItem.depend])
                    : '',
              };
            }
            return {
              route: actionItem.route,
              actionText: actionItem.text || '详情',
              title: actionItem.extraInfo && actionItem.extraInfo.title,
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
    const initPafination = {
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
      return initPafination;
    }
    return props.pagination || initPafination;
  })();
  return (
    <div className={styles.container}>
      <Table
        columns={userColumnList || columns}
        dataSource={dataSource}
        scroll={scroll}
        rowSelection={rowSelectionVisible ? rowSelection : null}
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
