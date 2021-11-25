var express = require('express');
var router = express.Router();

/* GET api listing. */
router.get('/v1/*', function (req, res, next) {
  console.log(req);
  res.send('respond with a resource');
});


/* POST api listing. */
router.post('/*', function (req, res, next) {
  console.log(req)
  res.send('respond with a resource');
});

module.exports = router;
