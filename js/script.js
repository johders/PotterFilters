import { potterCharacters } from "./datafile.js";

"use strict";

let homes, filteredByHouse;

window.addEventListener("load", initialise);

function initialise() {
    
    console.log(potterCharacters);
    getAllHomes();
    makeSelectOptions();

    document.addEventListener("input", filterHouseBasedOnSelection)

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


function filterHouseBasedOnSelection(e){

    const selectedHouse = e.target.value;

    populateSelection(selectedHouse);

}

function filterByHouse(residence){
 filteredByHouse = potterCharacters.filter(char => {return char.house === residence});
    
    if (residence ==="All"){
        filteredByHouse = potterCharacters;
    }
}

function populateSelection(residence){

    const mainEl = document.getElementById("main");

    mainEl.innerHTML = "";

    filterByHouse(residence);
    makeRadioButtons(residence);

    filteredByHouse.forEach(person => {
        
        const articleEl = document.createElement("article");

        if(person.house === ""){
            articleEl.classList.add("no-data");
        }
        else{
            articleEl.classList.add(person.house.toLowerCase());
        }

        const nameEl = document.createElement("h1");
        const imageEl = document.createElement("img");
        imageEl.src = person.image;
        const actorNameEl = document.createElement("p");

        nameEl.innerText = person.name;
        actorNameEl.innerText = person.actor;

        articleEl.append(nameEl);
        articleEl.append(imageEl);
        articleEl.append(actorNameEl);
        mainEl.append(articleEl);

    });

}

function makeRadioButtons(selection){

    const divEl = document.getElementById("ancestry");
    divEl.innerHTML = "";
    const ancestryOptions = [];

    filteredByHouse.forEach(person => {

        const existingOption = ancestryOptions.find(option => option === person.ancestry);

        if(!existingOption){
            if(person.ancestry !== ""){

                ancestryOptions.push(person.ancestry);
            }
        }
    });    


    console.log(ancestryOptions);

    const radioAllEl = document.createElement("input");
    const radioLabelForAll = document.createElement("label");
    radioAllEl.type = "radio";
    radioAllEl.id = "All";
    radioAllEl.name = "All";
    radioAllEl.value = "All";
    radioLabelForAll.for = "All";
    radioLabelForAll.innerText = "All";
    divEl.append(radioAllEl);
    divEl.append(radioLabelForAll);

    ancestryOptions.forEach(item => {

        const radioEl = document.createElement("input");
        const radioLabel = document.createElement("label");
        radioEl.type = "radio";
        radioEl.id = item;
        radioEl.name = item;
        radioEl.value = item;
        radioLabel.for = item;
        radioLabel.innerText = item;
        divEl.append(radioEl);
        divEl.append(radioLabel);
    })
}