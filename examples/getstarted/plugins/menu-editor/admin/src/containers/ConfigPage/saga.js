// import { LOCATION_CHANGE } from 'react-router-redux';
import { call, fork, put, select, takeLatest } from 'redux-saga/effects';
import { request } from 'strapi-helper-plugin';
import { getSettingsSucceeded, getSettings } from './actions';
import { GET_SETTINGS, SUBMIT } from './constants';
import {
  makeSelectModifiedData,
  makeSelectCurrentMenu,
  makeSelectInitialMenusList,
} from './selectors';
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
    const menusListResponse = yield call(request, `/${pluginId}/list-menus`, {
      method: 'GET',
    });
    const initialMenusList = menusListResponse.map(item => item['menu_uuid']);

    const currentMenu = yield select(makeSelectCurrentMenu());

    const isCurrentMenuInDatabase = Boolean(
      initialMenusList.find(item => item === currentMenu)
    );

    const initialDataRequest = {
      url: `/${pluginId}`,
      params: {
        menu_uuid: currentMenu,
      },
    };

    //If its in database, fetch it
    if (currentMenu === null || isCurrentMenuInDatabase) {
      const initialDataResponse = yield call(request, initialDataRequest.url, {
        method: 'GET',
        params: initialDataRequest.params,
      });

      yield put(
        getSettingsSucceeded({
          initialData: convert(remapSortlyInput(initialDataResponse)),
          initialMenusList,
        })
      );
    } else {
      yield put(
        getSettingsSucceeded({
          initialData: [],
        })
      );
    }
  } catch (err) {
    strapi.notification.error('notification.error');
  }
}

export function* submit() {
  //const initialData = yield select(makeSelectInitialData())

  //function difference(setA, setB) {
  //  let _difference = new Set(setA)
  //  for (let elem of setB) {
  //      _difference.delete(elem)
  //  }
  //  return _difference
  //}

  //const CH = difference(new Set(modifiedData), new Set(initialData))
  //const R = initialData.filter(item => {
  //  const rowidMapInitialData = new Set(initialData.map(item => item.rowid))
  //  const rowidMapModifiedData = new Set(modifiedData.map(item => item.rowid))
  //  return difference(rowidMapInitialData, rowidMapModifiedData).has(item.rowid)
  //})

  try {
    const modifiedData = yield select(makeSelectModifiedData());
    // const env = yield select(makeSelectEnv());
    let body = remapSortlyOutput(flatten(modifiedData));

    const requestURL = `/${pluginId}`;
    yield call(request, requestURL, { method: 'PUT', body });

    // Update reducer with optimisticResponse
    strapi.notification.success('email.notification.config.success');

    //yield put(submitSucceeded(convert(remapSortlyInput(response))));
    yield put(getSettings());
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
