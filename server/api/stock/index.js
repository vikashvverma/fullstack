'use strict';

var express = require('express');
var controller = require('./stock.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/symbol/top', controller.findTop);
router.get('/symbol/:id', controller.show);
router.get('/symbol', controller.showName);
router.post('/', controller.create);
router.put('/:id', controller.upsert);
router.patch('/:id', controller.patch);
router.delete('/:id', controller.destroy);

module.exports = router;
