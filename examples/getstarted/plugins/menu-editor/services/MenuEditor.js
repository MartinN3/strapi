'use strict';

/**
 * MenuEditor.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

const getConfig = async env => {
  let config = await strapi
    .store({
      environment: env,
      type: 'plugin',
      name: 'menu-editor',
    })
    .get({
      key: 'config',
    });

  return config;
};

module.exports = {
  getConfig,
};
