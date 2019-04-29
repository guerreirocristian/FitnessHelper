

// Registro de estudiantes
function registrarEstudiante() {
	// Tomo los datos
	var correoRegistro = document.getElementById('correoRegistro').value;
	var claveRegistro = document.getElementById('claveRegistro').value;
	//Llamo a la función para registrar de Firebase
	firebase.auth().createUserWithEmailAndPassword(correoRegistro, claveRegistro)
	.then(function(){
		botonEspera();
		enviarDatos();
		tipoCuentaEstudiante();		
		verificarCorreo();
		mensajeVerificacion();
		segundoPasoEstudiantes();
		// Si llamo a sesionIniciada() sin un setTimeOut de 3000 (aprox) no envía los datos a firebase.					
	})
	.catch(function(error) {
	  var errorCode = error.code;
	  var errorMessage = error.message;
	  // ... escribir mensaje de error en consola
	console.log(errorCode);
  	console.log(errorMessage);
	});	
}

// Carga de datos a firebase
function enviarDatos() {
	var correoRegistro = document.getElementById('correoRegistro').value;
	var nombre = document.getElementById('nombre').value;
	var apellido = document.getElementById('apellido').value;

	// Esto va a la base de datos
	var uid = firebase.auth().currentUser.uid;
	firebase.database().ref('users/' + uid).set({
		nombre: nombre,
		email: correoRegistro,
		apellido: apellido
	});
}

function tipoCuentaEstudiante() {
	var uid = firebase.auth().currentUser.uid;	
	firebase.database().ref('users/' + uid).update({
		cuenta: "estudiante"
	});
}

function tipoCuentaDocente() {
	var uid = firebase.auth().currentUser.uid;	
	firebase.database().ref('users/' + uid).update({
		cuenta: "docente"
	});	
}

// Envía un correo electrónico para verificación luego del registro de cualquier usuario
function verificarCorreo() {
	var user = firebase.auth().currentUser;

	user.sendEmailVerification().then(function() {
	  // Email sent.
	  console.log("Enviando correo...");
	}).catch(function(error) {
	  // An error happened.
	  console.log("Error");
	});	
}

// Observador para detectar cambios en la sesión de usuarios
function observador() {
	// Llamo a la función que detecta cambios en la sesión
	firebase.auth().onAuthStateChanged(function(user) {
		// Si hay un usuario logeado...
		if (user) {
		console.log("activo");
		var displayName = user.displayName;
		var email = user.email;
			// Muestro en consola los datos del usuario
			console.log(user);
			// Y muestro si el correo está verificado
			console.log(user.emailVerified);
		var emailVerified = user.emailVerified;
		var photoURL = user.photoURL;
		var isAnonymous = user.isAnonymous;
		var uid = user.uid;
		var providerData = user.providerData;
		}
		// Si no hay ningún usuario logeado...
		else {
		console.log("inactivo");
		}
	});	
}
observador();

function actualizarCorreo() {
	//Borro contenido del mensaje de error
	var mensajeError = document.getElementById('mensajeError');
	mensajeError.innerText = "";
	// Tomo los datos
	var correoIngresado = document.getElementById('correoIngresado').value;
	var nuevoCorreo = document.getElementById('nuevoCorreo').value;	
	// Tomo correo actual desde Firebase
	var correoActual = firebase.auth().currentUser.email;
		console.log(correoActual)
		console.log("ok1");

	// Comparo el correo ingresado con el que firebase dice que tiene registrado y si es distinto al nuevo
	if(correoIngresado == correoActual && correoActual != nuevoCorreo) {
		var correoReingresado = document.getElementById('correoReingresado').value;
			console.log("ok2");
			// Si es correcto, comparo que el nuevo correo haya sido reingresado correctamente
			if(nuevoCorreo == correoReingresado) {
				console.log("ok3");
				// Busco la id del usuario en Firebase
				var user = firebase.auth().currentUser;
				// Actualizo el correo
				user.updateEmail(nuevoCorreo).then(function() {
				  // Update successful.
				  botonEspera();
				  mensajeVerificacion();
				  verificarCorreo();
				  sesionIniciadaSplash();
				  	console.log("ok4");
				}).catch(function(error) {
				  // An error happened.
				  	mensajeError.innerText = "Se ha producido un error. Inicia sesión nuevamente y vuelve a intentarlo.";
				});
			}
			else {
				mensajeError.innerText = "El correo nuevo no coincide con el reingresado.";
			}
			// Chequear sección Volver a autenticar usuario y agregar la actualización a la base de datos
	}
	else {
		mensajeError.innerText = "El correo actual no es correcto o es igual al nuevo."
	}
}






































