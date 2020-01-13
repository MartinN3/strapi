'use strict';
var sha256 = require('js-sha256').sha256;

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
    // Send 200 `ok`
    ctx.send({
      message: 'ok',
    });
  },

  getCloudinaryConfig: async ctx => {
    // Add your own logic here.
    const {
      cloudinary: {
        username = '',
        apiSecret = '',
        cloudName = '',
        apiKey = '',
      } = {},
    } = strapi.config;

    const notDefinedInConfig = [username, apiSecret, cloudName, apiKey]
      .filter(item => item === '')
      .forEach(item => {
        console.log(`${item} is not defined in config/cloudinary.json`);
      });

    var d = new Date();
    const timestamp = d.getTime();

    let hash = sha256.create();
    hash.update(
      `cloud_name=${cloudName}&timestamp=${timestamp}&username=${username}${apiSecret}`
    );

    const signature = hash.hex();

    // Send 200 `ok`
    ctx.send({
      message: 'ok',
      body: {
        cloudinary: {
          cloud_name: cloudName,
          api_key: apiKey,
          username,
          timestamp,
          signature,
        },
      },
    });
  },
};
