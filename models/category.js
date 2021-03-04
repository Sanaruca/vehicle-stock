const { Schema, model, SchemaTypes } = require("mongoose");

const CategorySchema = new Schema({
  name: String,
});

module.exports = model("Category", CategorySchema);
