import { SELECTORS, DELAYS, CLASSES } from './constants';
import { createCheckbox, createCheckboxContainer } from './ui';

export async function unsubscribeFromChannel(channelItem) {
    try {
        const channelName = channelItem.querySelector(SELECTORS.CHANNEL_NAME)?.textContent;
        console.log('[DEBUG] Processing channel:', channelName);
        
        const subscribeButton = channelItem.querySelector(SELECTORS.SUBSCRIBE_BUTTON);
        if (!subscribeButton) {
            console.log('[DEBUG] Subscribe button not found for channel:', channelName);
            return false;
        }

        console.log('[DEBUG] Clicking subscribe button');
        subscribeButton.click();
        await new Promise(r => setTimeout(r, DELAYS.SUBSCRIBE_CLICK));
        
        const confirmDialog = document.querySelector(SELECTORS.CONFIRM_DIALOG);
        const confirmButton = confirmDialog?.querySelector(SELECTORS.CONFIRM_BUTTON);
        console.log('[DEBUG] Found unsubscribe confirmation button:', confirmButton);
        
        if (!confirmButton) {
            console.log('[DEBUG] Unsubscribe confirmation button not found');
            return false;
        }

        confirmButton.click();
        await new Promise(r => setTimeout(r, DELAYS.UNSUBSCRIBE_CLICK));
        console.log('[DEBUG] Successfully unsubscribed from:', channelName);
        return true;
    } catch (error) {
        console.error('[DEBUG] Error unsubscribing from channel:', error);
        return false;
    }
}

export function addCheckboxesToChannels() {
    const channelItems = document.querySelectorAll(SELECTORS.CHANNEL_ITEM);
    channelItems.forEach(item => {
        if (!item.querySelector(`.${CLASSES.CHECKBOX}`)) {
            const checkbox = createCheckbox();
            const container = createCheckboxContainer(checkbox);

            const avatarContainer = item.querySelector(SELECTORS.AVATAR_CONTAINER);
            if (avatarContainer) {
                avatarContainer.parentElement.insertBefore(container, avatarContainer);
                console.log('[DEBUG] Added checkbox to channel');
            } else {
                console.log('[DEBUG] Could not find avatar container');
            }
        }
    });
}