// For a simpler example of resource options files, see email.resource.js
const AdminJS = require('adminjs');
const { Components } = require('../components');
const Book = require('./book');

// Create a function to manage the visibility under the condition that the book is finished
const isFinished = ({ record }) => {
  return record.params.currentStage === "finished";
}

// Create a handler (a backend method for fetching or processing your data)
const bookHandler = (request, response, context) => {
  // const book = context.record;
  // return {
  //   record: book.toJSON()
  // }
  const { record, currentAdmin } = context
  return {
    record: record.toJSON(currentAdmin),
    msg: 'Hello world',
  }
}

// Create options for the Book resource
const BookResourceOptions = {
  resource: Book,
  options: {
    properties: {
      currentStage: {
        availableValues: [
          { value: "started", label: "In Progress" },
          { value: "finished", label: "Completed" }
        ]
      }
    },
    actions: {
      addCoverImage: { // Example code from official doc; it works
        actionType: 'record',
        component: Components.coverImage,
        handler: (request, response, context) => {
          const { record, currentAdmin } = context
          return {
            record: record.toJSON(currentAdmin),
            msg: 'Hello world',
          }
        }
      },
      addAReview: { // Example code from medium tutorial; it works
        actionType: 'record',
        isVisible: isFinished, // Only visible when the currentStage of the book is "finished"
        handler: bookHandler,
        // component: Components.addReview, // This works, too
        component: AdminJS.bundle('../public/review.jsx'), 
        msg: 'Hello Lulu'
      }
    }
  }
}

module.exports = BookResourceOptions;