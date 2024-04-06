const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

mongoose.connect("mongodb+srv://susmithajob93:taskmanager@cluster0.vzh9e3i.mongodb.net/taskmanager?retryWrites=true&w=majority");

const userSchema = mongoose.Schema({
  firstName : {
    type:String,
    required:true
  },
  lastName :  {
    type:String,
    required:true
  },
  username :  {
    type:String,
    required:true,
    unique:true
  },
  email :  {
    type:String,
    required:true,
    unique:true
  },
  password : {
    type:String,
    required:true
  },
  confirmpassword : {
    type:String,
    required:true
  },
  tasks: [{
    description: {
      type: String,
      required: true
    },
    dateAssigned: {
      type: Date,
      required: true,
    }
  }]
});


userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("userDetails",userSchema);