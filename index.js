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
	path 			= require('path'),
	ConnectRoles 	= require('connect-roles'),
	marked			= require('marked')

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
app.use('/admin/', user.can('post'))
app.use('/admin/', serveStatic(path.join(__dirname, 'assets/admin')));

app.set('views', __dirname + '/views');

var thePost = passFile = ""
var markedPost = ""

fs.readFile('savedState.txt','utf8', function (err, data) {
	if (err) throw err;
	thePost = data
	markedPost = marked(thePost)
});

fs.readFile('password.txt','utf8', function (err, data) {
	if (err) throw err;
	passFile = data
});

process.on('SIGINT', function() {
	fs.writeFileSync('savedState.txt',thePost)
	process.exit();
});

app.get('/post',user.can('post'),editPost);
app.post('/clear',user.can('post'),clearImages);
app.post('/post',user.can('post'),doPost);
app.post('/upload',user.can('post'),upload);
app.get('/login',login);
app.get('/',home);

  app.locals.pretty = true;


passport.use(new LocalStrategy(
	function(username, password, done) {
		
		username = username.toLowerCase()
  		if(username == 'will' && passFile .length && password == passFile) return done(null,{role:1})
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

app.get('*',fourOhFour);
app.listen(8083);

function home(req,res) {
	res.render('home',{post:markedPost})
}
function login(req,res) {
	res.render('login')
}
function editPost(req,res) {
	res.render('post',{post:thePost})
}
function doPost(req,res) {
	thePost = req.body.post
	markedPost = marked(thePost)
	res.json({msg:'success'})
}
function upload(req,res) {
	res.json({msg:'success'})
}
function clearImages(req,res){
	fs.readdir(path.join(__dirname, 'assets/public/uploads')	, function(err,files){
		if(err) res.status(400).json({msg:"Couldn't clear images."})
		else {
			var deleteError = undefined;
			var filesToDelete = files.length
			var count = 0
			for(var i = 0; i < files.length; i++){
				fs.unlink(path.join(__dirname, 'assets/public/uploads',files[i]),imageCleared)
			}
			
			function imageCleared(err){
				count ++
				deleteError = err
				if(count == filesToDelete){
					if(err){
						res.status(400).json({msg:err})
					} else {
						res.json({msg:"Cleared Images."})
					}
				}
			}
		}
	})
	
}
function fourOhFour(req,res){
	res.status(404).render('404')
}