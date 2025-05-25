"use strict";

if(!localStorage.getItem("userToken")) {
    window.location.href = "/login.html";
} else {
    const adminLink = document.getElementById("admingLink");
    adminLink.innerHTML = "<p id='logout'>Logga ut<p>"

    const logout = document.getElementById("logout");
    logout.addEventListener("click", function() {
        localStorage.clear();
    });
}