// Content script to handle text selection and show StyleContextMenu
declare const chrome: any;

console.log('SPX6900 Text Stylizer content script loaded');

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
let currentElement: HTMLInputElement | HTMLTextAreaElement | null = null;
let currentSelectionStart: number | null = null;
let currentSelectionEnd: number | null = null;

// Create and inject the StyleContextMenu
function createMenu(selectedText: string, position: Position): void {
  // Remove existing menu
  removeMenu();
  
  // Create container
  menuContainer = document.createElement('div');
  menuContainer.id = 'spx6900-text-menu';
  menuContainer.style.cssText = `
    position: fixed;
    top: ${position.y}px;
    left: ${position.x}px;
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
    width: 250px;
    max-height: 300px;
    overflow-y: auto;
  `;
  
  // Style options with preview text
  const styles: StyleOption[] = [
    { name: 'Bold', key: 'bold', preview: '𝐁𝐨𝐥𝐝' },
    { name: 'Italic', key: 'italic', preview: '𝐼𝑡𝑎𝑙𝑖𝑐' },
    { name: 'Bold Italic', key: 'boldItalic', preview: '𝑩𝒐𝒍𝒅 𝑰𝒕𝒂𝒍𝒊𝒄' },
    { name: 'Script', key: 'script', preview: '𝓢𝓬𝓻𝓲𝓹𝓽' },
    { name: 'Fraktur', key: 'fraktur', preview: '𝔉𝔯𝔞𝔨𝔱𝔲𝔯' },
    { name: 'Double Struck', key: 'doubleStruck', preview: '𝔻𝕠𝕦𝕓𝕝𝕖' },
    { name: 'Monospace', key: 'monospace', preview: '𝙼𝚘𝚗𝚘𝚜𝚙𝚊𝚌𝚎' },
    { name: 'Circled', key: 'circled', preview: 'Ⓒⓘⓡⓒⓛⓔ' },
    { name: 'Tiny Caps', key: 'tinycaps', preview: 'ᴛɪɴʏ ᴄᴀᴘs' },
    { name: 'Fullwidth', key: 'fullwidth', preview: 'Ｆｕｌｌｗｉｄｔｈ' }
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
  if (currentElement && currentSelectionStart !== null && currentSelectionEnd !== null) {
    currentElement.focus();
    
    // Restore the selection
    currentElement.selectionStart = currentSelectionStart;
    currentElement.selectionEnd = currentSelectionEnd;
    
    // Use execCommand to maintain undo history
    if (document.execCommand) {
      document.execCommand('insertText', false, styledText);
    } else {
      // Fallback for browsers that don't support execCommand
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

// Handle text selection
document.addEventListener('mouseup', () => {
  setTimeout(() => {
    console.log('Mouse up detected');
    const activeElement = document.activeElement;
    let selectedText = '';
    let rect: DOMRect | null = null;
    
    // Only work with input/textarea elements
    if (activeElement && (activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement)) {
      const start = activeElement.selectionStart;
      const end = activeElement.selectionEnd;
      
      if (start !== null && end !== null && start !== end) {
        selectedText = activeElement.value.substring(start, end);
        rect = activeElement.getBoundingClientRect();
        
        // Store current selection for later use
        currentElement = activeElement;
        currentSelectionStart = start;
        currentSelectionEnd = end;
        
        if (selectedText && selectedText.length > 0 && rect) {
          const position: Position = {
            x: Math.max(10, rect.left + window.scrollX),
            y: Math.max(10, rect.top + window.scrollY - 50)
          };
          
          // Ensure menu doesn't go off screen
          if (position.x + 300 > window.innerWidth) {
            position.x = window.innerWidth - 310;
          }
          
          createMenu(selectedText, position);
        } else {
          removeMenu();
        }
      } else {
        removeMenu();
        currentElement = null;
        currentSelectionStart = null;
        currentSelectionEnd = null;
      }
    } else {
      removeMenu();
    }
  }, 10);
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