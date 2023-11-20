const express = require("express");

const { getAllTopics } = require("./controllers/topics.controllers");

const app = express();



app.get("/api/topics", getAllTopics);

app.use(( req, res, next)=> {

     
    res.status(404).send({ msg: 'Path not found' })
})

module.exports = app;
