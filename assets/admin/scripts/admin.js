domready(function(){
	var form = document.querySelector('#editPage')
	var post = document.querySelector('#post')
	var clearImagesLink = document.querySelector('#clearImageDirectory')

	var dropZone = document.querySelector('#uploadImages')

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

	function dragFeedback(e){
		e.preventDefault()
		dropZone.classList.add('dragging')
		return false
	}
	function droppedImages(e){
		e.preventDefault()
		dropZone.classList.remove('dragging')
		if(e.dataTransfer.types == "Files"){
			upload(e.dataTransfer.files)
		}
		function upload(files){
			var fd = new FormData()
			for(var i = 0; i < files.length; i++){
				fd.append("image"+i,files[i])
			}
			var xmlhttp = new XMLHttpRequest();
			xmlhttp.open("POST", "/upload", true);
			xmlhttp.onreadystatechange = function () {
				if (xmlhttp.readyState == 4){
					if(xmlhttp.status == 200) {
						var o = JSON.parse(xmlhttp.responseText)
						feedback.innerText = '![uploaded image](/uploads/'+o.file+')'
						var selection = window.getSelection();            
						var range = document.createRange();
						range.selectNodeContents(feedback);
						selection.removeAllRanges();
						selection.addRange(range);
					} else {
						feedback.innerText = "There was a problem uploading images."
					}
				}
			}
		    xmlhttp.send(fd);
			
		}
		return false
	}

	dropZone.addEventListener('dragover',dragFeedback)
	dropZone.addEventListener('drop',droppedImages)
	clearImagesLink.addEventListener('click',clearImages)
	form.addEventListener('submit',submitPage)
})