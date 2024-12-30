window.YTManager = {
    utils: {
        isWatchLaterPage: function() {
            console.log('[DEBUG] Checking Watch Later page');
            return window.location.href.includes('list=WL');
        },
        
        isSubscriptionsPage: function() {
            return window.location.href.includes('/feed/channels');
        },
        
        ensureSingleControlPanel: function() {
            const existingPanels = document.querySelectorAll('.wl-control-panel');
            existingPanels.forEach(panel => panel.remove());
        }
    }
};