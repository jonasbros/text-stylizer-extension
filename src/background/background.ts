// Background script to handle messages between content script and popup
import fancyText from '../utils/fancy-text';

declare const chrome: any;

chrome.runtime.onMessage.addListener((message: any, _sender: any, sendResponse: any) => {
  if (message.type === 'APPLY_STYLE') {
    try {
      const styledText = fancyText(message.text, message.style);
      sendResponse({ styledText });
    } catch (error) {
      console.error('Error applying style:', error);
      sendResponse({ styledText: message.text });
    }
    return true; // Keep message channel open for async response
  }
});

// Handle extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('SPX6900 Text Stylizer Extension installed');
});