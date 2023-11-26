const db = require("../db/connection");

exports.deleteSelectComment = (comment_id) => {
    return db.query(`DELETE FROM comments WHERE comment_id = $1`, [comment_id])

.then((result) => {
    
    return result.rows
})
}

exports.checkCommentExists = (comment_id) => {
  return db
    .query(`SELECT * FROM comments WHERE comment_id = $1;`, [comment_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "this comment_id does not exist",
        });
      }

      return result.rows;
    });
};