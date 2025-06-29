document.addEventListener('DOMContentLoaded', () => {
  const dogBar = document.getElementById('dog-bar');
  const filterBtn = document.getElementById('good-dog-filter');
  let filterOn = false;
  
  // Initialize the app
  updateDogBar();
  
  // Filter button event listener
  filterBtn.addEventListener('click', () => {
    filterOn = !filterOn;
    filterBtn.textContent = `Filter good dogs: ${filterOn ? 'ON' : 'OFF'}`;
    updateDogBar();
  });
  
  // Update the dog bar 
  function updateDogBar() {
    fetch('http://localhost:3000/pups')
      .then(response => response.json())
      .then(pups => {
        dogBar.innerHTML = '';
        const filteredPups = filterOn ? pups.filter(pup => pup.isGoodDog) : pups;
        
        filteredPups.forEach(pup => {
          const pupSpan = document.createElement('span');
          pupSpan.textContent = pup.name;
          pupSpan.addEventListener('click', () => showPupInfo(pup));
          dogBar.appendChild(pupSpan);
        });
      });
  }
  
  // Show pup info
  function showPupInfo(pup) {
    const dogInfo = document.getElementById('dog-info');
    dogInfo.innerHTML = '';
    
    const img = document.createElement('img');
    img.src = pup.image;
    
    const h2 = document.createElement('h2');
    h2.textContent = pup.name;
    
    const button = document.createElement('button');
    button.textContent = pup.isGoodDog ? 'Good Dog!' : 'Bad Dog!';
    button.addEventListener('click', () => toggleGoodDog(pup, button));
    
    dogInfo.append(img, h2, button);
  }
  
  // Toggle good dog status
  function toggleGoodDog(pup, button) {
    const newStatus = !pup.isGoodDog;
    
    fetch(`http://localhost:3000/pups/${pup.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        isGoodDog: newStatus
      })
    })
    .then(response => response.json())
    .then(updatedPup => {
      pup.isGoodDog = updatedPup.isGoodDog;
      button.textContent = updatedPup.isGoodDog ? 'Good Dog!' : 'Bad Dog!';
      
      // If filter is on, update the dog bar
      if (filterOn) {
        updateDogBar();
      }
    });
  }
});