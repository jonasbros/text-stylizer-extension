// Content script to handle text selection and show StyleContextMenu
declare const chrome: any;

console.log('SPX6900 Text Stylizer content script loaded');

// Listen for toggle messages from popup
chrome.runtime.onMessage.addListener((message: any, _sender: any, sendResponse: any) => {
  if (message.type === 'TOGGLE_MENU') {
    isMenuEnabled = message.enabled;
    if (!isMenuEnabled) {
      removeMenu();
    }
    sendResponse({ success: true });
  }
});

interface Position {
  x: number;
  y: number;
}

interface StyleOption {
  name: string;
  key: string;
  preview: string;
}

let menuContainer: HTMLDivElement | null = null;
let currentElement: HTMLInputElement | HTMLTextAreaElement | HTMLElement | null = null;
let currentSelectionStart: number | null = null;
let currentSelectionEnd: number | null = null;
let currentRange: Range | null = null;
let isMenuEnabled: boolean = true;
let debounceTimer: number | null = null;

// Create and inject the StyleContextMenu
function createMenu(selectedText: string, _position: Position): void {
  // Remove existing menu
  removeMenu();
  
  // Create container
  menuContainer = document.createElement('div');
  menuContainer.id = 'spx6900-text-menu';
  // Calculate position based on selection
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const menuWidth = 300;
  const menuHeight = 350;
  
  let left = _position.x + 10;
  let top = _position.y + 10;
  
  // Adjust if menu would go off-screen
  if (left + menuWidth > viewportWidth) {
    left = _position.x - menuWidth - 10;
  }
  if (top + menuHeight > viewportHeight) {
    top = _position.y - menuHeight - 10;
  }
  
  // Ensure menu stays within viewport
  left = Math.max(10, Math.min(left, viewportWidth - menuWidth - 10));
  top = Math.max(10, Math.min(top, viewportHeight - menuHeight - 10));

  menuContainer.style.cssText = `
    position: fixed;
    left: ${left}px;
    top: ${top}px;
    z-index: 999999;
    background: #0f172a;
    border: 1px solid #fbbf24;
    border-radius: 8px;
    padding: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    font-family: system-ui, -apple-system, sans-serif;
    display: flex;
    flex-direction: column;
    gap: 2px;
    width: 300px;
    max-height: 350px;
    overflow-y: auto;
  `;
  
  // Add title header
  const titleHeader = document.createElement('div');
  titleHeader.textContent = 'Fancy Text SPX6900';
  titleHeader.style.cssText = `
    font-size: 11px;
    color: #9ca3af;
    text-align: center;
    padding: 4px 8px;
    border-bottom: 1px solid #374151;
    margin-bottom: 2px;
    font-weight: 500;
    letter-spacing: 0.5px;
  `;
  menuContainer.appendChild(titleHeader);

  // Add undo hint
  const undoHint = document.createElement('div');
  undoHint.textContent = 'Ctrl+Z to undo';
  undoHint.style.cssText = `
    font-size: 9px;
    color: #6b7280;
    text-align: center;
    padding: 2px 8px 4px 8px;
    border-bottom: 1px solid #374151;
    margin-bottom: 4px;
    font-style: italic;
  `;
  menuContainer.appendChild(undoHint);
  
  // Style options with preview text
  const styles: StyleOption[] = [
    { name: 'Bold', key: 'bold', preview: '𝐁𝐨𝐥𝐝' },
    { name: 'Bold Italic', key: 'boldItalic', preview: '𝑩𝒐𝒍𝒅 𝑰𝒕𝒂𝒍𝒊𝒸' },
    { name: 'Script', key: 'script', preview: '𝓢𝓬𝓻𝓲𝓹𝓽' },
    { name: 'Bold Script', key: 'boldScript', preview: '𝓑𝓸𝓵𝓭 𝓢𝓬𝓻𝓲𝓹𝓽' },
    { name: 'Fraktur', key: 'fraktur', preview: '𝔉𝔯𝔞𝔨𝔱𝔲𝔯' },
    { name: 'Bold Fraktur', key: 'boldFraktur', preview: '𝕱𝖗𝖆𝖐𝖙𝖚𝖗' },
    { name: 'Double Struck', key: 'doubleStruck', preview: '𝔻𝕠𝕦𝕓𝕝𝕖' },
    { name: 'Monospace', key: 'monospace', preview: '𝙼𝚘𝚗𝚘𝚜𝚙𝚊𝚌𝚎' },
    { name: 'Fullwidth', key: 'fullwidth', preview: 'Ｆｕｌｌｗｉｄｔｈ' },
    { name: 'Circled', key: 'circled', preview: 'Ⓒⓘⓡⓒⓛⓔ' },
    { name: 'Negative Circled', key: 'negativeCircled', preview: '🅝🅔🅖🅐🅣🅘🅥🅔' },
    { name: 'Squared', key: 'squared', preview: '🅂🅀🅄🄰🅁🄴🄳' },
    { name: 'Negative Squared', key: 'negativeSquared', preview: '🅽🅴🅶🅰🆃🅸🆅🅴' },
    { name: 'Tiny Caps', key: 'tinycaps', preview: 'ᴛɪɴʏ ᴄᴀᴘs' },
    { name: 'Old English', key: 'oldEnglish', preview: '𝔒𝔩𝔡 𝔈𝔫𝔤𝔩𝔦𝔰𝔥' },
    { name: 'Upside Down', key: 'upsideDown', preview: 'uʍop ǝpᴉsd∩' },
    { name: 'Zalgo', key: 'zalgo', preview: 'Z̴a̷l̸g̵o̶' }
  ];
  
  styles.forEach(style => {
    const button = document.createElement('div');
    button.style.cssText = `
      background: #374151;
      color: #fbbf24;
      border: 1px solid #6b7280;
      border-radius: 4px;
      padding: 8px 12px;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      justify-content: space-between;
      align-items: center;
      min-height: 32px;
    `;
    
    // Create name and preview elements
    const nameSpan = document.createElement('span');
    nameSpan.textContent = style.name;
    nameSpan.style.cssText = `
      font-size: 12px;
      color: #d1d5db;
      font-weight: 500;
    `;
    
    const previewSpan = document.createElement('span');
    previewSpan.textContent = style.preview;
    previewSpan.style.cssText = `
      font-size: 14px;
      color: #fbbf24;
      font-weight: bold;
    `;
    
    button.appendChild(nameSpan);
    button.appendChild(previewSpan);
    
    button.addEventListener('mouseenter', () => {
      button.style.background = '#4b5563';
      button.style.borderColor = '#fbbf24';
    });
    
    button.addEventListener('mouseleave', () => {
      button.style.background = '#374151';
      button.style.borderColor = '#6b7280';
    });
    
    button.addEventListener('click', () => {
      applyStyle(selectedText, style.key);
    });
    
    menuContainer!.appendChild(button);
  });
  
  document.body.appendChild(menuContainer);
}

