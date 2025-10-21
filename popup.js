document.addEventListener('DOMContentLoaded', () => {
  const enabledCheckbox = document.getElementById('enabledCheckbox');
  const speedRadios = document.querySelectorAll('input[name="speed"]');
  const statusDiv = document.getElementById('status');
  const supportBtn = document.getElementById('supportBtn');
  const refreshBtn = document.getElementById('refreshBtn'); // Get the new button

  // Load the stored state from storage when the popup opens
  function loadState() {
    chrome.storage.local.get({ enabled: false, speed: 3 }, (result) => {
      if (chrome.runtime.lastError) {
        console.error('Storage error:', chrome.runtime.lastError);
        return;
      }
      updateUI(result.enabled, result.speed);
    });
  }

  // Update the popup's interface (checkbox, radio buttons, status text)
  function updateUI(enabled, speed) {
    enabledCheckbox.checked = enabled;
    const speedRadio = document.querySelector(`input[value="${speed}"]`) || document.getElementById('speed1');
    speedRadio.checked = true;
    speedRadios.forEach(radio => radio.disabled = !enabled);
    statusDiv.textContent = enabled ? `${speed}x speed active on Netflix/YouTube` : 'Inactive';
    statusDiv.className = enabled ? 'active' : 'inactive';
  }

  // Generic function to save the current state and notify the content script
  function saveAndNotify() {
    const enabled = enabledCheckbox.checked;
    const speed = document.querySelector('input[name="speed"]:checked').value;
    const speedValue = parseFloat(speed);

    chrome.storage.local.set({ enabled, speed: speedValue }, () => {
      if (chrome.runtime.lastError) {
        console.error('Set error:', chrome.runtime.lastError);
        return;
      }
      updateUI(enabled, speedValue);
      sendToActiveTab({ enabled, speed: speedValue });
    });
  }

  // Send a message with the current settings to the content script
  function sendToActiveTab(settings) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && tabs[0].id && (tabs[0].url.includes('netflix.com/watch') || tabs[0].url.includes('youtube.com/watch'))) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'updateSpeed', ...settings }, (response) => {
          if (chrome.runtime.lastError) {
            console.warn('Message error:', chrome.runtime.lastError.message);
          } else {
            console.log('Content script acknowledged speed update:', response);
          }
        });
      }
    });
  }
  
  // --- *** NEW: REFRESH BUTTON LOGIC *** ---
  // When the refresh button is clicked
  refreshBtn.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      // Check if we are on a valid tab
      if (tabs[0] && tabs[0].id && (tabs[0].url.includes('netflix.com/watch') || tabs[0].url.includes('youtube.com/watch'))) {
        // Reload the tab
        chrome.tabs.reload(tabs[0].id);
      }
    });
  });

  // --- Event Listeners ---
  enabledCheckbox.addEventListener('change', saveAndNotify);
  speedRadios.forEach(radio => {
    radio.addEventListener('change', saveAndNotify);
  });
  supportBtn.addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://buymeacoffee.com/ivideogameboss' });
  });

  // Load the state as soon as the popup is opened
  loadState();
});