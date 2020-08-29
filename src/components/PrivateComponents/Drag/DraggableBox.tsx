import React, { useEffect, ReactNode, useState } from 'react';
import { useDrag, DragSourceMonitor } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState } from '@/models/connect';
import { DragState } from '@/models/drag';

function getStyles(
  left: number,
  top: number,
  isDragging: boolean
): React.CSSProperties {
  const transform = `translate3d(${left}px, ${top}px, 0)`;
  return {
    position: 'fixed',
    zIndex: 10,
    transform,
    WebkitTransform: transform,
    opacity: isDragging ? 0 : 1,
    height: isDragging ? 0 : ''
  };
}

export interface DraggableBoxProps {
  id: string;
  left?: number;
  top?: number;
  children: ReactNode;
  dispatch: Dispatch;
  dragState: DragState;
}

const DraggableBox: React.FC<DraggableBoxProps> = (props) => {
  const [left, setLeft] = useState<number>(props.left || 0);
  const [top, setTop] = useState<number>(props.top || 0);

  useEffect(() => {
    props.dispatch({
      type: 'dragState/savePosition',
      payload: {id: props.id, left, top}
    });
  }, []);

  useEffect(() => {
    setLeft(props.dragState.left);
    setTop(props.dragState.top);
  }, [props.dragState]);

  const [ { isDragging }, drag, preview ] = useDrag({
    item: { type: 'dragElement', id: props.id, left, top },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging()
    }),
  });

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, []);

  return (
    <div ref={drag} style={getStyles(left, top, isDragging)}>
      {props.children}
    </div>
  );
};


export default connect(({ dragState }: ConnectState) => ({ dragState }))(DraggableBox);
