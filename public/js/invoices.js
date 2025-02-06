document.addEventListener("DOMContentLoaded", function(){
    const sortSelect = document.querySelector("#sortSelect");
    const dynamicInput = document.querySelector("#dynamicInput");

    // Au chargement de la page, on définit le bon type d'input selon la valeur du select
    dynamicInput.type = sortSelect.value === "date" ? "date" : "text";

    // Changement du type d'input lorsque le select change
    sortSelect.addEventListener("change", function(){
        dynamicInput.type = this.value === "date" ? "date" : "text";
    });
});
