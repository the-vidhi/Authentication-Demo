const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');
const { swaggerOptions } = require('../config');

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));
router.use('/auth', require("./auth"));

router.use('/admin', require("./admin"));
router.use('/user', require("./user"));
router.use('/post', require("./post"));
router.use('/blog', require("./blog"));
router.use('/', require("./auth"));

module.exports = router;