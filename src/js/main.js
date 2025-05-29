"use strict";

//Fetching variables connected to customers
const reviewDisplay = document.getElementById("displayReviews");
const makeReviewBtn = document.getElementById("makeReview");
const submitBtn = document.getElementById("submitReview");
const submitBooking = document.getElementById("submitBooking")
const tapasForm = document.getElementById("newTapasDiv");
const drinkBtn = document.getElementById("addDrink");
const drinkForm = document.getElementById("newDrinkDiv");
const submitDrink = document.getElementById("submitDrink");
const tapasMenu = document.getElementById("tapasMenu");

//Adding eventlisteners
if(makeReviewBtn) {
    makeReviewBtn.addEventListener("click", toggleReviewForm);
    displayReviews();
}

if(submitBtn) {
    submitBtn.addEventListener("click", function(e) {
        postReview(e);
    });
}

if(submitBooking) {
    submitBooking.addEventListener("click", function(e) {
        postBooking(e);
    });
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

//Fetching variables connected to admins
const loginBtn = document.getElementById("submitLogin");
const logout = document.getElementById("logout");
const bookings = document.getElementById("upcomingBookings");
const tapasTable = document.getElementById("tapasMenuAdmin");
const editTapasBtn = document.getElementById("addTapas");
const submitTapas = document.getElementById("submitTapas");

//Adding eventlisteners
if(loginBtn) {
    loginBtn.addEventListener("click", function(e) {
        login(e);
    });
}

if(logout) {
    logout.addEventListener("click", function() {
        localStorage.clear();
        window.location.href = "/login.html";
    });
}

if(bookings) {
    allBookings();
}

if(tapasTable) {
    fetchTapas();
}

if(editTapasBtn) {
    editTapasBtn.addEventListener("click", toggleMenuForm);
}

if(submitTapas) {
    submitTapas.addEventListener("click", function(e) {
        addTapas(e);
    });
}

/* Fetching API:s */
//Logging in user
async function login(e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const errors = document.getElementById("loginErrors");

    if(username === "" || password === "") {
        errors.innerHTML = "Ange <strong>användarnamn</strong> och <strong>lösenord</strong>."
    } else {
        let loggedUser = {
            username: username,
            password: password
        }

        try {
            const result = await fetch("https://projekt-databas.onrender.com/api/login",{
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(loggedUser)
           });

           if(result.ok) {
            const data = await result.json();

            localStorage.setItem("userToken", data.response.token);
            window.location.href = "bookingAdmin.html";

           } else {
            throw error;
           }

        } catch(error) {
            errors.innerHTML = "Fel användarnamn eller lösenord."
        }
    }
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
            return data;
        } else {
            throw error;
        }

    } catch(error) {
        console.log(error);
    }
}

//Fetching bookings and menus
async function fetchDataAdmin(routing) {
    const currentToken = localStorage.getItem("userToken");

    try {
        const result = await fetch(`https://projekt-databas.onrender.com/api${routing}`, {
            method: "GET",
            headers: {
                "content-type": "application/json",
                "authorization": "Bearer " + currentToken
            }
        });

        if(result.ok) {
            const data = await result.json();
            return data;
        } else {
            throw new Error;
        }

    } catch(error) {
        const errors = document.getElementById("loginErrors");
        window.location.href = "login.html";
        errors.innerHTML = "Du måste logga in pånytt."
    }
}

//Adding menu items
async function addData(routing, object) {
    const currentToken = localStorage.getItem("userToken");

    try {
        const result = await fetch(`https://projekt-databas.onrender.com/api${routing}`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "authorization": "Bearer " + currentToken
            },
            body: JSON.stringify(object)
        });

        if(!result.ok) {
            throw new Error;
        }

    } catch(error) {
        window.location.href = "login.html";
    }
}

//Editing bookings and menus
async function editData(routingAndId, object) {
    const currentToken = localStorage.getItem("userToken");
    console.log(object)

    try {
        const result = await fetch(`https://projekt-databas.onrender.com/api${routingAndId}`, {
            method: "PUT",
            headers: {
                "content-type": "application/json",
                "authorization": "Bearer " + currentToken
            },
            body: JSON.stringify(object)
        });

        if(!result.ok) {
            throw new Error;
        }

    } catch(error) {
        window.location.href = "login.html";
    }
}

