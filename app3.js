// This is the simplest code to start the app; it works; but not currently in use

// require libraries
const AdminJS = require('adminjs');
const AdminJSExpress = require('@adminjs/express');
const express = require('express');

const AdminJSSequelize = require('@adminjs/sequelize');
const sequelize = require('./config/connection.js');
const Book = require('./models/book.js');

AdminJS.registerAdapter({
  Resource: AdminJSSequelize.Resource,
  Database: AdminJSSequelize.Database,
});

const PORT = 8000;

// Create the Express app, then uses it as a router for AdminJS and start the application
const start = async () => {
  const app = express();
  const admin = new AdminJS({
    databases: [], // this will need to be specified if I want to provide the entire database for AdminJS to load
    rootPath: '/admin',
    resources: [Book]
  });
  const adminRouter = AdminJSExpress.buildRouter(admin);
  app.use(admin.options.rootPath, adminRouter);
  sequelize.sync({ force: true }).then(() => {
    app.listen(PORT, () => {
      console.log(`AdminJS started on http://localhost:${PORT}${admin.options.rootPath}`)
    });
  });
}

start();