function removeMenu(): void {
  if (menuContainer) {
    menuContainer.remove();
    menuContainer = null;
  }
}

function applyStyle(text: string, styleKey: string): void {
  // Send message to background script or popup to apply style
  chrome.runtime.sendMessage({
    type: 'APPLY_STYLE',
    text: text,
    style: styleKey
  }, (response: any) => {
    if (response && response.styledText) {
      replaceSelectedText(response.styledText);
    }
  });
  removeMenu();
}

function replaceSelectedText(styledText: string): void {
  console.log('Replacing text:', { styledText, currentElement, currentSelectionStart, currentSelectionEnd });
  
  // Use stored element and selection
  if (currentElement) {
    currentElement.focus();
    
    // Handle contenteditable elements
    if (currentElement.contentEditable === 'true' && currentRange) {
      const selection = window.getSelection();
      if (selection && currentRange) {
        // Restore the stored range
        selection.removeAllRanges();
        selection.addRange(currentRange);
        
        // Get selected text before deleting
        const selectedTextContent = currentRange.toString();
        
        // Check if the selected text contains mentions or hashtags
        const containsMention = selectedTextContent.includes('@');
        const containsHashtag = selectedTextContent.includes('#');
        
        // For social media, try to preserve link structure
        if (containsMention || containsHashtag) {
          // Find if selection is within a link or mention element
          const parentLink = currentRange.commonAncestorContainer.nodeType === Node.ELEMENT_NODE 
            ? (currentRange.commonAncestorContainer as Element).closest('a, [data-mention], [data-hashtag]')
            : (currentRange.commonAncestorContainer.parentElement?.closest('a, [data-mention], [data-hashtag]'));
            
          if (parentLink) {
            // Replace the entire link/mention element
            const textNode = document.createTextNode(styledText);
            parentLink.parentNode?.replaceChild(textNode, parentLink);
            
            // Position cursor after replacement
            const newRange = document.createRange();
            newRange.setStartAfter(textNode);
            newRange.setEndAfter(textNode);
            selection.removeAllRanges();
            selection.addRange(newRange);
          } else {
            // Standard replacement: use execCommand for undo support
            try {
              // Try using execCommand for better undo support
              if (document.execCommand && document.execCommand('insertText', false, styledText)) {
                // execCommand worked, no need for manual DOM manipulation
              } else {
                throw new Error('execCommand not supported');
              }
            } catch (e) {
              // Fallback to manual DOM manipulation
              currentRange.deleteContents();
              const textNode = document.createTextNode(styledText);
              currentRange.insertNode(textNode);
              
              // Position cursor after replacement
              currentRange.setStartAfter(textNode);
              currentRange.setEndAfter(textNode);
              selection.removeAllRanges();
              selection.addRange(currentRange);
            }
          }
        } else {
          // Standard text replacement: use execCommand for undo support
          try {
            // Try using execCommand for better undo support
            if (document.execCommand && document.execCommand('insertText', false, styledText)) {
              // execCommand worked, no need for manual DOM manipulation
            } else {
              throw new Error('execCommand not supported');
            }
          } catch (e) {
            // Fallback to manual DOM manipulation
            currentRange.deleteContents();
            const textNode = document.createTextNode(styledText);
            currentRange.insertNode(textNode);
            
            // Position cursor after replacement
            currentRange.setStartAfter(textNode);
            currentRange.setEndAfter(textNode);
            selection.removeAllRanges();
            selection.addRange(currentRange);
          }
        }
        
        // Trigger input events for social media reactivity
        currentElement.dispatchEvent(new Event('input', { bubbles: true }));
        currentElement.dispatchEvent(new Event('keyup', { bubbles: true }));
        
        // Additional events for specific platforms
        const hostname = window.location.hostname;
        if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
          // Twitter needs these events for character counting
          currentElement.dispatchEvent(new Event('paste', { bubbles: true }));
        }
      }
    } 
    // Handle input/textarea elements
    else if (currentElement instanceof HTMLInputElement || currentElement instanceof HTMLTextAreaElement && 
             currentSelectionStart !== null && currentSelectionEnd !== null) {
      // Restore the selection
      currentElement.selectionStart = currentSelectionStart;
      currentElement.selectionEnd = currentSelectionEnd;
      
      // Use execCommand to maintain undo history
      if (document.execCommand) {
        document.execCommand('insertText', false, styledText);
      } else {
        // Fallback for browsers that don't support execCommand
        if (currentSelectionStart !== null && currentSelectionEnd !== null) {
          const value = currentElement.value;
          const newValue = value.substring(0, currentSelectionStart) + styledText + value.substring(currentSelectionEnd);
          currentElement.value = newValue;
          currentElement.selectionStart = currentSelectionStart;
          currentElement.selectionEnd = currentSelectionStart + styledText.length;
          
          // Trigger input event
          currentElement.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }
    }
  }
}

