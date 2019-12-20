/**
 *
 * ConfigPage reducer
 *
 */

import { fromJS, List } from 'immutable';

import {
  GET_SETTINGS,
  GET_SETTINGS_SUCCEEDED,
  ON_CANCEL,
  ON_CHANGE,
  //SET_ERRORS,
  //SUBMIT_ERROR,
  SUBMIT_SUCCEEDED,
} from './constants';

const initialState = fromJS({
  didCheckErrors: false,
  formErrors: List([]),
  initialData: [],
  modifiedData: [],
  settings: [],
  submitSuccess: false,
});

function configPageReducer(state = initialState, action) {
  switch (action.type) {
    case GET_SETTINGS:
      return state;
    case GET_SETTINGS_SUCCEEDED:
      return (
        state
          //.update('didCheckErrors', v => (v = !v))
          //.update('formErrors', () => List([]))
          .update('initialData', () => action.initialData)
          .update('modifiedData', () => action.initialData)
      );
    case ON_CANCEL:
      return (
        state
          //.update('didCheckErrors', v => (v = !v))
          //.update('formErrors', () => List([]))
          .update('modifiedData', () => state.get('initialData'))
      );
    case ON_CHANGE:
      console.group('ON_CHANGE:');
      console.log('action.value', action.value);
      console.log('state:', state);
      console.groupEnd();

      return state.update('modifiedData', () => action.value);
    //return state.updateIn(action.keys, () => action.value);
    //case SET_ERRORS:
    //case SUBMIT_ERROR:
    //  return state
    //    .update('didCheckErrors', v => (v = !v))
    //    .update('formErrors', () => List(action.errors));
    case SUBMIT_SUCCEEDED:
      return (
        state
          //.update('didCheckErrors', v => (v = !v))
          //.update('formErrors', () => List([]))
          .update('initialData', () => action.data)
          .update('modifiedData', () => action.data)
          .update('submitSuccess', v => (v = !v))
      );
    default:
      return state;
  }
}

export default configPageReducer;
