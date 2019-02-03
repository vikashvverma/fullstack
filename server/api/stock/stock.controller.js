/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/stock              ->  index
 * POST    /api/stock              ->  create
 * GET     /api/stock/:id          ->  show
 * PUT     /api/stock/:id          ->  upsert
 * PATCH   /api/stock/:id          ->  patch
 * DELETE  /api/stock/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Stock from './stock.model';

function compare(a, b) {
  if(a.diff < b.diff) {
    return -1;
  }
  if(a.diff > b.diff) {
    return 1;
  }
  return 0;
}

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode)
        .json(entity);
    }
    return null;
  };
}

function respondTop(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      let data = [];
      for(let i = 0; i < entity.length; i++) {
        data.push(
          {
            symbol: entity[i]['_id'],
            open: entity[i].open,
            close: entity[i].close,
            diff: entity[i].close - entity[i].open,
          }
        );
      }
      let sorted = data.sort(compare);
      return res.status(statusCode)
        .json(sorted.slice(sorted.length - 5, sorted.length)
          .reverse());
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function(entity) {
    try {
      // eslint-disable-next-line prefer-reflect
      jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch(err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function(entity) {
    if(entity) {
      return entity.remove()
        .then(() => {
          res.status(204)
            .end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if(!entity) {
      res.status(404)
        .end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode)
      .send(err);
  };
}

// Gets a list of Things
export function index(req, res) {
  return Stock.find()
    .limit(20)
    .exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Stock from the DB
export function show(req, res) {
  return Stock.find({symbol: req.params.id})
    .sort({date: 1})
    .exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}


// Gets all Stock names from the DB
export function showName(req, res) {
  return Stock.collection.distinct('symbol')
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}


// Gets all Stock names from the DB
export function findTop(req, res) {
  return Stock
    .aggregate([{'$group': {_id: '$symbol', open: {$sum: '$open'}, close: {$sum: '$close'}}}])
    .then(handleEntityNotFound(res))
    .then(respondTop(res))
    .catch(handleError(res));
}

// Creates a new Stock in the DB
export function create(req, res) {
  return Stock.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Stock in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Stock.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true})
    .exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Stock in the DB
export function patch(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Stock.findById(req.params.id)
    .exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Stock from the DB
export function destroy(req, res) {
  return Stock.findById(req.params.id)
    .exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
