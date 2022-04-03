const router = require('express').Router();

//middleware
const{valCheck} = require('../middlewares/helper')

//controller
const AUTH = require('../controllers/auth');

router.get('/', AUTH.login);
router.get('/signup', AUTH.signup);
router.post('/signup',valCheck ,AUTH.PostSignup);
router.get('/login', AUTH.login);
router.post('/login', AUTH.PostLogin);

module.exports = router;
