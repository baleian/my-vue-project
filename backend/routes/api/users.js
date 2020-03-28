var express = require('express');
var router = express.Router();

var USERS = [
  {
    "id": "8de216c69e884dbba3ddd4e866c027af", 
    "name": "", 
    "description": "B / 31 / 경기도 수원시 영통구 영통동"
  },
  {
    "id": "d7ff1f33acec4670a9a584aa9a594fae", 
    "name": "", 
    "description": "A / 32 / 서울특별시 금천구 가산동"
  },
  {
    "id": "428d70b032bc4a1ebde317ac47e0db5f", 
    "name": "", 
    "description": "B / 22 / 인천광역시 부평구 부평1동"
  },
  {
    "id": "756af1f0d422429284873b8c6a5b6585", 
    "name": "", 
    "description": "B / 24 / 서울특별시 송파구 방이동"
  },
];

router.get('/', function(req, res, next) {
  res.send(USERS);
});

router.get('/:id', function(req, res, next) {

});

module.exports = router;
