/**
 *
 *
 * ConfigPage actions
 *
 */

import {
  GET_SETTINGS,
  GET_SETTINGS_SUCCEEDED,
  ON_CANCEL,
  ON_CHANGE,
  SET_ERRORS,
  SUBMIT,
  SUBMIT_ERROR,
  SUBMIT_SUCCEEDED,
} from './constants';

export function getSettings() {
  return {
    type: GET_SETTINGS,
  };
}

export function getSettingsSucceeded(initialData) {
  return {
    type: GET_SETTINGS_SUCCEEDED,
    initialData,
  };
}

export function onCancel() {
  return {
    type: ON_CANCEL,
  };
}

export function onChange(menuRows) {
  return {
    type: ON_CHANGE,
    value: menuRows,
  };
}

export function setErrors(errors) {
  return {
    type: SET_ERRORS,
    errors,
  };
}

export function submit() {
  return {
    type: SUBMIT,
  };
}

export function submitError(errors) {
  return {
    type: SUBMIT_ERROR,
    errors,
  };
}

export function submitSucceeded(data) {
  return {
    type: SUBMIT_SUCCEEDED,
    data,
  };
}
