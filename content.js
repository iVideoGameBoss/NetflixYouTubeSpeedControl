// Content script to apply selected speed on Netflix/YouTube
(function() {
  'use strict';

  console.log("Speed Control: Content script loaded. Awaiting instructions.");

  let currentSpeed = 1; // Default to normal speed
  let speedControlActive = false; // Master control flag, starts as inactive
  let videoElement = null; // Store a reference to the video element to avoid re-searching

  // Function to find the video element, including within a shadow DOM
  function findVideo() {
    if (videoElement && document.contains(videoElement)) {
        return videoElement;
    }
    function pierceShadow(root) {
      const video = root.querySelector('video');
      if (video) return video;
      for (let el of root.querySelectorAll('*')) {
        if (el.shadowRoot) {
          const found = pierceShadow(el.shadowRoot);
          if (found) return found;
        }
      }
      return null;
    }
    videoElement = pierceShadow(document);
    return videoElement;
  }

  // Function to set the video's playback rate
  function setPlaybackRate(speed) {
    const video = findVideo();
    if (!video) return;
    if (video.playbackRate !== speed) {
        video.playbackRate = speed;
        console.log(`Speed Control: Playback rate set to ${speed}x`);
    }
  }

  // Add listeners to the video to re-apply speed if the website tries to reset it
  function addVideoListeners() {
    const video = findVideo();
    if (!video) return;
    ['play', 'ratechange', 'loadedmetadata'].forEach(event => {
        video.addEventListener(event, applyCurrentSpeedSetting);
    });
    console.log(`Speed Control: Event listeners attached to video element.`);
  }

  // This function checks the active state and applies the correct speed
  function applyCurrentSpeedSetting() {
      if (speedControlActive) {
          setPlaybackRate(currentSpeed);
      } else {
          setPlaybackRate(1); // If inactive, ensure speed is reset to normal 1x
      }
  }

  // Central function to handle any updates from the popup or initial storage check
  function handleUpdate({ enabled, speed }) {
      speedControlActive = enabled;
      if (enabled) {
          currentSpeed = speed || 1;
          console.log(`Speed Control: Extension has been ENABLED. Speed: ${currentSpeed}x.`);
      } else {
          currentSpeed = 1;
          console.log("Speed Control: Extension has been DISABLED. Resetting speed to 1x.");
      }
      applyCurrentSpeedSetting();
      addVideoListeners();
  }

  // 1. Listen for real-time messages from the popup UI
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'updateSpeed') {
      console.log('Speed Control: Received live update from popup:', request);
      handleUpdate({ enabled: request.enabled, speed: request.speed });
      sendResponse({ success: true, speed: currentSpeed });
    }
    return true;
  });

  // 2. Check storage on initial page load
  chrome.storage.local.get(['enabled', 'speed'], (result) => {
    if (chrome.runtime.lastError) {
      console.error('Storage error:', chrome.runtime.lastError);
      return;
    }
    if (result.enabled === true) {
      console.log("Speed Control: Initial state from storage is ENABLED.");
      handleUpdate({ enabled: true, speed: result.speed });
    } else {
      console.log("Speed Control: Initial state from storage is INACTIVE.");
    }
  });

  // 3. MutationObserver for dynamically loaded videos (e.g., YouTube navigation)
  const observer = new MutationObserver(() => {
      const video = findVideo();
      if (video) {
        console.log("Speed Control: Video element detected by MutationObserver.");
        applyCurrentSpeedSetting();
        addVideoListeners();
      }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // 4. *** NEW *** Polling mechanism to find pre-existing videos on injection.
  // This is the safety net for tabs that were already open.
  let pollAttempts = 0;
  const pollInterval = setInterval(() => {
    pollAttempts++;
    const video = findVideo();

    if (video) {
      console.log('Speed Control: Video found via polling. Applying settings.');
      applyCurrentSpeedSetting();
      addVideoListeners();
      clearInterval(pollInterval); // Success! Stop polling.
    } else if (pollAttempts > 20) { // Give up after 10 seconds (20 * 500ms)
      console.log('Speed Control: Polling timed out. No video found.');
      clearInterval(pollInterval); // Failure. Stop polling.
    }
  }, 500);

})();