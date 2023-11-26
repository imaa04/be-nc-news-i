const {
  deleteSelectComment,
  checkCommentExists,
} = require("../models/comments.models");

exports.deleteCommentId = (req, res, next) => {
    const { comment_id } = req.params;
    const commentPromises = [checkCommentExists(comment_id)]
 
  if(comment_id) {
    commentPromises.push(deleteSelectComment(comment_id)) 
  }

  Promise.all(commentPromises)
    .then((resolvedPromises) => {
        const comments = resolvedPromises[1]
       
      res.status(204).send({ comments });
    
      })
      .catch(next);

}