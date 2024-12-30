(function() {
    let isInitialized = false;

    function initializeControls() {
        if (isInitialized) {
            console.log('[DEBUG] Controls already initialized');
            return;
        }

        YTManager.utils.ensureSingleControlPanel();

        if (YTManager.utils.isWatchLaterPage()) {
            console.log('[DEBUG] Initializing Watch Later controls');
            YTManager.watchLater.controls.initialize();
            isInitialized = true;
        } else if (YTManager.utils.isSubscriptionsPage()) {
            console.log('[DEBUG] Initializing Subscription controls');
            YTManager.subscriptions.controls.initialize();
            isInitialized = true;
        }
    }

    // Reset initialization flag on navigation
    window.addEventListener('yt-navigate-start', () => {
        console.log('[DEBUG] Navigation started, resetting initialization');
        isInitialized = false;
    });

    // Initialize on navigation end
    window.addEventListener('yt-navigate-finish', () => {
        console.log('[DEBUG] Navigation finished, initializing controls');
        setTimeout(initializeControls, 1000);
    });

    // Initial load
    let initAttempts = 0;
    const maxAttempts = 10;
    const interval = setInterval(() => {
        if (document.querySelector('ytd-page-manager')) {
            initializeControls();
            clearInterval(interval);
        }
        initAttempts++;
        if (initAttempts >= maxAttempts) {
            clearInterval(interval);
        }
    }, 1000);
})();