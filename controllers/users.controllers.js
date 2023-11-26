const { selectUsers } = require('../models/users.models')

exports.getAllUsers = (req, res, next) => {
  selectUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};