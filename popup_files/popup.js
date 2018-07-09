'use strict';

let muteAudibleTabs = document.getElementById('muteAudibleTabs');
let unmuteUnaudibleTabs = document.getElementById('unmuteUnaudibleTabs');
let removeRedundentTabs = document.getElementById('removeRedundentTabs');

muteAudibleTabs.onclick = function(element) {
  console.log("what");
  chrome.tabs.query({audible: true}, function(tabs) {
    tabs.forEach(function(tab) {
      console.log(tab.id);
      chrome.tabs.update(tab.id, {muted: true}, function(updatedTab) {
        console.log(updatedTab.muted);
      });
    });
  });
};

unmuteUnaudibleTabs.onclick = function(element) {
  console.log(element);
  chrome.tabs.query({muted: true}, function(tabs) {
    tabs.forEach(function(tab) {
      console.log(tab.id);
      chrome.tabs.update(tab.id, {muted: false}, function(updatedTab) {
        console.log(updatedTab.muted);
      });
    });
  });
};

// removeRedundentTabs.onclick = function(element) {
//   chrome.tabs.query(, function(tabs) {
//     tabs.forEach(function(tab) {
//       console.log(tab.id);
//       chrome.tabs.update(tab.id, {muted: false}, function(updatedTab) {
//         console.log(updatedTab.muted);
//       });
//     });
//   });
// };
