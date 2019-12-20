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

const makeSelectModifiedData = () =>
  createSelector(
    selectConfigPageDomain(),
    substate => {
      console.group('Selectors makeSelectModifiedData:');
      //console.log('substate', substate)
      console.log('modified data to JS', substate.get('modifiedData'));
      console.groupEnd();
      return substate.get('modifiedData');
    }
  );

export default selectConfigPage;
export { makeSelectModifiedData };
