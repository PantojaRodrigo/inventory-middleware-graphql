const express = require("express");
const { createHandler } = require("graphql-http/lib/use/express");
const { schema, root } = require("./schema");
const cors = require("cors");
const { ruruHTML } = require("ruru/server");
const { NetworkError } = require("graphql-http");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.all(
  "/graphql",
  createHandler({
    schema,
    rootValue: root,
  })
);

app.get("/", (_req, res) => {
  res.type("html");
  res.end(ruruHTML({ endpoint: "/graphql" }));
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/graphql`);
});
