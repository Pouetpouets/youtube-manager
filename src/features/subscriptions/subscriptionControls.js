import { SELECTORS, CLASSES } from './constants';
import { createControlPanel, createButton } from './ui';
import { unsubscribeFromChannel, addCheckboxesToChannels } from './channelManager';

export function initializeSubscriptions() {
    console.log('[DEBUG] Adding subscription controls');
    
    const controlPanel = createControlPanel();
    const selectAllBtn = createButton('Select All Channels', CLASSES.BUTTON.SELECT);
    const unsubscribeBtn = createButton('Unsubscribe Selected', CLASSES.BUTTON.DELETE);
    
    selectAllBtn.addEventListener('click', handleSelectAll);
    unsubscribeBtn.addEventListener('click', handleUnsubscribe);
    
    controlPanel.appendChild(selectAllBtn);
    controlPanel.appendChild(unsubscribeBtn);

    insertControlPanel(controlPanel);
    setupChannelObserver();
    addCheckboxesToChannels();
}

function handleSelectAll() {
    const checkboxes = document.querySelectorAll(`.${CLASSES.CHECKBOX}`);
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);
    checkboxes.forEach(cb => cb.checked = !allChecked);
    this.textContent = allChecked ? 'Select All Channels' : 'Deselect All';
}

async function handleUnsubscribe() {
    const selectedChannels = document.querySelectorAll(`.${CLASSES.CHECKBOX}:checked`);
    console.log('[DEBUG] Selected channels:', selectedChannels.length);
    
    if (selectedChannels.length === 0) return;

    if (confirm(`Unsubscribe from ${selectedChannels.length} channels?`)) {
        let successCount = 0;

        for (const checkbox of selectedChannels) {
            const channelItem = checkbox.closest(SELECTORS.CHANNEL_ITEM);
            if (channelItem && await unsubscribeFromChannel(channelItem)) {
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
}

function insertControlPanel(panel) {
    const pageManager = document.querySelector(SELECTORS.PAGE_MANAGER);
    const header = pageManager?.querySelector(SELECTORS.CONTENTS);
    if (header) {
        header.insertBefore(panel, header.firstChild);
        console.log('[DEBUG] Added control panel to page header');
    }
}

function setupChannelObserver() {
    const observer = new MutationObserver(() => addCheckboxesToChannels());
    const container = document.querySelector(SELECTORS.CONTENTS);
    if (container) {
        observer.observe(container, {
            childList: true,
            subtree: true
        });
    }
}