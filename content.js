function isWatchLaterPage() {
    return window.location.href.includes('list=WL');
}

function isSubscriptionsPage() {
    return window.location.href.includes('/feed/channels');
}

function addWatchLaterControls() {
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
                            return text.includes('remove') || text.includes('supprimer');
                        });
                    
                    console.log('Found remove button:', removeButton);
                    
                    if (removeButton) {
                        removeButton.click();
                        await new Promise(r => setTimeout(r, 1000));
                    }
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

function addSubscriptionControls() {
    console.log('Adding subscription controls');
    
    // Create control panel
    const controlPanel = document.createElement('div');
    controlPanel.className = 'wl-control-panel';
    
    const selectAllBtn = document.createElement('button');
    selectAllBtn.textContent = 'Select All Channels';
    selectAllBtn.className = 'wl-btn select-all';
    
    const unsubscribeBtn = document.createElement('button');
    unsubscribeBtn.textContent = 'Unsubscribe Selected';
    unsubscribeBtn.className = 'wl-btn delete-selected';
    
    selectAllBtn.addEventListener('click', () => {
        const checkboxes = document.querySelectorAll('.subscription-checkbox');
        const allChecked = Array.from(checkboxes).every(cb => cb.checked);
        checkboxes.forEach(cb => cb.checked = !allChecked);
        selectAllBtn.textContent = allChecked ? 'Select All Channels' : 'Deselect All';
    });

    unsubscribeBtn.addEventListener('click', async () => {
        const selectedChannels = document.querySelectorAll('.subscription-checkbox:checked');
        console.log('Selected channels:', selectedChannels.length);
        
        if (selectedChannels.length === 0) return;

        if (confirm(`Unsubscribe from ${selectedChannels.length} channels?`)) {
            for (const checkbox of selectedChannels) {
                const channelItem = checkbox.closest('ytd-channel-renderer');
                console.log('Processing channel:', channelItem);
                
                const subscribeButton = channelItem.querySelector('ytd-subscribe-button-renderer button[aria-label^="Subscribed"]');
                console.log('Found subscribe button:', subscribeButton);
                
                if (subscribeButton) {
                    subscribeButton.click();
                    await new Promise(r => setTimeout(r, 1000));
                    
                    const confirmButton = document.querySelector('yt-confirm-dialog-renderer #confirm-button');
                    console.log('Found confirm button:', confirmButton);
                    
                    if (confirmButton) {
                        confirmButton.click();
                        await new Promise(r => setTimeout(r, 1500));
                    }
                }
            }
            // Refresh the page after all unsubscribes
            window.location.reload();
        }
    });
    
    controlPanel.appendChild(selectAllBtn);
    controlPanel.appendChild(unsubscribeBtn);
    
    // Insert the control panel
    const targetElement = document.querySelector('#primary');
    if (targetElement) {
        targetElement.insertBefore(controlPanel, targetElement.firstChild);
    }

    // Add checkboxes to channels
    function addCheckboxesToChannels() {
        const channelItems = document.querySelectorAll('ytd-channel-renderer');
        channelItems.forEach(item => {
            if (!item.querySelector('.subscription-checkbox')) {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'subscription-checkbox';
                item.insertBefore(checkbox, item.firstChild);
            }
        });
    }

    // Watch for new channels being loaded
    const observer = new MutationObserver(() => {
        addCheckboxesToChannels();
    });

    const container = document.querySelector('#content');
    if (container) {
        observer.observe(container, {
            childList: true,
            subtree: true
        });
        addCheckboxesToChannels();
    }
}

// Initialize based on page type
function initializeControls() {
    if (isWatchLaterPage()) {
        addWatchLaterControls();
    } else if (isSubscriptionsPage()) {
        addSubscriptionControls();
    }
}

// Initial load
const interval = setInterval(() => {
    if (document.querySelector('#primary')) {
        initializeControls();
        clearInterval(interval);
    }
}, 1000);

// Handle navigation
window.addEventListener('yt-navigate-finish', initializeControls);