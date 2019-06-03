var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var multiparty = require('multiparty');
var fs = require('fs');
var csv = require('fast-csv');
var app = express();
app.use(bodyParser.urlencoded({extended:false}));
	
module.exports = router;

router.get('/', function(req, res) {


	$_email = req.query.input_email;
	$_file_path1 = req.query.upload_file1;
	$_file_path2 = req.query.upload_file2;

	var result0 = [];
	var result1 = [];
	var result2 = [];



	var result3 = [];
	var result4 = [];
	var heart_rate_result = 0;

	
	fs.createReadStream($_file_path1)
	    .pipe(csv())
	    .on('data', function(data){
	    
	    result0.push(data[0]);
	    result1.push(data[1]);
	    result2.push(data[2]);
	   
	    
	})
	.on('end',function(data){

$_day = '';
	
	$_walk_cnt = result2[2];
	$_sleeptime = result2[6];

	$_day_array0 = result0[2].substring(0,4);
	$_day_array1 = result0[2].substring(6,7);
	$_day_array2 = result0[2].substring(9,11);
	console.log($_day_array0);
	console.log($_day_array1);
	console.log($_day_array2);

$_day = $_day + $_day_array0;
if($_day_array1.length == 1)
{
	$_day_array1 = '0' + $_day_array1;
}
$_day = $_day + $_day_array1;


if($_day_array2.length == 1)
{
$_day_array2 = '0' + $_day_array2;
}
$_day = $_day + $_day_array2;

$_sleeptime = Number($_sleeptime) / 60;



	console.log($_walk_cnt);
	console.log($_sleeptime);
	console.log($_day_array0);
	console.log($_day_array1);
	console.log($_day_array2);
	console.log('dd');
	console.log('csv data 받아온거 parsing 해주기!!');

	fs.createReadStream($_file_path2)
	    .pipe(csv())
	    .on('data', function(data){

	    
	    result3.push(data[0]);
	    result4.push(data[1]);

		


	})
	.on('end',function(data){

	for(var i= 1; i < result3.length; i++)
	{

		heart_rate_result = heart_rate_result + (Number)(result4[i]);
	}

	heart_rate_result = heart_rate_result / (result3.length-1);
	


	var mongoose = require('mongoose');
	// 2. testDB 세팅
	mongoose.connect('mongodb://localhost:27017/mongodb');
	// 3. 연결된 testDB 사용
	var db = mongoose.connection;
	// 4. 연결 실패
	db.on('error', function(){
	    console.log('Connection Failed!');
	});
	
	db.once('open', function() {

		console.log('Connected!');
		var query = {email : $_email, day : $_day};

		db.collection("information").find(query).toArray(function(err, result) { 

		console.log('assssssssssssss');
			console.log(result.length);	
			if(result.length == 0)
			{

				console.log('111');
				
				var newInformation = { email : $_email , day : $_day, heartrate : heart_rate_result , walkcnt : $_walk_cnt , sleeptime : $_sleeptime , foodkcal : 0, exercisekcal : 0 };

				db.collection("information").insertOne(newInformation);

				console.log("삽입 성공");

				var big = require('mongoose');
				// 2. testDB 세팅
				mongoose.connect('mongodb://localhost:27017/bigchain');
				// 3. 연결된 testDB 사용
				var bigdb = mongoose.connection;

				
				bigdb.collection("metadata").insertOne(newInformation);


				res.render('loginSuccess', {email : $_email});

				
				//res.redirect('/');
			}
			
			else if(result.length != 0)
			{
				
				console.log('222');

				$_old_sleeptime = result[0].sleeptime;
				$_old_heart_rate = result[0].heartrate;
				$_old_walk_cnt = result[0].walkcnt;

				// $_old_foodkcal ->  select 해오기
				$_new_sleeptime = Number($_sleeptime) + Number($_old_sleeptime);
				$_new_heart_rate = Number(heart_rate_result) + Number($_old_heart_rate);
				$_new_walk_cnt = Number($_walk_cnt) + Number($_old_walk_cnt);
				// 삭제 -> delete

				var newvalue = { $set: {sleeptime: $_new_sleeptime , heartrate: $_new_heart_rate, walkcnt: $_new_walk_cnt}};


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

});
	
	
	});

	
 res.render('loginSuccess', {email : $_email});
});

module.exports = router;
