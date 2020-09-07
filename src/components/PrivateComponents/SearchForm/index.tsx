import React, { useState, useEffect } from 'react';
import { Select, Input, Row, Col, Button, DatePicker, Cascader, InputNumber } from 'antd';
import { CascaderOptionType, CascaderValueType } from 'antd/lib/cascader';
import { connect } from 'dva';
import moment from 'moment';
import DBFn from '@/DB';
import { ConnectState } from '@/models/connect';
import {
  SearchPropsInterface,
  SearchItemControlType,
  SearchInfoItem,
  SearchInfoItemOption,
  SearchInfoItemOptionRequestParams,
  SearchInfoItemAction,
} from '../../Interface';
import styles from './index.less';

const DB = DBFn();

const basicSpanItem = {
  input: 4,
  select: 4,
  rangePicker: 8,
  monthPicker: 4,
  cascader: 8,
  action: 4,
  actionOffset: 0,
};
const { Option } = Select;
const { MonthPicker, RangePicker } = DatePicker;
const monthPickerDateFormat = 'YYYY-MM';

const SearchForm = (props: SearchPropsInterface) => {
  const { page, dispatch, searchForm, config = {} } = props;
  const {
    searchInfo: { searchList, searchActions, spanItem: userSpanItem },
  } = DB[page] || config;
  const [searchInfo, setSearchInfo] = useState<object>({});
  const spanItem = { ...basicSpanItem, ...userSpanItem };

  useEffect(() => {
    const getSelectOptions = async () => {
      const selectList = searchList.filter(
        (searchItem: SearchInfoItem) =>
          searchItem.type === SearchItemControlType.Select &&
          searchItem.optionRequestParams &&
          Object.keys(searchItem.optionRequestParams).length,
      );
      if (selectList.length) {
        await Promise.all(
          selectList.map((searchItem: SearchInfoItem) => {
            const { optionRequestParams, key } = searchItem;
            const {
              url: requestUrl,
              method,
              listRelatedFieldsPath: relatedFieldsPath,
              valueField,
              labelField,
              extraSearchInfo = {},
            } = optionRequestParams as SearchInfoItemOptionRequestParams;
            return dispatch({
              type: 'searchForm/getOptionList',
              payload: {
                requestUrl,
                method,
                relatedFieldsPath,
                key,
                valueField,
                labelField,
                extraSearchInfo,
              },
            });
          }),
        );
      }
    };
    void getSelectOptions();

    const searchInfoCopy = {};
    searchList.map((searchItem: SearchInfoItem) => {
      const defaultValue: any = (() => {
        if (searchItem.type === SearchItemControlType.RangePicker && searchItem.default) {
          if (searchItem.default instanceof Array && searchItem.default.length === 2) {
            return [searchItem.default[0], searchItem.default[1]];
          }
          throw new Error('rangePicker default 必须是数组，且 length === 2！');
        }
        return ['', ''];
      })();

      if (
        searchItem.type === SearchItemControlType.RangePicker &&
        (!searchItem.pickerFieldList || searchItem.pickerFieldList.length !== 2)
      ) {
        throw new Error('pickerFieldList 字段必须提供！');
      }
      const cascaderSearchInfo = (() => {
        if (searchItem.type === SearchItemControlType.Cascader) {
          if (searchItem.cascaderFieldList instanceof Array) {
            const cascaderObj = {};
            searchItem.cascaderFieldList.map((cascaderField: string) => {
              cascaderObj[cascaderField] = '';
              return null;
            });
            return cascaderObj;
          }
          throw new Error('请提供正确的 cascaderFieldList 字段！');
        }
        return {};
      })();
      Object.assign(
        searchInfoCopy,
        cascaderSearchInfo,
        searchItem.type === SearchItemControlType.RangePicker
          ? {
              [`${(searchItem.pickerFieldList as Array<string>)[0]}`]: defaultValue[0],
              [`${(searchItem.pickerFieldList as Array<string>)[1]}`]: defaultValue[1],
            }
          : { [`${searchItem.key}`]: '' },
        searchItem.type === SearchItemControlType.Select &&
          (searchItem.mode === 'multiple' || searchItem.mode === 'tags')
          ? { [`${searchItem.key}`]: [] }
          : {},
      );
      return null;
    });
    setSearchInfo(searchInfoCopy);
  }, [searchList]);

  const updateSearchInfo = (info: Object) => setSearchInfo({ ...searchInfo, ...info });

  const actionHandle = (action: SearchInfoItemAction) => {
    if (action.key === 'reset') {
      setSearchInfo({});
    }
    if (props.actionsHandle) {
      props.actionsHandle(action, action.key === 'reset' ? {} : searchInfo);
    }
  };

  const handleChange = (value: string | number | undefined, key: string) =>
    updateSearchInfo({ [key]: value });

  const cascaderLoadData = async (selectedOptions: CascaderOptionType[] | undefined) => {
    if (selectedOptions && props.cascaderLoadData) {
      await props.cascaderLoadData(selectedOptions);
    }
  };

  const cascaderOnChange = (value: CascaderValueType, searchItem: SearchInfoItem) => {
    const info = {};
    (searchItem.cascaderFieldList as Array<string>).map((cascaderField: string, index: number) => {
      info[cascaderField] = value[index];
      return null;
    });
    updateSearchInfo(info);
  };

  const searchTypeEle = (searchItem: SearchInfoItem) => {
    const {
      type,
      label,
      key,
      pickerFieldList,
      rangePickerDateFormat = 'YYYY-MM-DD',
      optionList,
      optionRequestParams,
      extra,
      cascaderFieldList,
      ...rest
    } = searchItem;
    switch (type) {
      case SearchItemControlType.Input:
        return (
          <Input
            value={searchInfo[key]}
            placeholder={searchItem.placeholder || '请输入'}
            onChange={e => handleChange(e.target.value, key)}
            {...rest}
          />
        );
      case SearchItemControlType.InputNumber:
        return (
          <InputNumber
            value={searchInfo[searchItem.key]}
            style={{ flex: 1 }}
            min={typeof searchItem.min === 'number' ? searchItem.min : Number.MIN_SAFE_INTEGER}
            max={typeof searchItem.max === 'number' ? searchItem.max : Number.MAX_SAFE_INTEGER}
            onChange={value => handleChange(value, searchItem.key)}
            {...rest}
          />
        );
      case SearchItemControlType.RangePicker: {
        if (!pickerFieldList || pickerFieldList.length !== 2) {
          throw new Error('pickerFieldList 字段必须提供！');
        }
        const pickerFirstField = pickerFieldList[0];
        const pickerSecondField = pickerFieldList[1];
        delete rest.placeholder;
        const { placeholder = '请选择', mode, ...isolateRest } = rest;

        return (
          <RangePicker
            value={
              searchInfo[pickerFirstField] && searchInfo[pickerSecondField]
                ? [
                    moment(searchInfo[pickerFirstField], rangePickerDateFormat),
                    moment(searchInfo[pickerSecondField], rangePickerDateFormat),
                  ]
                : null
            }
            style={{ flex: 1 }}
            allowClear={false}
            placeholder={[placeholder, placeholder]}
            onChange={(date, dateStringArr) =>
              updateSearchInfo({
                [`${pickerFirstField}`]: dateStringArr[0],
                [`${pickerSecondField}`]: dateStringArr[1],
              })
            }
            {...isolateRest}
          />
        );
      }
      case SearchItemControlType.Select: {
        const isolateOptionList = (() => {
          if (searchForm[`${searchItem.key}_option_list`]) {
            return searchForm[`${searchItem.key}_option_list`];
          }
          if (optionList instanceof Array) {
            return optionList;
          }
          return [];
        })();
        const defaultArray = isolateOptionList.filter(
          (option: SearchInfoItemOption) => option.isDefault && option,
        );

        const defaultValue = defaultArray.length ? defaultArray[0].value : '';
        return (
          <Select
            value={searchInfo[searchItem.key] || (searchItem.mode ? [] : defaultValue)}
            style={{ flex: 1 }}
            onChange={(value: string) => handleChange(value, searchItem.key)}
            {...rest}
          >
            {isolateOptionList.map((option: SearchInfoItemOption) => {
              const { value: optionValue, label: optionLabel, ...optionRest } = option;
              return (
                <Option key={optionValue} value={optionValue} {...optionRest}>
                  {optionLabel}
                </Option>
              );
            })}
          </Select>
        );
      }
      // TODO： 未验证 ...reset
      case SearchItemControlType.Cascader:
        return (
          <Cascader
            allowClear={false}
            value={(searchItem.cascaderFieldList as Array<string>).map((cascaderField: string) =>
              searchInfo[cascaderField] === undefined ? '' : searchInfo[cascaderField],
            )}
            options={props.cascaderOption || []}
            loadData={cascaderLoadData}
            onChange={(value: CascaderValueType) => cascaderOnChange(value, searchItem)}
            changeOnSelect
            {...rest}
          />
        );
      case SearchItemControlType.MonthPicker:
        if (typeof searchItem.default !== 'string') {
          throw new Error('请填写正确的 default 值！');
        }
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
        {searchList.map((searchItem: SearchInfoItem) => (
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
          <Row gutter={12} justify="end">
            {searchActions.map((action: SearchInfoItemAction) => (
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
