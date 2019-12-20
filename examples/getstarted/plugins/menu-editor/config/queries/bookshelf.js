module.exports = model => ({
  getMenus: async () => {
    return model.fetchAll();
  },
  setMenus: async ({ body }) => {
    return Promise.all(body.map(menu => model.forge(menu).save()));
  },
});
