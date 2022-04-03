var express = require('express');
var router = express.Router();

const ADMIN = require('../controllers/admin')
const {isAuth} = require('../middlewares/authentication')

router.get('/index', ADMIN.index);
router.get('/album', isAuth(['admin']), ADMIN.getAlbum);

module.exports = router;
