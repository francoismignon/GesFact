//Ajoute les evenements sur les bouton qui permettent de n'afficher que la liste par numero ou par date
document.querySelector("#btnByDate").addEventListener("click", ()=>{
    document.querySelector("#sortByDate").classList.remove("hidden");
    document.querySelector("#sortByNum").classList.add("hidden");
});
document.querySelector("#btnByNum").addEventListener("click", ()=>{
    document.querySelector("#sortByDate").classList.add("hidden");
    document.querySelector("#sortByNum").classList.remove("hidden");
});
document.querySelector("#invDate").addEventListener("change", ()=>{
    document.querySelector("#searchField").classList.add("hidden");
    document.querySelector("#dateField").classList.remove("hidden");
});
// affiche le selecteur de date si le bon bouton radio est coché
const radios = document.querySelectorAll(".radio");
radios.forEach(radio => {
    radio.addEventListener("change", ()=>{
        document.querySelector("#searchField").classList.remove("hidden");
        document.querySelector("#dateField").classList.add("hidden");
    });      
});