import { SELECTORS, DELAYS, CLASSES } from './constants';
import { createCheckbox } from './ui';

export async function removeVideo(videoItem) {
    console.log('Processing video item:', videoItem);
    
    const menuButton = videoItem.querySelector(SELECTORS.MENU_BUTTON);
    console.log('Found menu button:', menuButton);
    
    if (!menuButton) return false;

    menuButton.click();
    await new Promise(r => setTimeout(r, DELAYS.MENU_CLICK));
    
    const removeButton = Array.from(document.querySelectorAll(SELECTORS.REMOVE_BUTTON))
        .find(item => {
            const text = item.textContent.toLowerCase();
            return text.includes('remove') || text.includes('supprimer');
        });
    
    console.log('Found remove button:', removeButton);
    
    if (!removeButton) return false;

    removeButton.click();
    await new Promise(r => setTimeout(r, DELAYS.REMOVE_CLICK));
    return true;
}

export function addCheckboxesToVideos() {
    const videoItems = document.querySelectorAll(SELECTORS.VIDEO_ITEM);
    videoItems.forEach(item => {
        if (!item.querySelector(`.${CLASSES.VIDEO_CHECKBOX}`)) {
            const checkbox = createCheckbox();
            item.insertBefore(checkbox, item.firstChild);
        }
    });
}