//Deleting bookings and menu items
async function deleteData(routingAndId) {
    const currentToken = localStorage.getItem("userToken");

    console.log("Deleting: ", `https://projekt-databas.onrender.com/api${routingAndId}`)

    try {
        const result = await fetch(`https://projekt-databas.onrender.com/api${routingAndId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + currentToken
            }
        });

        if(result.ok) {
            const data = await result.json();
            console.log(data);

        } else {
            throw new Error;
        }

    } catch(error) {
        console.log(error)
        /* window.location.href = "login.html"; */
    }
}

//Receiving reviews and bookings
async function customerInputs(routing, object) {
    try {
        const result = await fetch(`https://projekt-databas.onrender.com/api/menu${routing}`, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(object)
        });

        if(result.ok) {
            const data = await result.json();
            console.log(data)
        } else {
            throw error;
        }

    } catch(error) {
        console.log(error);
    }
}


/* Bookings */
//Sorting bookings for admin
async function allBookings() {
    const requestedBookings = document.getElementById("otherBookings");
    const data = await fetchDataAdmin("/bookings");

    //Getting current date
    const date = new Date
    let today = date.getDate();
    let month = date.getMonth() +1;
    const year = date.getFullYear();
    const upcomingBooking = [];

    if(today < 10) {
        let formatedToday = "0" + today;
        today = formatedToday;
    }

    if(month < 10) {
        let formatedMonth = "0" + month;
        month = formatedMonth;
    }

    //Sorting out old bookings
    const fullDate = year + "-" + month + "-" + today;
    data.forEach((booked) => {
        const formatedDate = booked.booked_date.slice(0,10);

        if(formatedDate >= fullDate) {
            return upcomingBooking.push(booked);
        }
    });

    //Sorting upcoming bookings after time
    const sortedBookings = upcomingBooking.sort((a,b) => {

        //Creating new date object from booked date and time
        const dateA = a.booked_date.slice(0,10);
        const dateB = b.booked_date.slice(0,10);
        const timeStampA = new Date(`${dateA}T${a.booked_time}`);
        const timeStampB = new Date(`${dateB}T${b.booked_time}`);

        return timeStampA - timeStampB;
    });
    
    //Emptying tables
    bookings.innerHTML = "";
    requestedBookings.innerHTML = "";

    for(let i = 0; i < sortedBookings.length; i++) {
        if(sortedBookings[i].confirmed === true) {
            confirmedBooking(sortedBookings[i]);
            
        } else {
            requestedBooking(sortedBookings[i]);
        }
    }
}

//Displaying requested bookings
function requestedBooking(booking) {
    const requestedBookings = document.getElementById("otherBookings");
    const formatedDate = booking.booked_date.slice(0,10);
    const formatedTime = booking.booked_time.slice(0,5);

    const tableRow = document.createElement("tr");
    const nameTd = document.createElement("td");
    const name = document.createTextNode(booking.firstname + " " + booking.surname);

    requestedBookings.appendChild(tableRow);
    tableRow.appendChild(nameTd);
    nameTd.appendChild(name);

    const emailTd = document.createElement("td");
    const email = document.createTextNode(booking.email);
    tableRow.appendChild(emailTd);
    emailTd.appendChild(email);

    const messageTd = document.createElement("td");
    const message = document.createTextNode(booking.message);
    tableRow.appendChild(messageTd);
    messageTd.appendChild(message);

    const peopleTd = document.createElement("td");
    const people = document.createTextNode(booking.people);
    tableRow.appendChild(peopleTd);
    peopleTd.appendChild(people);

    const dateTd = document.createElement("td");
    const date = document.createTextNode(formatedDate);
    tableRow.appendChild(dateTd);
    dateTd.appendChild(date);

    const timeTd = document.createElement("td");
    const time = document.createTextNode(formatedTime);
    tableRow.appendChild(timeTd);
    timeTd.appendChild(time);

    const confirmTd = document.createElement("td");
    const select = document.createElement("select");
    const chooseOption = document.createElement("option");
    chooseOption.setAttribute("hidden", "true");
    const confirmOption = document.createElement("option");
    const denyOption = document.createElement("option");

    const choose = document.createTextNode("Obesvarad");
    const confirm = document.createTextNode("Bekräfta");
    const deny = document.createTextNode("Avböj");

    tableRow.appendChild(confirmTd);
    confirmTd.appendChild(select);
    select.appendChild(chooseOption);
    chooseOption.appendChild(choose);
    select.appendChild(confirmOption);
    confirmOption.appendChild(confirm);
    select.appendChild(denyOption);
    denyOption.appendChild(deny);

    select.addEventListener("input", async function(e) {
        const id = booking.booking_num;

        if(e.target.value === "Bekräfta") {
            const confirmedBooking = {
                message: booking.message,
                booked_date: booking.booked_date,
                booked_time: booking.booked_time,
                people: booking.people,
                confirmed: true
            }

            await editData(`/bookings/${id}`, confirmedBooking);
            allBookings();

        } else {
            await deleteData(`/bookings/${id}`);
            allBookings();
        }
    });
}

