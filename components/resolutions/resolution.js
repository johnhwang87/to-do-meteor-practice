if (Meteor.isClient) {
    // adding helper method for resolution to see if it is owner or not
    Template.resolution.helpers({
    isOwner: function() {
      // shows the public/private button if it is currentuser
      return this.owner === Meteor.userId();
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
    },
    'click .toggle-private': function () {
      // if private, it will make it false when checked
      Meteor.call("setPrivate", this._id, !this.private)
    }
  });
}
