import { CLASSES } from './constants';

export function createControlPanel() {
    const panel = document.createElement('div');
    panel.className = CLASSES.CONTROL_PANEL;
    return panel;
}

export function createButton(text, type) {
    const button = document.createElement('button');
    button.textContent = text;
    button.className = `${CLASSES.BUTTON.BASE} ${type}`;
    return button;
}

export function createCheckbox() {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = CLASSES.CHECKBOX;
    return checkbox;
}

export function createCheckboxContainer(checkbox) {
    const container = document.createElement('div');
    container.className = CLASSES.CHECKBOX_CONTAINER;
    container.appendChild(checkbox);
    return container;
}