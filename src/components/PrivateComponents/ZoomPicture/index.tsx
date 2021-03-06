import React, { useState } from 'react';
import { Modal } from 'antd';
import { ZoomPicturePropsInterface } from '@/components/Interface';
import styles from './index.less';

export default (props: ZoomPicturePropsInterface) => {
  const [modalVisible, setModalVisible] = useState<boolean>(true);

  const onCancelHandle = () => {
    setModalVisible(false);
    if (props.onCancelHandle) {
      props.onCancelHandle();
    }
  };

  return (
    <div>
      <Modal
        title=""
        visible={modalVisible}
        closable={false}
        destroyOnClose
        footer={null}
        onCancel={onCancelHandle}
        width={props.width || 720}
      >
        <div className={styles.big_icon}>
          <img src={props.pictureSrc} alt="" />
        </div>
      </Modal>
    </div>
  );
};
