var erudaLoaded = false;
var loadingTimeout;
var errorMessageDisplayed = false;

document.getElementById('erudaIcon').addEventListener('click', function() {
    var iframe = document.querySelector('.frame');
    var erudaLoadingScreen = document.getElementById('erudaLoadingScreen');
    
    erudaLoadingScreen.style.display = 'block';

    loadingTimeout = setTimeout(function() {
        if (!errorMessageDisplayed) { 
            erudaLoadingScreen.textContent = 'Error: Eruda is taking too long to load.';
            errorMessageDisplayed = true; 
        }
        erudaLoaded = false;
        erudaLoadingScreen.style.display = 'none';
    }, 10000);

    if (iframe.contentWindow.eruda && erudaLoaded) {
        clearTimeout(loadingTimeout);
        iframe.contentWindow.eruda.destroy();
        erudaLoaded = false;
        erudaLoadingScreen.style.display = 'none';
    } else {
        if (!erudaLoaded) {
            var script = iframe.contentDocument.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/eruda';
            script.onload = function() {
                clearTimeout(loadingTimeout);
                iframe.contentWindow.eruda.init();
                iframe.contentWindow.eruda.show();
                erudaLoaded = true;
                erudaLoadingScreen.style.display = 'none';
            };
            script.onerror = function() {
                clearTimeout(loadingTimeout);
                if (!errorMessageDisplayed) { 
                    erudaLoadingScreen.textContent = 'Error loading Eruda. Please try again later.';
                    errorMessageDisplayed = true; 
                }
                erudaLoaded = false;
            };
            iframe.contentDocument.head.appendChild(script);
        }
    }
});
