$(document).ready(function(){ 

	firebase.auth().onAuthStateChanged(function(user) {

	var uid =  firebase.auth().currentUser.uid;
	var cambiarImagen = document.getElementById("cambiarImgPerfil");

	//Buscamos en la base de datos la ubicacion del usuario
	//y lo asignamos a una variable
	var datosUsuario = firebase.database().ref('Usuarios/' + uid); 

	//leemos una vez con el metodo .once() y buscamos el valor que contiene la referencia
	datosUsuario.once('value').then(function(snapshot) { 

    //recuperamos cualquier dato que pueda tener el usuario
		$("#nombre").text(snapshot.val().nombre);
		$("#apellido").text(snapshot.val().apellido);
    $("#edad").text(snapshot.val().edad);      
    $("#sexo").text(snapshot.val().sexo);  
    $("#nacion").text(snapshot.val().nacionalidad);  
    $("#disci").text(snapshot.val().disciplinas);  

    console.log(snapshot.val().contacto.facebook !== "sin especificar");
    //checkea si existe data que desplegar en cada boton
    //si es así también aumentamos la opacidad y permite clickean en ellos
    if (snapshot.val().contacto.facebook !== "") {
      $("#facebook").attr("href", snapshot.val().contacto.facebook);
      $(".btn-facebook").css({"pointer-events":"auto", "opacity":"1"});}
    if (snapshot.val().contacto.instagram !== "") {
      $("#instagram").attr("href", snapshot.val().contacto.instagram);
      $(".btn-instagram").css({"pointer-events":"auto", "opacity":"1"})}
    if (snapshot.val().contacto.twitter !== "") {
      $("#twitter").attr("href", snapshot.val().contacto.twitter);
      $(".btn-twitter").css({"pointer-events":"auto", "opacity":"1"})}


    //checkeamos si el usuario tiene img de perfil y la ponemos
    if ( $("#imgPerfil").attr("src") === "sin especificar") {} else {
    $("#imgPerfil").attr("src", snapshot.val().imgPerfil);  }; 

	 }); //termina el child_added




//event listener para el input del file
	cambiarImagen.addEventListener("change", function(){

    //Asignamos estas dos variables para verificar el tamaño de imagen
    var tamañoImagen = cambiarImagen.files[0].size;
    var tamañoEnKB = parseInt(tamañoImagen / 1024);

  //Mediante un parametro, revisamos la extensión de la imagen
  //y su tamaño
  if ( /\.(jpe?g|png|gif)$/i.test(cambiarImagen.files[0].name) === false ) { 
    $("#labelError").show(); 

 	 } else if (tamañoEnKB >  1024) { 
    //Ocultamos el error en caso de que haya aparecido
    

  		 //Mostramos el error del tamaño
  		 alert("El archivo no debe superar 1mb de espacio.");

  		 } else { 

  		  	// asignamos una variable a la imagen a subir
  		  	var imagenFinal = cambiarImagen.files[0]

  		   	//Creamos una referencia
        	var storageRef = firebase.storage().ref("imagen/" + imagenFinal.name);

        	//Subimos el archivo a la base de datos
        	//además tomamos el snapshot y pedimos el URL 
        	//para usarlo y cambiar el src de la img de perfil
        	storageRef.put(imagenFinal).then(function (snapshot){
				snapshot.ref.getDownloadURL().then(function(downloadURL) {
       		
	       		// Agregamos la imagen subida como foto de perfil
	       		// y ponemos el url en la consola con fines de desarrollo
	       		$("#imgPerfil").attr("src", downloadURL);
	       		console.log('File available at', downloadURL)

	       		//ponemos la URL en los datos del usuario
	       		firebase.database().ref().child("Usuarios/" + uid).update({
                "imgPerfil" : downloadURL
            }); //terminamos de guardar la url de la foto de perfil

	       	 }); //termina el segundo then

        	}); // termina el primer then

        }; // termina el if statment

	}); //termina la funcion del addEventListener
		
    //El botón editar abre el modal
  $("#editPerfil").click(function(){
    $("#modalInfo").modal("show");
     }); //Termina el click()

  $("#editSocial").click(function(){
    $("#modalSocial").modal("show");
     }); //Termina el click()

  //cambiamos la info del perfil
  $("#cambiarInfoPerfil").click(function(){
    
  
    //Actualizamos los datos del usuario segun lo pedido
    firebase.database().ref().child("Usuarios/" + uid).update({
                "apellido" : $("#modalApellido").val(),
                "nombre" :  $("#modalNombre").val(),
                "edad" : $("#modalEdad").val(),
                "sexo" : $("#modalSexo").val(),
                "nacionalidad" : $("#modalNacionalidad").val(),
                "disciplinas" : $("#modalDisciplina").val()
            }).then(function(){ //y luego pasamos los valores actualizados a su perfil
             //cerramos el modal
              $("#modalInfo").modal("hide");

              //pasamos la info al html del perfil
              $("#nombre").text($("#modalNombre").val());
              $("#apellido").text($("#modalApellido").val());
              $("#edad").text($("#modalEdad").val());
              $("#sexo").text($("#modalSexo").val());
              $("#nacion").text($("#modalNacionalidad").val());
              $("#disci").text($("#modalDisciplina").val());
     });

    
     }); //Termina el click()

  //cambiamos la info del perfil
  $("#cambiarInfoSocial").click(function(){
    
  
    //Actualizamos los datos del usuario segun lo pedido
    firebase.database().ref().child("Usuarios/" + uid + "/contacto").update({
              
              "facebook": $("#modalFacebook").val(),
              "instagram": $("#modalInstagram").val(),
              "twitter": $("#modalTwitter").val()

            }).then(function(){ //y luego pasamos los valores actualizados a su perfil
              //cerramos el modal
              $("#modalSocial").modal("hide");

              //pasamos los enlaces a los botones
              $("#facebook").attr("href", $("#modalFacebook").val());
              $("#instagram").attr("href", $("#modalInstagram").val());
              $("#twitter").attr("href", $("#modalTwitter").val());
                }); //termina el then()

     }); //Termina el click()


 }); //termina el firebase.auth()
}); //Termina el document ready