let tabCount = 1;
const tabsContainer = document.querySelector('.tabs');
const tabPanelsContainer = document.querySelector('.tab-panels');
const addTabBtn = document.getElementById('add-tab-btn');
const closeTabBtn = document.getElementById('closetabbtn');
const iframeControl = document.querySelector('.iframe-control');
const inputField = document.querySelector('input');
let currentTabPanelId = null;

function switchTab(event) {
    const target = event.target;
    if (target === addTabBtn) {
        addTab();
    } else if (target.classList.contains('close-tab-btn')) {
        closeTab(event);
    } else {
        const tabPanel = target.closest('li').getAttribute('data-panel');
        showTab(tabPanel);
    }
}

function addTab(title, src) {
    const newTabId = `tab${tabCount}`;
    const newTabPanelId = `panel${tabCount}`;

    document.querySelectorAll('.tabs li').forEach(tab => {
        tab.classList.remove('active');
    });

    document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.remove('active');
    });

    const newTab = document.createElement('li');
    newTab.setAttribute('data-panel', newTabPanelId);
    newTab.classList.add('active');
    newTab.innerHTML = `${title} <span class="close-tab-btn"></span>`;
    tabsContainer.appendChild(newTab);

    const newTabPanel = document.createElement('div');
    newTabPanel.setAttribute('data-src', src);
    newTabPanel.classList.add('tab-panel', 'active');
    newTabPanel.setAttribute('id', newTabPanelId);
    newTabPanel.innerHTML = `<iframe src="${src}" frameborder="0"></iframe>`;
    tabPanelsContainer.appendChild(newTabPanel);

    tabCount++;
    resizeTabs();

    const iframe = newTabPanel.querySelector('.frame');
    updateTabTitleFromIframe(iframe);
    iframe.addEventListener('load', function () {
        updateTabTitleFromIframe(iframe);
    });
}

function showTab(panelId) {
    document.querySelectorAll('.tabs li').forEach(tab => {
        tab.classList.remove('active');
    });

    document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.remove('active');
    });

    const tabToActivate = document.querySelector(`.tabs li[data-panel="${panelId}"]`);
    const tabPanelToActivate = document.querySelector(`#${panelId}`);
    tabToActivate.classList.add('active');
    tabPanelToActivate.classList.add('active');
    currentTabPanelId = panelId;
}

function closeTab(event) {
    const activeTabPanel = document.querySelector('.tab-panel.active');
    if (activeTabPanel) {
        const tabPanelId = activeTabPanel.getAttribute('id');
        const tabToRemove = document.querySelector(`[data-panel="${tabPanelId}"]`);
        const tabPanelToRemove = document.getElementById(tabPanelId);

        localStorage.removeItem(`${tabPanelId}-input`);

        tabPanelToRemove.classList.add('tab-closing');
        tabToRemove.classList.add('tab-closing');

        tabPanelToRemove.remove();
        tabToRemove.remove();

        const newActiveTabPanel = document.querySelector('.tab-panel.active');
        if (newActiveTabPanel) {
            showTab(newActiveTabPanel.getAttribute('id'));
        } else {
            const lastTabPanel = document.querySelector('.tab-panel:last-child');
            if (lastTabPanel) {
                showTab(lastTabPanel.getAttribute('id'));
            } else {
                // No tabs left, show a message to open a new tab
                const newTabMessage = document.createElement('div');
                newTabMessage.classList.add('new-tab-message');
                newTabMessage.textContent = 'Open a new tab to continue';
                tabPanelsContainer.appendChild(newTabMessage);
            }
        }

        resizeTabs();
    }
}

function saveInputs(panelId) {
    const iframe = document.querySelector(`#${panelId} iframe`);
    const inputs = iframe.contentDocument.querySelectorAll('input, textarea');

    inputs.forEach(input => {
        const savedValue = localStorage.getItem(`${panelId}-${input.name}`);
        input.value = savedValue || '';

        input.addEventListener('input', function () {
            localStorage.setItem(`${panelId}-${input.name}`, input.value);
        });
    });
}

function resizeTabs() {
    const tabWidth = 100; 
    const totalTabs = tabsContainer.childElementCount;
    const availableWidth = tabsContainer.offsetWidth;
    const maxVisibleTabs = Math.floor(availableWidth / tabWidth);
    const visibleTabs = Math.min(maxVisibleTabs, totalTabs);

    const newTabWidth = `${100 / visibleTabs}%`;
    tabsContainer.querySelectorAll('.tabs li').forEach(tab => {
        tab.style.width = newTabWidth;
    });
}

tabsContainer.addEventListener('click', switchTab);
addTabBtn.addEventListener('click', function () {
    addTab('<i class="fas fa-globe"></i> Skyy Tab', "index.html");
});

closeTabBtn.addEventListener('click', closeTab);

function initTabs() {
    showTab('panel1');
    saveInputs('panel1');
    addTab('<i class="fa-solid fa-house"></i> Home', "home.html"); // Add the Home tab on load

    const iframes = document.querySelectorAll('.tab-panel iframe');
    iframes.forEach(iframe => {
        updateTabTitleFromIframe(iframe);
        iframe.addEventListener('load', function () {
            updateTabTitleFromIframe(iframe);
        });
    });
}

// Handle window resize to adjust the tabs
window.addEventListener('resize', function () {
    resizeTabs();
});

function isOverflowing(container, element) {
    return container.scrollWidth > container.clientWidth || element.offsetTop > container.clientHeight;
}

// Function to calculate server ping
function calculateServerPing(serverURL) {
    const beaconData = 'ping-test';
    const startTime = performance.now();
    navigator.sendBeacon(serverURL, beaconData);
    const endTime = performance.now();
    const pingTime = endTime - startTime;
    const pingResultElement = document.getElementById('pingResult');
    alert(`Average ping to ${serverURL}: ${pingTime.toFixed(2)} ms`);
}

// Initialize tabs
initTabs();

function changeTabSrc(src) {
    const activeTabPanel = document.querySelector('.tab-panel.active');
    if (activeTabPanel) {
        const iframe = activeTabPanel.querySelector('iframe');
        iframe.src = src;
    }
}