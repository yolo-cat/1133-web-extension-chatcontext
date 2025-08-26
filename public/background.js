// background.js - Service Worker for Chrome Extension
console.log('TodoList Extension: Background script loaded');

// 儲存待處理的待辦事項
let pendingTodos = [];

// 處理來自content script的訊息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('TodoList Extension: Background received message:', message);
  console.log('TodoList Extension: From sender:', sender);

  if (message.action === 'addTodo' && message.text) {
    console.log('TodoList Extension: Processing addTodo in background for:', message.text);

    // 嘗試直接轉發到所有擴展頁面（包括popup）
    try {
      // 如果popup是開啟的，直接發送訊息
      chrome.runtime.sendMessage({
        action: 'addTodo',
        text: message.text,
        fromBackground: true
      }).then(() => {
        console.log('TodoList Extension: Message forwarded to popup successfully');
        sendResponse({ success: true, source: 'background-forwarded' });
      }).catch((error) => {
        console.log('TodoList Extension: No popup to receive message, storing for later');

        // 如果popup沒有開啟，儲存到本地storage
        chrome.storage.local.get(['pendingTodos'], (result) => {
          const existingPending = result.pendingTodos || [];
          existingPending.push({
            text: message.text,
            timestamp: Date.now(),
            processed: false
          });

          chrome.storage.local.set({ pendingTodos: existingPending }, () => {
            console.log('TodoList Extension: Todo saved to pending list');
            sendResponse({ success: true, source: 'background-stored' });
          });
        });
      });
    } catch (error) {
      console.error('TodoList Extension: Error processing message:', error);
      sendResponse({ success: false, error: error.message });
    }

    return true; // 保持訊息通道開啟
  }

  return false;
});

// 監聽擴展安裝事件
chrome.runtime.onInstalled.addListener((details) => {
  console.log('TodoList Extension: Extension installed/updated:', details.reason);

  // 初始化storage
  chrome.storage.local.set({
    extensionVersion: chrome.runtime.getManifest().version,
    installDate: new Date().toISOString(),
    pendingTodos: []
  });
});

// 監聽擴展啟動事件
chrome.runtime.onStartup.addListener(() => {
  console.log('TodoList Extension: Extension started');
});

// 處理storage變化（減少日誌輸出）
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local') {
    // 只記錄重要變化，避免過多日誌
    if (changes.pendingTodos) {
      console.log('TodoList Extension: Pending todos changed:', changes.pendingTodos);
    }
  }
});

// 保持service worker活躍（減少頻率）
const keepAlive = () => {
  // 每60秒執行一次，減少日誌噪音
  setTimeout(() => {
    console.log('TodoList Extension: Service worker keepalive');
    keepAlive();
  }, 60000);
};

// 啟動keepalive
keepAlive();

// 點擊擴展圖標時，注入 floatingBall.js 到當前 tab
// （已改為 content_scripts 自動注入，這段可移除避免重複注入）
// chrome.action.onClicked.addListener((tab) => {
//   if (!tab.id) return;
//   chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     files: ['floatingBall.js']
//   }, () => {
//     if (chrome.runtime.lastError) {
//       console.error('注入 floatingBall.js 失敗:', chrome.runtime.lastError.message);
//     } else {
//       console.log('已注入 floatingBall.js 到 tab', tab.id);
//     }
//   });
// });
