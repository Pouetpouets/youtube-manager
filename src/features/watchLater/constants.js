window.YTManager = window.YTManager || {};

YTManager.watchLater = YTManager.watchLater || {};
YTManager.watchLater.constants = {
    SELECTORS: {
        PLAYLIST_CONTAINER: 'ytd-playlist-video-list-renderer',
        VIDEO_ITEM: 'ytd-playlist-video-renderer',
        MENU_BUTTON: 'button.yt-icon-button, ytd-menu-renderer button, [aria-label="Action menu"]',
        REMOVE_BUTTON: 'ytd-menu-service-item-renderer, tp-yt-paper-item',
        PRIMARY_CONTAINER: 'ytd-browse #primary'
    },

    CLASSES: {
        VIDEO_CHECKBOX: 'video-checkbox',
        CONTROL_PANEL: 'wl-control-panel',
        BUTTON: {
            BASE: 'wl-btn',
            SELECT: 'select-all',
            DELETE: 'delete-selected'
        }
    },

    DELAYS: {
        MENU_CLICK: 1000,
        REMOVE_CLICK: 1000
    }
};