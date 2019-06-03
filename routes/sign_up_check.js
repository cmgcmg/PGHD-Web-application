var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var app = express();
/* GET home page. */
app.use(bodyParser.urlencoded({extended:false}));
	
module.exports = router;

router.get('/', function(req, res) {
	

	$_email = req.query._email;
	$_password = req.query._pwd;



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
		var query = {email : $_email};

		db.collection("member").find(query).toArray(function(err, result) { 


			if(!result.length)
			{
				var newMember = { email : $_email , password : $_password };

				db.collection("member").insertOne(newMember);



/////////////////

				var big = require('mongoose');
				// 2. testDB 세팅
				mongoose.connect('mongodb://localhost:27017/bigchain');
				// 3. 연결된 testDB 사용
				var bigdb = mongoose.connection;

				bigdb.once('open', function(){
				

				bigdb.collection("member").insertOne(newMember);
			});


				res.render('index', { title: 'Express' });
			}
			
			else if(result.length)
			{


/////////////////////

				res.redirect('/sign_up');
			}
			
		});
});

});