// Function to handle text selection (used by both mouse and keyboard events)
function handleTextSelection() {
  console.log('Text selection detected (debounced)');
  const activeElement = document.activeElement;
  let selectedText = '';
  let rect: DOMRect | null = null;
  
  // Check for contenteditable elements or input/textarea
  if (isMenuEnabled && activeElement) {
    // Handle contenteditable elements
    if ((activeElement as HTMLElement).contentEditable === 'true' || isTargetElement(activeElement)) {
      const selection = window.getSelection();
      if (selection && selection.toString().trim()) {
        selectedText = selection.toString().trim();
        const range = selection.getRangeAt(0);
        rect = range.getBoundingClientRect();
        
        // Store current selection for contenteditable
        currentElement = activeElement as HTMLElement;
        currentRange = range.cloneRange(); // Store the actual range
        currentSelectionStart = 0; // Not used for contenteditable
        currentSelectionEnd = 0; // Not used for contenteditable
        
        if (selectedText.length > 0 && rect) {
          const position: Position = { x: rect.right, y: rect.top };
          createMenu(selectedText, position);
        } else {
          removeMenu();
        }
      } else {
        removeMenu();
      }
    }
    // Handle input/textarea elements
    else if (activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement) {
      const start = activeElement.selectionStart;
      const end = activeElement.selectionEnd;
      
      if (start !== null && end !== null && start !== end) {
        selectedText = activeElement.value.substring(start, end);
        rect = activeElement.getBoundingClientRect();
        
        // Store current selection for later use
        currentElement = activeElement;
        currentSelectionStart = start;
        currentSelectionEnd = end;
        currentRange = null; // Clear range for input/textarea
        
        if (selectedText && selectedText.length > 0 && rect) {
          // For input/textarea, position menu near the bottom-right of the element
          // since we can't get exact cursor position in these elements
          const position: Position = { 
            x: rect.left + rect.width - 20, 
            y: rect.bottom + 5 
          };
          createMenu(selectedText, position);
        } else {
          removeMenu();
        }
      } else {
        removeMenu();
        currentElement = null;
        currentSelectionStart = null;
        currentSelectionEnd = null;
        currentRange = null;
      }
    } else {
      removeMenu();
    }
  } else {
    removeMenu();
  }
}

