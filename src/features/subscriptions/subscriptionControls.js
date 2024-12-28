import { ensureSingleControlPanel } from '../../utils/common.js';

export function addSubscriptionControls() {
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
                        }
                    }
                } catch (error) {
                    console.error('[DEBUG] Error processing channel:', error);
                }
            }

            if (successCount > 0) {
                alert(`Successfully unsubscribed from ${successCount} channels. Page will refresh.`);
                window.location.reload();
            }
        }
    });
    
    controlPanel.appendChild(selectAllBtn);
    controlPanel.appendChild(unsubscribeBtn);

    // Insert the panel
    const pageManager = document.querySelector('ytd-page-manager');
    if (pageManager) {
        const header = pageManager.querySelector('#contents.ytd-section-list-renderer');
        if (header) {
            header.insertBefore(controlPanel, header.firstChild);
            console.log('[DEBUG] Added control panel to page header');
        } else {
            const alternativeHeader = pageManager.querySelector('ytd-rich-grid-renderer');
            if (alternativeHeader) {
                alternativeHeader.insertBefore(controlPanel, alternativeHeader.firstChild);
                console.log('[DEBUG] Added control panel using alternative selector');
            }
        }
    }

    function addCheckboxesToChannels() {
        const channelItems = document.querySelectorAll('#content-section');
        channelItems.forEach(item => {
            if (!item.querySelector('.subscription-checkbox')) {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'subscription-checkbox';

                const checkboxContainer = document.createElement('div');
                checkboxContainer.className = 'subscription-checkbox-container';
                checkboxContainer.appendChild(checkbox);

                const avatarContainer = item.querySelector('#channel-thumbnail-container');
                if (avatarContainer) {
                    avatarContainer.parentElement.insertBefore(checkboxContainer, avatarContainer);
                    console.log('[DEBUG] Added checkbox to channel');
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