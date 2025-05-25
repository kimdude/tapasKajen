"use strict";

const makeReviewBtn = document.getElementById("makeReview");
const submitBtn = document.getElementById("submitReview");
const tapasBtn = document.getElementById("addTapas");
const tapasForm = document.getElementById("newTapasDiv");
const submitTapas = document.getElementById("submitTapas");
const drinkBtn = document.getElementById("addDrink");
const drinkForm = document.getElementById("newDrinkDiv");
const submitDrink = document.getElementById("submitDrink");
const tapasMenu = document.getElementById("tapasMenu");


//Adding eventlisteners
if(makeReviewBtn) {
    makeReviewBtn.addEventListener("click", toggleReviewForm);
}

if(submitBtn) {
    submitBtn.addEventListener("click", toggleReviewForm);
}

if(tapasBtn) {
    tapasBtn.addEventListener("click", toggleMenuForm);
}

if(submitTapas) {
    submitTapas.addEventListener("click", toggleMenuForm);
}

if(drinkBtn) {
    drinkBtn.addEventListener("click", toggleMenuForm);
}

if(submitDrink) {
    submitDrink.addEventListener("click", toggleMenuForm);
}

if(tapasMenu) {
    displayMenu();
}


//Fetching menus and reviews
async function fetchData(routing) {
    try {
        const result = await fetch(`https://projekt-databas.onrender.com/api/menu${routing}`, {
            method: "GET",
            headers: {
                "content-type": "application/json"
            }
        });

        if(result.ok) {
            const data = await result.json();
            console.log(data);
            return data;
        } else {
            throw error;
        }

    } catch(error) {
        console.log(error);
    }
}

//Displaying tapas menu
async function displayMenu() {

    //Displaying tapas
    const tapas = await fetchData("/tapasmenu");

    for(let i=0; i< tapas.length; i++) {

        if(tapas[i].availability === true) {
            const articleEl = document.createElement("article");
            const tapasInfo = document.createElement("div");

            const nameContainer = document.createElement("p");
            nameContainer.setAttribute("class", "name");
            const strongStyle = document.createElement("strong");
            const name = document.createTextNode(tapas[i].name);

            const priceContainer = document.createElement("p");
            priceContainer.setAttribute("class", "price");
            const strong = document.createElement("strong");
            const price = document.createTextNode(tapas[i].price);

            tapasMenu.appendChild(articleEl);
            articleEl.appendChild(tapasInfo);
            tapasInfo.appendChild(nameContainer);
            nameContainer.appendChild(strongStyle);
            strongStyle.appendChild(name);
            tapasInfo.appendChild(priceContainer);
            priceContainer.appendChild(strong);
            strong.appendChild(price);

            const descriptionContainer = document.createElement("p");
            const description = document.createTextNode(tapas[i].description);
            articleEl.appendChild(descriptionContainer);
            descriptionContainer.appendChild(description);
        } 
    }

    //Displaying drinks
    const drinkMenu = document.getElementById("drinksMenu");
    const drinks = await fetchData("/drinkmenu");

    for(let i=0; i< drinks.length; i++) {

        if(tapas[i].availability === true) {
            const articleEl = document.createElement("article");
            const drinkInfo = document.createElement("div");

            const nameContainer = document.createElement("p");
            nameContainer.setAttribute("class", "name");
            const strongStyle = document.createElement("strong");
            const name = document.createTextNode(drinks[i].name);

            const priceContainer = document.createElement("p");
            priceContainer.setAttribute("class", "price");
            const strong = document.createElement("strong");
            const price = document.createTextNode(drinks[i].price);

            drinkMenu.appendChild(articleEl);
            articleEl.appendChild(drinkInfo);
            drinkInfo.appendChild(nameContainer);
            nameContainer.appendChild(strongStyle);
            strongStyle.appendChild(name);
            drinkInfo.appendChild(priceContainer);
            priceContainer.appendChild(strong);
            strong.appendChild(price);

            const descriptionContainer = document.createElement("p");
            const description = document.createTextNode(drinks[i].description);
            articleEl.appendChild(descriptionContainer);
            descriptionContainer.appendChild(description);
        } 
    }

}



//Toggle review form
function toggleReviewForm() {
    const reviewForm = document.getElementById("reviewForm");
    const style = getComputedStyle(reviewForm);

    if(style.display === "none") {
        reviewForm.style.display = "block";
        makeReviewBtn.style.display = "none";
    } else {
            reviewForm.style.display = "none";
            makeReviewBtn.style.display = "block";
    }
}

//Toggle menu forms
function toggleMenuForm() {

    let form;
    let button;

    if(tapasForm) {
        form = tapasForm;
        button = tapasBtn;
    } else {
        form = drinkForm;
        button = drinkBtn;
    }

    const style = getComputedStyle(form);

    if(style.display === "none") {
        form.style.display = "block";
        button.style.display = "none";
    } else {
        form.style.display = "none";
        button.style.display = "block";
    }
}