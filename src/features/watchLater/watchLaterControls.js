window.YTManager = window.YTManager || {};
YTManager.watchLater = YTManager.watchLater || {};

YTManager.watchLater.controls = {
    initialize: function() {
        const controlPanel = YTManager.watchLater.ui.createControlPanel();
        
        const selectAllBtn = YTManager.watchLater.ui.createButton('Select All', YTManager.watchLater.constants.CLASSES.BUTTON.SELECT);
        const deleteBtn = YTManager.watchLater.ui.createButton('Delete Selected', YTManager.watchLater.constants.CLASSES.BUTTON.DELETE);
        
        selectAllBtn.addEventListener('click', this.handleSelectAll);
        deleteBtn.addEventListener('click', this.handleDelete);
        
        controlPanel.appendChild(selectAllBtn);
        controlPanel.appendChild(deleteBtn);
        
        this.insertControlPanel(controlPanel);
        this.setupVideoObserver();
        YTManager.watchLater.videoManager.addCheckboxesToVideos();
    },

    handleSelectAll: function() {
        const checkboxes = document.querySelectorAll(`.${YTManager.watchLater.constants.CLASSES.VIDEO_CHECKBOX}`);
        const allChecked = Array.from(checkboxes).every(cb => cb.checked);
        checkboxes.forEach(cb => cb.checked = !allChecked);
        this.textContent = allChecked ? 'Select All' : 'Deselect All';
    },

    handleDelete: async function() {
        const selectedVideos = document.querySelectorAll(`.${YTManager.watchLater.constants.CLASSES.VIDEO_CHECKBOX}:checked`);
        if (selectedVideos.length === 0) return;

        if (confirm(`Delete ${selectedVideos.length} videos from Watch Later?`)) {
            for (const checkbox of selectedVideos) {
                const videoItem = checkbox.closest(YTManager.watchLater.constants.SELECTORS.VIDEO_ITEM);
                if (videoItem) {
                    await YTManager.watchLater.videoManager.removeVideo(videoItem);
                }
            }
        }
    },

    insertControlPanel: function(panel) {
        const pageManager = document.querySelector('ytd-page-manager');
        const header = pageManager?.querySelector(YTManager.watchLater.constants.SELECTORS.PRIMARY_CONTAINER);
        if (header) {
            header.insertBefore(panel, header.firstChild);
            console.log('[DEBUG] Added Watch Later control panel');
        }
    },

    setupVideoObserver: function() {
        const observer = new MutationObserver(() => YTManager.watchLater.videoManager.addCheckboxesToVideos());
        const container = document.querySelector(YTManager.watchLater.constants.SELECTORS.PLAYLIST_CONTAINER);
        if (container) {
            observer.observe(container, {
                childList: true,
                subtree: true
            });
        }
    }
};