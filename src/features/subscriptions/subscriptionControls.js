window.YTManager = window.YTManager || {};

YTManager.subscriptions = {
    addSubscriptionControls: function() {
        YTManager.utils.ensureSingleControlPanel();
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
                        // Updated selector to find the correct channel item container
                        const channelItem = checkbox.closest('ytd-channel-renderer, ytd-grid-channel-renderer');
                        if (!channelItem) {
                            console.log('[DEBUG] Could not find channel item');
                            continue;
                        }

                        const channelName = channelItem.querySelector('ytd-channel-name').textContent;
                        console.log('[DEBUG] Processing channel:', channelName);
                        
                        // Click the subscribed button to show the unsubscribe dialog
                        const subscribeButton = channelItem.querySelector('ytd-subscribe-button-renderer button');
                        if (subscribeButton) {
                            console.log('[DEBUG] Clicking subscribe button');
                            subscribeButton.click();
                            await new Promise(r => setTimeout(r, 1500));
                            
                            // Find and click the unsubscribe button in the dialog
                            const confirmDialog = document.querySelector('yt-confirm-dialog-renderer');
                            const confirmButton = confirmDialog?.querySelector('#confirm-button button');
                            console.log('[DEBUG] Found unsubscribe confirmation button:', confirmButton);
                            
                            if (confirmButton) {
                                confirmButton.click();
                                successCount++;
                                console.log('[DEBUG] Successfully unsubscribed from:', channelName);
                                // Wait longer to ensure unsubscribe completes
                                await new Promise(r => setTimeout(r, 2000));
                            } else {
                                console.log('[DEBUG] Unsubscribe confirmation button not found');
                            }
                        } else {
                            console.log('[DEBUG] Subscribe button not found for channel:', channelName);
                        }
                    } catch (error) {
                        console.error('[DEBUG] Error processing channel:', error);
                    }
                }

                console.log(`[DEBUG] Unsubscribe process completed. Success count: ${successCount}`);
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

        // Insert panel into page header
        const pageManager = document.querySelector('ytd-page-manager');
        if (pageManager) {
            const header = pageManager.querySelector('#contents');
            if (header) {
                header.insertBefore(controlPanel, header.firstChild);
                console.log('[DEBUG] Added control panel to page header');
            }
        }

        function addCheckboxesToChannels() {
            // Updated selector to find channels in both list and grid views
            const channelItems = document.querySelectorAll('ytd-channel-renderer, ytd-grid-channel-renderer');
            channelItems.forEach(item => {
                if (!item.querySelector('.subscription-checkbox')) {
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.className = 'subscription-checkbox';

                    const checkboxContainer = document.createElement('div');
                    checkboxContainer.className = 'subscription-checkbox-container';
                    checkboxContainer.appendChild(checkbox);

                    // Updated selector for the avatar container
                    const avatarContainer = item.querySelector('#avatar-link');
                    if (avatarContainer) {
                        avatarContainer.parentElement.insertBefore(checkboxContainer, avatarContainer);
                        console.log('[DEBUG] Added checkbox to channel');
                    } else {
                        console.log('[DEBUG] Could not find avatar container');
                    }
                }
            });
        }

        const observer = new MutationObserver(() => {
            addCheckboxesToChannels();
        });

        const container = document.querySelector('#contents');
        if (container) {
            observer.observe(container, {
                childList: true,
                subtree: true
            });
            addCheckboxesToChannels();
        }
    }
};