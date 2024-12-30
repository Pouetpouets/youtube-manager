window.YTManager = window.YTManager || {};
YTManager.subscriptions = YTManager.subscriptions || {};

YTManager.subscriptions.controls = {
    initialize: function() {
        console.log('[DEBUG] Adding subscription controls');
        
        const controlPanel = YTManager.subscriptions.ui.createControlPanel();
        const selectAllBtn = YTManager.subscriptions.ui.createButton('Select All Channels', YTManager.subscriptions.constants.CLASSES.BUTTON.SELECT);
        const unsubscribeBtn = YTManager.subscriptions.ui.createButton('Unsubscribe Selected', YTManager.subscriptions.constants.CLASSES.BUTTON.DELETE);
        
        selectAllBtn.addEventListener('click', this.handleSelectAll);
        unsubscribeBtn.addEventListener('click', this.handleUnsubscribe);
        
        controlPanel.appendChild(selectAllBtn);
        controlPanel.appendChild(unsubscribeBtn);

        this.insertControlPanel(controlPanel);
        this.setupChannelObserver();
        YTManager.subscriptions.channelManager.addCheckboxesToChannels();
    },

    handleSelectAll: function() {
        const checkboxes = document.querySelectorAll(`.${YTManager.subscriptions.constants.CLASSES.CHECKBOX}`);
        const allChecked = Array.from(checkboxes).every(cb => cb.checked);
        checkboxes.forEach(cb => cb.checked = !allChecked);
        this.textContent = allChecked ? 'Select All Channels' : 'Deselect All';
    },

    handleUnsubscribe: async function() {
        const selectedChannels = document.querySelectorAll(`.${YTManager.subscriptions.constants.CLASSES.CHECKBOX}:checked`);
        console.log('[DEBUG] Selected channels:', selectedChannels.length);
        
        if (selectedChannels.length === 0) return;

        if (confirm(`Unsubscribe from ${selectedChannels.length} channels?`)) {
            let successCount = 0;

            for (const checkbox of selectedChannels) {
                const channelItem = checkbox.closest(YTManager.subscriptions.constants.SELECTORS.CHANNEL_ITEM);
                if (channelItem && await YTManager.subscriptions.channelManager.unsubscribeFromChannel(channelItem)) {
                    successCount++;
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
    },

    insertControlPanel: function(panel) {
        const pageManager = document.querySelector(YTManager.subscriptions.constants.SELECTORS.PAGE_MANAGER);
        if (!pageManager) {
            console.log('[DEBUG] Page manager not found');
            return;
        }

        const header = pageManager.querySelector(YTManager.subscriptions.constants.SELECTORS.CONTENTS);
        if (header) {
            header.insertBefore(panel, header.firstChild);
            console.log('[DEBUG] Added subscription control panel');
        } else {
            console.log('[DEBUG] Could not find header for subscription controls');
        }
    },

    setupChannelObserver: function() {
        const observer = new MutationObserver(() => YTManager.subscriptions.channelManager.addCheckboxesToChannels());
        const container = document.querySelector(YTManager.subscriptions.constants.SELECTORS.CONTENTS);
        if (container) {
            observer.observe(container, {
                childList: true,
                subtree: true
            });
        }
    }
};