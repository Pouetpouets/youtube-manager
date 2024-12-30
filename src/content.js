(function() {
    function initializeControls() {
        if (YTManager.utils.isWatchLaterPage()) {
            YTManager.watchLater.controls.initialize();
        } else if (YTManager.utils.isSubscriptionsPage()) {
            YTManager.subscriptions.controls.initialize();
        }
    }

    let initAttempts = 0;
    const maxAttempts = 10;
    const interval = setInterval(() => {
        if (document.querySelector('ytd-guide-section-renderer')) {
            initializeControls();
            clearInterval(interval);
        }
        initAttempts++;
        if (initAttempts >= maxAttempts) {
            clearInterval(interval);
        }
    }, 1000);

    window.addEventListener('yt-navigate-finish', () => {
        setTimeout(initializeControls, 1000);
    });
})();