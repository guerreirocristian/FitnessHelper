function desloguear() {
	firebase.auth().signOut().then(function(){
		window.location.assign("index.html");});
	
}