import Immutable from 'immutable';

import ReducerHelper from './ReducerHelper';
import {
  WIREFRAME_TOGGLE,
  SHADING_TOGGLE
} from 'webapp/app/actions/types';

const initialState = Immutable.fromJS({
  showWireframe: false,
  showShading: 0
});

export default ReducerHelper.createReducer(initialState, {
  [WIREFRAME_TOGGLE]: (state) => {
    let nextState = state;
    nextState = nextState.set('showWireframe', !nextState.get('showWireframe'));

    return nextState;
  },

  [SHADING_TOGGLE]: (state) => {
    let nextState = state;
    nextState = nextState.set('showShading', (nextState.get('showShading') + 1) % 3);

    return nextState;
  }
});
