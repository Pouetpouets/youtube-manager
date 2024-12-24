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
  
  // Add event listeners
  selectAllBtn.addEventListener('click', () => {
      const checkboxes = document.querySelectorAll('.video-checkbox');
      const allChecked = Array.from(checkboxes).every(cb => cb.checked);
      checkboxes.forEach(cb => cb.checked = !allChecked);
      selectAllBtn.textContent = allChecked ? 'Select All' : 'Deselect All';
  });

  deleteBtn.addEventListener('click', async () => {
      const selectedVideos = document.querySelectorAll('.video-checkbox:checked');
      console.log('Selected videos:', selectedVideos.length);
      
      if (selectedVideos.length === 0) return;

      if (confirm(`Delete ${selectedVideos.length} videos from Watch Later?`)) {
          for (const checkbox of selectedVideos) {
              const videoItem = checkbox.closest('ytd-playlist-video-renderer');
              console.log('Processing video item:', videoItem);
              
              // Find the menu button using multiple possible selectors
              const menuButton = videoItem.querySelector('button.yt-icon-button, ytd-menu-renderer button, [aria-label="Action menu"]');
              console.log('Found menu button:', menuButton);
              
              if (menuButton) {
                  // Click the menu button
                  menuButton.click();
                  await new Promise(r => setTimeout(r, 1000));
                  
                  // Try multiple selectors for the remove button
                  const removeButton = Array.from(document.querySelectorAll('ytd-menu-service-item-renderer, tp-yt-paper-item'))
                      .find(item => {
                          const text = item.textContent.toLowerCase();
                          return text.includes('remove') || text.includes('supprimer'); // Added French translation
                      });
                  
                  console.log('Found remove button:', removeButton);
                  
                  if (removeButton) {
                      removeButton.click();
                      await new Promise(r => setTimeout(r, 1000));
                  } else {
                      console.log('Remove button not found');
                  }
              } else {
                  console.log('Menu button not found');
              }
          }
      }
  });
  
  controlPanel.appendChild(selectAllBtn);
  controlPanel.appendChild(deleteBtn);
  
  // Insert panel into page
  const targetElement = document.querySelector('#primary');
  if (targetElement) {
      targetElement.insertBefore(controlPanel, targetElement.firstChild);
  }

  // Add checkboxes to videos
  function addCheckboxesToVideos() {
      const videoItems = document.querySelectorAll('ytd-playlist-video-renderer');
      videoItems.forEach(item => {
          if (!item.querySelector('.video-checkbox')) {
              const checkbox = document.createElement('input');
              checkbox.type = 'checkbox';
              checkbox.className = 'video-checkbox';
              item.insertBefore(checkbox, item.firstChild);
          }
      });
  }

  // Watch for new videos being loaded
  const observer = new MutationObserver(() => {
      addCheckboxesToVideos();
  });

  const playlistContainer = document.querySelector('ytd-playlist-video-list-renderer');
  if (playlistContainer) {
      observer.observe(playlistContainer, {
          childList: true,
          subtree: true
      });
      addCheckboxesToVideos();
  }
}

// Try to add controls every second until successful
const interval = setInterval(() => {
  if (document.querySelector('#primary')) {
      addControls();
      clearInterval(interval);
  }
}, 1000);