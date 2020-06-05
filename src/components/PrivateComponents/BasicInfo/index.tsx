import React, { useState } from 'react';
import { Button } from 'antd';
import {
  BasicInformationInterface,
  ItemInterface,
  ExtraActionItemInterface,
} from '@/components/Interface';
import ZoomPicture from '../ZoomPicture';
import styles from './index.less';

interface PropsInterface {
  basicInfo: BasicInformationInterface;
  onActionsHandle?: (action: ExtraActionItemInterface) => void;
}

export default (props: PropsInterface) => {
  const { basicInfo } = props;

  const [isZoomPicture, setIsZoomPicture] = useState<boolean>(false);

  return (
    <div>
      <h3>{basicInfo.title}</h3>
      <div className={styles.flexSpaceBetween}>
        {basicInfo.pictureLabel ? (
          <div className={styles.flex}>
            <div className={styles.basic_label}>{basicInfo.pictureLabel}</div>
            <div className={styles.basic_icon} onClick={() => setIsZoomPicture(true)}>
              <img src={basicInfo.picSrc} alt="" />
            </div>
          </div>
        ) : null}
        {basicInfo.contentArr.map(content => (
          <div
            key={content.key}
            className={content.itemArr.some((item: ItemInterface) => item.wrap) ? styles.wrap : ''}
          >
            {content.itemArr.map((item: ItemInterface) => (
              <div key={item.label} className={styles.item}>
                <div
                  style={{ minWidth: `${content.labelLength || 6}em` }}
                  className={styles.basic_label}
                >
                  {item.label}
                </div>
                <div>{item.text}</div>
              </div>
            ))}
          </div>
        ))}
        {basicInfo.extraActions
          ? basicInfo.extraActions.map(action => (
              <Button
                type={action.type}
                key={action.text}
                onClick={() => props.onActionsHandle && props.onActionsHandle(action)}
              >
                {action.text}
              </Button>
            ))
          : null}
      </div>

      {isZoomPicture ? (
        <ZoomPicture
          pictureSrc={basicInfo.picSrc || ''}
          onCancelHandle={() => setIsZoomPicture(false)}
        />
      ) : null}
    </div>
  );
};
