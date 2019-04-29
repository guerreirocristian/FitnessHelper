$(document).ready(function() {

 $("#iniciarSesion").click(function() {
      //Ocultamos el error
      $("#inicioError").hide();

      if (firebase.auth().currentUser) {
        // [START signout]
        firebase.auth().signOut();
        $("#inicioError").show();
          $("#inicioError").text("Tu cuenta ya está logueada.");
        // [END signout]
      } else {
        var idEmail = document.getElementById('email').value;
        var idContraseña = document.getElementById('contraseña').value;
        if (idEmail.length < 4) {

          //Mostramos el error y le damos el texto correspondiente
          $("#inicioError").show();
          $("#inicioError").text("Ingresa una dirección de email");
          return;
        }
        if (idContraseña.length < 4) {
          $("#inicioError").show();
          $("#inicioError").text("Por favor ingresa una contraseña");
          return;
        }

        // Sign in with email and pass.
        // [START authwithemail]
        firebase.auth().signInWithEmailAndPassword(idEmail, idContraseña)
        .then(function(){window.location.assign("paginaInicial.html");})
        .catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // [START_EXCLUDE]
          $("#inicioError").show();
          $("#inicioError").text(errorMessage);
          // [END_EXCLUDE]
        });
        // [END authwithemail]
      }


    } //termina la funcion


) //termina el click()           


}); //termina el document ready





