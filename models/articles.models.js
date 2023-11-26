const db = require("../db/connection");
const format = require("pg-format");

exports.selectArticleById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then((result) => {
      const user = result.rows[0];
      if (!user) {
        return Promise.reject({
          status: 404,
          msg: "article_id does not exist",
        });
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

exports.checkArticleExists = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "this article_id doesn't exist",
        });
      }

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
      return result.rows;
    });
};

exports.createNewComment = (article_id, newComment) => {
  const { username, body } = newComment;
  const insertCommentsQueryStr = format(
    `INSERT INTO comments (body, article_id, author) VALUES (%L, %L, %L) RETURNING *;`,
    body,
    article_id,
    username
  );
  return db
    .query(insertCommentsQueryStr)

    .then((result) => {
      return result.rows[0];
    });
};

exports.updateArticle = (article_id, newVoteChange) => {
  const { inc_votes } = newVoteChange;

  const updateVotes = `
      UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`;

  return db.query(updateVotes, [inc_votes, article_id]).then((result) => {
    const user = result.rows[0];
    if (!user) {
      return Promise.reject({
        status: 404,
        msg: "article_id does not exist",
      });
    }
    return result.rows[0];
  });
};
