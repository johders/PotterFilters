
"use strict";
import { potterCharacters } from "./datafile.js";

let allCharacters, homes, filteredByHouse, houseList, mainEl, divEl, buttonEl, local, onlineData, pageNumbersEl, currentPage, maxItemsOnPage;

window.addEventListener("load", initialise);

function initialise() {

    allCharacters = potterCharacters;
    houseList = document.getElementById("houses");
    mainEl = document.getElementById("main");
    divEl = document.getElementById("ancestry");
    buttonEl = document.getElementById("get-data-online");
    pageNumbersEl = document.getElementById("pagination");
    local = true;

    currentPage = 1;
    maxItemsOnPage = 12;

    console.log(potterCharacters);
    getAllHomes();
    makeSelectOptions();

    houseList.addEventListener("input", filterHouseBasedOnSelection);
    buttonEl.addEventListener("click", toggleHouseDataSource);


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
 filteredByHouse = allCharacters.filter(char => {return char.house === residence;});
    
    if (residence === "All"){
        filteredByHouse = allCharacters;
    }
}

function populateSelection(residence){

    mainEl.innerHTML = "";

    filterByHouse(residence);
    makeRadioButtons(residence);

    currentPage = 1;

    paginate(filteredByHouse, mainEl, maxItemsOnPage, currentPage);
    generatePaginationControls(filteredByHouse, pageNumbersEl, maxItemsOnPage);

}

function paginate(items, wrapper, rowsPerPage, page){

    wrapper.innerHTML = "";
    page--;

    const start = rowsPerPage * page;
    const end = start + rowsPerPage;
    const paginatedItems = items.slice(start, end);


    console.log(paginatedItems);

    for(let i = 0; i < paginatedItems.length; i++){
        const person = paginatedItems[i];

        makePersonCard(person);
    }
}

function generatePaginationControls(items, wrapper, rowsPerPage){

    wrapper.innerHTML = "";
    const pageCount = Math.ceil(items.length / rowsPerPage);

    for(let i = 1; i < pageCount + 1; i++){
        const btnEl = paginationButton(i, items);
        wrapper.appendChild(btnEl);
    }
}

function paginationButton(page, items){
    const button = document.createElement("button");
    button.innerText = page;

    if(currentPage == page){
        button.classList.add("active");
    }

    button.addEventListener("click", function (){

        currentPage = page;
        paginate(items, mainEl, maxItemsOnPage, currentPage);

        const currentButtonEl = document.querySelector(".pagination button.active");
        currentButtonEl.classList.remove("active");

        button.classList.add("active");
    });

    return button;
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

    const rdbAncestry = document.getElementsByName("ancestry");
    rdbAncestry[0].checked = true;
}

function filterByAncestry(e){

    let result = filteredByHouse.filter(person => person.ancestry === e.target.value);

    if (e.target.value === "All"){
        result = filteredByHouse;
    }

    // mainEl.innerHTML = "";

    // result.forEach(person => {

    //     makePersonCard(person);

    // });
    currentPage = 1;

    paginate(result, mainEl, maxItemsOnPage, currentPage);
    generatePaginationControls(result, pageNumbersEl, maxItemsOnPage);
   
}

function makePersonCard(person){

    const articleEl = document.createElement("article");

        if(person.house === ""){
            articleEl.classList.add("color-white-smoke");
        }
        else{
            articleEl.classList.add(person.house.toLowerCase());
        }

        const nameEl = document.createElement("h1");
        const imageEl = document.createElement("img");

        if(person.image === ""){
            imageEl.src = "img/No_Image_Available.jpg";
        }
        else{

            imageEl.src = person.image;
        }
        const actorNameEl = document.createElement("p");

        nameEl.innerText = person.name;
        actorNameEl.innerText = person.actor;

        articleEl.append(nameEl);
        articleEl.append(imageEl);
        articleEl.append(actorNameEl);

        const isWizard = person.wizard ? "Wizard: Yes" : "Wizard: No";
        let status;

        if(person.hogwartsStaff){
            status = "Status: Staff";
        }
        else if(person.hogwartsStudent){
            status = "Status: Student";
        }
        else{
            status = "Status: Other";
        }

        articleEl.title = isWizard + "\n" + status;
        mainEl.append(articleEl);

}

function createRadioElement(option){

    const radioEl = document.createElement("input");
        const radioLabel = document.createElement("label");
        radioEl.type = "radio";
        radioEl.id = option;
        radioEl.name = "ancestry";
        radioEl.value = option;
        radioEl.addEventListener("click", filterByAncestry);
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
        buttonEl.innerText = "Get Offline Data";
        houseList[0].selected = true;
        populateSelection("All");
        local = false;
    }
    else{
        allCharacters = potterCharacters;
        buttonEl.innerText = "Get Online Data";
        houseList[0].selected = true;
        populateSelection("All");
        local = true;
    }

    console.log(allCharacters);

}