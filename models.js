const mongoose = require("mongoose");

const mongoUri = process.env.MONGODB_URI || "mongodb://localhost/antares-hotel";
console.log("Connecting to " + mongoUri);
// Set up promises with mongoose
mongoose.Promise = Promise;
// Connect to the Mongo DB
mongoose.connect(mongoUri);

function createRoomModel() {
  const Schema = mongoose.Schema;
  const schema = new Schema({
    num: { type: String, required: true },
    occupancy: { type: String, default: "open" }
  });
  schema.plugin(require("mongoose-findorcreate"));
  return mongoose.model("Room", schema);
}

const Room = createRoomModel();

module.exports = { Room };
