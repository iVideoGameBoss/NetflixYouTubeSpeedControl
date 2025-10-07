// Content script to apply selected speed on Netflix/YouTube
(function() {
  'use strict';

  const isNetflix = window.location.hostname.includes('netflix.com');
  const isYouTube = window.location.hostname.includes('youtube.com');
  console.log(`Speed Control: Loaded on ${isNetflix ? 'Netflix' : 'YouTube'}`);

  // Function to find video (including shadow DOM)
  function findVideo() {
    function pierceShadow(root) {
      const video = root.querySelector('video');
      if (video) return video;
      const shadows = root.querySelectorAll('*');
      for (let el of shadows) {
        const shadow = el.shadowRoot;
        if (shadow) {
          const found = pierceShadow(shadow);
          if (found) return found;
        }
      }
      return null;
    }
    return pierceShadow(document);
  }

  // Function to set playback rate
  function setPlaybackRate(video, speed) {
    if (!video || video.playbackRate === speed) return;
    video.playbackRate = speed;
    console.log(`Speed Control: Set to ${speed}x (current time: ${video.currentTime})`);
  }

  let currentSpeed = 3; // Default

  // Apply speed from storage or message
  function applySpeed(enabled, speed) {
    if (!enabled) {
      console.log('Speed Control: Disabled via message/storage');
      return;
    }
    currentSpeed = speed || 3;

    const video = findVideo();
    if (video) {
      setPlaybackRate(video, currentSpeed);
      // Re-apply on events (YouTube might change on quality/adjust)
      ['play', 'ratechange', 'loadedmetadata', 'ended'].forEach(event => {
        video.addEventListener(event, () => setPlaybackRate(video, currentSpeed), { once: false });
      });
      console.log(`Speed Control: Listeners added for ${currentSpeed}x`);
    } else {
      console.log('Speed Control: No video found yet');
    }
  }

  // Listen for messages from popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'updateSpeed') {
      console.log('Speed Control: Received update:', request);
      applySpeed(request.enabled, request.speed);
      sendResponse({ success: true, speed: currentSpeed });
    }
  });

  // Check storage and apply on load
  chrome.storage.local.get(['enabled', 'speed'], (result) => {
    if (chrome.runtime.lastError) {
      console.error('Storage error:', chrome.runtime.lastError);
      // Fallback
      applySpeed(true, 3);
      return;
    }
    const enabled = result.enabled !== false;
    const speed = result.speed || 3;
    applySpeed(enabled, speed);
  });

  // Initial apply (in case storage is async)
  applySpeed(true, 3);

  // Poll every 500ms for up to 10s
  let pollCount = 0;
  const pollInterval = setInterval(() => {
    pollCount++;
    chrome.storage.local.get(['enabled', 'speed'], (result) => {
      const enabled = result.enabled !== false;
      const speed = result.speed || 3;
      applySpeed(enabled, speed);
    });
    if (pollCount > 20) {
      clearInterval(pollInterval);
      console.log('Speed Control: Polling stopped');
    }
  }, 500);

  // MutationObserver for dynamic changes
  const observer = new MutationObserver(() => {
    chrome.storage.local.get(['enabled', 'speed'], (result) => {
      const enabled = result.enabled !== false;
      const speed = result.speed || 3;
      applySpeed(enabled, speed);
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // Cleanup
  window.addEventListener('beforeunload', () => {
    observer.disconnect();
    clearInterval(pollInterval);
  });

  console.log('Speed Control: Observer, polling, and messaging ready');
})();