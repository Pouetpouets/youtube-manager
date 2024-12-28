import { ensureSingleControlPanel } from '../../utils/common.js';

export function addWatchLaterControls() {
    ensureSingleControlPanel();
    // Create control panel
    const controlPanel = document.createElement('div');
    controlPanel.className = 'wl-control-panel';
    
    // Add buttons
    const selectAllBtn = document.createElement('button');
    selectAllBtn.textContent = 'Select All';
    selectAllBtn.className = 'wl-btn select-all';
    
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete Selected';
    deleteBtn.className = 'wl-btn delete-selected';
    
    // Add event listeners
    selectAllBtn.addEventListener('click', () => {
        const checkboxes = document.querySelectorAll('.video-checkbox');
        const allChecked = Array.from(checkboxes).every(cb => cb.checked);
        checkboxes.forEach(cb => cb.checked = !allChecked);
        selectAllBtn.textContent = allChecked ? 'Select All' : 'Deselect All';
    });

    deleteBtn.addEventListener('click', async () => {
        const selectedVideos = document.querySelectorAll('.video-checkbox:checked');
        console.log('Selected videos:', selectedVideos.length);
        
        if (selectedVideos.length === 0) return;

        if (confirm(`Delete ${selectedVideos.length} videos from Watch Later?`)) {
            for (const checkbox of selectedVideos) {
                const videoItem = checkbox.closest('ytd-playlist-video-renderer');
                console.log('Processing video item:', videoItem);
                
                // Find menu button
                const menuButton = videoItem.querySelector('button.yt-icon-button, ytd-menu-renderer button, [aria-label="Action menu"]');
                console.log('Found menu button:', menuButton);
                
                if (menuButton) {
                    menuButton.click();
                    await new Promise(r => setTimeout(r, 1000));
                    
                    const removeButton = Array.from(document.querySelectorAll('ytd-menu-service-item-renderer, tp-yt-paper-item'))
                        .find(item => {
                            const text = item.textContent.toLowerCase();
                            return text.includes('remove') || text.includes('supprimer');
                        });
                    
                    console.log('Found remove button:', removeButton);
                    
                    if (removeButton) {
                        removeButton.click();
                        await new Promise(r => setTimeout(r, 1000));
                    }
                }
            }
        }
    });
    
    controlPanel.appendChild(selectAllBtn);
    controlPanel.appendChild(deleteBtn);
    
    // Insert panel
    const pageManager = document.querySelector('ytd-page-manager');
    if (pageManager) {
        const header = pageManager.querySelector('ytd-browse #primary');
        if (header) {
            header.insertBefore(controlPanel, header.firstChild);
            console.log('[DEBUG] Added Watch Later control panel');
        }
    }

    function addCheckboxesToVideos() {
        const videoItems = document.querySelectorAll('ytd-playlist-video-renderer');
        videoItems.forEach(item => {
            if (!item.querySelector('.video-checkbox')) {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'video-checkbox';
                item.insertBefore(checkbox, item.firstChild);
            }
        });
    }

    const observer = new MutationObserver(() => {
        addCheckboxesToVideos();
    });

    const playlistContainer = document.querySelector('ytd-playlist-video-list-renderer');
    if (playlistContainer) {
        observer.observe(playlistContainer, {
            childList: true,
            subtree: true
        });
        addCheckboxesToVideos();
    }
}