var express = require('express');
var superagent = require('superagent');
var cheerio = require('cheerio');
var path = require('path');

var app = express();
app.set('views', path.join(__dirname, '/views')) 
app.set('view engine','pug') 
app.use(express.static(path.join(__dirname, '/public')))

app.get('/',function(req,res,next){
	var oUrl = 'http://piccache.cnki.net/index/images2009/other/2017/%E5%8D%81%E4%B9%9D%E5%A4%A7%E6%8A%A5%E5%91%8A/index.html';
	superagent.get(oUrl)
	.end(function(err,sres){
		if (err)
			return next(err);
		var $ =cheerio.load(sres.text);
		var items=[];

		$('section[level=1]').each(function(index, el) {
			var $el = $(el);
			var subTopic = [];
			$(el).find('subsection').each(function(index, subel) {
				var $subel = $(subel);
				subTopic.push({
					subName: $subel.find('.anchor-tag').text(),
					subHref: oUrl+"#"+$subel.find('.anchor-tag').attr('id')
				});		
			});

			items.push({
					name: $el.find('.anchor-tag').first().text(),
					href: oUrl+"#"+$el.find('.anchor-tag').first().attr('id'),
					subTopic: subTopic
			});
		});
		res.render('index',{
			items:items
		});
	});
});

app.listen(3000,function(){
	console.log('开始监听 3000端口');
});