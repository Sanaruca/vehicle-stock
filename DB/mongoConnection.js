const { consoleError, consoleMessage } = require("../utils/console");
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => consoleMessage("DB coneccted:"))
  .catch((err) => consoleError(err));