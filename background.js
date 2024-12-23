console.log('Background script loaded');

chrome.webNavigation.onCompleted.addListener(function(details) {
    if (details.url.includes('youtube.com/playlist') && details.url.includes('list=WL')) {
        chrome.scripting.executeScript({
            target: { tabId: details.tabId },
            files: ['content.js']
        });
    }
}, {
    url: [{
        hostEquals: 'www.youtube.com',
        pathContains: 'playlist'
    }]
});