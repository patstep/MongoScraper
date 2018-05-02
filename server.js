
// dependencies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var request = require('request'); 
var cheerio = require('cheerio');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static('public'));


// Database configuration with mongoose
// mongoose.connect('mongodb://localhost/webScraping');
mongoose.connect("mongodb://heroku_qrccx9wk:68ut94sf70s71ltm6cdmtp9d6u@ds161021.mlab.com:61021/heroku_qrccx9wk");
var db = mongoose.connection;

db.on('error', function(err) {
  console.log('Mongoose Error: ', err);
});

db.once('open', function() {
  console.log('connection successful');
});

var Note = require('./models/Note.js');
var Article = require('./models/Article.js');



// Routes

app.get('/', function(req, res) {
  res.send(index.html);
});


app.get('/scrape', function(req, res) {

  request('https://www.reddit.com/', function(error, response, html) {
  
    var $ = cheerio.load(html);

		
    $('a.title').each(function(i, element) {
				var result = {};
				result.title = $(this).text();
				result.paragraph = $(this).text();
				result.link = $(this).attr('href');

				console.log("Article: " + i);
				var entry = new Article (result);

				entry.save(function(err, doc) {
				  if (err) {
				    console.log(err);
				  }

				  else {
				    console.log("This is the printed document" + doc);
				  }
				});


    });
  });

  res.send("Scrape Complete");
});


app.get('/articles', function(req, res){
	Article.find({}, function(err, doc){

		if (err){
			console.log(err);
		}
		else {
			res.json(doc);
		}
	});
});


app.get('/articles/:id', function(req, res){
	Article.findOne({'_id': req.params.id})
	.populate('note')

	.exec(function(err, doc){

		if (err){
			console.log(err);
		} 

		else {
			res.json(doc);
		}
	});
});


// replaces existing note of an article with a new one
app.post('/articles/:id', function(req, res){

	var newNote = new Note(req.body);

	
	newNote.save(function(err, doc){
		
		if(err){
			console.log(err);
		} 
		
		else {
		
			Article.findOneAndUpdate({'_id': req.params.id}, {'note':doc._id})
		
			.exec(function(err, doc){
				
				if (err){
					console.log(err);
				} else {
					
					res.send(doc);
				}
			});
		}
	});
});







// listen on port 3000
app.listen(3000, function() {
  console.log('App running on port 3000!');
});
