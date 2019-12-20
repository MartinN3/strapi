/**
 *
 * ConfigPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';

// You can find these components in either
// ./node_modules/strapi-helper-plugin/lib/src
// or strapi/packages/strapi-helper-plugin/lib/src
import { ContainerFluid, PluginHeader } from 'strapi-helper-plugin';

import pluginId from '../../pluginId';

// Plugin's components
import EditForm from '../../components/EditForm';

import { getSettings, onCancel, onChange, setErrors, submit } from './actions';

import reducer from './reducer';
import saga from './saga';
import selectConfigPage from './selectors';

class ConfigPage extends React.Component {
  componentDidMount() {
    this.getSettings();
  }

  /**
   * Get Settings depending on the props
   * @param  {Object} props
   * @return {Func}       calls the saga that gets the current settings
   */
  getSettings = () => {
    this.props.getSettings();
  };

  handleSubmit = e => {
    e.preventDefault();

    return this.props.submit();
  };

  pluginHeaderActions = [
    {
      kind: 'secondary',
      label: 'app.components.Button.cancel',
      onClick: this.props.onCancel,
      type: 'button',
    },
    {
      kind: 'primary',
      label: 'app.components.Button.save',
      onClick: this.handleSubmit,
      type: 'submit',
    },
  ];

  render() {
    console.log('kurva', this.props.modifiedData);
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <ContainerFluid>
            <PluginHeader
              actions={this.pluginHeaderActions}
              description={{ id: 'menu-editor.ConfigPage.description' }}
              title={{ id: 'menu-editor.ConfigPage.title' }}
            />
            <EditForm
              didCheckErrors={this.props.didCheckErrors}
              formErrors={this.props.formErrors}
              modifiedData={this.props.modifiedData}
              onChange={this.props.onChange}
            />
          </ContainerFluid>
        </form>
      </div>
    );
  }
}

ConfigPage.defaultProps = {
  appEnvironments: [],
  formErrors: [],
  settings: [],
  modifiedData: [],
};

ConfigPage.propTypes = {
  appEnvironments: PropTypes.array,
  didCheckErrors: PropTypes.bool.isRequired,
  formErrors: PropTypes.array,
  getSettings: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  modifiedData: PropTypes.array.isRequired,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  setErrors: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired,
  submitSuccess: PropTypes.bool.isRequired,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getSettings,
      onCancel,
      onChange,
      setErrors,
      submit,
    },
    dispatch
  );
}

const mapStateToProps = selectConfigPage();

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

const withReducer = strapi.injectReducer({
  key: 'configPage',
  reducer,
  pluginId,
});

const withSaga = strapi.injectSaga({ key: 'configPage', saga, pluginId });

export default compose(
  withReducer,
  withSaga,
  withConnect
)(ConfigPage);
