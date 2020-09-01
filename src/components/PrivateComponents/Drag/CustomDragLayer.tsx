import React, { ReactNode } from 'react';
import { useDragLayer } from 'react-dnd';
import styles from './index.less';

export interface CustomDragLayerProps {
  children: ReactNode;
}

export const CustomDragLayer: React.FC<CustomDragLayerProps> = (props) => {
  const { isDragging, initialOffset, currentOffset } = useDragLayer(
    (monitor) => ({
      item: monitor.getItem(),
      itemType: monitor.getItemType(),
      initialOffset: monitor.getInitialSourceClientOffset(),
      currentOffset: monitor.getSourceClientOffset(),
      isDragging: monitor.isDragging()
    })
  );

  if (!isDragging) {
    return null;
  }

  return (
    <div className={styles.layer}>
      {(!initialOffset || !currentOffset) ? null : (
        <div style={{ transform: `translate(${currentOffset.x}px, ${currentOffset.y}px)` }}>
          <div className={styles.preview_box}>
            {props.children}
          </div>
        </div>
      )}
    </div>
  );
};
