var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var app = express();
/* GET home page. */
app.use(bodyParser.urlencoded({extended:false}));
	
module.exports = router;

router.get('/', function(req, res) {

	console.log("페이지 kkkkk 성공");


	$_email = req.query.input_email;
	$_day = req.query.input_day;
	$_foodkcal = req.query.input_food;
	$_ecerkcal = req.query.input_exer;


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
		var query = {email : $_email, day : $_day};

		db.collection("information").find(query).toArray(function(err, result) { 

			
			if(result.length == 0)
			{


				var newInformation = { email : $_email , day : $_day, heartrate : "0", walkcnt : "0", sleeptime : "0", foodkcal : $_foodkcal, exercisekcal : $_ecerkcal };

				db.collection("information").insertOne(newInformation);

				console.log("삽입 성공");

				var big = require('mongoose');
				// 2. testDB 세팅
				mongoose.connect('mongodb://localhost:27017/bigchain');
				// 3. 연결된 testDB 사용
				var bigdb = mongoose.connection;

				bigdb.once('open', function(){
				

					bigdb.collection("metadata").insertOne(newInformation);

				});



				res.render('loginSuccess', {email : $_email});

				
				//res.redirect('/');
			}
			
			else if(result.length != 0)
			{


				$_old_foodkcal = result[0].foodkcal;
				$_old_exerkcal = result[0].exercisekcal;

				// $_old_foodkcal ->  select 해오기
				$_new_foodkcal = Number($_foodkcal) + Number($_old_foodkcal);
				$_new_exerkcal = Number($_ecerkcal) + Number($_old_exerkcal);
				// 삭제 -> delete

				var newvalue = { $set: {foodkcal: $_new_foodkcal , exercisekcal: $_new_exerkcal}};

				//db.collection("information").updateOne({query},{'foodkcal' : $_new_foodkcal,'exercisekcal' : $_new_exerkcal});
				//db.collection("information").update({query}, {$set : { foodkcal : $_new_foodkcal}});
				db.collection("information").updateOne(query, newvalue);







				var big = require('mongoose');
				// 2. testDB 세팅
				mongoose.connect('mongodb://localhost:27017/bigchain');
				// 3. 연결된 testDB 사용
				var bigdb = mongoose.connection;

				bigdb.once('open', function(){
				

				bigdb.collection("metadata").updateOne(query, newvalue);

				});

				


				// 삽입
				//var newInformation = { email : $_email , day : $_day, heartrate : "0", walkcnt : "0", sleeptime : "0", foodkcal : $_new_foodkcal, exercisekcal : $_ecerkcal };

				//db.collection("information").insertOne(newInformation);

				 res.render('loginSuccess', {email : $_email});

				//mongo db 업데이트

				//res.render('loginSuccess', {email : $_email});
			}
			
		});
});




	//res.render('kcalUpload', {email : $_email});
});
