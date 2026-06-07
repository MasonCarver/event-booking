// Imports
const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");
const isAuth = require("./middleware/is-auth");

const graphQlSchema = require("./graphQL/schema/index");
const graphQlResolvers = require("./graphQL/resolvers/index");

// Create express app
const app = express();

// Parse incoming JSON request bodies
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(isAuth);

// Configure GraphQL endpoint
app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true,
  }),
);

const PORT = process.env.PORT || 8000;

console.log("DB:", process.env.MONGO_DB);
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.1dpahbb.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority&appName=Cluster0`,
  )
  .then(() => {
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`server is running on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
