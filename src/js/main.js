//Entry

function go(){
	alert('Dododasd');
	console.log('asdaskda')
}

function init(){
	var audio = document.getElementsByTagName('audio')[0];
	audio.play();
	audio.volume = .5;
	setTimeout(function(){
		document.querySelector('.intro').className += ' display';
	} ,2000)
}

window.onload = function() {
	init();
	// document.body.className = "loaded";
}
