
$(document).ready(function() {

	$("#botonRegistro").click(function registrar() {	 
		//Tomamos todos los input y los asignamos a sus variables correspondientes
		var idEmail = $("#email").val(); 
		var idContraseña = $("#contraseña").val(); 
		var idRepContraseña = $("#repetirContraseña").val();  
		var idNombre = $("#nombre").val(); 
		var idApellido = $("#apellido").val(); 
		var arrayIds = [$("#email"), $("#contraseña"), $("#repetirContraseña"), $("#nombre"), $("#apellido")];

		//Reiniciamos el mensaje de error
		$("#registroError").hide();
		$("#registroErrorContraseña").hide();

				//Ponemos el color predeterminado de los input
				for (var i = 0; i < arrayIds.length; i++) {
				arrayIds[i].css('box-shadow', 'none');};
			//Verificamos que todos los inputs esten correctamente escritos
			if (idContraseña === idRepContraseña && idNombre && idApellido && idContraseña && idRepContraseña && idEmail) {
				
				

				//Pasamos los valores para crear la cuenta
				firebase.auth().createUserWithEmailAndPassword(idEmail, idContraseña).catch(function(error) {
				
				// Handle Errors here.
				var errorCode = error.code;
				var errorMessage = error.message;
				// ...
				//Mostramos posibles errores
				$("#registroError").show();
				$("#registroError").text(errorMessage);
				
				}).then(function(){
					//Una vez creada la cuenta, enviamos información correspondiente a la base de datos
					//Asignamos el ID del usuario a una variable
					var uid = firebase.auth().currentUser.uid;

					//Guardamos la información en su correspondiente sección
					firebase.database().ref().child('Usuarios/' + uid).set({
	 	 				nombre: idNombre,
	 	 				apellido: idApellido,
	 	 				imgPerfil: "sin especificar",
	 	 				edad: "sin especificar",
	 	 				sexo: "sin especificar",
	 	 				nacionalidad: "sin especificar",
	 	 				disciplinas: "sin especificar",
	 	 				contacto: {
	 	 					facebook: "",
	 	 					instagram: "",
	 	 					twitter: "",
	 	 				}
	 				});

				//Mostramos la alerta del registro exitoso
				$("#modal").modal("show");

				//Redireccionamos a iniciar sesion cuando presiona el boton
				$("#registroExitoso").click(function(){window.location.assign("index.html")})
				firebase.auth().signOut(); //deslogueamos 
				}); //termina el .then()

				

			} else { if (idContraseña !== idRepContraseña) {$("#registroErrorContraseña").show();
				} else { 
				$("#registroError").show();
				for (var i = 0; i < arrayIds.length; i++) {
					if(arrayIds[i].val() == "" ) {arrayIds[i].css('box-shadow', '0px 0px 8px red')}
				}};

				/* $("input").each(function(){
					if () {$(this).css("box-shadow","inset 0 1px 1px rgba(0,0,0,.075),0 0 8px red");}
				})

				alert("Ingresa correctamente la contraseña")
				 */
				
		
		
	
		}; 

	}); //termina el .click()
});