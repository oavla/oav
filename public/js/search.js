const frame = document.querySelector("iframe");
const div = document.querySelector(".search-container");
const loadingScreen = document.querySelector(".loading-screen");
const navbar = document.querySelector(".navbar");
const searchInput1 = document.getElementById("searchInput");
const searchInput2 = document.getElementById("searchInputt");
const searchIntro = document.querySelector(".search-intro");

navbar.style.display = "none";
frame.style.display = "none";
searchInput2.style.display = "block";

const defaultEngine = localStorage.getItem("searchEngine") || "duckduckgo";

let dropdownOpen = false;

const searchInputs = [searchInput1, searchInput2];
searchInputs.forEach((input) => {
    input.addEventListener("keyup", (event) => {
        if (event.key === "Enter") {
            handleSearch(input.value);
        }
    });
});

async function handleSearch(query) {
    const searchURL = search(query);
    preloadResources(searchURL);

    showLoadingScreen();
    div.style.display = "none";
    frame.style.display = "block";
     
    frame.src = await getUrlWithDelay(searchURL);

    frame.onload = () => {
        hideLoadingScreen();
        navbar.style.display = "block";
    };
}

function search(input) {
    try {
        return new URL(input).toString();
    } catch (err) {}
    try {
        const url = new URL(`https://${input}`);
        if (url.hostname.includes(".")) return url.toString();
    } catch (err) {}

    const engine = localStorage.getItem("searchEngine") || "duckduckgo";
    const engines = {
        google: `https://google.com/search?q=${encodeURIComponent(input)}`,
        bing: `https://bing.com/search?q=${encodeURIComponent(input)}`,
        duckduckgo: `https://duckduckgo.com/?q=${encodeURIComponent(input)}`,
        yahoo: `https://search.yahoo.com/search?p=${encodeURIComponent(input)}`
    };
    return engines[engine] || engines.duckduckgo;
}



function showLoadingScreen() {
    loadingScreen.style.display = "flex";
    loadingScreen.querySelector(".loading-text").textContent = "Loading up your content...";
}

function hideLoadingScreen() {
    loadingScreen.querySelector(".loading-text").textContent = "Ready!";
    setTimeout(() => {
        loadingScreen.style.display = "none";
    }, 200);
}

function preloadResources(url) {
    const link = document.createElement("link");
    link.rel = "preload";
    link.href = url;
    link.as = "fetch";
    document.head.appendChild(link);
}

function getUrlWithDelay(url) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(__uv$config.prefix + __uv$config.encodeUrl(url));
        }, 0);
    });
}

function updateTitleAndIcon() {
    try {
        const iframeDocument = frame.contentDocument || frame.contentWindow.document;
        if (iframeDocument) {
            const iframeTitle = iframeDocument.title;
            if (iframeTitle && document.title !== iframeTitle) {
                document.title = iframeTitle;
            }
            const iframeIconLink =
                iframeDocument.querySelector("link[rel~='icon']") ||
                iframeDocument.querySelector("link[rel~='shortcut icon']");
            if (iframeIconLink) {
                updateFavicon(iframeIconLink.href);
            }
        }
    } catch (error) {
        console.error("Error accessing iframe content:", error);
    }
}

function updateFavicon(iconUrl) {
    let favicon = document.querySelector("link[rel='icon']");
    if (!favicon) {
        favicon = document.createElement("link");
        favicon.rel = "icon";
        document.head.appendChild(favicon);
    }
    if (favicon.href !== iconUrl) {
        favicon.href = iconUrl;
    }
}

setInterval(updateTitleAndIcon, 100);  
