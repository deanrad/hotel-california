const express = require("express");
const path = require("path");
const morgan = require("morgan");

const app = express();
const port = process.env.PORT || 3120;

app.use(morgan("dev"));

// API calls
app.get("/api/hello", (req, res) => {
  res.send({ express: "Hello From The Server." });
});

if (process.env.NODE_ENV === "production") {
  // Serve any static files
  app.use(express.static(path.join(__dirname, "client/build")));

  // Handle React routing, return all requests to React app
  app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

app.listen(port, () => console.log(`Listening on port ${port}`));
