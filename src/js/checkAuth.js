"use strict";

if(!localStorage.getItem("userToken")) {
    window.location.href = "/login.html";
} 