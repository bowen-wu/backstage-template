import React, { useState, useEffect } from 'react';
import { Select, Input, Row, Col, Button, DatePicker, Cascader } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import DBFn from '@/DB';
import {SearchPropsInterface, SearchActionInterface, SearchItemControlType, MethodEnum} from '../../Interface';
import styles from './index.less';
import {ObjectInterface} from "@/components/Interface";
import {ConnectState} from "@/models/connect";

const DB = DBFn();

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

export interface OptionInterface {
  label: string;
  value: string;
}

interface OptionRequestParamsInterface {
  url: string,
  method: MethodEnum,
  listRelatedFields: string,
  labelField: string,
  valueField: string,
}

interface SearchItemInterface {
  key: string;
  type: string;
  label: string;
  placeholder?: string;
  optionList?: Array<SearchItemOptionInterface>;
  optionRequestParams?: OptionRequestParamsInterface,
  default?: string | Array<string>;
  extra?: string;
  disabledDate?: SearchItemDisabledDateInterface;
  pickerFieldList?: Array<string>;
}

const SearchForm = (props: SearchPropsInterface) => {
  const { page, dispatch, searchForm } = props;
  const {searchInfo: { searchList, searchActions, spanItem: userSpanItem }} = DB[page];
  const [searchInfo, setSearchInfo] = useState<object>({});
  const spanItem = Object.assign({}, basicSpanItem, userSpanItem);
  const [cascaderOption, setCascaderOption] = useState<Array<ObjectInterface>>([]);

  useEffect(() => {
    const getSelectOptions = async () => {
      const selectList = searchList.filter((searchItem: SearchItemInterface) => searchItem.type === SearchItemControlType.Select && searchItem.optionRequestParams && Object.keys(searchItem.optionRequestParams).length);
      if(selectList.length) {
        await Promise.all(selectList.map((searchItem: SearchItemInterface) => {
          const {optionRequestParams, key} = searchItem;
          const {url: requestUrl, method, listRelatedFields: relatedFields, valueField, labelField} = (optionRequestParams as OptionRequestParamsInterface);
          return dispatch({
            type: 'searchForm/getOptionList',
            payload: {requestUrl, method, relatedFields, key, valueField, labelField},
          })
        }));
      }
    };
    getSelectOptions();

    const searchInfoCopy = {};
    searchList.map((searchItem: SearchItemInterface) => {
      const defaultValue: any = (() => {
        if (searchItem.type === SearchItemControlType.RangePicker && searchItem.default) {
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
      if(searchItem.type === SearchItemControlType.RangePicker && (!searchItem.pickerFieldList || searchItem.pickerFieldList.length !== 2)) {
        throw new Error('pickerFieldList 字段必须提供！');
      }
      Object.assign(
        searchInfoCopy,
        searchItem.type === SearchItemControlType.RangePicker
          ? { [`${(searchItem.pickerFieldList as Array<string>)[0]}`]: defaultValue[0], [`${(searchItem.pickerFieldList as Array<string>)[1]}`]: defaultValue[1] }
          : { [`${searchItem.key}`]: '' },
      );
      return null;
    });
    setSearchInfo(searchInfoCopy);
  }, [searchList]);

  const updateSearchInfo = (info: Object) => setSearchInfo(Object.assign({}, searchInfo, info));

  const actionHandle = (action: SearchActionInterface) => {
    if(action.key === 'reset') {
      setSearchInfo({});
    }
    if(props.actionsHandle) {
      props.actionsHandle(action, action.key === 'reset' ? {} : searchInfo);
    }
  };

  const handleChange = (value: string, key: string) => updateSearchInfo({ [key]: value });

  // TODO: cascader 相关逻辑
  const cascaderLoadData = (selectedOptions: any) => {
    console.log('selectedOptions -> ', selectedOptions);
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
  };

  const cascaderOnChange = (value: any, selectedOptions: any) => {
    console.log(value, selectedOptions);
  };

  const searchTypeEle = (searchItem: SearchItemInterface) => {
    switch (searchItem.type) {
      case SearchItemControlType.Input:
        return (
          <Input
            value={searchInfo[searchItem.key]}
            placeholder={searchItem.placeholder || '请输入'}
            onChange={e => handleChange(e.target.value, searchItem.key)}
          />
        );
      case SearchItemControlType.Select: {
        const optionList = (() => {
          if(searchForm[`${searchItem.key}_option_list`]) {
            return searchForm[`${searchItem.key}_option_list`];
          }
          if(searchItem.optionList instanceof Array) {
            return searchItem.optionList
          }
          return [];
        })();
        const defaultArray = optionList.filter(
          (option: SearchItemOptionInterface) => option.isDefault && option,
        );
        const defaultValue = defaultArray.length ? defaultArray[0].value : '';
        return (
          <Select
            value={searchInfo[searchItem.key] || defaultValue}
            style={{ flex: 1 }}
            onChange={(value: string) => handleChange(value, searchItem.key)}
          >
            {optionList.map((option: OptionInterface) => (
              <Option key={option.value}>{option.label}</Option>
            ))}
          </Select>
        );
      }
      case SearchItemControlType.RangePicker: {
        const { placeholder = '请选择' } = searchItem;
        if(!searchItem.pickerFieldList || searchItem.pickerFieldList.length !== 2) {
          throw new Error('pickerFieldList 字段必须提供！');
        }
        const pickerFirstField = searchItem.pickerFieldList[0];
        const pickerSecondField = searchItem.pickerFieldList[1];
        return (
          <RangePicker
            value={searchInfo[pickerFirstField] && searchInfo[pickerSecondField] ? [moment(searchInfo[pickerFirstField], rangePickerDateFormat), moment(searchInfo[pickerSecondField], monthPickerDateFormat)] : []}
            style={{ flex: 1 }}
            allowClear={false}
            placeholder={[placeholder, placeholder]}
            onChange={(date, dateStringArr) =>
              updateSearchInfo({ [`${pickerFirstField}`]: dateStringArr[0], [`${pickerSecondField}`]: dateStringArr[1] })
            }
          />
        );
      }
      case SearchItemControlType.MonthPicker:
        return (
          <MonthPicker
            value={moment(searchItem.default, monthPickerDateFormat) || ''}
            style={{ flex: 1 }}
            disabledDate={searchItem.disabledDate}
            placeholder={searchItem.placeholder || '请选择'}
          />
        );
      case SearchItemControlType.Cascader:
        return (
          <Cascader
            options={cascaderOption}
            loadData={cascaderLoadData}
            onChange={cascaderOnChange}
            changeOnSelect
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

export default connect(({ searchForm }: ConnectState) => ({ searchForm }))(SearchForm);
