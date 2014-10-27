domready(function(){
	var form = document.querySelector('#editPage')
	var post = document.querySelector('#post')
	var clearImagesLink = document.querySelector('#clearImageDirectory')

	function submitPage(e){
		e.preventDefault()

		var toSubmit = {
			post : post.value
		}

		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("POST", "/post", true);
		xmlhttp.setRequestHeader('Content-Type', 'application/json');
		xmlhttp.onreadystatechange = function () {
			if (xmlhttp.readyState == 4){
				if(xmlhttp.status == 200) {
					feedback.innerText = "Successfully Saved."
				} else {
					feedback.innerText = "There was a problem saving your post."
				}
			}
		}
	    xmlhttp.send(JSON.stringify(toSubmit));

		return false
	}

	function clearImages(e){
		e.preventDefault()

		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("POST", "/clear", true);
		xmlhttp.onreadystatechange = function () {
			if (xmlhttp.readyState == 4){
				if(xmlhttp.status == 200) {
					feedback.innerText = "Successfully Cleared Images."
				} else {
					feedback.innerText = "There was a problem clearing images."
				}
			}
		}
	    xmlhttp.send();

		return false
	}

	clearImagesLink.addEventListener('click',clearImages)
	form.addEventListener('submit',submitPage)
})