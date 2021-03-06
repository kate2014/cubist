import Immutable from 'immutable';

import ReducerHelper from './ReducerHelper';
import {
  CAMERA_ORBIT,
  CAMERA_UPDATE,
  CAMERA_SET_VIEW
} from 'webapp/actions/types';

// Take note that each element in the list is Vector3
const initialState = Immutable.fromJS({
  position: new Immutable.Map({ x: 0, y: 450, z: 450 }),
  up: new Immutable.Map({ x: 0, y: 1, z: 0 }),
  lookAt: new Immutable.Map({ x: 0, y: 0, z: 0 }),
  quaternion: new Immutable.Map({ x: 0, y: 0, z: 0, w: 0 }),
  trigger: false
});

export default ReducerHelper.createReducer(initialState, {
  [CAMERA_ORBIT](state, action) {
    let nextState = state;
    nextState = nextState.merge(Immutable.fromJS(action.payload));
    return nextState;
  },

  [CAMERA_UPDATE]: (state, camera) => {
    let nextState = state;
    const { position, up, lookAt, quaternion } = camera.payload;

    nextState = nextState.set('position', Immutable.fromJS(position));
    nextState = nextState.set('up', Immutable.fromJS(up));
    nextState = nextState.set('lookAt', Immutable.fromJS(lookAt));
    nextState = nextState.set('quaternion', Immutable.fromJS(quaternion));

    return nextState;
  },

  [CAMERA_SET_VIEW]: (state, { payload }) => {
    let nextState = state;
    const { position, lookAt } = payload;

    nextState = nextState.set('position', Immutable.fromJS(position));
    nextState = nextState.set('lookAt', Immutable.fromJS(lookAt));
    nextState = nextState.set('trigger', !nextState.get('trigger'));

    return nextState;
  }

});
