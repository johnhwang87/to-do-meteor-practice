// Creating a new collection for the mongo database
Resolutions = new Mongo.Collection('resolutions');

// runs on client startup
if (Meteor.isClient) {
  // template helper allows you to use information on the page
  Template.body.helpers({
    // calling all resolutions from the database
    resolutions: function() {
      if (Session.get('hideFinished')) {
        // checking if resolution is checked, and returning the nonchecked resolutions
        return Resolutions.find({checked: {$ne: true}});
      } else {

      return Resolutions.find();
      }
    },
    // below function syncs the session variable to the checkbox
    hideFinished: function () {
      return Session.get('hideFinished');
    }
  });
  // Calling events into your app
  // this is named .body because it is not in the resolutio template
  Template.body.events({
    // string which contains the event itself = submit
    // second part is which element were going to be looking for event on
    'submit .new-resolution': function (event) {
      // .target targets the resolution form .value is the actual value of the field
      var title = event.target.title.value;

      // calling the method of adding Resolution. This is to make the app secure.
      Meteor.call("addResolution", title); //title is being passed

      // clearing the form after you submit
      event.target.title.value = "";
      // return false does not refresh the page
      return false;

    },
    'change .hide-finished': function (event) {
      // when checkboxed is checked, it will fire this function
      Session.set('hideFinished', event.target.checked);
    }
  });
  // below references resolution template, not body because the delete button is in the template
  Template.resolution.events({
    // function for checking resolutions updating
    'click .toggle-checked': function () {
      // this._id takes the id, and changes the object inside.
      // $set sets whatever we are going to change or modify, which is checked:
      // !this.checked part is saying whatever boolean it is, make it opposite when clicked
      Meteor.call("updateResolution", this._id, !this.checked)
    }, //have to have comma here or it breaks...
    // because we are looking for click event, that is the first part of the string
    // .delete is because we are looking for the delete class button
    'click .delete': function () {
      // this._id will reference to whatever object id that is being clicked... mongo is awesome
      Meteor.call("deleteResolution", this._id);
    }
  });
// modifying accounts password package to take in username instead of default email
Accounts.ui.config({
  passwordSignupFields: "USERNAME_ONLY"
});


}
// runs on server startup
if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
// methods that clients will have access to. This is after removing insecure package, so that users cant open up console and insert crap on they own.
Meteor.methods({
  addResolution: function(title) {
      Resolutions.insert({
        title : title,
        createdAt : new Date()
      });
  },
  // method for deleting resolution
  deleteResolution: function(id) {
    Resolutions.remove(id);
  },
  // method for updating resolutions
  updateResolution: function(id, checked) {
    Resolutions.update(id, {$set: {checked: checked}})
  }

})


