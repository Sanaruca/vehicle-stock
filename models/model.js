const { Schema, model, SchemaTypes } = require("mongoose");

const ModelSchema = new Schema({
  name: String,
  brand: { type: SchemaTypes.ObjectId, ref: "Brand", required: true },
  year: { type: Date, required: true },
});

module.exports = model("Model", ModelSchema);
