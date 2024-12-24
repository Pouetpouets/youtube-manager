function isWatchLaterPage() {
    return window.location.href.includes('list=WL');
}

function isSubscriptionsPage() {
    return window.location.href.includes('/feed/channels') || window.location.href.includes('/feed/subscriptions');
}

function ensureSingleControlPanel() {
    const existingPanels = document.querySelectorAll('.wl-control-panel');
    existingPanels.forEach(panel => panel.remove());
}

function addWatchLaterControls() {
    // ... (keep existing Watch Later controls)
}

function addSubscriptionControls() {
    ensureSingleControlPanel();
    console.log('Adding subscription controls');
    
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
            window.location.reload();
        }
    });
    
    controlPanel.appendChild(selectAllBtn);
    controlPanel.appendChild(unsubscribeBtn);

    // Insert panel in the left sidebar above subscriptions
    const guideSection = document.querySelector('ytd-guide-section-renderer');
    if (guideSection) {
        guideSection.insertBefore(controlPanel, guideSection.firstChild);
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