chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({color: '#ae00ff'}, function() {
      console.log("The color is green.");
    });
});