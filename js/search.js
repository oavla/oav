const frame = document.querySelector("iframe");
const div = document.querySelector(".search-container");
const loadingScreen = document.querySelector(".loading-screen");
const navbar = document.querySelector(".navbar");

navbar.style.display = "none";
frame.style.display = "none";

const searchInput1 = document.getElementById("searchInput");

searchInput1.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        handleSearch(searchInput1.value);
    }
});

const searchInput2 = document.getElementById("searchInputt");
searchInput2.style.display = "block";

searchInput2.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        handleSearch(searchInput2.value);
    }
});

function handleSearch(query) {
    showLoadingScreen();
    div.style.display = "none";
    frame.style.display = "block";

    frame.onload = function() {
        hideLoadingScreen();
        navbar.style.display = "block";
    };

    setTimeout(() => {
        frame.src = __uv$config.prefix + __uv$config.encodeUrl(search(query));
    }, 1000);
}

function search(input) {
    try {
        return new URL(input).toString(); // Valid URL
    } catch (err) {}

    try {
        const url = new URL(`http://${input}`);
        if (url.hostname.includes(".")) return url.toString(); // Valid URL
    } catch (err) {}

    // Treat input as a search query
    return `https://www.google.com/search?q=${encodeURIComponent(input)}`;
}

function showLoadingScreen() {
    loadingScreen.style.display = "flex"; 
    loadingScreen.querySelector(".loading-text").textContent = "Loading up your content...";
}

function hideLoadingScreen() {
    loadingScreen.querySelector(".loading-text").textContent = "Finish!";
    setTimeout(() => {
        loadingScreen.style.display = "none"; 
    }, 2000);
}

function preloadResources() {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = 'https://www.google.com';
    link.as = 'document';
    document.head.appendChild(link);
}

preloadResources();
