export function isWatchLaterPage() {
    console.log('[DEBUG] Checking Watch Later page');
    return window.location.href.includes('list=WL');
}

export function isSubscriptionsPage() {
    return window.location.href.includes('/feed/channels');
}

export function ensureSingleControlPanel() {
    const existingPanels = document.querySelectorAll('.wl-control-panel');
    existingPanels.forEach(panel => panel.remove());
}