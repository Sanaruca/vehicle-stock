const { Schema, model, SchemaTypes } = require("mongoose");

const brandSchema = new Schema({
  companyname: String,
  website: String,
  logo: String,
});

module.exports = model("Brand", brandSchema);
