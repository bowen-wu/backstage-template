# BackStage Template

## Environment Prepare

Install `node_modules`:

```
yarn
```

### Start project

```
yarn start
```

### Build project

```
yarn build
```

### Check code style

```
yarn lint
```

You can also use script to auto fix some lint error:

```
yarn lint:fix
```

## 使用

### 路由

权限路由由接口获取，初始路由为 `config/config.ts` 文件中的 `routes`

### 使用基础表格功能

1.  引入 `components/PrivateComponents/pageBasic` 组件并在 `render` 中使用

    - `pageBasic` 参数说明

    | 参数 | 说明 | 类型 | 默认值 | required |
    | :-: | :-: | :-: | :-: | :-: |
    | page | 页面唯一标识，同时对应着 `DB/index.ts` 中的相关配置 | string | - | true |
    | hasSearchForm | 是否含有 `searchForm` | boolean | false | false |
    | extraSearchInfo | 在搜索时会带上 `extraSearchInfo` 中的字段 | object | - | false |
    | searchActionsHandle | 搜索后的回调函数 | (action: ActionInterface) => void | - | false |
    | actionsHandle | 表格中 action 操作的回调函数 | (action: ActionInterface, record: any) => void | - | false |
    | refresh | 值更改了之后，则会强制刷新 `table` | boolean | - | false |
    | onRowSelectionChange | table 中表格行选中项发生变化时的回调 | (selectedRows: Array<ObjectInterface>) => void | - | false |

        <!--
            TODO: 这两个参数需要更新
            tableList: TableListModelState;
            dispatch: Dispatch;
        -->

