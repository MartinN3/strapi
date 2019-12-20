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
  findOne(ctx) {
    ctx.body = {};
  },
  find(ctx) {
    ctx.body = [];
  },
  getMenus: async ctx => {
    const Menus = strapi.plugins['menu-editor'].models.menus;

    try {
      // Get the list of menus using the plugins queries
      const menus = await strapi.plugins['menu-editor'].config
        .queries(Menus)
        .getMenus();

      // Send the list of menus as response
      ctx.body = menus;
    } catch (error) {
      console.log('getMenus error:', error);
      ctx.send(
        {
          message: 'error',
          error,
        },
        400
      );
    }
  },
  setMenus: async ctx => {
    const body = ctx.request.body;

    const Menus = strapi.plugins['menu-editor'].models.menus;

    // Get the list of menus using the plugins queries
    try {
      const menus = await strapi.plugins['menu-editor'].config
        .queries(Menus)
        .setMenus({ body });

      // Send the list of menus as response
      ctx.body = menus;
    } catch (error) {
      console.log('setMenus error:', error);
      ctx.send(
        {
          message: 'error',
          error,
        },
        400
      );
    }
  },
};
