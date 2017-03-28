#!/usr/bin/env node
var request = require('request'),
	cheerio = require('cheerio'),
	options;

var jar = request.jar();

var v2exName = process.argv[2],
	v2exPassword = process.argv[3]

options = {

	headers: {
		'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.57 Safari/537.36 OPR/40.0.2308.15 (Edition beta)',
		'Referer': 'https://v2ex.com/signin',
		'Origin': 'https://www.v2ex.com'
	}
}

options.url = 'https://www.v2ex.com/signin';

request.get(options, function(err, response, body) {

	if (body) {
		var $ = cheerio.load(body);

		var fromOptions = {

			'name': $("input.sl[type='text']").attr('name'),
			'password': $("input.sl[type='password']").attr('name'),
			'onceCode': $("input[name='once']").attr('value'),
			'loginCookie': response.headers['set-cookie']
		}

		login_start(fromOptions, sign_start);
	}
})

function login_start (fromOptions, sign_start) {

	var name = fromOptions.name,
		password = fromOptions.password,
		onceCode = fromOptions.onceCode;

	options.form = {};
	var form = options.form;

	form[name] = v2exName;
	form[password] = v2exPassword;
	form.once = onceCode;
	form.next = '/';

	var Cookies = {};

	
	// if (Array.isArray(fromOptions['loginCookie'])) {

	// 	fromOptions['loginCookie'].toString().split(';').forEach(function(cok){

	// 		cok.split(";");
	// 		var parts = cok.split("=");
	// 		Cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
	// 	})
	// }

	var Cookies = fromOptions['loginCookie'].toString();	


	// return null
	var cookie = request.cookie(Cookies);

	jar.setCookie(cookie, options.url)

	options.jar = jar

	return request.post(options, function(err, response, body){

		sign_start()
	});
}

function sign_start () {

	options.url = "https://www.v2ex.com/mission/daily"

	request.get(options, function(err, resp, body) {

		console.log(body)
	})
}
