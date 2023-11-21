const db = require("../db/connection");

exports.selectTopics = () => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    
    return rows;
  });
};

exports.selectArticleById = (article_id) => {
    return db.query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then((result) => {
       const user = result.rows[0];
       if (!user) {
         return Promise.reject({ status: 404, msg: "article does not exist" });
       } 
        return result.rows[0]
    })
}
