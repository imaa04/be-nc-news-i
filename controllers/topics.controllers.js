const { selectTopics } = require("../models/topics.models");
const endpoints = require("../endpoints.json");

exports.getAllTopics = (req, res, next) => {
  selectTopics(req.body)
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.getDocs = (req,res) => {
    res.status(200).send({endpoints})
} 
