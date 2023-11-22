const db = require("../db/connection");

exports.selectArticleById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then((result) => {
      const user = result.rows[0];
      if (!user) {
        return Promise.reject({ status: 404, msg: "article does not exist" });
      }
      return result.rows[0];
    });
};

exports.selectArticles = () => {
  const queryString = `
    SELECT
    a.article_id,
    a.author,
    a.title,
    a.topic,
    a.created_at,
    a.votes,
    a.article_img_url,
    (SELECT COUNT(c.comment_id)::int FROM comments c WHERE c.article_id =
    a.article_id) AS comment_count    
  FROM articles a
  ORDER BY a.created_at DESC;`;

  return db.query(queryString).then((result) => {
    return result.rows;
  });
};

exports.selectCommentByArticleId = (article_id) => {
    
   return db
     .query(
       `SELECT * FROM comments WHERE article_id = $1
        ORDER BY created_at DESC;`,
       [article_id]
     )
     .then((result) => {
         const user = result.rows[0];
         if (!user) {
           return Promise.reject({
             status: 404,
             msg: "this article doesn't have a comment",
           });
         }

       return result.rows;
     });

    
}
