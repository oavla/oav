const dropdownLogic = (dropdownId, updateCallback) => {
    const dropdown = document.querySelector(`#${dropdownId} .search-engine-dropdown`);
    if (!dropdown) return; 
  
    const dropdownOptions = dropdown.querySelector(".dropdown-options");
    const dropdownSelected = dropdown.querySelector(".dropdown-selected");
  
    let dropdownOpen = false;
  
    dropdown.addEventListener("click", (event) => {
      event.stopPropagation();
      dropdownOpen = !dropdownOpen;
      dropdownOptions.style.display = dropdownOpen ? "block" : "none";
      dropdownSelected.setAttribute("aria-expanded", dropdownOpen.toString());
      dropdown.classList.toggle("open", dropdownOpen);
    });
  
    dropdownOptions?.querySelectorAll(".dropdown-option").forEach((option) => {
      option.addEventListener("click", (event) => {
        event.stopPropagation();
        const title = option.getAttribute("data-title");
        const favicon = option.getAttribute("data-favicon");
        const isCustom = title === "Custom";
        updateCallback(option, title, favicon, isCustom);
        dropdownOptions.style.display = "none";
        dropdownOpen = false;
        dropdown.classList.remove("open");
      });
    });
  
    document.addEventListener("click", (event) => {
      if (!dropdown.contains(event.target)) {
        dropdownOptions.style.display = "none";
        dropdownOpen = false;
        dropdownSelected.setAttribute("aria-expanded", "false");
        dropdown.classList.remove("open");
      }
    });
  };
  
  const applyFaviconAndTitle = (title, favicon) => {
    if (title) {
      document.title = title;
    }
  
    let faviconLink = document.querySelector("link[rel='icon']");
    if (!faviconLink) {
      faviconLink = document.createElement("link");
      faviconLink.type = "image/x-icon";
      faviconLink.rel = "icon";
      document.head.appendChild(faviconLink);
    }
    if (favicon) {
      faviconLink.href = favicon;
    }
  };
  
  const updateSearchEngine = (option) => {
    const selectedEngine = option.getAttribute("data-value");
    const selectedDropdown = document.querySelector("#searchEngine .dropdown-selected");
    if (selectedDropdown) {
      selectedDropdown.textContent = selectedEngine.charAt(0).toUpperCase() + selectedEngine.slice(1);
    }
    localStorage.setItem("searchEngine", selectedEngine);
  };
  
  const updateTabCloaking = (option, title, favicon, isCustom) => {
    const selectedTitle = title || "Custom";
    const selectedFavicon = favicon || "";
    const selectedDropdown = document.querySelector("#tabCloaking .dropdown-selected");
    if (selectedDropdown) {
      selectedDropdown.textContent = selectedTitle;
    }
  
    if (isCustom) {
      const customTabFields = document.querySelector("#customTabFields");
      if (customTabFields) {
        customTabFields.style.display = "block";
      }
      localStorage.setItem("tabCloakingMode", "custom");
    } else {
      applyFaviconAndTitle(selectedTitle, selectedFavicon);
      const customTabFields = document.querySelector("#customTabFields");
      if (customTabFields) {
        customTabFields.style.display = "none";
      }
      localStorage.setItem("tabCloakingMode", "preset");
      localStorage.setItem("presetTitle", selectedTitle);
      localStorage.setItem("presetFavicon", selectedFavicon);
    }
  };
  
  const applyCustomTabListener = document.querySelector("#applyCustomTab");
  if (applyCustomTabListener) {
    applyCustomTabListener.addEventListener("click", () => {
      const customTitle = document.querySelector("#customTitle")?.value.trim();
      const customFavicon = document.querySelector("#customFavicon")?.value.trim();
  
      if (customTitle && customFavicon) {
        applyFaviconAndTitle(customTitle, customFavicon);
        const customTabFields = document.querySelector("#customTabFields");
        if (customTabFields) {
          customTabFields.style.display = "none";
        }
  
        localStorage.setItem("tabCloakingMode", "custom");
        localStorage.setItem("customTitle", customTitle);
        localStorage.setItem("customFavicon", customFavicon);
      } else {
        alert("Please enter both a title and a favicon URL.");
      }
    });
  }
  
  window.addEventListener("load", function () {
    const tabCloakingMode = localStorage.getItem("tabCloakingMode");
  
    if (tabCloakingMode === "custom") {
      const savedCustomTitle = localStorage.getItem("customTitle");
      const savedCustomFavicon = localStorage.getItem("customFavicon");
  
      if (savedCustomTitle && savedCustomFavicon) {
        applyFaviconAndTitle(savedCustomTitle, savedCustomFavicon);
  
        const customTabFields = document.querySelector("#customTabFields");
        if (customTabFields) {
          customTabFields.style.display = "block";
        }
  
        document.querySelector("#customTitle")?.setAttribute("value", savedCustomTitle);
        document.querySelector("#customFavicon")?.setAttribute("value", savedCustomFavicon);
  
        const selectedDropdown = document.querySelector("#tabCloaking .dropdown-selected");
        if (selectedDropdown) {
          selectedDropdown.textContent = savedCustomTitle;
        }
      }
    } else if (tabCloakingMode === "preset") {
      const savedPresetTitle = localStorage.getItem("presetTitle");
      const savedPresetFavicon = localStorage.getItem("presetFavicon");
  
      if (savedPresetTitle && savedPresetFavicon) {
        applyFaviconAndTitle(savedPresetTitle, savedPresetFavicon);
  
        const selectedDropdown = document.querySelector("#tabCloaking .dropdown-selected");
        if (selectedDropdown) {
          selectedDropdown.textContent = savedPresetTitle;
        }
      }
    }
  });  
  
  dropdownLogic("searchEngine", updateSearchEngine);
  dropdownLogic("tabCloaking", updateTabCloaking);
  