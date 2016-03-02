// Creating a new collection for the mongo database
Resolutions = new Mongo.Collection('resolutions');

// runs on client startup
if (Meteor.isClient) {
  // 'subscribing to the server data of resolutions'
  Meteor.subscribe("resolutions");
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
  // after removing autopublish (listing all resolutions, not just user specific, we gotta add publish to show only user created resolutions)
  Meteor.publish("resolutions", function() {
    return Resolutions.find({
      // make private private to user, only public can be shown to all
      $or: [
      // ne is not equal
        { private: {$ne: true} },
        { owner: this.userId}
      ]
    });
  });
}
// methods that clients will have access to. This is after removing insecure package, so that users cant open up console and insert crap on they own.
Meteor.methods({
  addResolution: function(title) {
      Resolutions.insert({
        title : title,
        createdAt : new Date(),
        // when someone creates new resolution, we will get new user id attached to it
        owner: Meteor.userId()
      });
  },
  // method for deleting resolution
  deleteResolution: function(id) {
    // throws error if user is not the user that created resolution if you want to set to public or private
    var res = Resolutions.findOne(id);
      if(res.owner !== Meteor.userId()) {
        throw new Meteor.Error('not-authorized user');
      }
       Resolutions.remove(id);
  },
  // method for updating resolutions
  updateResolution: function(id, checked) {
    var res = Resolutions.findOne(id);
      if(res.owner !== Meteor.userId()) {
        throw new Meteor.Error('not-authorized user');
      }
    Resolutions.update(id, {$set: {checked: checked}})
  },
  // adding set private method
  setPrivate: function(id, private) {
    // updating resolution to private or public
    // setting a single resolution to res (findOne is mongo )
    var res = Resolutions.findOne(id);
      // throws error if user is not the user that created resolution if you want to set to public or private
      if(res.owner !== Meteor.userId()) {
        throw new Meteor.Error('not-authorized user');
      }


         Resolutions.update(id, {$set: {private: private}})
  }

})