//Displaying confirmed bookings
async function confirmedBooking(booking) {
    const formatedDate = booking.booked_date.slice(0,10);
    const formatedTime = booking.booked_time.slice(0,5);

    const tableRow = document.createElement("tr");
    const nameTd = document.createElement("td");
    const name = document.createTextNode(booking.firstname + " " + booking.surname);

    bookings.appendChild(tableRow);
    tableRow.appendChild(nameTd);
    nameTd.appendChild(name);

    const emailTd = document.createElement("td");
    const email = document.createTextNode(booking.email);
    tableRow.appendChild(emailTd);
    emailTd.appendChild(email);

    const messageTd = document.createElement("td");
    const message = document.createTextNode(booking.message);
    tableRow.appendChild(messageTd);
    messageTd.appendChild(message);

    const peopleTd = document.createElement("td");
    const people = document.createTextNode(booking.people);
    tableRow.appendChild(peopleTd);
    peopleTd.appendChild(people);

    const dateTd = document.createElement("td");
    const date = document.createTextNode(formatedDate);
    tableRow.appendChild(dateTd);
    dateTd.appendChild(date);

    const timeTd = document.createElement("td");
    const time = document.createTextNode(formatedTime);
    tableRow.appendChild(timeTd);
    timeTd.appendChild(time);

    const deleteTd = document.createElement("td");
    const deleteBtn = document.createElement("button");
    deleteBtn.setAttribute("class", "tableBtn deleteBtn");
    const deleteNode = document.createTextNode("Avboka");
    const editBtn = document.createElement("button");
    editBtn.setAttribute("class", "tableBtn");
    const editNode = document.createTextNode("Redigera");

    tableRow.appendChild(deleteTd);
    deleteTd.appendChild(editBtn);
    editBtn.appendChild(editNode);
    deleteTd.appendChild(deleteBtn);
    deleteBtn.appendChild(deleteNode);

    deleteBtn.addEventListener("click", async function() {
        const id = booking.booking_num;
        await deleteData(`/bookings/${id}`);
        allBookings();
    });

    //Form when editing booking
    editBtn.addEventListener("click", async function() {
        messageTd.innerHTML = "";
        peopleTd.innerHTML = "";
        dateTd.innerHTML = "";
        timeTd.innerHTML = "";
        deleteTd.innerHTML = "";

        const message = document.createElement("textarea");
        message.value = booking.message;
        messageTd.appendChild(message);

        const group = document.createElement("input");
        group.setAttribute("type", "number");
        group.value = booking.people;
        peopleTd.appendChild(group);

        const date = document.createElement("input");
        date.setAttribute("type", "date");
        date.value = formatedDate;
        dateTd.appendChild(date);

        const time = document.createElement("input");
        time.setAttribute("type", "time");
        time.value = formatedTime 
        timeTd.appendChild(time);

        const updateBtn = document.createElement("button");
        updateBtn.setAttribute("class", "tableBtn");
        const updateNode = document.createTextNode("Uppdatera");

        deleteTd.appendChild(updateBtn);
        updateBtn.appendChild(updateNode);

        //Confirming edit
        updateBtn.addEventListener("click", async function() {
            const bookingID = booking.booking_num;

            const updatedBooking = {
                message: message.value,
                people: group.value,
                booked_date: date.value,
                booked_time: time.value,
                confirmed: true
            }

            await editData(`/bookings/${bookingID}`, updatedBooking);
            allBookings();
        });
    });
}

