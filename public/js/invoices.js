document.addEventListener("DOMContentLoaded", function(){
    const sortSelect = document.querySelector("#sortSelect");
    const dynamicInput = document.querySelector("#dynamicInput");

    //Au chargement de la page, on definit le bon type d'input, suivant le nom du sortSelect recuperer par le back
    dynamicInput.type = sortSelect.value === "date"?"date":"text";

    //Changer le type d'input losqu'on change le select
    sortSelect.addEventListener("change", function(){
        dynamicInput.type = this.value === "date"?"date":"text";
    })
});