$(document).ready(function(){ 

//Si el checkbox está tildado, lo destilda
$('html').click(function() {
  if ($("#menuCheckbox").prop("checked")) 
  	{$("#menuCheckbox").prop("checked",false)} ;
});

//Detiene los eventos padre al clickear el checkbox
$('#menuCheckbox').click(function(event){
    event.stopPropagation();

});


});//termina el document ready