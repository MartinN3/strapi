'use strict';

/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 */
const _ = require('lodash');

module.exports = async () => {
  // set plugin store
  const pluginStore = strapi.store({
    environment: strapi.config.environment,
    type: 'plugin',
    name: 'menu-editor',
  });

  // if provider config does not exist set one by default
  const config = await pluginStore.get({ key: 'config' });

  if (!config) {
    const value = _.assign(
      {},
      {
        'menu-0': [],
      }
    );

    await pluginStore.set({ key: 'config', value });
  }
};
