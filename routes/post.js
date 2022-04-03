const express = require('express');
const router = express.Router();

const POST = require('../controllers/post')
const {isAuth , isActive} = require('../middlewares/authentication');
const {upload} = require('../middlewares/helper')

router.get('/index', POST.adminindex);
router.get('/home',POST.userindex);
router.get('/:entity/:id?',isAuth(['admin','user']), POST.show);
router.post('/',isAuth(['admin','user']),isActive, upload.fields([{ name: 'pancard', maxCount: 1 },{ name: 'image', maxCount: 8 }]),POST.store);
router.put('/:entity/:_id',isAuth(['admin','user']), isActive,POST.update);
router.delete('/:_id',isAuth(['admin','user']), isActive,POST.destroy);

module.exports = router;
