const newTabBtn = document.querySelector('.new-tab');
const tabContainer = document.querySelector('.tab-container');
const warningMessage = document.querySelector('.warning');
const noTabsMessage = document.getElementById('noTabsMessage');
let tabCount = 0;
const maxTabs = 7;
let warningTimeout;

function activateTab(tab) {
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.iframe-container').forEach(iframe => iframe.classList.remove('active'));

    tab.classList.add('active');
    const iframeId = tab.getAttribute('data-iframe');
    document.getElementById(iframeId).classList.add('active');
}

function updateNoTabsMessage() {
    if (tabCount === 0) {
        noTabsMessage.style.display = 'block';
    } else {
        noTabsMessage.style.display = 'none';
    }
}

function updateTabTitle(iframe, tab) {
    try {
        const iframeDocument = iframe.contentDocument;
        if (iframeDocument && iframeDocument.title) {
            let title = iframeDocument.title;
            const maxLength = 8;

            if (title.length > maxLength) {
                title = title.substring(0, maxLength) + '...';
            }

            tab.querySelector('span').textContent = title;

            const iconLink = iframeDocument.querySelector("link[rel='icon']");
            if (iconLink) {
                tab.querySelector('img')?.setAttribute('src', iconLink.href);
            }
        } else {
            window.addEventListener("message", (event) => {
                if (event.origin !== iframe.src) return;
                if (event.data && event.data.title) {
                    let title = event.data.title;
                    const maxLength = 8;

                    if (title.length > maxLength) {
                        title = title.substring(0, maxLength) + '...';
                    }

                    tab.querySelector('span').textContent = title;
                }
            });
        }
    } catch (error) {
        console.error("Error accessing iframe title:", error);
    }
}

function createNewTab() {
    if (tabCount >= maxTabs) {
        warningMessage.style.display = 'inline';
        clearTimeout(warningTimeout);
        warningTimeout = setTimeout(() => {
            warningMessage.style.display = 'none';
        }, 5000);
        return;
    }

    const iframeId = `iframe${Date.now()}`;

    const newTab = document.createElement('div');
    newTab.classList.add('tab');
    newTab.setAttribute('data-iframe', iframeId);
    newTab.innerHTML = `
        <img src="" alt="Tab Icon" style="width: 16px; height: 16px; margin-right: 8px;">
        <span>New Tab</span>
        <span class="close-btn">&times;</span>
    `;

    tabContainer.insertBefore(newTab, newTabBtn);

    const newIframeContainer = document.createElement('div');
    newIframeContainer.classList.add('iframe-container');
    newIframeContainer.id = iframeId;
    newIframeContainer.innerHTML = `<iframe src="/search.html" id="iframe" allowfullscreen></iframe>`;
    document.body.appendChild(newIframeContainer);

    const iframe = newIframeContainer.querySelector('iframe');

    iframe.addEventListener('load', function () {
        updateTabTitle(iframe, newTab);
    });

    iframe.contentWindow.postMessage({ type: 'getTitle' }, '*');

    setInterval(() => {
        updateTabTitle(iframe, newTab);
    }, 1000);

    newTab.addEventListener('click', function () {
        activateTab(this);
    });

    newTab.querySelector('.close-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        const allTabs = document.querySelectorAll('.tab');
        const index = Array.from(allTabs).indexOf(newTab);

        newTab.style.animation = 'slide-out 0.4s forwards';
        setTimeout(() => {
            document.getElementById(iframeId).remove();
            newTab.remove();
            tabCount--;
            warningMessage.style.display = 'none';
            updateNoTabsMessage();

            if (allTabs.length > 0) {
                if (index > 0) {
                    activateTab(allTabs[index - 1]);
                } else if (index < allTabs.length) {
                    activateTab(allTabs[index + 1]);
                }
            }
        }, 160); 
    });

    activateTab(newTab);
    tabCount++;
    warningMessage.style.display = 'none';
    updateNoTabsMessage();
}

window.addEventListener('DOMContentLoaded', () => {
    createNewTab();
});

newTabBtn.addEventListener('click', createNewTab);