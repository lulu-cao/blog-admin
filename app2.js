// This is more complex example code from AdminJS with authentication
// Need to change process.env.NODE_ENV and read more about session and store
// Here is a good place to start: https://www.npmjs.com/package/connect-session-sequelize
// Last step would be to try PostgreSQL and Prisma 
const AdminJS = require('adminjs')
const AdminJSExpress = require('@adminjs/express')
const express = require('express')
const passwordsFeature = require('@adminjs/passwords');
const argon2 = require('argon2');
const connect = require("connect");
const session = require('express-session')

const AdminJSSequelize = require('@adminjs/sequelize')
const sequelize = require('./config/connection.js')
const { componentLoader } = require('./components')
const User = require('./models/user.js');

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

// Below is example code for really authenticating user by comparing the password they entered with that saved in the database
// Below uses Prisma for PostgreSQL

// const authenticate = async (email, password) => {
//   const user = await prisma.user.findFirst({
//     where:{
//       email: email
//     }
//   })

//   if (user && await argon2.verify(user.password, password)) {
//     return Promise.resolve(user)
//   }
//   return null
// }

const start = async () => {
  const app = express()

  // Initalize sequelize with session store
  const SequelizeStore = require("connect-session-sequelize")(
    session.Store
  );
  
  connect().use(
    connect.session({
      store: new SequelizeStore({
        db: sequelize,
      }),
      secret: "***************CHANGEME",
    })
  );

  const adminOptions = {
    databases: [], 
    resources: [
      {
        resource: User,
        options: {
          properties: { password: { isVisible: false } },
        },
        features: [
          passwordsFeature({
            properties: {
              encryptedPassword: 'password',
              password: 'newPassword'
            },
            hash: argon2.hash,
          })
        ]
      }
    ], 
    componentLoader, 
  }
  
  const admin = new AdminJS(adminOptions)

  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    admin,
    {
      authenticate,
      cookieName: 'adminjs',
      cookiePassword: 'sessionsecret',
    },
    null,
    {
      store: SequelizeStore,
      resave: true,
      saveUninitialized: true,
      secret: 'sessionsecret',
      cookie: {
        httpOnly: process.env.NODE_ENV === 'production',
        secure: process.env.NODE_ENV === 'production',
      },
      name: 'adminjs',
    }
  );
  
  app.use(admin.options.rootPath, adminRouter)

  // Force true to drop/recreate tables on every sync; good for development, not for production
  sequelize.sync({ force: true }).then(() => {
    app.listen(PORT, () => {
      console.log(`AdminJS started on http://localhost:${PORT}${admin.options.rootPath}`)
    })
  });

}

start()