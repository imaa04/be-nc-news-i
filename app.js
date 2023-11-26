const express = require("express");

const {
  getAllTopics,
  getDocs,
} = require("./controllers/topics.controllers");

const {
  getAllArticles,
  getArticlesById,
  getCommentByArticleId,
  postNewComment,
  updateArticleVotes,
} = require("./controllers/articles.controllers");

const {
  deleteCommentId
} = require("./controllers/comments.controllers");

const { getAllUsers } = require("./controllers/users.controllers")


const app = express();
app.use(express.json())

app.get("/api/topics", getAllTopics);

app.get("/api", getDocs);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id", getArticlesById);

app.get("/api/articles/:article_id/comments", getCommentByArticleId);

app.post("/api/articles/:article_id/comments", postNewComment);

app.patch("/api/articles/:article_id", updateArticleVotes);

app.delete("/api/comments/:comment_id", deleteCommentId);

app.get("/api/users", getAllUsers)

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  } else if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else if (err.code === "23502") {
    res.status(400).send({ msg: "Bad request: Missing required fileds" });
  } else if (err.code === "23503") {
    res.status(404).send({msg: 'Not Found: username does not exist'})
  }
});

app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "Path not found" });
});

module.exports = app;
