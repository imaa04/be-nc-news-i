const express = require("express");
//const endpoints = require('../endpoints.json')

const { getAllTopics, getDocs } = require("./controllers/topics.controllers");


const app = express();



app.get("/api/topics", getAllTopics);

app.get('/api', getDocs)


app.all('/*', ( req, res, next)=> {  
res.status(404).send({ msg: 'Path not found' })
})


module.exports = app;
