document.addEventListener("DOMContentLoaded", function(){
    const sortSelect = document.querySelector("#sortSelect");
    const dynamicInput = document.querySelector("#dynamicInput");

    // Au chargement de la page, on définit le bon type d'input selon la valeur du select
    dynamicInput.type = sortSelect.value === "date" ? "date" : "text";

    // Changement du type d'input lorsque le select change
    sortSelect.addEventListener("change", function(){
        dynamicInput.type = this.value === "date" ? "date" : "text";
    });
    // Récupérer la position du scroll enregistrée
    const scrollY = sessionStorage.getItem("scrollPosition");

    if (scrollY) {
        window.scrollTo(0, parseInt(scrollY));
        sessionStorage.removeItem("scrollPosition"); // Nettoyer après l'application
    }

    // Sauvegarder la position du scroll avant de quitter la page
    window.addEventListener("beforeunload", function () {
        sessionStorage.setItem("scrollPosition", window.scrollY);
    });
});
