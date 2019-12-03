'use strict';

/**
 * EnvSettings.js controller
 *
 * @description: A set of functions called "actions" of the `envsettings` plugin.
 */

module.exports = {
  /**
   * Default action.
   *
   * @return {Object}
   */

  index: async ctx => {
    // Add your own logic here.
    console.log(strapi.config);

    // Send 200 `ok`
    ctx.send({
      message: 'ok',
    });
  },
};
