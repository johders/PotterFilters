import { potterCharacters } from "./datafile.js";

"use strict";

let homes;

window.addEventListener("load", initialise);

function initialise() {
    
    console.log(potterCharacters);
    getAllHomes();
    makeSelectOptions();


    document.addEventListener("input", filterBasedOnSelection)

}

function getAllHomes(){

    homes = [];

    potterCharacters.forEach(character => {

        const existingHome = homes.find(home => home === character.house);

        if(!existingHome){
            homes.push(character.house);
        }
    });

    console.log(homes);
}

function makeSelectOptions(){

    const houseList = document.getElementById("houses");
    houseList.options[houseList.length] = new Option("All", "All");

    homes.forEach(home => {
        if(home !== ""){
            houseList.options[houseList.length] = new Option(home, home);
        }
    });
}


function filterBasedOnSelection(e){

    const selectedHouse = e.target.value;

    populateSelection(selectedHouse);

}

function populateSelection(residence){

    const mainEl = document.getElementById("main");

    mainEl.innerHTML = "";

    const filteredByHouse = potterCharacters.filter(char => {return char.house === residence});

    filteredByHouse.forEach(c => console.log(c));

    filteredByHouse.forEach(person => {
        
        const articleEl = document.createElement("article");
        const nameEl = document.createElement("h1");
        const actorNameEl = document.createElement("p");

        nameEl.innerText = person.name;
        actorNameEl.innerText = person.actor;

        articleEl.append(nameEl);
        articleEl.append(actorNameEl);
        mainEl.append(articleEl);

    });

}