const { selectTopics, selectArticleById } = require("../models/topics.models");
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

exports.getArticlesById = (req, res, next) => {
    const { article_id } = req.params;
    selectArticleById(article_id).then((article) => {
        res.status(200).send({article})
    })
    .catch(next)
}


