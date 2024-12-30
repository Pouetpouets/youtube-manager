window.YTManager = window.YTManager || {};
YTManager.watchLater = YTManager.watchLater || {};

YTManager.watchLater.ui = {
    createControlPanel: function() {
        const panel = document.createElement('div');
        panel.className = YTManager.watchLater.constants.CLASSES.CONTROL_PANEL;
        return panel;
    },

    createButton: function(text, type) {
        const button = document.createElement('button');
        button.textContent = text;
        button.className = `${YTManager.watchLater.constants.CLASSES.BUTTON.BASE} ${type}`;
        return button;
    },

    createCheckbox: function() {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = YTManager.watchLater.constants.CLASSES.VIDEO_CHECKBOX;
        return checkbox;
    }
};