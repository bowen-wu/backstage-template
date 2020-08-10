import React, { useState, useEffect } from 'react';
import BraftEditor from 'braft-editor';
import { Button, Spin } from 'antd';
import { RichTextEditorPropsInterface } from '@/components/Interface';
import styles from './index.less';
import 'braft-editor/dist/index.css';

const RichTextEditor = (props: RichTextEditorPropsInterface) => {
  const [editorState, setEditorState] = useState<any>(null);
  const [readOnly, setReadOnly] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [actionText, setActionText] = useState<string>('编辑');

  useEffect(() => {
    setEditorState(BraftEditor.createEditorState(props.htmlContent));
  }, [props.htmlContent]);

  const submitContent = () => {
    // 在编辑器获得焦点时按下ctrl+s会执行此方法
    const htmlContent = editorState.toHTML();
    if (props.saveEditorContentHandle) {
      props.saveEditorContentHandle(htmlContent);
    }
    setLoading(false);
  };

  const handleEditorChange = (newEditorState: any) => {
    setEditorState(newEditorState);
  };

  const onChangeStatus = () => {
    if (actionText === '保存') {
      setLoading(true);
      submitContent();
    }
    setReadOnly(!readOnly);
    setActionText(actionText === '保存' ? '编辑' : '保存');
  };

  return (
    <Spin spinning={loading}>
      <div className={styles.flex}>
        <h3 style={{ marginBottom: '0' }}>{props.title}</h3>
        <Button type="primary" style={{ marginLeft: 'auto' }} onClick={onChangeStatus}>
          {actionText}
        </Button>
      </div>
      <br />
      <div className={styles.mask_container}>
        <BraftEditor
          className={styles.braft_editor}
          readOnly={readOnly}
          value={editorState}
          onChange={handleEditorChange}
        />
        {readOnly ? <div className={styles.mask} /> : null}
      </div>
    </Spin>
  );
};

export default RichTextEditor;
