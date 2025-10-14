import fancyText from '../utils/fancy-text';

declare const chrome: any;

export default function SelectionListener() {
    document.addEventListener('selectionchange', () => {
        const selection = window.getSelection()!;
        const selectedText = selection.toString().trim();
    
        if (selectedText) {
          console.log('Selected text:', fancyText(selectedText, "fraktur"));
          chrome.runtime.sendMessage({
            type: 'TEXT_SELECTED',
            text: selectedText
          });
        }
    });
}