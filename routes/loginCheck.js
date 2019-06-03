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

	$_email = req.query.login_email;
	$_password = req.query.login_pwd;




	var mongoose = require('mongoose');
	// 2. testDB 세팅
	mongoose.connect('mongodb://localhost:27017/mongodb');

	// 3. 연결된 testDB 사용
	var db = mongoose.connection;
	
	// 4. 연결 실패
	db.on('error', function(){
	    console.log('Connection Failed!');
	});

	// 5. 연결 성공
	db.once('open', function() {

		console.log('Connected!');
		var query = {email : $_email, password : $_password};

		db.collection("member").find(query).toArray(function(err, result) { 
		
			console.log("db접속 성공");
			if(!result.length)
			{
				
				var newMember = { email : $_email , password : $_password };

				db.collection("member").insertOne(newMember);

				res.render('index', { title: 'Express' });
				
				console.log("로그인 실패");

				

				res.redirect('/');
			}
			
			else if(result.length)
			{
				res.render('loginSuccess', {email : $_email});
			}
			
		});

});
});
