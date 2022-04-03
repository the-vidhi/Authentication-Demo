const router = require('express').Router();

const USER = require("../controllers/user")
const { isAuth, isActive} = require("../middlewares/authentication");

router.get('/list', USER.userlist);
router.get('/',isAuth(['admin']) ,USER.all);
router.post('/:_id',isAuth(['admin']),isActive, USER.statuschange);

module.exports = router;
