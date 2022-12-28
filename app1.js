// This is more simple example code from AdminJS without authentication; currently in use
// So far, everything here works
const AdminJS = require('adminjs')
const { componentLoader } = require('./components')
const AdminJSExpress = require('@adminjs/express')
const express = require('express')

// Register Adapters Line 7-16
const AdminJSSequelize = require('@adminjs/sequelize')
const sequelize = require('./config/connection.js')
const Movie = require('./models/Movie.js');
const BookResourceOptions = require('./models/book.resource.js'); // File is named based on official demo filename
const Article = require('./models/article.js');
const User = require('./models/user.js');
const EmailResourceOptions = require('./models/email.resource.js')

AdminJS.registerAdapter({
  Resource: AdminJSSequelize.Resource,
  Database: AdminJSSequelize.Database,
})

const PORT = 3000

const start = async () => {
  const app = express()

  // Passing resources to AdminJS
  const adminOptions = {
    // Method 1: provide entire database
    databases: [], // this array will need to be specified 
    // Method 2 (recommended): provide every resource explicitly 
    resources: [
      Movie,
      User,
      BookResourceOptions, {
      resource: Article,
      options: {
        properties: {
          date: {
            isVisible: false // Setting it false will hide the field in creating a record, too
          },
          rating: {
            availableValues: [
              { value: 1, label: "1 star" },
              { value: 2, label: "2 stars" },
              { value: 3, label: "3 stars" },
              { value: 4, label: "4 stars" },
              { value: 5, label: "5 stars" },
            ]
          },
          book: {
            reference: "books", // There will be a Book field for users to select in creating an Article record
            // And there will a link in Article records that could redirect users to the corresponding book record
          }
        }
      }
      }, EmailResourceOptions // You can write options here directly or you can put them in a separate file and import here
    ], 
    componentLoader, // Register custom components here
  }
  
  // Please note that some plugins don't need you to create AdminJS instance manually,
  // instead you would just pass `adminOptions` into the plugin directly,
  // an example would be "@adminjs/hapi"
  const admin = new AdminJS(adminOptions)

  const adminRouter = AdminJSExpress.buildRouter(admin)
  app.use(admin.options.rootPath, adminRouter)

  // Example code for custom route; it works 
  const bookRoute = require('./routes/api/bookRoutes.js');
  app.use(express.json()); // put this after mounting adminJS route to avoid conflict
  app.use("/books", bookRoute);

  // error handler for custom route
  app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).json({ success: false, message: "INTERNAL_ERROR" });
  });

  // Force true to drop/recreate tables on every sync; good for development, not for production
  sequelize.sync({ force: true }).then(() => {
    app.listen(PORT, () => {
      console.log(`AdminJS started on http://localhost:${PORT}${admin.options.rootPath}`)
    })
  });

  // Launch a separate bundling process in the background
  admin.watch()
}

start()


