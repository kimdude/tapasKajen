"use strict";

//Fetching variables connected to customers
const reviewDisplay = document.getElementById("displayReviews");
const makeReviewBtn = document.getElementById("makeReview");
const submitBtn = document.getElementById("submitReview");
const submitBooking = document.getElementById("submitBooking")
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

//Fetching variables connected to admins
const loginBtn = document.getElementById("submitLogin");
const logout = document.getElementById("logout");
const bookings = document.getElementById("upcomingBookings");

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

//Editing bookings and menus
async function editData(routingAndId, object) {
    const currentToken = localStorage.getItem("userToken");

    try {
        const result = await fetch(`https://projekt-databas.onrender.com/api${routingAndId}`, {
            method: "PUT",
            headers: {
                "content-type": "application/json",
                "authorization": "Bearer " + currentToken
            },
            body: JSON.stringify(object)
        });

        if(result.ok) {
            const data = await result.json();
            console.log(data);

        } else {
            throw new Error;
        }

    } catch(error) {
        const errors = document.getElementById("loginErrors");
        window.location.href = "login.html";
        errors.innerHTML = "Du måste logga in pånytt."
    }
}

//Deleting bookings and menu items
async function deleteData(routingAndId) {
    console.log("Kom fram")
    const currentToken = localStorage.getItem("userToken");

    try {
        const result = await fetch(`https://projekt-databas.onrender.com/api${routingAndId}`, {
            method: "DELETE",
            headers: {
                "content-type": "application/json",
                "authorization": "Bearer " + currentToken
            },
        });

        if(result.ok) {
            const data = await result.json();
            console.log(data);

        } else {
            throw new Error;
        }

    } catch(error) {
        const errors = document.getElementById("loginErrors");
        window.location.href = "login.html";
        errors.innerHTML = "Du måste logga in pånytt."
    }
}

//Sorting bookings for admin
async function allBookings() {
    const data = await fetchDataAdmin("/bookings");

    for(let i = 0; i < data.length; i++) {
        if(data[i].confirmed === true) {
            confirmedBooking(data[i]);
            
        } else {
            requestedBooking(data[i]);
        }
    }

    console.log(data)
}

//Displaying requested bookings
function requestedBooking(booking) {
    const requestedBookings = document.getElementById("otherBookings");

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
    const date = document.createTextNode(booking.booked_date);
    tableRow.appendChild(dateTd);
    dateTd.appendChild(date);

    const timeTd = document.createElement("td");
    const time = document.createTextNode(booking.booked_time);
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

    select.addEventListener("input", function(e) {
        const id = booking.booking_num;

        if(e.target.value === "Bekräfta") {
            const confirmedBooking = {
                message: booking.message,
                booked_date: booking.booked_date,
                booked_time: booking.booked_time,
                people: booking.people,
                confirmed: true
            }

            editData(`/bookings/${id}`, confirmedBooking);

        } else {
            deleteData(`/bookings/${id}`);

        }
    })
  
}


//Displaying confirmed bookings
async function confirmedBooking(booking) {
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
    const date = document.createTextNode(booking.booked_date);
    tableRow.appendChild(dateTd);
    dateTd.appendChild(date);

    const timeTd = document.createElement("td");
    const time = document.createTextNode(booking.booked_time);
    tableRow.appendChild(timeTd);
    timeTd.appendChild(time);
}


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
            console.log(error);
        }
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

//Creates new review
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

        customerInputs("/reviews", newReview);
        toggleReviewForm();
    }
}

//Creates new booking
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

//Displaying reviews
async function displayReviews() {

    const reviews = await fetchData("/reviews");
    let index = 0; 
    let indexPlus = 3; 

    for(let i = index; i < indexPlus; i++) {
        createReview(reviews[i]);
    }

    //Switching reviews after 5s
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

    }, 5000);

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