window.YTManager = window.YTManager || {};
YTManager.watchLater = YTManager.watchLater || {};

YTManager.watchLater.videoManager = {
    removeVideo: async function(videoItem) {
        console.log('Processing video item:', videoItem);
        
        const menuButton = videoItem.querySelector(YTManager.watchLater.constants.SELECTORS.MENU_BUTTON);
        console.log('Found menu button:', menuButton);
        
        if (!menuButton) return false;

        menuButton.click();
        await new Promise(r => setTimeout(r, YTManager.watchLater.constants.DELAYS.MENU_CLICK));
        
        const removeButton = Array.from(document.querySelectorAll(YTManager.watchLater.constants.SELECTORS.REMOVE_BUTTON))
            .find(item => {
                const text = item.textContent.toLowerCase();
                return text.includes('remove') || text.includes('supprimer');
            });
        
        console.log('Found remove button:', removeButton);
        
        if (!removeButton) return false;

        removeButton.click();
        await new Promise(r => setTimeout(r, YTManager.watchLater.constants.DELAYS.REMOVE_CLICK));
        return true;
    },

    addCheckboxesToVideos: function() {
        const videoItems = document.querySelectorAll(YTManager.watchLater.constants.SELECTORS.VIDEO_ITEM);
        videoItems.forEach(item => {
            if (!item.querySelector(`.${YTManager.watchLater.constants.CLASSES.VIDEO_CHECKBOX}`)) {
                const checkbox = YTManager.watchLater.ui.createCheckbox();
                item.insertBefore(checkbox, item.firstChild);
            }
        });
    }
};