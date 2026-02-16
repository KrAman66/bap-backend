const express = require("express");
const questionsRouter = require("./routes/allRoutes");
const errorHandler = require("./middleware/errorHandler");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const basePath = process.env.API_PREFIX || "/asa";
app.use("/asa", questionsRouter);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
