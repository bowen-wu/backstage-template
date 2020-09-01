import React, { useEffect, ReactNode, useState, Fragment } from 'react';
import { useDrag, DragSourceMonitor } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState } from '@/models/connect';
import { DragState } from '@/models/drag';
import { CustomDragLayer } from '@/components/PrivateComponents/Drag/CustomDragLayer';

import styles from './index.less';

export interface DraggableBoxProps {
  id: string;
  left?: number;
  top?: number;
  children: ReactNode;
  dispatch: Dispatch;
  dragState: DragState;
}

const DraggableBox: React.FC<DraggableBoxProps> = (props) => {
  const [ left, setLeft ] = useState<number>(props.left || 0);
  const [ top, setTop ] = useState<number>(props.top || 0);

  useEffect(() => {
    props.dispatch({
      type: 'dragState/savePosition',
      payload: { id: props.id, left, top }
    });
  }, []);

  useEffect(() => {
    setLeft(props.dragState.left);
    setTop(props.dragState.top);
  }, [ props.dragState ]);

  const [ { isDragging }, drag, preview ] = useDrag({
    item: { type: 'dragElement', id: props.id, left, top },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, []);

  return (
    <Fragment>
      <div ref={drag} style={{
        transform: `translate3d(${left}px, ${top}px, 0)`,
        opacity: isDragging ? 0 : 1,
        height: isDragging ? 0 : ''
      }} className={styles.children}>
        {props.children}
      </div>
      <CustomDragLayer>{props.children}</CustomDragLayer>
    </Fragment>
  );
};


export default connect(({ dragState }: ConnectState) => ({ dragState }))(DraggableBox);
