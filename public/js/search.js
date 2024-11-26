class UIElements {
    constructor() {
        this.frame = document.querySelector("iframe");
        this.div = document.querySelector(".search-container");
        this.loadingScreen = document.querySelector(".loading-screen");
        this.navbar = document.querySelector(".navbar");
        this.searchInputs = [document.getElementById("searchInput"), document.getElementById("searchInputt")];
        this.searchIntro = document.querySelector(".search-intro");
        this.dropdown = document.querySelector(".search-engine-dropdown");
        this.dropdownOptions = document.querySelector(".dropdown-options");
        this.dropdownSelected = document.querySelector(".dropdown-selected");
        this.dropdownOpen = false;
    }

    toggleDropdown() {
        this.dropdownOpen = !this.dropdownOpen;
        this.dropdownOptions.style.display = this.dropdownOpen ? "block" : "none";
    }

    hideDropdown() {
        this.dropdownOptions.style.display = "none";
        this.dropdownOpen = false;
    }

    updateSearchEngineDisplay(engine) {
        this.dropdownSelected.textContent = engine.charAt(0).toUpperCase() + engine.slice(1);
    }

    updateTitleAndIcon() {
        try {
            const iframeDocument = this.frame.contentDocument || this.frame.contentWindow.document;
            if (iframeDocument) {
                const iframeTitle = iframeDocument.title;
                if (iframeTitle && document.title !== iframeTitle) document.title = iframeTitle;

                const iframeIconLink = iframeDocument.querySelector("link[rel~='icon']") || iframeDocument.querySelector("link[rel~='shortcut icon']");
                if (iframeIconLink) this.setFavicon(iframeIconLink.href);
            }
        } catch (error) {
            console.error("Error accessing iframe content:", error);
        }
    }

    setFavicon(iconUrl) {
        let favicon = document.querySelector("link[rel='icon']");
        if (!favicon) {
            favicon = document.createElement("link");
            favicon.rel = "icon";
            document.head.appendChild(favicon);
        }
        if (favicon.href !== iconUrl) favicon.href = iconUrl;
    }

    showLoadingScreen() {
        this.loadingScreen.style.display = "flex";
        this.loadingScreen.querySelector(".loading-text").textContent = "Loading up your content...";
    }

    hideLoadingScreen() {
        this.loadingScreen.querySelector(".loading-text").textContent = "Ready!";
        setTimeout(() => this.loadingScreen.style.display = "none", 200);
    }

    toggleUIVisibility() {
        this.div.style.display = "none";
        this.frame.style.display = "block";
        this.searchIntro.style.display = "none";
    }
}

class SearchEngine {
    constructor() {
        this.engines = {
            google: query => `https://google.com/search?q=${encodeURIComponent(query)}`,
            bing: query => `https://bing.com/search?q=${encodeURIComponent(query)}`,
            duckduckgo: query => `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
            yahoo: query => `https://search.yahoo.com/search?p=${encodeURIComponent(query)}`
        };
        this.defaultEngine = localStorage.getItem("searchEngine") || "duckduckgo";
    }

    getSearchURL(query) {
        try {
            return new URL(query).toString();
        } catch (err) {}

        const engineURL = this.engines[this.defaultEngine];
        return engineURL ? engineURL(query) : this.engines.duckduckgo(query);
    }

    updateSearchEngine(engine) {
        localStorage.setItem("searchEngine", engine);
        this.defaultEngine = engine;
    }
}

class App {
    constructor() {
        this.uiElements = new UIElements();
        this.searchEngine = new SearchEngine();

        this.initialize();
    }

    initialize() {
        this.uiElements.navbar.style.display = "none";
        this.uiElements.frame.style.display = "none";
        this.uiElements.searchInputs[1].style.display = "block";

        this.setupEventListeners();
        this.uiElements.updateSearchEngineDisplay(this.searchEngine.defaultEngine);
        this.setupDropdown();
    }

    setupEventListeners() {
        this.uiElements.searchInputs.forEach(input => {
            input.addEventListener("keyup", (event) => this.onSearchInput(event));
        });

        this.uiElements.dropdown.addEventListener("click", (event) => this.uiElements.toggleDropdown());
        this.uiElements.dropdownOptions.querySelectorAll(".dropdown-option").forEach(option => {
            option.addEventListener("click", (event) => this.onSearchEngineSelect(event));
        });

        document.addEventListener("click", (event) => this.onDocumentClick(event));
        setInterval(() => this.uiElements.updateTitleAndIcon(), 10);
    }

    onSearchInput(event) {
        if (event.key === "Enter") this.handleSearch(event.target.value);
    }

    onSearchEngineSelect(event) {
        const selectedEngine = event.target.getAttribute("data-value");
        if (selectedEngine) {
            this.searchEngine.updateSearchEngine(selectedEngine);
            this.uiElements.updateSearchEngineDisplay(selectedEngine);
            this.uiElements.hideDropdown();
        }
        event.stopPropagation();
    }

    onDocumentClick(event) {
        if (!this.uiElements.dropdown.contains(event.target)) this.uiElements.hideDropdown();
    }

    async handleSearch(query) {
        const searchURL = this.searchEngine.getSearchURL(query);
        this.preloadResources(searchURL);

        this.uiElements.showLoadingScreen();
        this.uiElements.toggleUIVisibility();

        this.uiElements.frame.src = await this.getUrlWithDelay(searchURL);
        this.uiElements.frame.onload = () => this.onFrameLoad();
    }

    preloadResources(url) {
        const link = document.createElement("link");
        link.rel = "preload";
        link.href = url;
        link.as = "fetch";
        document.head.appendChild(link);
    }

    async getUrlWithDelay(url) {
        return new Promise(resolve => setTimeout(() => resolve(__uv$config.prefix + __uv$config.encodeUrl(url)), 0));
    }

    onFrameLoad() {
        this.uiElements.hideLoadingScreen();
        this.uiElements.navbar.style.display = "block";
    }

    setupDropdown() {
        this.uiElements.dropdown.addEventListener("click", (event) => {
            event.stopPropagation();
            this.uiElements.toggleDropdown();
        });

        this.uiElements.dropdownOptions.querySelectorAll(".dropdown-option").forEach((option) => {
            option.addEventListener("click", (event) => {
                const selectedEngine = event.target.getAttribute("data-value");
                if (selectedEngine) {
                    localStorage.setItem("searchEngine", selectedEngine);
                    this.uiElements.updateSearchEngineDisplay(selectedEngine);
                    this.uiElements.dropdownOptions.style.display = "none";
                    this.uiElements.dropdownOpen = false;
                }
                event.stopPropagation();
            });
        });
    }
}

const app = new App();
