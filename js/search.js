const frame = document.querySelector("iframe");
const div = document.querySelector(".search-container");
const loadingScreen = document.querySelector(".loading-screen");
const navbar = document.querySelector(".navbar");
const clock = document.getElementById("clock");


navbar.style.display = "none";
clock.style.display = "block";


frame.style.display = "none";


const searchInput1 = document.getElementById("searchInput");


searchInput1.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        showLoadingScreen();
        div.style.display = "none";
        clock.style.display = "none";
        dynamicText.style.display = "none";
        frame.style.display = "block";
        frame.onload = function() {
            hideLoadingScreen();
            navbar.style.display = "block";
            searchInput2.style.display = "block";
        };
        setTimeout(() => {
            frame.src = __uv$config.prefix + __uv$config.encodeUrl(search(searchInput1.value));
        }, 1000);
    }
});


const searchInput2 = document.getElementById("searchInputt");
searchInput2.style.display = "none";


searchInput2.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        showLoadingScreen();
        frame.style.display = "block";
        frame.onload = function() {
            hideLoadingScreen();
            navbar.style.display = "block";
        };
        // Delay the request slightly
        setTimeout(() => {
            frame.src = __uv$config.prefix + __uv$config.encodeUrl(search(searchInput2.value));
        }, 900);
    }
});


const searchInput3 = document.getElementById("searchInputtt");


searchInput3.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        showLoadingScreen();
        div.style.display = "none";
        clock.style.display = "none";
        console.log("Enter key pressed"); // Debugging
        dynamicText.style.display = "none";
        frame.style.display = "block";
        frame.onload = function() {
            hideLoadingScreen();
            navbar.style.display = "block";
            searchInput2.style.display = "block";
        };
        setTimeout(() => {
            frame.src = __uv$config.prefix + __uv$config.encodeUrl(search(searchInput3.value));
        }, 1000);
    }
});


function search(input, template) {
    try {
        // input is a valid URL:
        // eg: https://example.com, https://example.com/test?q=param
        return new URL(input).toString();
    } catch (err) {
        // input was not a valid URL
    }


    try {
        // input is a valid URL when http:// is added to the start:
        // eg: example.com, https://example.com/test?q=param
        const url = new URL(`http://${input}`);
        // only if the hostname has a TLD/subdomain
        if (url.hostname.includes(".")) return url.toString();
    } catch (err) {
        // input was not valid URL
    }


    // input may have been a valid URL, however the hostname was invalid


    // Attempts to convert the input to a fully qualified URL have failed
    // Treat the input as a search query
    return `https://www.google.com/search?q=${encodeURIComponent(input)}`;
}


function showLoadingScreen() {
    loadingScreen.style.display = "block";
    loadingScreen.querySelector(".loading-text").textContent = "Getting things ready...";
}


function hideLoadingScreen() {
    loadingScreen.querySelector(".loading-text").textContent = "Ready!";
    setTimeout(() => {
        loadingScreen.style.display = "none";
    }, 2000);
}

preloadResources();

function preloadResources() {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = 'https://www.google.com';
    link.as = 'document';
    document.head.appendChild(link);
}