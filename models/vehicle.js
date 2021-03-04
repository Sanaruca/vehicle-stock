const { Schema, model, SchemaTypes } = require("mongoose");

const VehicleSchema = new Schema({
  type: { type: String, enum: ["auto", "moto"], required: true },
  category: { type: SchemaTypes.ObjectId, ref: "Category", required: true },
  brand: { type: SchemaTypes.ObjectId, ref: "Brand", required: true },
  model: { type: SchemaTypes.ObjectId, ref: "Model", required: true },
  description: String,
  price: Number,
  image: String,
});

module.exports = model("Vehicle", VehicleSchema);
