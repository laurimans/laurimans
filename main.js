
// Declaración de variables
let colorOver= "#f5f5f5";

let navButtons = document.getElementsByClassName("navButton");

// Mouseover y mouseout sobre botones de navegacion
for(let i=0; i<navButtons.length; i++){
    navButtons[i].addEventListener("mouseover", function(){
        this.style.color= colorOver;
    })

    navButtons[i].addEventListener("mouseout", function(){
        this.style.color="";
    })
}

function goto(seccionId) {
  const seccion = document.getElementById(seccionId);
  if (seccion) {
    seccion.scrollIntoView({ behavior: "smooth" }); // Desplazamiento suave
  }
}




