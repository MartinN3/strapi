const bookshelf = require('bookshelf');

module.exports = model => ({
  getMenu: async ({ menu_uuid }) => {
    if (menu_uuid === null) {
      return [];
    } else {
      return await model.where({ menu_uuid: menu_uuid }).fetchAll();
    }
  },
  getMenusList: async () => {
    //return await model.query({distinct: "menu_uuid"}).fetchAll()  },
    return await model.query(qb => qb.distinct('menu_uuid')).fetchAll();
  },
  setMenus: async ({ body }) => {
    const item = body.find(item => item.menu_uuid);
    const menu_uuid = item && item['menu_uuid'];

    const Bookshelf = new bookshelf(strapi.connections.default);

    //return await Bookshelf.knex("menu-editor_menus").insert(body)
    return await Bookshelf.knex.transaction(async trx => {
      try {
        await Bookshelf.knex('menu-editor_menus')
          .transacting(trx)
          .where({ menu_uuid: menu_uuid })
          .del();

        const r2 = await Bookshelf.knex('menu-editor_menus')
          .transacting(trx)
          .insert(body);
        await trx.commit;

        return r2;
      } catch (error) {
        console.log('error', error);
        await trx.rollback;
      }
    });
  },
});
