console.log('YouTube Watch Later Manager: Script loaded');

function waitForElement(selector) {
  return new Promise(resolve => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver(mutations => {
      if (document.querySelector(selector)) {
        observer.disconnect();
        resolve(document.querySelector(selector));
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
}

async function initBulkManager() {
  console.log('YouTube Watch Later Manager: Initializing...');
  
  // Wait for the playlist container
  const playlistContainer = await waitForElement('ytd-playlist-video-list-renderer');
  
  if (!playlistContainer) {
    console.log('YouTube Watch Later Manager: Playlist container not found');
    return;
  }

  console.log('YouTube Watch Later Manager: Playlist container found');

  // Create bulk actions container
  const bulkActionsContainer = document.createElement('div');
  bulkActionsContainer.className = 'bulk-actions-container';
  
  // Create buttons
  const selectAllBtn = document.createElement('button');
  selectAllBtn.className = 'select-all-btn';
  selectAllBtn.textContent = 'Select All';
  
  const deleteSelectedBtn = document.createElement('button');
  deleteSelectedBtn.className = 'delete-selected-btn';
  deleteSelectedBtn.textContent = 'Delete Selected';
  
  bulkActionsContainer.appendChild(selectAllBtn);
  bulkActionsContainer.appendChild(deleteSelectedBtn);
  
  // Insert the container before the playlist
  playlistContainer.parentElement.insertBefore(bulkActionsContainer, playlistContainer);
  
  console.log('YouTube Watch Later Manager: Controls added');

  // Add checkboxes to videos
  function addCheckboxesToVideos() {
    const videoItems = document.querySelectorAll('ytd-playlist-video-renderer');
    console.log('YouTube Watch Later Manager: Found', videoItems.length, 'videos');
    
    videoItems.forEach(item => {
      if (!item.querySelector('.video-checkbox')) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'video-checkbox';
        item.insertBefore(checkbox, item.firstChild);
      }
    });
  }
  
  // Handle select all
  selectAllBtn.addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('.video-checkbox');
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);
    checkboxes.forEach(cb => cb.checked = !allChecked);
    selectAllBtn.textContent = allChecked ? 'Select All' : 'Deselect All';
  });
  
  // Handle delete selected
  deleteSelectedBtn.addEventListener('click', async () => {
    const selectedVideos = document.querySelectorAll('.video-checkbox:checked');
    if (selectedVideos.length === 0) return;
    
    if (confirm(`Delete ${selectedVideos.length} videos from Watch Later?`)) {
      for (const checkbox of selectedVideos) {
        const videoItem = checkbox.closest('ytd-playlist-video-renderer');
        const menuButton = videoItem.querySelector('yt-icon-button[aria-label="Action menu"]');
        
        if (menuButton) {
          // Click menu button
          menuButton.click();
          await new Promise(r => setTimeout(r, 100));
          
          // Find and click remove button
          const removeButton = Array.from(document.querySelectorAll('tp-yt-paper-item'))
            .find(item => item.textContent.includes('Remove from'));
          if (removeButton) {
            removeButton.click();
            await new Promise(r => setTimeout(r, 100));
          }
        }
      }
    }
  });
  
  // Initial checkbox addition
  addCheckboxesToVideos();
  
  // Watch for new videos being loaded
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length) {
        addCheckboxesToVideos();
      }
    });
  });
  
  observer.observe(playlistContainer, {
    childList: true,
    subtree: true
  });
}

// Check if we're on the Watch Later playlist
if (window.location.href.includes('playlist?list=WL')) {
  console.log('YouTube Watch Later Manager: Watch Later playlist detected');
  // Wait for the page to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBulkManager);
  } else {
    initBulkManager();
  }
}