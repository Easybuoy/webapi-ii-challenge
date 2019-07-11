const express = require("express");

const app = express();
const posts = require("./posts");

app.use(express.json());
app.use("/api/posts", posts);

app.listen(3500, () => {
  console.log("app listening on port 3500");
});
