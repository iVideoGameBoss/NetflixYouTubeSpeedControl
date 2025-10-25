document.addEventListener('DOMContentLoaded', () => {
  const enabledCheckbox = document.getElementById('enabledCheckbox');
  const speedRadios = document.querySelectorAll('input[name="speed"]');
  const statusDiv = document.getElementById('status');
  const supportBtn = document.getElementById('supportBtn');
  const reapplyBtn = document.getElementById('reapplyBtn'); // Get the new button by its new ID

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
            console.log('Content script acknowledged update:', response);
          }
        });
      }
    });
  }
  
  // --- *** NEW: RE-APPLY BUTTON LOGIC *** ---
  // When the re-apply button is clicked, toggle the extension off and on again.
  reapplyBtn.addEventListener('click', () => {
    // Only proceed if the extension is meant to be active.
    if (!enabledCheckbox.checked) {
      console.log("Cannot re-apply speed while the extension is disabled.");
      return;
    }

    const currentSpeed = parseFloat(document.querySelector('input[name="speed"]:checked').value);

    // 1. Send a 'disable' message to reset the speed to normal.
    sendToActiveTab({ enabled: false, speed: 1 });

    // 2. Use a short delay, then send the 'enable' message with the correct speed.
    setTimeout(() => {
      sendToActiveTab({ enabled: true, speed: currentSpeed });
    }, 100); // A 100ms delay is enough for the script to process the change.
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