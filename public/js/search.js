const frame = document.querySelector("iframe");
const div = document.querySelector(".search-container");
const versionDiv = document.querySelector(".version");
const loadingScreen = document.querySelector(".loading-screen");
const navbar = document.querySelector(".navbar");

const searchInput1 = document.getElementById("searchInput");
const searchInput2 = document.getElementById("searchInputt");

navbar.style.display = "none";
versionDiv.style.display = "block";
frame.style.display = "none";
searchInput2.style.display = "block";

const searchInputs = [searchInput1, searchInput2];
searchInputs.forEach(input => {
    input.addEventListener("keyup", event => {
        if (event.key === "Enter") {
            handleSearch(input.value);
        }
    });
});

// Function to handle search
async function handleSearch(query) {
    showLoadingScreen();
    div.style.display = "none";
    frame.style.display = "block";
    versionDiv.style.display = "none"; 

    const searchURL = search(query);
    frame.src = await getUrlWithDelay(searchURL);
    
    frame.onload = () => {
        hideLoadingScreen();
        navbar.style.display = "block";
        updateTitleAndIcon(); // Update the title and favicon when iframe content loads
    };
}

// Determine if input is a URL or query
function search(input) {
    try {
        return new URL(input).toString(); // Valid URL
    } catch (err) {}

    try {
        const url = new URL(`http://${input}`);
        if (url.hostname.includes(".")) return url.toString(); // Valid URL
    } catch (err) {}

    // Treat input as a search query
    return `https://google.com/search?q=${encodeURIComponent(input)}`;
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
    link.as = 'fetch';
    document.head.appendChild(link);
}

function getUrlWithDelay(url) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(__uv$config.prefix + __uv$config.encodeUrl(url));
        }, 1000);
    });
}

preloadResources();

// Function to update the website's title and favicon dynamically
function updateTitleAndIcon() {
    try {
        const iframeDocument = frame.contentDocument || frame.contentWindow.document;

        if (iframeDocument) {
            // Update the title
            const iframeTitle = iframeDocument.title;
            if (iframeTitle) {
                document.title = iframeTitle;
            }

            // Update the favicon
            const iframeIconLink = iframeDocument.querySelector("link[rel~='icon']") || iframeDocument.querySelector("link[rel~='shortcut icon']");
            if (iframeIconLink) {
                updateFavicon(iframeIconLink.href);
            }
        }
    } catch (error) {
        console.error("Error accessing iframe content:", error);
    }
}

// Function to update the favicon
function updateFavicon(iconUrl) {
    let favicon = document.querySelector("link[rel='icon']");
    if (!favicon) {
        favicon = document.createElement("link");
        favicon.rel = "icon";
        document.head.appendChild(favicon);
    }
    favicon.href = iconUrl;
}

// Polling function to check for updates in the iframe periodically
setInterval(updateTitleAndIcon, 1000);