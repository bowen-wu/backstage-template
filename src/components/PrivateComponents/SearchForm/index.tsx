import React, { useState, useEffect } from 'react';
import { Select, Input, Row, Col, Button, DatePicker } from 'antd';
import moment from 'moment';
import DB from '../../../DB/index';
import { SearchPropsInterface, SearchActionInterface } from '../../Interface';
import styles from './index.less';

const basicSpanItem = {
  input: 4,
  select: 4,
  rangePicker: 8,
  monthPicker: 4,
  action: 4,
  actionOffset: 0,
};
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
  optionRequestUrl?: string;
  default?: string | Array<string>;
  extra?: string;
  disabledDate?: SearchItemDisabledDateInterface;
  pickerFiledList?: Array<string>;
}

export default (props: SearchPropsInterface) => {
  const { page } = props;
  const {
    searchInfo: { searchList, searchActions, spanItem: userSpanItem },
  } = DB[page];
  const [searchInfo, setSearchInfo] = useState<object>({});
  const spanItem = Object.assign({}, basicSpanItem, userSpanItem);

  // TODO: select 后台获取

  useEffect(() => {
    const searchInfoCopy = {};
    searchList.map((searchItem: SearchItemInterface) => {
      const defaultValue: any = (() => {
        if (searchItem.type === 'rangePicker' && searchItem.default) {
          if (searchItem.default instanceof Array && searchItem.default.length === 2) {
            return [
              moment(searchItem.default[0], rangePickerDateFormat),
              moment(searchItem.default[1], rangePickerDateFormat),
            ];
          }
          throw new Error('rangePicker default 必须是数组，且 length === 2！');
        }
        return ['', ''];
      })();
      if(searchItem.type === 'rangePicker' && (!searchItem.pickerFiledList || searchItem.pickerFiledList.length !== 2)) {
        throw new Error('pickerFiledList 字段必须提供！');
      }
      Object.assign(
        searchInfoCopy,
        searchItem.type === 'rangePicker'
          ? { [`${(searchItem.pickerFiledList as Array<string>)[0]}`]: defaultValue[0], [`${(searchItem.pickerFiledList as Array<string>)[1]}`]: defaultValue[1] }
          : { [`${searchItem.key}`]: '' },
      );
    });
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
            style={{ flex: 1 }}
            onChange={(value: string) => handleChange(value, searchItem.key)}
          >
            {optionList.map(option => (
              <Option key={option.value}>{option.label}</Option>
            ))}
          </Select>
        );
      }
      case 'rangePicker': {
        const { placeholder = '请选择' } = searchItem;
        if(!searchItem.pickerFiledList || searchItem.pickerFiledList.length !== 2) {
          throw new Error('pickerFiledList 字段必须提供！');
        }
        const pickerFirstFiled = searchItem.pickerFiledList[0];
        const pickerSecondFiled = searchItem.pickerFiledList[1];
        return (
          <RangePicker
            value={searchInfo[pickerFirstFiled] && searchInfo[pickerSecondFiled] ? [moment(searchInfo[pickerFirstFiled], rangePickerDateFormat), moment(searchInfo[pickerSecondFiled], monthPickerDateFormat)] : []}
            style={{ flex: 1 }}
            allowClear={false}
            placeholder={[placeholder, placeholder]}
            onChange={(date, dateStringArr) =>
              updateSearchInfo({ [`${pickerFirstFiled}`]: dateStringArr[0], [`${pickerSecondFiled}`]: dateStringArr[1] })
            }
          />
        );
      }
      case 'monthPicker':
        return (
          <MonthPicker
            value={moment(searchItem.default, monthPickerDateFormat) || ''}
            style={{ flex: 1 }}
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
      <Row gutter={12}>
        {searchList.map((searchItem: SearchItemInterface) => (
          <Col
            key={searchItem.key}
            className={`${styles.margin} ${styles.flex}`}
            span={spanItem[searchItem.type] || 4}
          >
            {styles.label ? <div className={styles.label}>{searchItem.label}：</div> : null}
            {searchTypeEle(searchItem)}
            {searchItem.extra ? <div className={styles.extra}>{searchItem.extra}</div> : null}
          </Col>
        ))}
        <Col span={spanItem.action} offset={spanItem.actionOffset}>
          <Row gutter={12} className={styles.flex}>
            {searchActions.map((action: SearchActionInterface) => (
              <Col key={action.key}>
                <Button
                  type={action.type}
                  className={styles.margin}
                  onClick={() => actionHandle(action)}
                >
                  {action.text}
                </Button>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </div>
  );
};
