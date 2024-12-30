window.YTManager = window.YTManager || {};
YTManager.subscriptions = YTManager.subscriptions || {};

YTManager.subscriptions.constants = {
    SELECTORS: {
        CHANNEL_ITEM: 'ytd-channel-renderer, ytd-grid-channel-renderer',
        CHANNEL_NAME: 'ytd-channel-name',
        SUBSCRIBE_BUTTON: 'ytd-subscribe-button-renderer button',
        CONFIRM_DIALOG: 'yt-confirm-dialog-renderer',
        CONFIRM_BUTTON: '#confirm-button button',
        CONTENTS: '#primary',
        PAGE_MANAGER: 'ytd-page-manager',
        AVATAR_CONTAINER: '#avatar-link'
    },

    CLASSES: {
        CHECKBOX: 'subscription-checkbox',
        CHECKBOX_CONTAINER: 'subscription-checkbox-container',
        CONTROL_PANEL: 'wl-control-panel',
        BUTTON: {
            BASE: 'wl-btn',
            SELECT: 'select-all',
            DELETE: 'delete-selected'
        }
    },

    DELAYS: {
        SUBSCRIBE_CLICK: 1500,
        UNSUBSCRIBE_CLICK: 2000
    }
};