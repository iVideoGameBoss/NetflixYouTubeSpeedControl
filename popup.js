document.addEventListener('DOMContentLoaded', () => {
  const enabledCheckbox = document.getElementById('enabledCheckbox');
  const speedRadios = document.querySelectorAll('input[name="speed"]');
  const statusDiv = document.getElementById('status');
  const supportBtn = document.getElementById('supportBtn');

  // Load stored state (default: enabled=false, speed=3)
  function loadState() {
    chrome.storage.local.get(['enabled', 'speed'], (result) => {
      if (chrome.runtime.lastError) {
        console.error('Storage error:', chrome.runtime.lastError);
        // Fallback: enabled=false, speed=3
        updateUI(false, 3);
        return;
      }
      const enabled = result.enabled === true; // Explicitly false by default
      const speed = result.speed || 3;
      updateUI(enabled, speed);
      if (enabled) {
        // Send current settings to active tab on load (if enabled)
        sendToActiveTab({ enabled, speed: parseFloat(speed) });
      }
    });
  }

  function updateUI(enabled, speed) {
    enabledCheckbox.checked = enabled;
    document.querySelector(`input[value="${speed}"]`).checked = true;
    speedRadios.forEach(radio => radio.disabled = !enabled);
    statusDiv.textContent = enabled ? `${speed}x speed active` : 'Inactive';
    statusDiv.className = enabled ? 'active' : 'inactive';
    statusDiv.style.color = enabled ? '#00ff00' : '#ff0000';
  }

  // Event listeners
  enabledCheckbox.addEventListener('change', saveAndHandleEnable);
  speedRadios.forEach(radio => {
    radio.addEventListener('change', saveAndNotify);
  });

  function saveAndHandleEnable() {
    const enabled = enabledCheckbox.checked;
    const speed = document.querySelector('input[name="speed"]:checked').value;
    chrome.storage.local.set({ enabled, speed }, () => {
      if (chrome.runtime.lastError) {
        console.error('Set error:', chrome.runtime.lastError);
        loadState();
        return;
      }
      updateUI(enabled, parseFloat(speed));
      if (enabled) {
        // Refresh tab on enable
        refreshActiveTab();
      } else {
        // Just notify on disable (no refresh)
        sendToActiveTab({ enabled: false, speed: parseFloat(speed) });
      }
    });
  }

  function saveAndNotify() {
    const enabled = enabledCheckbox.checked;
    const speed = document.querySelector('input[name="speed"]:checked').value;
    if (!enabled) return; // No notify if disabled
    chrome.storage.local.set({ enabled, speed }, () => {
      if (chrome.runtime.lastError) {
        console.error('Set error:', chrome.runtime.lastError);
        loadState();
        return;
      }
      updateUI(enabled, parseFloat(speed));
      // Notify active tab for instant speed change (if enabled)
      sendToActiveTab({ enabled, speed: parseFloat(speed) });
    });
  }

  // Refresh active Netflix tab
  function refreshActiveTab() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && tabs[0].url.includes('netflix.com/watch')) {
        chrome.tabs.reload(tabs[0].id);
      }
    });
  }

  // Send message to active Netflix tab
  function sendToActiveTab(settings) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && tabs[0].url.includes('netflix.com/watch')) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'updateSpeed', ...settings }, (response) => {
          if (chrome.runtime.lastError) {
            console.error('Message error:', chrome.runtime.lastError);
          } else {
            console.log('Speed updated via message:', response);
          }
        });
      }
    });
  }

  // Support button handler
  supportBtn.addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://buymeacoffee.com/ivideogameboss' });
  });

  loadState();
});