// login_eamil
// login_pwd

var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var app = express();
/* GET home page. */
app.use(bodyParser.urlencoded({extended:false}));
	
module.exports = router;

router.get('/', function(req, res) {

	console.log("페이지 이동 성공");
	$_email = req.query.email;

	

	res.render('kcalUpload', {email : $_email});
});
