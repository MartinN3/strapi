import { createSelector } from 'reselect';
import pluginId from '../../pluginId';

/**
 * Direct selector to the configPage state domain
 */
const selectConfigPageDomain = () => state =>
  state.get(`${pluginId}_configPage`);

/**
 * Default selector used by ConfigPage
 */

const selectConfigPage = () =>
  createSelector(
    selectConfigPageDomain(),
    substate => substate.toJS()
  );

const makeSelectInitialData = () =>
  createSelector(
    selectConfigPageDomain(),
    substate => substate.get('initialData')
  );

const makeSelectInitialMenusList = () =>
  createSelector(
    selectConfigPageDomain(),
    substate => substate.get('initialMenusList')
  );

const makeSelectModifiedData = () =>
  createSelector(
    selectConfigPageDomain(),
    substate => substate.get('modifiedData')
  );

const makeSelectCurrentMenu = () =>
  createSelector(
    selectConfigPageDomain(),
    substate => substate.get('currentMenu')
  );

export default selectConfigPage;
export {
  makeSelectModifiedData,
  makeSelectInitialData,
  makeSelectCurrentMenu,
  makeSelectInitialMenusList,
};
