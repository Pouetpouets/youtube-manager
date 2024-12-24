function isWatchLaterPage() {
    return window.location.href.includes('list=WL');
}

function isSubscriptionsPage() {
    return window.location.href.includes('/feed/channels');
}

function ensureSingleControlPanel() {
    // Remove any existing control panels
    const existingPanels = document.querySelectorAll('.wl-control-panel');
    existingPanels.forEach(panel => panel.remove());
}

function addWatchLaterControls() {
    ensureSingleControlPanel();
    // Rest of the function...
}

function addSubscriptionControls() {
    ensureSingleControlPanel();
    // Rest of the function...
}

// Initialize based on page type
function initializeControls() {
    ensureSingleControlPanel();
    if (isWatchLaterPage()) {
        addWatchLaterControls();
    } else if (isSubscriptionsPage()) {
        addSubscriptionControls();
    }
}

// Initial load
let initAttempts = 0;
const maxAttempts = 10;
const interval = setInterval(() => {
    if (document.querySelector('#primary')) {
        initializeControls();
        clearInterval(interval);
    }
    initAttempts++;
    if (initAttempts >= maxAttempts) {
        clearInterval(interval);
    }
}, 1000);

// Handle navigation
window.addEventListener('yt-navigate-finish', () => {
    // Small delay to ensure DOM is ready
    setTimeout(initializeControls, 1000);
});