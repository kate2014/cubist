import TypeHelper from './TypeHelper';

// Normal Action Types
const normalTypes = {
  WIREFRAME_TOGGLE: null,
  SHADING_TOGGLE: null,
  AUTO_ROTATE_TOGGLE: null
};

// Promise Action Types
const promiseTypes = {

};

export default TypeHelper.combineTypes(normalTypes, promiseTypes);