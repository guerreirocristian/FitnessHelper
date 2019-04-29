var cronometro;
var	centesimas = 0;
var	segundos = 0;
var	minutos = "00";
var	horas = 0;
var vuelta = 1;

$(document).ready(function(){
	$("#pausar").hide();

	$("#iniciar").click(function() {
		// $("#iniciar").prop("disabled",true);
		$("#iniciar").hide();	
		$("#pausar").show();
		cronometro = setInterval(function crono(){
				if (centesimas < 99) { 
					centesimas++;
					if (centesimas < 10) {centesimas = "0"+centesimas;};
					$("#centesimas").text(centesimas);
				}
				if (centesimas == 99) {centesimas = -1;};

				if (centesimas == 0) {
					segundos++;
					if (segundos < 10) {segundos = "0"+segundos;};
					$("#segundos").text(segundos);
				};

				if (segundos == 59) {segundos = -1;}

				if (centesimas == 0 && segundos == 0) {
					minutos++;
					if (minutos < 10) {minutos = "0"+minutos;};
					$("#minutos").text(minutos);
					};

				if (minutos == 59) {minutos = -1;}

				if (segundos == 0 && minutos == 0 && centesimas == 0) {
					horas++;
					if (horas < 10) {horas = "0"+horas;};
					$("#horas").text(horas);
				}

				if (horas == 99) {horas = 0;}
			
			}, 10);
		}); //termina el click  

	$("#pausar").click(function() { 
		$("#iniciar").show();
		$("#pausar").hide();
		$("#reiniciar").show();	
		clearInterval (cronometro);
		$("#iniciar").prop("disabled",false);
	}); //termina el click

	$("#reiniciar").click(function() { 
		$("#iniciar").show();	
		$("#pausar").hide();
		$("#reiniciar").prop("disabled",false)
		clearInterval (cronometro);
		$("#centesimas, #segundos, #minutos, #horas").text("00");
		centesimas = 0;
		segundos = 0;
		minutos = 0;
		horas = 0;
		}); //termina el click

	$("#vueltas").click(function() { 
		$("#lista").append("<li>"+vuelta+" - "+minutos+":"+segundos+":"+centesimas+"</li>")
		vuelta++;
	}); //termina el click

	$("#limpiar").click(function() { 
		$("#lista").empty();
		vuelta = 1;
	});//termina el lcick
}); //Termina document ready