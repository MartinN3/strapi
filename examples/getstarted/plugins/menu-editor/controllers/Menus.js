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
  getMenusList: async ctx => {
    const Menus = strapi.plugins['menu-editor'].models.menus;

    try {
      // Get the list of menus using the plugins queries
      const menusList = await strapi.plugins['menu-editor'].config
        .queries(Menus)
        .getMenusList();

      // Send the list of menus as response
      ctx.body = menusList;
    } catch (error) {
      console.log('getMenusList error:', error);
      ctx.send(
        {
          message: 'error',
          error,
        },
        400
      );
    }
  },
  getMenus: async ctx => {
    const { menu_uuid = null } = ctx.request.query;
    const Menus = strapi.plugins['menu-editor'].models.menus;
    const params = {
      menu_uuid: menu_uuid,
    };

    try {
      // Get the list of menus using the plugins queries
      const menus = await strapi.plugins['menu-editor'].config
        .queries(Menus)
        .getMenu(params);

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
