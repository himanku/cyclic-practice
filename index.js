const express = require("express");
const swaggerJSdoc=require("swagger-jsdoc")
const swaggerUi=require("swagger-ui-express")
const { connection } = require("./configs/db");
const { userRouter } = require("./routes/User.route");
const { noteRouter } = require("./routes/Note.route");
const { authenticate } = require("./middlewares/authenticate.middleware");
require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "MERN CRUD API DOCUMENTATION",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:8080",
      }
    ],
  },
  apis: ["./routes/*.js"],
};
const swaggerSpec = swaggerJSdoc(options);
app.use("/api-docs",swaggerUi.serve,swaggerUi.setup(swaggerSpec))

app.get("/", (req, res) => {
  res.send("Home Page");
});

app.use("/users", userRouter);
app.use(authenticate);
app.use("/notes", noteRouter);

app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log("Connected to the DB");
  } catch (err) {
    console.log("Trouble connecting to the DB");
    console.log(err);
  }
  console.log(`running at ${process.env.port}`);
});
