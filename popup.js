document.addEventListener('DOMContentLoaded', () => {
  const enabledCheckbox = document.getElementById('enabledCheckbox');
  const speedRadios = document.querySelectorAll('input[name="speed"]');
  const statusDiv = document.getElementById('status');
  const supportBtn = document.getElementById('supportBtn');

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

  // --- *** UPDATED: CORE LOGIC TO SAVE AND NOTIFY *** ---
  // This function is now called by all interactive elements.
  function saveAndNotify(event) {
    const enabled = enabledCheckbox.checked;
    const speed = document.querySelector('input[name="speed"]:checked').value;
    const speedValue = parseFloat(speed);
    
    // Determine if the user changed a speed radio button while the extension was already enabled.
    const isForcedSpeedChange = event.target.type === 'radio' && enabled;

    chrome.storage.local.set({ enabled, speed: speedValue }, () => {
      if (chrome.runtime.lastError) {
        console.error('Set error:', chrome.runtime.lastError);
        return;
      }
      updateUI(enabled, speedValue);

      if (isForcedSpeedChange) {
        // A speed radio button was clicked, so force the change by toggling off and on.
        console.log("Forcing speed re-application.");
        // 1. Send 'disable' to reset the speed to 1x.
        sendToActiveTab({ enabled: false, speed: 1 });
        // 2. After a brief delay, send the new desired speed.
        setTimeout(() => {
          sendToActiveTab({ enabled: true, speed: speedValue });
        }, 100);
      } else {
        // The main checkbox was toggled, so send a single command.
        sendToActiveTab({ enabled, speed: speedValue });
      }
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