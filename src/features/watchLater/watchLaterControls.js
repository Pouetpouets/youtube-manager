import { SELECTORS, CLASSES } from './constants';
import { createControlPanel, createButton } from './ui';
import { removeVideo, addCheckboxesToVideos } from './videoManager';

export function initializeWatchLater() {
    const controlPanel = createControlPanel();
    
    const selectAllBtn = createButton('Select All', CLASSES.BUTTON.SELECT);
    const deleteBtn = createButton('Delete Selected', CLASSES.BUTTON.DELETE);
    
    selectAllBtn.addEventListener('click', handleSelectAll);
    deleteBtn.addEventListener('click', handleDelete);
    
    controlPanel.appendChild(selectAllBtn);
    controlPanel.appendChild(deleteBtn);
    
    insertControlPanel(controlPanel);
    setupVideoObserver();
    addCheckboxesToVideos();
}

function handleSelectAll() {
    const checkboxes = document.querySelectorAll(`.${CLASSES.VIDEO_CHECKBOX}`);
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);
    checkboxes.forEach(cb => cb.checked = !allChecked);
    this.textContent = allChecked ? 'Select All' : 'Deselect All';
}

async function handleDelete() {
    const selectedVideos = document.querySelectorAll(`.${CLASSES.VIDEO_CHECKBOX}:checked`);
    if (selectedVideos.length === 0) return;

    if (confirm(`Delete ${selectedVideos.length} videos from Watch Later?`)) {
        for (const checkbox of selectedVideos) {
            const videoItem = checkbox.closest(SELECTORS.VIDEO_ITEM);
            if (videoItem) {
                await removeVideo(videoItem);
            }
        }
    }
}

function insertControlPanel(panel) {
    const pageManager = document.querySelector('ytd-page-manager');
    const header = pageManager?.querySelector(SELECTORS.PRIMARY_CONTAINER);
    if (header) {
        header.insertBefore(panel, header.firstChild);
        console.log('[DEBUG] Added Watch Later control panel');
    }
}

function setupVideoObserver() {
    const observer = new MutationObserver(() => addCheckboxesToVideos());
    const container = document.querySelector(SELECTORS.PLAYLIST_CONTAINER);
    if (container) {
        observer.observe(container, {
            childList: true,
            subtree: true
        });
    }
}