const express = require("express");
//const endpoints = require('../endpoints.json')

const { getAllTopics, getDocs, getArticlesById } = require("./controllers/topics.controllers");



const app = express();



app.get("/api/topics", getAllTopics);

app.get('/api', getDocs)

app.get("/api/articles/:article_id", getArticlesById)

app.use((err, req, res, next) => {
  console.log(err);
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  } else if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } 
});



app.all('/*', ( req, res, next)=> {  
res.status(404).send({ msg: 'Path not found' })
})


module.exports = app;
