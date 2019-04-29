$(document).ready(function(){

	firebase.auth().onAuthStateChanged(function(user) {
 	if (user) {

    	var uid =  firebase.auth().currentUser.uid;

    	//Asignamos la referencia a una variable
    	var ejerciciosNuevos = firebase.database().ref('Ejercicios/' + uid);

    	var cont = 1;

    	//Buscamos con el metodo "child_added" todos los child de la referencia
    	ejerciciosNuevos.on('child_added', function(snapshot, prevChildKey) {
		
    	var urlDelEjercicio = "";
    	var descripcionChe = "Sin descripcion disponible";

		//Creamos un row que va a contener todos los elementos html
		var rowAnexo="<div class='row' data-toggle='collapse' data-target="+ "#c" + cont + ">" +
                			"<div class='col-1 seccion seccion'>" + "</div>" +
                			"<div class='seccion col-11'>" + 
                				"<img class='img-fluid border-estilo' src="+ '"' + snapshot.val().imagen/* ACA LA IMAGEN */+ '"' +">" +
                				"<p>" + snapshot.val().nombre/*NOMBRE DEL EJERCICIO*/ + "</p>" +
                			"</div>" +
                			"<div class='col-0 seccion'>" +  "</div>" +  
                	"</div>" + 
                	"<div class='collapse' id='c" + cont + "' " + "data-parent='#accordion'>" +
                	"</div>";

        var descripcionChe="<div class='row'>" +
                				"<div class='col-0 descripcion'>" + "</div>" +
                				"<div class='col-5 descripcion'>" + "<h6 class='descripcion'>Descripción:</h6>" + "</div>" +		
                				"<div class='col-7 descripcion'><p>" + snapshot.val().descripcion + "</p>" + "</div>" +
                			"</div>";
                		

        var urlDelEjercicio="<div class='row'>" +
                				"<div class='col-0 descripcion'>" + "</div>" +
                				"<div class='col-5 descripcion'>" + "<h6 class='descripcion'>Video / info adicional:</h6>" + "</div>" +		
                				"<div class='col-7 descripcion'><p>" + snapshot.val().urlEjercicio + "</p>" + "</div>" +
                			"</div>";


            //Propositos del desarrollo, sin utilidad real
            console.log(snapshot.val().descripcion);




            //Anexamos la primer variable al accordión, luego verificamos si hay descripcioon y url, y las agregamos si hay. 
          $("#accordion").append(rowAnexo).after(function verDescripcion(){ if ( snapshot.val().descripcion !== ""  ) { $("#c" + cont).append(descripcionChe) };	
				}).after(function verDescripcion(){ if ( snapshot.val().urlEjercicio !== ""  ) { $("#c" + cont).append(urlDelEjercicio) };	
					}).after( function hr(){ $("#accordion").append("<hr>") 
						}); //termina funcion after
					// (Aclaracion: el after se utiliza para añadir un elemento al final del objeto seleccionado, el append se utiliza para añadirlo dentro)

		cont++;

      });//termina el ".on"

//Si nadie está conectado, lo aviso
  } else {
    alert("nadie conectado")
  };

  }); //Termina el auth

}); //Termina el document ready