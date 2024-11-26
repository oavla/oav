document.getElementById('refreshIcon').addEventListener('click', function() {
    var iframe = document.querySelector('.frame');
    iframe.contentWindow.location.reload(true);
});

document.getElementById('fullscreenIcon').addEventListener('click', function() {
    var iframe = document.querySelector('.frame');
    iframe.requestFullscreen();
});

document.getElementById('backIcon').addEventListener('click', function() {
    var iframe = document.querySelector('.frame');
    iframe.contentWindow.history.back();
});

document.getElementById('forwardIcon').addEventListener('click', function() {
    var iframe = document.querySelector('.frame');
    iframe.contentWindow.history.forward();
});
