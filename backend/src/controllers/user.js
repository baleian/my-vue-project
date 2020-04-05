import createError from 'http-errors';

import * as userService from '../services/user';


export function getUserList(req, res, next) {
  userService.getUserList()
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      next(createError(500, err));
    });
}

export function getUserProfile(req, res, next) {
  var userId = req.params.id;
  if (!userId) return next(createError(400));
  userService.getUserProfile(userId)
    .then(result => {
      if (!result) return next(createError(404));
      res.send(result);
    })
    .catch(err => {
      next(createError(500, err));
    });
}

export function setUser(req, res, next) {
  var userId = req.params.id;
  if (!userId) return next(createError(400));
  var userName = req.body.userName || null;
  var description = req.body.description || null;
  userService.setUser(userId, { userName, description })
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      next(createError(500, err));
    });
}
