let clockMode = 'time'; // Initialize the clock mode

function updateTime() {
  const now = new Date(); 
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0'); 
  const amPm = hours >= 12 ? 'PM' : 'AM'; 
  hours = hours % 12; 
  hours = hours ? hours : 12; 
  const hoursPadded = String(hours).padStart(2, '0'); 

  const clockElement = document.getElementById('clock');
  
  if (clockMode === 'time') {
    // Display time with space between components and AM/PM indicator
    clockElement.textContent = `${hoursPadded} : ${minutes} : ${seconds}  ${amPm}`;
  } else {
    // Display date with space around the slash
    const date = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const dateFormatted = `${month} / ${date} / ${year}`;
    clockElement.textContent = dateFormatted;
  }
}

setInterval(updateTime, 1000);
updateTime(); // Initial display

// Function to toggle between displaying date and time
function toggleClockDisplay() {
  if (clockMode === 'time') {
    clockMode = 'date';
  } else {
    clockMode = 'time';
  }
  updateTime(); // Update display after toggling
}
