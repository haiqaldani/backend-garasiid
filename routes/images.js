var express = require('express');
var router = express.Router();
const { index, create, update, delete } = require('../controller/images');

router.get('/', index);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', delete);


module.exports = router;
