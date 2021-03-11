const mongoose = require("mongoose");
const { Schema } = mongoose;

const bcryptNodejs = require("bcrypt-nodejs");

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

UserSchema.methods.encrypt = (password) => {
  return bcryptNodejs.hashSync(password, bcryptNodejs.genSaltSync(10))
};

UserSchema.methods.compare_encrypt = function (password) {
  return bcryptNodejs.compareSync(password, this.password)
};

module.exports = mongoose.model("User", UserSchema);
