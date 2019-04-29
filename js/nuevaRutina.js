

$(document).ready(function() {

  //Revisamos si el usuario está conectado
	firebase.auth().onAuthStateChanged(function(user) {
  if (user) {

      var uid =  firebase.auth().currentUser.uid;

      //Asignamos la referencia a una variable
      var ejerciciosNuevos = firebase.database().ref('Ejercicios/' + uid);

      //Asignamos un contador que utilizaremos en child_added
      var cont = 0

      //Buscamos con el metodo "child_added" todos los child de la referencia
      ejerciciosNuevos.on('child_added', function(snapshot, prevChildKey) {

              //Propositos del desarrollo, sin utilidad real
              console.log(snapshot.val().nombre);

              //Sumamos 1 al contador cada vuelta que haga el child_added
              cont++;

          $("#selectEjercicio").append($('<option>', {

          //Le asignamos al value el cont, para diferenciar los option más adelante
          value: cont,
          id: "valor" + cont,
          //el "nombre" permite buscar dentro del valor del snapshot, 
          //un nodo con ese nombre
          text: snapshot.val().nombre 
          
          })); //termina funcion snapshot
      });//termina el ".on"


        //Tomamos el input file de la página
        var imagen = document.getElementById("subirImagen");
        var botonCrearRutina = document.getElementById("crearRutina");

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
        botonCrearRutina.addEventListener("click", function() {

            //En caso de que el error se haya mostrado, lo ocultamos
            $("#imagenError").hide();

            //Si el campo de usuario está escrito, continuamos
            if (document.getElementById("nombre").value) {
              
              //En caso de que el error se haya mostrado, lo ocultamos
              $("#nombreError").hide();

              //Si el input de imagen tiene una, continuamos
              if (document.getElementById("subirImagen").files[0]) {

                //Tomamos el primer archivo subido
                var file = imagen.files[0];

                //Creamos una referencia
                var storageRef = firebase.storage().ref("imagen/" + file.name);

                //Subimos el archivo a la base de datos
                var uploadTask = storageRef.put(file);

                //Cuando la variable cambie, aplicamos diversas funciones

                // Un observador que cambia dependiendo del progreso, pausa o reanudacion de la descarga
                uploadTask.on('state_changed', function(snapshot){

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
                            var nombreRutina = $("#nombre").val();
                            var descripcion = $("#descripcion").val();

                            //Tomamos el ID de usuario
                            var uid =  firebase.auth().currentUser.uid;


                            //Guardamos la información dentro del ID del usuario en la seccion ejercicios
                            firebase.database().ref().child("Rutinas/" + uid + "/"+ nombreRutina).set(
                             {nombre: nombreRutina,
                              descripcion: descripcion,
                              imagen: downloadURL}).then(function(){
                               //Luego de que se guarde la información correctamente,
                               //utilizamos un nuevo ".then" para activar la tabla,

                               //Le asignamos el nombre de la rutina al boton
                               $("#tablaRutina").text(nombreRutina);
                               $("#contTabla").show();
                               $("#contAñadirEjercicio").show();
                               //y ocultamos la posibilidad de crear nuevas rutinas
                               $("#contCrearRutina").hide();

                              });

                          });

                          }
                    );

              //Si el input de imagen no tiene una, mostramos error
              } else {$("#imagenError").show();}

              //Si el campo de nombre no está escrito, mostramos error
            } else { $("#nombreError").show();}



        });//termina el addEventListener()


//Si nadie está conectado, lo aviso a mi mismo
  } else {
    alert("nadie conectado")
  };
});


//Añadimos una función al clickear "Añadir ejercicio a rutina"
$("#añadirEjercicio").click(function(){

          //Asignamos variables de los input
          var ejercicio = $("#selectEjercicio option:selected").text();
          var serie = $("#serie").val();
          var repeticiones = $("#rep").val();
          var descanso = $("#desc").val();


          function validar(p){
            var pattern = /^[0-9-]+$/
            return pattern.test(p)

          }

        //validamos los 3 campos
        if ( validar(serie) && validar(repeticiones) && validar(descanso) ) {

           $("#validacionError").hide(); 

          //Ponemos todo el append() en una variable para usarlo despues
          //Dentro tomo los valores de los inputs y armo las rows
          var rowEjercicio =  "<tr>" +
                              "<td>" + ejercicio + "</td>" +
                              "<td>" + serie + "</td>" +
                              "<td>" + repeticiones + "</td>" +  
                              "<td>" + descanso + "</td>" +
                              "</tr>";

          //Los colocamos en la tabla
          $("#tBody").append(rowEjercicio)

          //Tomamos el ID de usuario
          var uid =  firebase.auth().currentUser.uid;

          //Declaramos nuevamente la variable usada en otra funcion y asignamos el valor
          //que utilizaremos para acceder a la carpeta de la base de datos
          var nombreRutina = $("#tablaRutina").text();

          //Guardamos la información dentro del ID del usuario en la seccion Rutina
          firebase.database().ref().child("Rutinas/" + uid + "/"+ nombreRutina + "/Ejercicios/" + ejercicio ).set(
           {Ejercicio: ejercicio,
            Series: serie,
            Repeticiones: repeticiones,
            Descanso: descanso }).then(function(){

            //Reiniciamos todos los inputs y el select
            $("#selectEjercicio").val($("#selectEjercicio option:first").val()); //aca seleccionamos la primera option
            $("#serie").val("");
            $("#rep").val("");
            $("#desc").val("");


            }); //termina el .then()

      } else {    $("#validacionError").show()        }; //termina el if

});//termina el .click()


           
        



}); //termina el document ready


