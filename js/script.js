
import { potterCharacters } from "./datafile.js";
"use strict";

let allCharacters, homes, filteredByHouse, houseList, mainEl, divEl, buttonEl, local, onlineData;

window.addEventListener("load", initialise);

function initialise() {

    allCharacters = potterCharacters;
    houseList = document.getElementById("houses");
    mainEl = document.getElementById("main");
    divEl = document.getElementById("ancestry");
    buttonEl = document.getElementById("get-data-online");
    local = true;

    console.log(potterCharacters);
    getAllHomes();
    makeSelectOptions();

    houseList.addEventListener("input", filterHouseBasedOnSelection);
    buttonEl.addEventListener("click", toggleHouseDataSource);

    // getJsonData();
}

function getAllHomes(){

    homes = [];

    allCharacters.forEach(character => {

        const existingHome = homes.find(home => home === character.house);

        if(!existingHome){
            homes.push(character.house);
        }
    });

    console.log(homes);
}

function makeSelectOptions(){

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
 filteredByHouse = allCharacters.filter(char => {return char.house === residence});
    
    if (residence ==="All"){
        filteredByHouse = allCharacters;
    }
}

function populateSelection(residence){

    mainEl.innerHTML = "";

    filterByHouse(residence);
    makeRadioButtons(residence);

    filteredByHouse.forEach(person => {      
        makePersonCard(person);
    });

}

function makeRadioButtons(){

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

    createRadioElement("All");

    ancestryOptions.forEach(item => {

        createRadioElement(item);

    });
}

function filterByAncestry(e){

    let result = filteredByHouse.filter(person => person.ancestry === e.target.value);

    if (e.target.value ==="All"){
        result = filteredByHouse;
    }

    mainEl.innerHTML = "";

    result.forEach(person => {

        makePersonCard(person);

    });
   
}

function makePersonCard(person){

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

}

function createRadioElement(option){

    const radioEl = document.createElement("input");
        const radioLabel = document.createElement("label");
        radioEl.type = "radio";
        radioEl.id = option;
        radioEl.name = "ancestry";
        radioEl.value = option;
        radioEl.addEventListener("click", filterByAncestry)
        radioLabel.for = option;
        radioLabel.innerText = option;
        divEl.append(radioEl);
        divEl.append(radioLabel);
}

async function getJsonData(){

    const jsonUrl = "https://howest-gp-wfa.github.io/st-2223-2-d-pe03-HP-jd-HW/api/characters.json";
    onlineData = [];

    try{
        const response = await fetch(jsonUrl);
        const data = await response.json();
    
        onlineData = data;
        console.log(onlineData);
    }
    catch(e){
        console.log(response);
    }
     
}

async function toggleHouseDataSource(){

    if(local){
        await getJsonData();
        allCharacters = onlineData;
        local = false;
    }
    else{
        allCharacters = potterCharacters;
        local = true;
    }

    console.log(allCharacters);

}