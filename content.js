function addControls() {
  // Only run on Watch Later playlist
  if (!window.location.href.includes('list=WL')) return;
  console.log('Adding controls to Watch Later playlist');

  // Create control panel
  const controlPanel = document.createElement('div');
  controlPanel.className = 'wl-control-panel';
  
  // Add buttons
  const selectAllBtn = document.createElement('button');
  selectAllBtn.textContent = 'Select All';
  selectAllBtn.className = 'wl-btn select-all';
  
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete Selected';
  deleteBtn.className = 'wl-btn delete-selected';
  
  controlPanel.appendChild(selectAllBtn);
  controlPanel.appendChild(deleteBtn);
  
  // Insert panel into page
  const targetElement = document.querySelector('ytd-playlist-header-renderer');
  if (targetElement) {
      targetElement.parentElement.insertBefore(controlPanel, targetElement.nextSibling);
  }
}

// Try to add controls every second until successful
const interval = setInterval(() => {
  if (document.querySelector('ytd-playlist-header-renderer')) {
      addControls();
      clearInterval(interval);
  }
}, 1000);