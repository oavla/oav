var iframe = document.querySelector('.frame');

iframe.addEventListener('load', function() {
    var randomId = '';
    var characters = '0123456789abcdefghijklmnopqrstuvwxyz';

    for (var i = 0; i < 5; i++) { 
        randomId += characters.charAt(Math.floor(Math.random() * 36)); 
    }

    history.replaceState({}, '', '/course?id=' + randomId); 
});
