import React, { useState, useEffect } from 'react';
import { Select, Input, Row, Col, Button, DatePicker } from 'antd';
import moment from 'moment';
import DB from '../../../DB/index';
import { PropsInterface, SearchActionInterface } from '../../Interface';
import styles from './index.less';

const { Option } = Select;
const { MonthPicker, RangePicker } = DatePicker;
const rangePickerDateFormat = 'YYYY-MM-DD';
const monthPickerDateFormat = 'YYYY-MM';

interface SearchItemOptionInterface {
  value: string;
  label: string;
  isDefault?: boolean;
}

interface SearchItemDisabledDateInterface {
  (current: any): boolean;
}

interface SearchItemInterface {
  key: string;
  type: string;
  label: string;
  placeholder?: string;
  optionList?: Array<SearchItemOptionInterface>;
  default?: string | Array<string>;
  extra?: string;
  disabledDate?: SearchItemDisabledDateInterface;
}

export default (props: PropsInterface) => {
  const { page } = props;
  const {
    searchInfo: { searchList, searchActions, flexDirection },
  } = DB[page];
  const [searchInfo, setSearchInfo] = useState<object>({});

  useEffect(() => {
    const searchInfoCopy = {};
    searchList.map((searchItem: SearchItemInterface) =>
      Object.assign(
        searchInfoCopy,
        searchItem.type === 'rangePicker'
          ? { gmtCreateBegin: '', gmtCreateEnd: '' }
          : { [`${searchItem.key}`]: '' },
      ),
    );
    setSearchInfo(searchInfoCopy);
  }, [searchList]);

  const updateSearchInfo = (info: Object) => setSearchInfo(Object.assign({}, searchInfo, info));

  const actionHandle = (action: SearchActionInterface) =>
    props.actionsHandle && props.actionsHandle(action, searchInfo);

  const handleChange = (value: string, key: string) => updateSearchInfo({ [key]: value });

  const searchTypeEle = (searchItem: SearchItemInterface) => {
    switch (searchItem.type) {
      case 'input':
        return (
          <Input
            placeholder={searchItem.placeholder || '请输入'}
            onChange={e => handleChange(e.target.value, searchItem.key)}
          />
        );
      case 'select': {
        const optionList = searchItem.optionList instanceof Array ? searchItem.optionList : [];
        const defaultArray = optionList.filter(
          (option: SearchItemOptionInterface) => option.isDefault && option,
        );
        const defaultValue = defaultArray.length ? defaultArray[0].value : '';
        return (
          <Select
            defaultValue={defaultValue}
            style={{ width: 120 }}
            onChange={(value: string) => handleChange(value, searchItem.key)}
          >
            {optionList.map(option => (
              <Option key={option.value}>{option.label}</Option>
            ))}
          </Select>
        );
      }
      case 'rangePicker': {
        const defaultValue: any = (() => {
          if (searchItem.default) {
            if (searchItem.default instanceof Array && searchItem.default.length === 2) {
              return [
                moment(searchItem.default[0], rangePickerDateFormat),
                moment(searchItem.default[1], rangePickerDateFormat),
              ];
            }
            throw new Error('rangePicker default 必须是数组，且 length === 2！');
          }
          return [];
        })();
        const { placeholder = '请选择' } = searchItem;
        return (
          <RangePicker
            defaultValue={defaultValue}
            placeholder={[placeholder, placeholder]}
            onChange={(date, dateStringArr) =>
              updateSearchInfo({ gmtCreateBegin: dateStringArr[0], gmtCreateEnd: dateStringArr[1] })
            }
          />
        );
      }
      case 'monthPicker':
        return (
          <MonthPicker
            defaultValue={moment(searchItem.default, monthPickerDateFormat) || ''}
            disabledDate={searchItem.disabledDate}
            placeholder={searchItem.placeholder || '请选择'}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <Row className={styles[`${flexDirection ? 'flexColumn' : 'flex'}`]} gutter={12}>
        {searchList.map((searchItem: SearchItemInterface) => (
          <Col key={searchItem.key} className={styles[`${flexDirection ? 'itemColumn' : 'item'}`]}>
            {styles.label ? <div className={styles.label}>{searchItem.label}：</div> : null}
            {searchTypeEle(searchItem)}
            {searchItem.extra ? <div className={styles.extra}>{searchItem.extra}</div> : null}
          </Col>
        ))}
        <div className={styles[`${flexDirection ? 'actionColumn' : 'action'}`]}>
          {searchActions.map((action: SearchActionInterface) => (
            <Button key={action.key} type={action.type} onClick={() => actionHandle(action)}>
              {action.text}
            </Button>
          ))}
        </div>
      </Row>
    </div>
  );
};
