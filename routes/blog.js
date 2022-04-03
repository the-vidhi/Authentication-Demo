var express = require('express');
var router = express.Router();

var BLOG = require("../controllers/blog");
const {isAuth, isActive} = require('../middlewares/authentication')


router.get('/index',BLOG.blogindexadmin);
router.get('/home', BLOG.blogindexuser)
router.get('/:entity/blogs/:_id?',isAuth(['admin','user']), BLOG.all);
router.get('/list/:_id?',BLOG.storeblogUser)
router.get('/:_id?',BLOG.storeblog)
router.post('/',isAuth(['admin','user']),isActive,BLOG.store);
router.post('/:_id',isAuth(['admin','user']), isActive,BLOG.destroy);
router.put('/:_id',isAuth(['admin','user']), isActive,BLOG.update);

module.exports = router;

