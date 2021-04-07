const { Schema, model, SchemaTypes } = require("mongoose");

const InstanceSchema = new Schema({
  vehicle: {type: SchemaTypes.ObjectId, ref : "Vehicle"},
  color: String,
  rinZise: Number,
})

module.exports = model("VehicleInstance", InstanceSchema)