const frame = document.querySelector("iframe");  // This is the existing iframe on the page
const div = document.querySelector(".search-container");
const loadingScreen = document.querySelector(".loading-screen");
const navbar = document.querySelector(".navbar");
const clock = document.getElementById("clock");
const userCount = document.getElementById("userCount");
const tabsButton = document.getElementById("tabs-button");

navbar.style.display = "none";
clock.style.display = "block";
userCount.style.display = "block";
frame.style.display = "none";  // Initially hide the iframe until a URL is loaded

// Handle search input from the user
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

document.getElementById('gameShortcut').addEventListener('click', function(event) {
    event.preventDefault();  

    const websiteUrl = event.target.closest('a').getAttribute('href');
    
    handleSearch(websiteUrl);
});

document.getElementById('movieShortcut').addEventListener('click', function(event) {
    event.preventDefault();  

    const websiteUrl = event.target.closest('a').getAttribute('href');
    
    handleSearch(websiteUrl);
});

function handleSearch(query) {
    showLoadingScreen();
    div.style.display = "none";
    clock.style.display = "none";
    userCount.style.display = "none";
    tabsButton.style.display = "none";
    dynamicText.style.display = "none";
    frame.style.display = "block";  // Display the iframe when loading the website

    frame.onload = function() {
        hideLoadingScreen();
        navbar.style.display = "block";
    };

    setTimeout(() => {
        frame.src = __uv$config.prefix + __uv$config.encodeUrl(search(query));  // Pass the URL through the UV client to the existing iframe
    }, 1000);
}

function search(input) {
    // Check if the input is a valid URL
    try {
        return new URL(input).toString();  // If it's a valid URL, return it
    } catch (err) {}

    // If it's not a valid URL, treat it as a search query
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