//Creating new booking
async function postBooking(e) {
    e.preventDefault();

    const fname = document.getElementById("firstnameBooking").value;
    const lname = document.getElementById("surnameBooking").value;
    const email = document.getElementById("email").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    const group = document.getElementById("group").value;
    const message = document.getElementById("bookingMessage").value.trim();
    const errorSpan = document.getElementById("errorsBookingForm");
    const errors = [];

    if(!fname) {
        errors.push(" förnamn");
    }

    if(!lname) {
        errors.push(" efternamn");
    }

    if(!email) {
        errors.push(" epost");
    }

    if(!date) {
        errors.push(" datum");
    }

    if(!time) {
        errors.push(" tid");
    }

    if(!group) {
        errors.push(" antal personer");
    }

    if(errors.length > 0) {
        errorSpan.innerHTML = `<p> Ange <strong>${errors}</strong>.</p>`;

    } else {
        let newBooking = {
            firstname: fname,
            surname: lname,
            email: email,
            bookedDate: date,
            bookedTime: time,
            peopleSum: group,
            message: message
        }

        customerInputs("/bookings", newBooking);

        document.getElementById("firstnameBooking").value = "";
        document.getElementById("surnameBooking").value = "";
        document.getElementById("email").value = "";
        document.getElementById("date").value = "";
        document.getElementById("time").value = "";
        document.getElementById("group").value = "";
        document.getElementById("bookingMessage").value = "";
    }
}


/* Reviews */
//Creating new review
async function postReview(e) {
    e.preventDefault();

    const fname = document.getElementById("firstname").value;
    const lname = document.getElementById("surname").value;
    const email = document.getElementById("emailReview").value;
    const message = document.getElementById("reviewMessage").value.trim();
    const errorSpan = document.getElementById("errorsReviewForm");
    const errors = [];

    if(!fname) {
        errors.push(" förnamn");
    }

    if(!lname) {
        errors.push(" efternamn");
    }

    if(!email) {
        errors.push(" epost");
    }

    if(!message) {
        errors.push(" recension");
    }

    if(errors.length > 0) {
        errorSpan.innerHTML = `<p> Ange <strong>${errors}</strong>.</p>`;

    } else {
        let newReview = {
            firstname: fname,
            surname: lname,
            email: email,
            message: message
        }

        await customerInputs("/reviews", newReview);

        document.getElementById("firstname").value = "";
        document.getElementById("surname").value = "";
        document.getElementById("emailReview").value = "";
        document.getElementById("reviewMessage").value = "";

        displayReviews();
        toggleReviewForm();
    }
}

//Displaying reviews
async function displayReviews() {
    reviewDisplay.innerHTML = "";

    const reviews = await fetchData("/reviews");
    let index = 0; 
    let indexPlus = 3; 

    for(let i = index; i < indexPlus; i++) {
        createReview(reviews[i]);
    }

    //Switching reviews after 10s
    const switchReviews = setInterval(function() {

        reviewDisplay.innerHTML = "";

        for(let i = index; i < indexPlus; i++) {
            createReview(reviews[i]);
        }

        const newIndex = index + 3
        index = newIndex;
        indexPlus = newIndex + 3;

        if(index >= reviews.length) {
            index = 0;
            indexPlus = 3;
        }

    }, 10000);

}

