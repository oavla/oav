document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('searchInput');
  const gitHub = document.getElementById('gitHub');
  const engineDropdown = document.getElementById('searchEngine');
  setTimeout(() => {
    searchInput.classList.add('expanded');
  }, 200);
  setTimeout(() => {
    engineDropdown.classList.add('expanded');
  }, 200);
  setTimeout(() => {
    gitHub.classList.add('spin');
  }, 200);
  const sloganElement = document.getElementById('slogan');
  const sloganText = '"Browse Safely, Explore Freely."';
  let i = 0;

  function typeWriter() {
    if (i < sloganText.length) {
      sloganElement.innerHTML += sloganText.charAt(i);
      i++;
      setTimeout(typeWriter, 60); 
    } else {
      setTimeout(() => {
        sloganElement.classList.add('cursor-fade-out');
      }, 1000); 
    }
  }
  typeWriter(); 
});
