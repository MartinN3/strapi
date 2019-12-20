'use strict';

/**
 * MenuEditor.js controller
 *
 * @description: A set of functions called "actions" of the `menu-editor` plugin.
 */

const _ = require('lodash');

module.exports = {
  /**
   * Default action.
   *
   * @return {Object}
   */

  index: async ctx => {
    // Add your own logic here.

    // Send 200 `ok`
    ctx.send({
      message: 'ok',
    });
  },

  getEnvironments: async ctx => {
    const environments = _.map(
      _.keys(strapi.config.environments),
      environment => {
        return {
          name: environment,
          active: strapi.config.environment === environment,
        };
      }
    );

    ctx.send({ environments });
  },

  getSettings: async ctx => {
    let config = await strapi.plugins[
      'menu-editor'
    ].services.menueditor.getConfig(ctx.params.environment);

    ctx.send({
      config,
    });
  },

  updateSettings: async ctx => {
    await strapi
      .store({
        environment: ctx.params.environment,
        type: 'plugin',
        name: 'menu-editor',
      })
      .set({ key: 'config', value: ctx.request.body });

    ctx.send({ ok: true, value: ctx.request.body });
  },
};
