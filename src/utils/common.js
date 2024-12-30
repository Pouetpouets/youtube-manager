window.YTManager = {
    utils: {
        isWatchLaterPage: function() {
            console.log('[DEBUG] Checking Watch Later page');
            return window.location.href.includes('list=WL');
        },
        
        isSubscriptionsPage: function() {
            console.log('[DEBUG] Checking Subscriptions page');
            return window.location.href.includes('/feed/channels') || 
                   window.location.pathname === '/feed/subscriptions';
        },
        
        ensureSingleControlPanel: function() {
            console.log('[DEBUG] Removing existing control panels');
            const existingPanels = document.querySelectorAll('.wl-control-panel');
            existingPanels.forEach(panel => panel.remove());
        }
    }
};