2.  在 `DB/index.ts` 中添加使用了 `components/PrivateComponents/pageBasic` 组件的相关配置

    - 数据结构

      ```
      {
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
          pageObj,
      }
      ```

    - 字段含义

    | 参数 | 说明 | 类型 | 默认值 | required |
    | :-: | :-: | :-: | :-: | :-: |
    | detailsUrl | 详情页面接口，前提是 table action 中有详情按钮 | string | '' | false |
    | requestUrl | 页面中 table 数据的接口 | string | '' | true |
    | requestMethod | 请求 table 数据的接口的方法 | enum[MethodEnum] | MethodEnum.GET | false |
    | searchInfo | search form 相关信息 | Object | - | false |
    | tableInfo | table 相关信息 | Object | 无 | true |
    | pageObj | 页码相关信息 | Object | 无 | true |
    | tableListRelatedFields | 接口获取的 table 相关字段 | object | - | false |

    `searchInfo` 字段说明

    | 参数 | 说明 | 类型 | 默认值 | required |
    | :-: | :-: | :-: | :-: | :-: |
    | searchList | searchForm 中的搜索项 | Array<Object> | - | true |
    | searchActions | searchForm 中的操作项 | Array<Object> | - | false |
    | spanItem | 各个类型的控件占据的 span | SpanItemInterface | - | false |
    | externalProcessingActionKeyList | 外部处理的 action 的 key 的集合 | Array | - | false |

    `tableInfo` 字段说明

    |     参数     |           说明           |     类型      | 默认值 | required |
    | :----------: | :----------------------: | :-----------: | :----: | :------: |
    |  columnList  | table 中的列描述数据对象 | Array<Object> |   -    |   true   |
    |   keyList    | table 的 `rowKey` 的集合 |     Array     |   -    |   true   |
    |  actionList  |     table 中的操作项     | Array<Object> |   -    |  false   |
    |    scroll    |  表格是否可滚动，配置项  |    object     |   -    |  false   |
    | rowSelection | 表格行是否可选择，配置项 |    object     |   -    |  false   |

    `searchList<Object>` 字段说明

    | 参数 | 说明 | 类型 | 默认值 | required |
    | :-: | :-: | :-: | :-: | :-: |
    | type | search item 的控件类型 | enum[SearchItemControlType] | - | true |
    | label | search item label 标签的文本 | string | '' | false |
    | key | React 需要的 key，不能有相同的 | string | - | true |
    | placeholder | 控件的占位文本 | string | '' | false |
    | optionRequestUrl | 当 `type === SearchItemControlType.Select` 时设置才生效。获取选项列表请求的 url, 当 `optionRequestUrl` 和 `optionList` 同时存在时，以 `optionRequestUrl` 为主 | string | - | false |
    | optionList | 当 `type === SearchItemControlType.Select` 时设置才生效。选项列表 | Array | - | false |
    | default | 默认值 | 由控件类型决定，`string | Array<string>` | - | false |
    | disabledDate | 当控件类型为 `SearchItemControlType.MonthPicker` 时才生效。不可选择的日期 | (currentDate: moment) => boolean | - | false |
    | extra | 控件后面需要补充的文字 | string | - | false |

    `searchActions<Object>` 字段说明

    | 参数 |              说明              |    类型    | 默认值 | required |
    | :--: | :----------------------------: | :--------: | :----: | :------: |
    | key  | React 需要的 key，不能有相同的 |   string   |   -    |   true   |
    | text |          action 文案           |   string   |   -    |   true   |
    | type |       action Button type       | ButtonType |   -    |   true   |

    `columnList<Object>` 字段说明

    | 参数 | 说明 | 类型 | 默认值 | required |
    | :-: | :-: | :-: | :-: | :-: |
    | title | 列头显示文字 | string | - | true |
    | dataIndex | 列数据在数据项中对应的 key | string | - | true |
    | key | React 需要的 key，和 dataIndex 保持一致即可 | string | - | true |
    | fixed | 列是否固定，可选 true(等效于 left) 'left' 'right' | boolean 或 string | false | false |
    | render | 生成复杂数据的渲染函数，参数分别为当前行的值，当前行数据，行索引 | Function(text, record, index) {} | - | false |
    | width | 列宽度 | string 或 number | - | false |

    `actionList<Object>` 字段说明

    | 参数 | 说明 | 类型 | 默认值 | required |
    | :-: | :-: | :-: | :-: | :-: |
    | key | React 需要的 key，不能有相同的 | string | - | true |
    | type | action Button type | ButtonType 或 'popConfirm' | - | true |
    | text | action 文案 | string | - | false |
    | depend | action 文案的依据字段，此字段为 column 中的 key | string | - | false |
    | status | 依据 depend 字段的状态来确定各个状态的文案 | Object | - | false |
    | extraInfo | 如果 `type === popConfirm` 时，`popConfirm` 的 `title` 在这里获取 | ExtraInfoInterface | - | false |
    | exchangeStatusUrl | 状态更改时需要访问的 url | string | - | false |
    | exchangeStatusParamsKeyObj | 状态更改时需要传递的参数 | Object | - | false |
    | exchangeStatusParamsPosition | 状态更改时传递的参数放置的位置 | ExchangeStatusParamsPositionEnum | - | false |
    | exchangeStatusObj | 状态更改时状态的最终改变量 | object | - | false |
    | exchangeStatusKey | 状态更改时需要更改的字段 | string | - | false |
    | route | 如果提供 `route` 并且 `key !== 'status'` 时，action 的文案为 `text || '详情'`，点击 action 后，跳转至此 route | string | - | false |

    ```
    注意：
    - 当 ` key === status ` depend 和 status 才会生效
    - 当 ` depend ` 和 ` status ` 全部为真时，action 文案才会生效，此时可以不用 ` text ` 字段
    ```

    `ExtraInfoInterface` 字段说明

    | 参数  |         说明          |       类型       | 默认值 | required |
    | :---: | :-------------------: | :--------------: | :----: | :------: |
    | title | `popConfirm` 的 title | object 或 string |   -    |   true   |

    `SpanItemInterface` 字段说明

    |     参数     |             说明             |  类型  | 默认值 | required |
    | :----------: | :--------------------------: | :----: | :----: | :------: |
    |    input     |     input 控件占据 span      | number |   4    |  false   |
    |    select    |     select 控件占据 span     | number |   4    |  false   |
    | rangePicker  |  rangePicker 控件占据 span   | number |   8    |  false   |
    | monthPicker  |  monthPicker 控件占据 span   | number |   4    |  false   |
    |    action    |     action 控件占据 span     | number |   4    |  false   |
    | actionOffset | actionOffset 控件的便宜 span | number |   0    |  false   |

    `scroll` 字段说明

    | 参数 | 说明 | 类型 | 默认值 | required |
    | :-: | :-: | :-: | :-: | :-: |
    | x | 设置横向滚动，也可用于指定滚动区域的宽和高，可以设置为像素值，百分比，true 和 'max-content' | number 或 true | - | false |
    | y | 设置纵向滚动，也可用于指定滚动区域的宽和高，可以设置为像素值，百分比，true 和 'max-content' | number 或 true | - | false |
    | rangePicker | 当分页、排序、筛选变化后是否滚动到表格顶部 | boolean | - | false |

    `rowSelection` 字段说明

    | 参数  |               说明               |  类型   |   默认值   | required |
    | :---: | :------------------------------: | :-----: | :--------: | :------: |
    | fixed |       把选择框列固定在左边       | boolean |     -      |  false   |
    | type  | 多选/单选，`checkbox` or `radio` | string  | `checkbox` |  false   |
    
    ` tableListRelatedFields ` 字段说明
    
    | 参数  |               说明               |  类型   |   默认值   | required |
    | :---: | :------------------------------: | :-----: | :--------: | :------: |
    | data  | 后台接口返回的包装的字段 | string  | data |  false   |
    | total |       总条数     | string |     total      |  false   |
    | list | 数组字段 | string | list | false |
    
    ` pageObj ` 字段说明
    
    | 参数  |               说明               |  类型   |   默认值   | required |
    | :---: | :------------------------------: | :-----: | :--------: | :------: |
    | pageSizeFiled  | pageSize 字段名称 | string  | - |   true  |
    | currentFiled |       currentPage 字段名称     | string |     -      |  true   |
    | [`${pageSizeFiled}`] | pageSize 字段 | number | - | true |
    | [`${currentFiled}`] | currentPage 字段 | number | - | true |
