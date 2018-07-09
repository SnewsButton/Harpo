'use strict';

let muteAudibleTabs = document.getElementById('muteAudibleTabs');
let unmuteUnaudibleTabs = document.getElementById('unmuteUnaudibleTabs');
let removeRedundentTabs = document.getElementById('removeRedundentTabs');
let bkg = chrome.extension.getBackgroundPage();

muteAudibleTabs.onclick = function(element) {
  console.log("what");
  bkg.console.log('foo');
  chrome.tabs.query({audible: true}, function(tabs) {
    tabs.forEach(function(tab) {
      bkg.console.log(tab.id);
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

removeRedundentTabs.onclick = function(element) {
  var redundentTabs = new Object();
  chrome.tabs.query({}, function(tabs) {
    tabs.forEach(function(tab) {
      let tabUrl = tab.url;
      // Add new field to object
      if (redundentTabs[tabUrl] == null) {
        redundentTabs[tabUrl] = [];
      }
      else {
        redundentTabs[tabUrl].push(tab.id);
      }
    });
    // remove reduncent tabs
    var numTabs = 0;
    for (var redundentUrl in redundentTabs) {
      if (redundentTabs.hasOwnProperty(redundentUrl) && redundentTabs[redundentUrl].length > 0) {
        chrome.tabs.remove(redundentTabs[redundentUrl], function(){});
        numTabs += redundentTabs[redundentUrl].length;
      }
    }
    alertClosedTabs(numTabs);
  });
};

function alertClosedTabs(numTabs) {
  alert(numTabs + ' tab(s) have been closed.');
};
