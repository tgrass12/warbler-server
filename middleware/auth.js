require('dotenv').load();
const jwt = require('jsonwebtoken');

exports.loginRequired = function(req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (decoded) {
        console.log('Authenticated');
        return next();
      }
      else {
        return next({status: 401, message: "Please log in."});
      }
    });
  } catch(err) {
    return next({status: 401, message: "Please log in."});
  }
};


exports.ensureCorrectUser = function(req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (decoded && decoded.id === req.params.id) {
        console.log('Authorized');
        return next();
      }
      else {
        return next({ status: 401, message: "Unauthorized"});
      }
    })
  } catch(err) {
    return next({ status: 401, message: "Unauthorized"});
  }
};