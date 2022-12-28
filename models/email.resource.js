// For a more complex example of resource options files, see book.resource.js
const Email = require('./email.js');

const EmailResourceOptions = {
  resource: Email,
  options: {
    properties: {
      body: {
        type: "richtext",
      },
      email: {
        props: {
          type: "email"
        }
      }
    }
  }
}

module.exports = EmailResourceOptions