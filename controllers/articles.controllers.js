const {
  selectArticleById,
  selectArticles,
  selectCommentByArticleId,
  checkArticleExists,
} = require("../models/articles.models");

exports.getArticlesById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getAllArticles = (req, res, next) => {
  selectArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getCommentByArticleId = (req, res, next) => {
    
    const { article_id } = req.params;
  const commentPromises = [checkArticleExists(article_id)]
 
  
  if(article_id) {
    commentPromises.push(selectCommentByArticleId(article_id));
    
  }

  Promise.all(commentPromises)
    .then((resolvedPromises) => {
        const comments = resolvedPromises[1]
       
      res.status(200).send({ comments });
    })
    .catch(next);
};
