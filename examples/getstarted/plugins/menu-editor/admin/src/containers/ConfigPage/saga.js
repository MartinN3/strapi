// import { LOCATION_CHANGE } from 'react-router-redux';
import { call, fork, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'strapi-helper-plugin';
import { getSettingsSucceeded, submitSucceeded } from './actions';
import { GET_SETTINGS, SUBMIT } from './constants';
import { makeSelectModifiedData } from './selectors';
import pluginId from '../../pluginId';
import { flatten, convert } from 'react-sortly';

const remapSortlyInput = databaseOutput => {
  return databaseOutput.map(row => {
    const {
      id,
      uuid,
      parent_uuid = null,
      menu_uuid,
      index,
      name,
      page_id,
    } = row;

    return {
      rowid: id,
      id: uuid,
      index,
      name,
      parentId: parent_uuid,
      menu_uuid,
      page_id,
    };
  });
};

const remapSortlyOutput = sortlyOutput => {
  return sortlyOutput.map(row => {
    const { rowid, id, index, name, parentId = null, page_id, menu_uuid } = row;

    return {
      id: rowid,
      uuid: id,
      index,
      name,
      parent_uuid: parentId,
      menu_uuid,
      page_id,
    };
  });
};

export function* settingsGet() {
  try {
    const requestURL = `/${pluginId}/menus`;
    const response = yield call(request, requestURL, { method: 'GET' });

    yield put(getSettingsSucceeded(convert(remapSortlyInput(response))));
  } catch (err) {
    strapi.notification.error('notification.error');
  }
}

export function* submit() {
  try {
    // const env = yield select(makeSelectEnv());
    let body = yield select(makeSelectModifiedData());
    body = remapSortlyOutput(flatten(body));

    console.group('SAGA SUBMIT body:');
    console.log(body);
    console.groupEnd();

    const requestURL = `/${pluginId}/menus`;
    const response = yield call(request, requestURL, { method: 'PUT', body });

    // Update reducer with optimisticResponse
    strapi.notification.success('email.notification.config.success');

    console.group('SAGA SUBMIT Succeeded body:');
    console.log(convert(remapSortlyInput(response)));
    console.groupEnd();

    yield put(submitSucceeded(convert(remapSortlyInput(response))));
  } catch (err) {
    strapi.notification.error('notification.error');
    // TODO handle error PUT
  }
}

function* defaultSaga() {
  yield fork(takeLatest, GET_SETTINGS, settingsGet);
  yield fork(takeLatest, SUBMIT, submit);
}

export default defaultSaga;
