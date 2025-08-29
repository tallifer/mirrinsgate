// js/landing.js
document.addEventListener('DOMContentLoaded', () => {
    const enterButton = document.getElementById('enterButton');
    
    // Check if the user is on a mobile device based on screen width
    const isMobile = window.innerWidth <= 768; 
  
    if (isMobile) {
      // On mobile, the "Enter" button goes directly to the journal
      enterButton.onclick = () => { 
        window.location.href = 'journal.html'; 
      };
    } else {
      // On desktop, it sets a session item and goes to the town
      enterButton.onclick = () => {
        sessionStorage.setItem('fromIndex', 'true');
        window.location.href = 'town.html';
      };
    }
  });
  
  