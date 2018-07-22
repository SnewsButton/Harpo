'use strict';

/*
Audio
*/

let jumpAudibleTab = document.getElementById('jumpAudibleTab');
let muteAudibleTabs = document.getElementById('muteAudibleTabs');
let unmuteUnaudibleTabs = document.getElementById('unmuteUnaudibleTabs');
let bkg = chrome.extension.getBackgroundPage();

jumpAudibleTab.onclick = function(element) {
  // get current window
  var currWindowId;
  chrome.windows.getCurrent({}, function (win) {
    currWindowId = win.id;
    bkg.console.log(currWindowId);
    completeJump(currWindowId);
  });
};

muteAudibleTabs.onclick = function(element) {
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

function completeJump(windowId) {
  bkg.console.log(windowId);
  chrome.tabs.query({active: true, windowId: windowId}, function(tabs) {
    tabs.forEach(function(tab) {
      bkg.console.log('curr sd');
      bkg.console.log(tab.id);
      getNextAudibleTab(windowId, tab.id, tab.audible);
      return;
    });
  });
};

function getNextAudibleTab(windowId, tabId, currTabAudible) {
  bkg.console.log('search: ' + tabId);
  bkg.console.log('search: ' + windowId);
  chrome.tabs.query({audible: true}, function(tabs) {
    if (currTabAudible) {
      // else find it and then go to next
      // if at end of arr, go to first
      bkg.console.log("hey");
      var foundTab = false;
      bkg.console.log(tabs);
      tabs.forEach(function(tab, index) {
        bkg.console.log("loop: " + index);
        bkg.console.log(tab.id + " : " + tabId);
        bkg.console.log(tab.windowId);
        if (foundTab) {
          foundTab = false;
          bkg.console.log("whtg");
          focusTab(tab);
        }
        if (tab.windowId == windowId && tab.id == tabId) {
          bkg.console.log('fuck me ');
          foundTab = true;
          if (index == tabs.length - 1) {
            focusTab(tabs[0]);
          }
        }
      });
    } else {
      if (tabs.length > 0) {
        bkg.console.log(tabs[0].windowId);  // chose the first one
        focusTab(tabs[0]);
      }
    }
  });
};

function focusTab(tab) {
  chrome.windows.update(tab.windowId, {focused: true}, function(window) {});  // go to window
  chrome.tabs.update(tab.id, {active: true}, function (newtab) {});  // set tab active
};

/*
Management
*/
let removeRedundentTabs = document.getElementById('removeRedundentTabs');

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
      if (redundentTabs.hasOwnProperty(redundentUrl)
          && redundentTabs[redundentUrl].length > 0) {
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
