
$(document).ready(function() {
  
//Tomamos el input file de la página
var imagen = document.getElementById("subirImagen");
var botonSubir = document.getElementById("subir");

// Tomamos la variable del label
labelNombre = document.getElementById("nombreArchivo");
imagen.addEventListener("change", function(){

    //Asignamos estas dos variables para verificar el tamaño de imagen
    var tamañoImagen = $('#subirImagen')[0].files[0].size;
    var tamañoEnKB = parseInt(tamañoImagen / 1024);

  //Mediante un parametro, revisamos la extensión de la imagen
  //y su tamaño
  if ( /\.(jpe?g|png|gif)$/i.test(imagen.files[0].name) === false ) { 
    $("#labelError").show(); 

  } else if (tamañoEnKB >  1024) { 
    //Ocultamos el error en caso de que haya aparecido
    $("#labelError").hide();

    //Mostramos el error del tamaño
    $("#tamañoError").show();

    } else { 

      //Ocultamos el error
      $("#tamañoError").hide();

    //le damos el nombre al label
    labelNombre.innerHTML = imagen.files[0].name;}

}); //termina la funcion del label


//Cuando el input sea clickeado, se activa la función
botonSubir.addEventListener("click", function() {

    //En caso de que el error se haya mostrado, lo ocultamos
    $("#imagenError").hide();

    if (document.getElementById("nombre").value) {
      
      //En caso de que el error se haya mostrado, lo ocultamos
      $("#nombreError").hide();

      if (document.getElementById("subirImagen").files[0]) {

        //Tomamos el primer archivo subido
        var file = imagen.files[0];

        //Creamos una referencia
        var storageRef = firebase.storage().ref("imagen/" + file.name);

        //Subimos el archivo a la base de datos
        var uploadTask = storageRef.put(file);

        //Cuando la variable cambie, aplicamos diversas funciones
        uploadTask.on('state_changed', function(snapshot){

          	// Un observador que cambia dependiendo del progreso, pausa o reanudacion de la descarga
          	// Mostramos el progreso dividiendo el numero de bytes subidos por el total de bytes a subir
         		var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
         		
            //lo mostramos en la consola
            console.log('Upload is ' + progress + '% done');
         		switch (snapshot.state) {
           			case firebase.storage.TaskState.PAUSED: // or 'paused'
              			console.log('Upload is paused');
              			break;
            		case firebase.storage.TaskState.RUNNING: // or 'running'
              			console.log('Upload is running');
              			break;
          		}

        	}, function(error) {
           		// A full list of error codes is available at
          		// https://firebase.google.com/docs/storage/web/handle-errors
          			switch (error.code) {
            			case 'storage/unauthorized':
             				// User doesn't have permission to access the object
             				break;

            			case 'storage/canceled':
             				// User canceled the upload
             				break;

           				case 'storage/unknown':
           				   // Unknown error occurred, inspect error.serverResponse
           				   break;
                   }
            		}, function() {
              			// Funcion que ocurre luego de una subida de archivo exitosa

              			// En este caso, nos da la URL en la que se encuentra el archivo subido
              			uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
              			console.log('File available at', downloadURL);
                    //alert("Tu archivo se subio correctamente.");

                    //Tomamos los inputs de NOMBRE, DESCRIPCION y URL para usarlos luego
                    var nombreEjercicio = document.getElementById("nombre").value;
                    var descripcion = document.getElementById("descripcion").value;
                    var url = document.getElementById("url").value;

                    //Tomamos el ID de usuario
                    var uid =  firebase.auth().currentUser.uid;


                    //Guardamos la información dentro del ID del usuario en la seccion ejercicios
                    firebase.database().ref().child("Ejercicios/" + uid + "/"+ nombreEjercicio).set(
                     {nombre: nombreEjercicio,
                      descripcion: descripcion,
                      urlEjercicio: url,
                      imagen: downloadURL}).then(function(){
                        //Aplicamos un .then para que los campos se vacien una vez se suba la data
                    $("#nombre").val("");
                    $("#descripcion").val("");
                    $("#url").val("");
                    $("#subirImagen").val("");
                    $("#nombreArchivo").text("Agrega una imagen");
                    $("#modal").modal("show");

                      });

                  });

            			}
        		);
      } else {$("#imagenError").show();}

    } else { $("#nombreError").show();}



});


});