// Get a reference to the storage service, which is used to create references in your storage bucket
//var storage = firebase.storage();

// Create a storage reference from our storage service
//var storageRef = storage.ref();

var subirArchivo = document.getElementById("subirImagen");

subirArchivo.addEventListener("change", function(e) {
	//tomar el archivo
	var file = e.target.files[0];
	//crear un storage ref
	var storageRef = firebase.storage().ref("imagen/" + file.name);

	//uploadfile
	storageRef.put(file);
});