function isWatchLaterPage() {
    console.log('[DEBUG] Adding isWatchLaterPage');
    return window.location.href.includes('list=WL');
}

function isSubscriptionsPage() {
    return window.location.href.includes('/feed/channels');
}

function ensureSingleControlPanel() {
    const existingPanels = document.querySelectorAll('.wl-control-panel');
    existingPanels.forEach(panel => panel.remove());
}

function addWatchLaterControls() {
    // ... (previous watch later code remains the same)
}

function addSubscriptionControls() {
    ensureSingleControlPanel();
    console.log('[DEBUG] Adding subscription controls');
    
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
        console.log('[DEBUG] Selected channels:', selectedChannels.length);
        
        if (selectedChannels.length === 0) return;

        if (confirm(`Unsubscribe from ${selectedChannels.length} channels?`)) {
            let successCount = 0;

            for (const checkbox of selectedChannels) {
                try {
                    const channelItem = checkbox.closest('#content-section');
                    const channelName = channelItem?.querySelector('.ytd-channel-name')?.textContent;
                    console.log('[DEBUG] Processing channel:', channelName);
                    
                    const subscribeButton = channelItem.querySelector('ytd-subscribe-button-renderer button');
                    if (subscribeButton) {
                        subscribeButton.click();
                        await new Promise(r => setTimeout(r, 1500));
                        
                        const unsubscribeButton = document.querySelector('button.yt-spec-button-shape-next--call-to-action[aria-label="Se désabonner"]');
                        console.log('[DEBUG] Found unsubscribe button:', unsubscribeButton);
                        
                        if (unsubscribeButton) {
                            unsubscribeButton.click();
                            successCount++;
                            await new Promise(r => setTimeout(r, 2000));
                        } else {
                            console.log('[DEBUG] Unsubscribe button not found in dialog');
                        }
                    } else {
                        console.log('[DEBUG] Subscribe button not found for channel');
                    }
                } catch (error) {
                    console.error('[DEBUG] Error processing channel:', error);
                }
            }

            console.log(`[DEBUG] Successfully unsubscribed from ${successCount} channels`);
            
            if (successCount > 0) {
                alert(`Successfully unsubscribed from ${successCount} channels. Page will refresh.`);
                window.location.reload();
            } else {
                alert('No channels were unsubscribed. Please try again.');
            }
        }
    });
    
    controlPanel.appendChild(selectAllBtn);
    controlPanel.appendChild(unsubscribeBtn);

    const guideSection = document.querySelector('ytd-guide-section-renderer');
    if (guideSection) {
        guideSection.insertBefore(controlPanel, guideSection.firstChild);
    }

    function addCheckboxesToChannels() {
        const channelItems = document.querySelectorAll('#content-section');
        channelItems.forEach(item => {
            if (!item.querySelector('.subscription-checkbox')) {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'subscription-checkbox';

                // Create a container for the checkbox
                const checkboxContainer = document.createElement('div');
                checkboxContainer.className = 'subscription-checkbox-container';
                checkboxContainer.appendChild(checkbox);

                // Find the avatar container and insert the checkbox before it
                const avatarContainer = item.querySelector('#channel-thumbnail-container');
                if (avatarContainer) {
                    avatarContainer.parentElement.insertBefore(checkboxContainer, avatarContainer);
                    console.log('[DEBUG] Added checkbox to channel with container');
                } else {
                    item.insertBefore(checkboxContainer, item.firstChild);
                    console.log('[DEBUG] Added checkbox to channel without container');
                }
            }
        });
    }

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

function initializeControls() {
    ensureSingleControlPanel();
    if (isWatchLaterPage()) {
        addWatchLaterControls();
    } else if (isSubscriptionsPage()) {
        addSubscriptionControls();
    }
}

let initAttempts = 0;
const maxAttempts = 10;
const interval = setInterval(() => {
    if (document.querySelector('ytd-guide-section-renderer')) {
        initializeControls();
        clearInterval(interval);
    }
    initAttempts++;
    if (initAttempts >= maxAttempts) {
        clearInterval(interval);
    }
}, 1000);

window.addEventListener('yt-navigate-finish', () => {
    setTimeout(initializeControls, 1000);
});