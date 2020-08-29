import { Reducer } from 'redux';

export interface DragState {
  id: string;
  left: number;
  top: number;
}

export interface DragType {
  namespace: 'dragState';
  state: DragState;
  reducers: {
    savePosition: Reducer<DragState>;
  };
}

const initState = {
  id: 'init',
  left: 0,
  top: 0
};

const Drag: DragType = {
  namespace: 'dragState',

  state: initState,

  reducers: {
    savePosition(state = initState, action) {
      return {
        ...state,
        ...action.payload
      };
    }
  }
};

export default Drag;
