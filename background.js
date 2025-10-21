// This script runs in the background and is ideal for handling events.

// Listen for when the extension is first installed or updated.
chrome.runtime.onInstalled.addListener(details => {
    // The 'reason' can be 'install', 'update', or 'chrome_update'.
    if (details.reason === 'install') {
      console.log('Netflix & YouTube Speed Control: First-time installation.');
  
      // Find all existing Netflix and YouTube tabs and inject the content script.
      chrome.tabs.query({}, tabs => {
        for (const tab of tabs) {
          // Check if the tab's URL matches our target sites.
          if (tab.url && (tab.url.includes('netflix.com/watch') || tab.url.includes('youtube.com/watch'))) {
            
            console.log(`Injecting content script into existing tab: ${tab.id} (${tab.url})`);
  
            // Programmatically inject the content.js script into the tab.
            chrome.scripting.executeScript({
              target: { tabId: tab.id },
              files: ['content.js']
            }).catch(err => console.error('Failed to inject script:', err));
          }
        }
      });
    }
  });
  
  // A simple log to confirm the background script itself is running.
  console.log("Speed Control background script is active.");