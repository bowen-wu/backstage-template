import React, { useState, useEffect } from 'react';
import { Upload, message } from 'antd';
import { ObjectInterface, UploadFilePropInterface } from '@/components/Interface';
import { ConnectState } from '@/models/connect';
import { connect } from 'umi';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons/lib';

const UploadFile = (props: UploadFilePropInterface) => {
  const { dispatch } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [defaultValue, setDefaultValue] = useState<string>(props.defaultValue || '');

  useEffect(
    () => () => {
      dispatch({
        type: 'global/initUploadFileUrl',
        payload: {},
      });
    },
    [],
  );

  useEffect(() => {
    setDefaultValue(props.global.uploadFileUrl || props.defaultValue || '');
  }, [props.global.uploadFileUrl, props.defaultValue]);

  useEffect(() => {
    if (props.uploadSuccess) {
      props.uploadSuccess(props.global.uploadFileUrl || props.defaultValue || '');
    }
  }, [props.global, props.uploadSuccess, props.defaultValue]);

  const beforeUpload = (file: any) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只支持 JPG 或 PNG 图片!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('请上传小于 2MB 的图片!');
    }
    return isJpgOrPng && isLt2M;
  };

  const customRequest = async (event: ObjectInterface) => {
    setDefaultValue('');
    setLoading(true);
    const formData = new FormData();
    formData.append('file', event.file);
    await dispatch({
      type: 'global/uploadFile',
      payload: { data: formData },
    });
    setLoading(false);
  };

  return (
    <div>
      <Upload
        listType="picture-card"
        showUploadList={false}
        beforeUpload={beforeUpload}
        customRequest={customRequest}
      >
        {defaultValue ? (
          <img src={defaultValue} alt="" style={{ width: '100%' }} />
        ) : (
          <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div className="ant-upload-text">Upload</div>
          </div>
        )}
      </Upload>
    </div>
  );
};

export default connect(({ global }: ConnectState) => ({ global }))(UploadFile);
