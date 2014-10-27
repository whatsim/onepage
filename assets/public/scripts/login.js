domready(function(){

	function hashPasswordAndLogin(e){
		e.preventDefault()
		var user = document.querySelector('#username').value
		var pass = document.querySelector('#password').value
		var feedback = document.querySelector('#feedback')
		var SHA1 = new Hashes.SHA1;
		var hashPass = SHA1.hex(pass)

		var loginObject = {username:user,password:hashPass}

		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("POST", "/login", true);
		xmlhttp.setRequestHeader('Content-Type', 'application/json');
		xmlhttp.onreadystatechange = function () {
			if (xmlhttp.readyState == 4){
				if(xmlhttp.status == 200) {
					window.location.href = "/post"
				} else {
					feedback.innerText = "There was a problem with your username or password."
				}
			}
		}
	    xmlhttp.send(JSON.stringify(loginObject));
	    return false
	}

	var form = document.querySelector('#login')
	form.addEventListener('submit',hashPasswordAndLogin)

})