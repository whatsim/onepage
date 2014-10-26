var fs				= require('fs'),
	express			= require('express'),
	app				= express(),
	jade			= require('jade'),
	passport 		= require('passport'),
	LocalStrategy 	= require('passport-local'),
	bodyParser 		= require('body-parser'),
	serveStatic 	= require('serve-static'),
	favicon 		= require('serve-favicon'),
	session 		= require('express-session'),

	user = new ConnectRoles({
		failureHandler: function (req, res, action) {
			var accept = req.headers.accept || '';
			res.status(403);
			if (~accept.indexOf('html')) {
				res.render('404', {action: action});
			} else {
				res.send('Access Denied - You don\'t have permission to: ' + action);
			}
		}
	});

app.set('view engine', 'jade');
app.use(favicon(__dirname + '/assets/public/favicon.ico'));
app.use(bodyParser.json()); 

app.use(session({
	secret: '127t3r8wfudiysvbhiqugfci8q7uwhasbf823yweuh',
	saveUninitialized: true,
	resave: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(user.middleware());

app.use(serveStatic(path.join(__dirname, 'assets/public')));
app.set('views', __dirname + '/views');

var post = passFile = ""

fs.readFile('savedState.txt','utf8', function (err, data) {
  if (err) throw err;
  post = data
});

fs.readFile('password.txt','utf8', function (err, data) {
  if (err) throw err;
  passFile = data
});

process.on('SIGINT', function() {
	fs.writeFileSync('savedState.txt',post)
	process.exit();
});

app.get('/post',user.can('post'),post);
app.post('/post',user.can('post'),doPost);
app.post('/upload',user.can('post'),upload);
app.get('/login',login);
app.post('/login',doLogin);
app.get('*',home);

passport.use(new LocalStrategy(
	function(username, password, done) {
		username = username.toLowerCase()
  		if(username == 'will' && passFile.length && password == passfile) return done(null,user)
  		else return done(null,false, {message: 'There was a problem with your Username or Password.'})
	}
));

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(user, done) {
	done(null, user);
});

app.post('/login', passport.authenticate('local'),function(req,res){
	res.json({code:200,msg:'Successfully Logged In!'})
});
app.get('/logout', function(req, res){
	req.logout();
	res.redirect('/login');
});

// Access Control

user.use(function (req, action) {
	if (!req.isAuthenticated()) return action === 'public';
})

user.use('post', function (req) {
	if (req.user.role === 1) {
		return true;
	}
})

app.listen(8081);