module.exports = function(app) {
  
  var proxyRoutes = App.route('proxyRoutes')
  app.get   ("/proxy", proxyRoutes.process)

  var confRoutes  = App.route('confRoutes')
  app.get   ("/conf/list",       confRoutes.list)
  app.get   ("/conf/get/:key",   confRoutes.getByKey)
  app.post  ("/conf/add",        confRoutes.add)
  app.put   ("/conf/update/:id", confRoutes.update)
  app.delete("/conf/del/:id",    confRoutes.del)

  var servicesRoutes  = App.route('servicesRoutes')
  app.get   ("/services/list",       servicesRoutes.list)
  app.get   ("/services/get/:key",   servicesRoutes.getByKey)
  app.post  ("/services/add",        servicesRoutes.add)
  app.put   ("/services/update/:id", servicesRoutes.update)
  app.delete("/services/del/:id",    servicesRoutes.del)

  var statsRoutes  = App.route('statsRoutes')
  app.get   ("/statistics/list",       statsRoutes.list)
  app.get   ("/statistics/get/:key",   statsRoutes.getByKey)
  app.put   ("/statistics/reset/:key", statsRoutes.resetByKey)

  app.get('*', function(req, res) { 
    res.sendFile(App.appPath('public/404.html'));
  });
  
}