// Check if element is a target for text styling (social media specific)
function isTargetElement(element: Element): boolean {
  const hostname = window.location.hostname;
  
  // YouTube comment boxes
  if (hostname.includes('youtube.com')) {
    return element.matches('#contenteditable-root, [contenteditable="true"]');
  }
  
  // Facebook/Instagram
  if (hostname.includes('facebook.com') || hostname.includes('instagram.com')) {
    return element.matches('[contenteditable="true"], [role="textbox"]');
  }
  
  // Twitter/X
  if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
    return element.matches('[contenteditable="true"], [data-testid*="tweet"], [role="textbox"]');
  }
  
  // TikTok
  if (hostname.includes('tiktok.com')) {
    return element.matches('[contenteditable="true"], [data-e2e*="comment"]');
  }
  
  // Generic contenteditable support for other sites
  return (element as HTMLElement).contentEditable === 'true';
}

// Handle text selection with debounce (mouse)
document.addEventListener('mouseup', () => {
  // Clear existing timer
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
  
  // Set new timer with 300ms delay
  debounceTimer = window.setTimeout(handleTextSelection, 300);
});

// Handle Ctrl+A and other keyboard selections
document.addEventListener('keydown', (e: KeyboardEvent) => {
  if (e.ctrlKey && e.key === 'a') {
    const activeElement = document.activeElement;
    
    // Handle input/textarea elements
    if (isMenuEnabled && activeElement && (activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement)) {
      // Clear existing timer
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      
      // Set timer to check selection after Ctrl+A completes
      debounceTimer = window.setTimeout(() => {
        // Double check that text is actually selected after Ctrl+A
        const start = activeElement.selectionStart;
        const end = activeElement.selectionEnd;
        const value = activeElement.value;
        
        if (start === 0 && end === value.length && value.length > 0) {
          handleTextSelection();
        }
      }, 50);
    }
    // Handle contenteditable elements
    else if (isMenuEnabled && activeElement && ((activeElement as HTMLElement).contentEditable === 'true' || isTargetElement(activeElement))) {
      // Clear existing timer
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      
      // Set timer to check selection after Ctrl+A completes
      debounceTimer = window.setTimeout(() => {
        const selection = window.getSelection();
        if (selection && selection.toString().trim()) {
          handleTextSelection();
        }
      }, 50);
    }
  }
});

// Add selection change listener for contenteditable elements
document.addEventListener('selectionchange', () => {
  // Clear existing timer
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
  
  // Set new timer with delay
  debounceTimer = window.setTimeout(() => {
    const activeElement = document.activeElement;
    if (isMenuEnabled && activeElement && ((activeElement as HTMLElement).contentEditable === 'true' || isTargetElement(activeElement))) {
      const selection = window.getSelection();
      if (selection && selection.toString().trim()) {
        handleTextSelection();
      } else {
        removeMenu();
      }
    }
  }, 300);
});

// Hide menu when clicking elsewhere
document.addEventListener('mousedown', (e: MouseEvent) => {
  if (menuContainer && !menuContainer.contains(e.target as Node)) {
    removeMenu();
  }
});

// Hide menu when scrolling
document.addEventListener('scroll', () => {
  removeMenu();
});

// Mutation observer to handle dynamically loaded content
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    // Check if new nodes were added
    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
      mutation.addedNodes.forEach((node) => {
        // Only process element nodes
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as Element;
          
          // Check if the new element or its children contain target elements
          const targetElements = element.querySelectorAll('[contenteditable="true"], input, textarea, [role="textbox"]');
          
          // Also check if the element itself is a target
          if ((element as HTMLElement).contentEditable === 'true' || 
              element.matches('input, textarea, [role="textbox"]') ||
              isTargetElement(element)) {
            // Add a small delay to ensure element is fully initialized
            setTimeout(() => {
              console.log('New interactive element detected:', element);
            }, 100);
          }
          
          // Log detected target elements for debugging
          if (targetElements.length > 0) {
            console.log(`SPX6900: Detected ${targetElements.length} new text input elements`);
          }
        }
      });
    }
  });
});

// Start observing the document for changes
observer.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: ['contenteditable', 'role']
});

// Also observe for attribute changes on existing elements
const attributeObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'attributes') {
      const element = mutation.target as Element;
      
      // Check if contenteditable or role attribute changed
      if (mutation.attributeName === 'contenteditable' || mutation.attributeName === 'role') {
        if ((element as HTMLElement).contentEditable === 'true' || element.getAttribute('role') === 'textbox') {
          console.log('SPX6900: Element became interactive:', element);
        }
      }
    }
  });
});

// Observe attribute changes on the entire document
attributeObserver.observe(document.documentElement, {
  attributes: true,
  subtree: true,
  attributeFilter: ['contenteditable', 'role']
});