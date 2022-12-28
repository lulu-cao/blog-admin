// This is more complex example code from AdminJS with authentication (need to change Line 53 connectionString in order to use)
const AdminJS = require('adminjs')
const AdminJSExpress = require('@adminjs/express')
const express = require('express')

// Store our session in a Postgres table and 
// allow our session store to connect to the database.
const Connect = require('connect-pg-simple')
const session = require('express-session')

// Register Adapters Line 8-14
const AdminJSSequelize = require('@adminjs/sequelize')
const sequelize = require('./config/connection1.js')
const Category = require('./models/Category.js');

AdminJS.registerAdapter({
  Resource: AdminJSSequelize.Resource,
  Database: AdminJSSequelize.Database,
})

const PORT = 3000

const DEFAULT_ADMIN = {
  email: 'admin@example.com',
  password: 'password',
}

const authenticate = async (email, password) => {
  if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
    return Promise.resolve(DEFAULT_ADMIN)
  }
  return null
}

const start = async () => {
  const app = express()

  // Register Adapters Line 34-43
  const adminOptions = {
    // We pass Category to `resources`
    resources: [Category],
  }
  
  // Please note that some plugins don't need you to create AdminJS instance manually,
  // instead you would just pass `adminOptions` into the plugin directly,
  // an example would be "@adminjs/hapi"
  // const admin = new AdminJS(adminOptions)
  const admin = new AdminJS({})

  const ConnectSession = Connect(session)
  const sessionStore = new ConnectSession({
    conObject: {
      connectionString: 'postgres://adminjs:adminjs@localhost:5435/adminjs',
      ssl: process.env.NODE_ENV === 'production',
    },
    tableName: 'session',
    createTableIfMissing: true,
  })

  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    admin,
    {
      authenticate,
      cookieName: 'adminjs',
      cookiePassword: 'sessionsecret',
    },
    null,
    {
      store: sessionStore,
      resave: true,
      saveUninitialized: true,
      secret: 'sessionsecret',
      cookie: {
        httpOnly: process.env.NODE_ENV === 'production',
        secure: process.env.NODE_ENV === 'production',
      },
      name: 'adminjs',
    }
  )
  app.use(admin.options.rootPath, adminRouter)

  // Force true to drop/recreate tables on every sync; good for development, not for production
  sequelize.sync({ force: true }).then(() => {
    app.listen(PORT, () => {
      console.log(`AdminJS started on http://localhost:${PORT}${admin.options.rootPath}`)
    })
  });

}

start()