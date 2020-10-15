import React, { ReactNode } from 'react';
import { useDrop } from 'react-dnd';
import { ConnectState } from '@/models/connect';
import { connect, Dispatch } from 'umi';

interface DragItem {
  id: string;
  type: string;
  left: number;
  top: number;
}

export interface ContainerProps {
  children: ReactNode;
  dispatch: Dispatch;
}

function doSnapToGrid(x: number, y: number): [number, number] {
  const snappedX = Math.round(x / 32) * 32;
  const snappedY = Math.round(y / 32) * 32;
  return [snappedX, snappedY];
}

const Container: React.FC<ContainerProps> = props => {
  const [, drop] = useDrop({
    accept: 'dragElement',
    drop(item: DragItem, monitor) {
      const delta = monitor.getDifferenceFromInitialOffset() as { x: number; y: number };
      const [left, top] = doSnapToGrid(
        Math.round(item.left + delta.x),
        Math.round(item.top + delta.y),
      );
      props.dispatch({
        type: 'dragState/savePosition',
        payload: { id: item.id, left, top },
      });
      return undefined;
    },
  });

  return <div ref={drop}>{props.children}</div>;
};

export default connect(({ dragState }: ConnectState) => ({ dragState }))(Container);