//Creating articles with reviews
async function createReview(review) {
    if(review != null) {
        const articleEl = document.createElement("article");
        articleEl.setAttribute("class", "reviewArticle");
        const reviewP = document.createElement("p");
        const reviewNode = document.createTextNode(review.message);

        reviewDisplay.appendChild(articleEl);
        articleEl.appendChild(reviewP);
        reviewP.appendChild(reviewNode);
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

/* Menus */
//Displaying menus
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

//Toggle menu forms
function toggleMenuForm() {

    let form;
    let button;

    if(tapasForm) {
        form = tapasForm;
        button = editTapasBtn;
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

//Fetching tapas menu for admin
async function fetchTapas() {
    tapasTable.innerHTML = "";
    const tapas = await fetchData("/tapasmenu");

    //Sorting tapas by availability
    const sortedTapas = tapas.sort((a,b) => {
        return b.availability - a.availability
    });

    for(let i = 0; i < sortedTapas.length; i++) {
        const tableRow = document.createElement("tr");

        if(sortedTapas[i].availability === false) {
            tableRow.setAttribute("class", "unavailable");
        }

        const nameTd = document.createElement("td");
        const nameNode = document.createTextNode(sortedTapas[i].name);

        tapasTable.appendChild(tableRow);
        tableRow.appendChild(nameTd);
        nameTd.appendChild(nameNode);

        const descrTd = document.createElement("td");
        const descrNode = document.createTextNode(sortedTapas[i].description);
        tableRow.appendChild(descrTd);
        descrTd.appendChild(descrNode);

        const priceTd = document.createElement("td");
        const priceNode = document.createTextNode(sortedTapas[i].price);
        tableRow.appendChild(priceTd);
        priceTd.appendChild(priceNode);

        //Availability options
        const statusTd = document.createElement("td");
        const select = document.createElement("select");
        const availableOption = document.createElement("option");
        const hideOption = document.createElement("option");
        const deleteOption = document.createElement("option");

        const available = document.createTextNode("Tillgänglig");
        const hide = document.createTextNode("Otillgänglig");
        const deleteNode = document.createTextNode("Ta bort");

        if(sortedTapas[i].availability === true) {
            availableOption.setAttribute("selected", "selected");
        } else {
            hideOption.setAttribute("selected", "selected");
        }

        tableRow.appendChild(statusTd);
        statusTd.appendChild(select);
        select.appendChild(availableOption);
        availableOption.appendChild(available);
        select.appendChild(hideOption);
        hideOption.appendChild(hide);
        select.appendChild(deleteOption);
        deleteOption.appendChild(deleteNode);

        //Changing availability
        select.addEventListener("input", async function(e) {
            const choice = e.target.value;
            const tapasID = sortedTapas[i].tapas_code;
            
            if(choice === "Otillgänglig") {
                const updatedTapas = {
                    name: sortedTapas[i].name,
                    description: sortedTapas[i].description,
                    price: sortedTapas[i].price,
                    availability: false
                }

                await editData(`/tapasmenu/${tapasID}`, updatedTapas);
                fetchTapas();

            } else if(choice === "Tillgänglig") {
                const updatedTapas = {
                    name: sortedTapas[i].name,
                    description: sortedTapas[i].description,
                    price: sortedTapas[i].price,
                    availability: true
                }

                await editData(`/tapasmenu/${tapasID}`, updatedTapas);
                fetchTapas();
            } else {
                await deleteData(`/tapasmenu/${tapasID}`);
                fetchTapas();
            }
        });

        //Editing tapas
        const editTd = document.createElement("td");
        const editBtn = document.createElement("button");
        editBtn.setAttribute("class", "tableBtn");
        const editNode = document.createTextNode("Redigera");

        tableRow.appendChild(editTd);
        editTd.appendChild(editBtn);
        editBtn.appendChild(editNode);

        editBtn.addEventListener("click", function() {
            nameTd.innerHTML = "";
            descrTd.innerHTML = "";
            priceTd.innerHTML = "";
            editTd.innerHTML = "";

            const nameInput = document.createElement("input");
            nameInput.setAttribute("type", "text");
            nameInput.value = sortedTapas[i].name;
            nameTd.appendChild(nameInput);

            const descrInput = document.createElement("input");
            descrInput.setAttribute("type", "text");
            descrInput.value = sortedTapas[i].description;
            descrTd.appendChild(descrInput);

            const priceInput = document.createElement("input");
            priceInput.setAttribute("type", "number");
            priceInput.value = sortedTapas[i].price;
            priceTd.appendChild(priceInput);

            const confirmBtn = document.createElement("button");
            confirmBtn.setAttribute("class", "tableBtn");
            const confirmNode = document.createTextNode("Uppdatera");

            editTd.appendChild(confirmBtn);
            confirmBtn.appendChild(confirmNode);
            confirmBtn.addEventListener("click", async function() {
                const tapasID = sortedTapas[i].tapas_code;

                const updatedTapas = {
                    name: nameInput.value,
                    description: descrInput.value,
                    price: priceInput.value,
                    availability: true
                }

                await editData(`/tapasmenu/${tapasID}`, updatedTapas);
                fetchTapas();
            });
        });
    }
}

//Adding tapas to menu
async function addTapas(e) {
    e.preventDefault();

    const name = document.getElementById("tapasName").value;
    const descr = document.getElementById("tapasDescr").value;
    const price = document.getElementById("tapasPrice").value;
    const errorSpan = document.getElementById("tapasErrors");
    const errors = [];

    if(!name) {
        errors.push(" namn");
    }

    if(!descr) {
        errors.push(" beskrivning");
    }

    if(!price) {
        errors.push(" pris");
    }

    if(errors.length > 0) {
        errorSpan.innerHTML = `Ange <strong>${errors}</strong>.`;

    } else {
        //Creating object
        const newTapas = {
            name: name,
            description: descr,
            price: price
        }

        //Adding object
        await addData("/tapasmenu", newTapas);

        //Reseting inputs
        document.getElementById("tapasName").value = "";
        document.getElementById("tapasDescr").value = "";
        document.getElementById("tapasName").value = "";

        fetchTapas();
        toggleMenuForm();
    }
}

//Fetching drink menu admin

