// // floatingBall.js
// (function() {
//   if (document.getElementById('todolist-floating-ball')) return;
//   const ball = document.createElement('div');
//   ball.id = 'todolist-floating-ball';
//   ball.style.cssText = `
//     position: fixed;
//     bottom: 40px;
//     right: 40px;
//     width: 60px;
//     height: 60px;
//     background: rgba(80,80,80,0.6);
//     border-radius: 50%;
//     box-shadow: 0 2px 8px rgba(0,0,0,0.18);
//     z-index: 999999;
//     cursor: pointer;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     transition: box-shadow 0.2s;
//     user-select: none;
//   `;
//   ball.title = 'TodoList 懸浮球';
//   ball.innerHTML = `
//     <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 403.3 403.3" style="width:100%;height:100%;display:block;" xml:space="preserve">
//       <rect x="-52.2" y="-52.2" display="none" stroke="#FFFFFF" stroke-miterlimit="10" width="507.7" height="507.7"></rect>
//       <g id="Orb_1_"><circle fill="#00FFFF" cx="201.6" cy="201.6" r="109.9"></circle></g>
//       <g id="Orb"><radialGradient id="SVGID_1_" cx="201.6483" cy="201.6483" r="94.5055" gradientUnits="userSpaceOnUse"><stop offset="0" style="stop-color:#FFFFFF"></stop><stop offset="0" style="stop-color:#F7F7F7"></stop><stop offset="1" style="stop-color:#000000;stop-opacity:0"></stop></radialGradient><circle fill="url(#SVGID_1_)" cx="201.6" cy="201.6" r="94.5"></circle></g>
//       <g id="ring1"><path fill="#C5FFFD" d="M371.9,201.7c0,0,0,1-0.1,3c-0.1,2-0.4,4.9-1.2,8.6c-0.8,3.7-2.3,8.2-4.6,13.2c-2.3,5-5.5,10.5-9.4,16.4c-3.9,5.9-8.6,12.2-13.6,19.2c-2.5,3.5-5,7.1-7.4,11c-2.4,3.9-4.7,8.1-6.8,12.5c-4.3,8.9-8.1,18.6-12.8,28.7c-2.4,5-5,10.2-8.1,15.2c-3.1,5-6.8,9.9-11.4,14.2c-2.3,2.1-4.8,4.1-7.5,5.8l-1,0.6c-0.2,0.1-0.3,0.2-0.6,0.3l-0.5,0.3c-0.7,0.4-1.3,0.8-2.1,1.1c-0.7,0.4-1.5,0.7-2.2,1.1c-0.8,0.3-1.5,0.6-2.3,0.9c-6.1,2.3-12.7,3.4-19.4,3.8c-6.7,0.4-13.4,0.1-20.2-0.5c-6.8-0.6-13.6-1.3-20.5-2c-6.9-0.7-13.9-1.2-21-1.1c-7,0.1-14.2,0.7-21.5,1.3c-7.3,0.7-14.7,1.4-22.2,1.7c-7.5,0.3-15.2,0.2-22.8-1.3c-7.6-1.4-15-4.4-21.3-9.2c-6.3-4.8-11.4-10.9-15.6-17.6c-8.4-13.4-13.7-28.4-20.7-42.7c-1.8-3.6-3.6-7.1-5.7-10.5c-2.1-3.4-4.3-6.7-6.6-10c-4.6-6.5-9.6-12.9-14.3-19.5c-4.7-6.6-9.1-13.4-12.5-20.9c-3.4-7.4-5.6-15.5-5.6-23.9c-0.1-8.2,2-16.5,5.3-24c3.3-7.5,7.7-14.5,12.3-21.2c4.6-6.7,9.5-13.1,14.1-19.6c2.3-3.3,4.5-6.6,6.5-10c2-3.4,3.8-6.9,5.5-10.5c6.9-14.2,12.2-29.3,20.7-42.8c4.3-6.7,9.4-13,15.9-17.8c0.8-0.6,1.6-1.2,2.5-1.7c0.9-0.5,1.7-1.1,2.6-1.6c0.9-0.5,1.6-0.9,2.6-1.4c0.9-0.4,1.8-0.9,2.8-1.3c3.7-1.5,7.5-2.6,11.4-3.4c7.7-1.4,15.5-1.5,23-1.2c7.5,0.4,14.9,1.2,22.2,1.9c7.3,0.7,14.4,1.4,21.5,1.5l2.6,0l2.7,0c1.7,0,3.5-0.1,5.2-0.2c3.5-0.2,7-0.5,10.4-0.8c13.8-1.2,27.4-3.1,40.8-2.3c6.7,0.4,13.3,1.6,19.4,3.9c6.1,2.3,11.6,5.9,16.2,10.2c4.6,4.3,8.3,9.2,11.4,14.2c3.1,5,5.7,10.1,8.1,15.2c4.7,10.1,8.5,19.9,12.8,28.7c2.1,4.4,4.4,8.6,6.8,12.5c2.4,3.9,5,7.5,7.4,11c4.9,7,9.7,13.3,13.6,19.2c4,5.9,7.1,11.4,9.4,16.4c2.3,5,3.7,9.5,4.6,13.2c0.8,3.7,1.1,6.6,1.2,8.6C371.9,200.6,371.9,201.6,371.9,201.7L371.9,201.7z"/></g>
//       <g id="ring2"><path fill="#C5FFFD" d="M328.4,328.7c0,0-0.8,0.7-2.3,2.2c-1.6,1.4-3.9,3.3-7.3,5.5c-3.4,2.1-7.8,4.4-13.3,6.4c-5.5,2-12,3.7-19.3,5.2c-7.3,1.4-15.6,2.6-24.4,4c-4.4,0.7-9.1,1.5-13.8,2.6c-4.7,1.1-9.5,2.5-14.4,4.2c-9.8,3.4-20,7.8-31,11.8c-5.5,2-11.3,3.8-17.3,5.2c-6,1.3-12.4,2.2-19,2c-3.3-0.1-6.6-0.5-9.8-1.3l-1.2-0.3c-0.2-0.1-0.4-0.1-0.6-0.2l-0.6-0.2c-0.8-0.2-1.6-0.4-2.4-0.7c-0.8-0.3-1.6-0.6-2.4-0.9c-0.8-0.3-1.6-0.7-2.4-1c-6.2-2.8-11.9-6.9-17.2-11.5c-5.2-4.6-10-9.9-14.6-15.4c-4.6-5.5-9.1-11.2-13.8-16.8c-4.7-5.6-9.5-11.3-14.9-16.5c-5.3-5.2-11.2-10.1-17.1-15c-5.9-4.9-12-9.9-17.8-15.2c-5.8-5.4-11.4-11.2-16-17.9c-4.5-6.7-7.9-14.4-9-22.6c-1.1-8.2-0.3-16.5,1.5-24.6c3.7-16.2,11-31.4,16.4-47.2c1.4-4,2.6-8,3.6-12.1c1-4.1,1.8-8.2,2.5-12.4c1.4-8.3,2.5-16.8,3.9-25.2c1.4-8.4,3.3-16.8,6.3-24.9c3-8,7.5-15.7,13.6-21.9c6.1-6.1,13.8-10.7,21.8-13.8c8.1-3.1,16.5-5,24.9-6.5c8.4-1.5,16.8-2.6,25.2-4c4.2-0.7,8.3-1.5,12.3-2.6c4-1,8-2.3,12-3.6c15.8-5.5,31-12.7,47.4-16.3c8.1-1.8,16.6-2.6,24.9-1.4c1,0.2,2.1,0.4,3.1,0.5c1,0.3,2,0.5,3.1,0.7c1,0.3,1.9,0.5,2.9,0.9c1,0.4,2,0.7,3,1.1c3.8,1.6,7.5,3.6,10.8,5.9c6.8,4.7,12.6,10.3,17.9,16.2c5.3,5.9,10.2,12,15.1,18c4.9,6,9.7,11.8,14.9,17.2c5.2,5.4,10.7,10.2,16.3,14.9c11.2,9.4,22.7,18.1,32,28.6c4.6,5.3,8.7,11,11.5,17.2c2.8,6.2,4.2,12.9,4.4,19.5c0.2,6.6-0.7,12.9-2,19c-1.4,6-3.3,11.8-5.3,17.3c-4,11-8.5,21.2-11.8,31c-1.7,4.9-3.1,9.7-4.2,14.4c-1.1,4.7-1.9,9.3-2.7,13.8c-1.5,8.9-2.7,17.1-4.1,24.4c-1.4,7.3-3.2,13.8-5.2,19.3c-2,5.5-4.3,9.9-6.5,13.3c-2.2,3.4-4.1,5.8-5.5,7.3C329.1,328,328.4,328.7,328.4,328.7z"/></g>
//       <g id="ring3"><path fill="#C5FFFD" d="M328.7,74.9c0,0,0.7,0.8,2.2,2.3c1.4,1.6,3.3,3.9,5.5,7.3c2.1,3.4,4.4,7.8,6.4,13.3c2,5.5,3.7,12,5.2,19.3c1.4,7.3,2.6,15.6,4,24.4c0.7,4.4,1.5,9.1,2.6,13.8c1.1,4.7,2.5,9.5,4.2,14.4c3.4,9.8,7.8,20,11.8,31c2,5.5,3.8,11.3,5.2,17.3c1.3,6,2.2,12.4,2,19c-0.1,3.3-0.5,6.6-1.3,9.8l-0.3,1.2c-0.1,0.2-0.1,0.4-0.2,0.6l-0.2,0.6c-0.2,0.8-0.4,1.6-0.7,2.4c-0.3,0.8-0.6,1.6-0.9,2.4c-0.3,0.8-0.7,1.6-1,2.4c-2.8,6.2-6.9,11.9-11.5,17.2c-4.6,5.2-9.9,10-15.4,14.6c-5.5,4.6-11.2,9.1-16.8,13.8c-5.6,4.7-11.3,9.5-16.5,14.9c-5.2,5.3-10.1,11.2-15,17.1c-4.9,5.9-9.9,12-15.2,17.8c-5.4,5.8-11.2,11.4-17.9,16c-6.7,4.5-14.4,7.9-22.6,9c-8.2,1.1-16.5,0.3-24.6-1.5c-16.2-3.7-31.4-11-47.2-16.4c-4-1.4-8-2.6-12.1-3.6c-4.1-1-8.2-1.8-12.4-2.5c-8.3-1.4-16.8-2.5-25.2-3.9c-8.4-1.4-16.8-3.3-24.9-6.3c-8-3-15.7-7.5-21.9-13.6c-6.2-6.1-10.7-13.8-13.8-21.8c-3.1-8.1-5-16.5-6.5-24.9c-1.5-8.4-2.6-16.8-4-25.2c-0.7-4.2-1.5-8.3-2.6-12.3c-1-4-2.3-8-3.6-12c-5.5-15.8-12.7-31-16.3-47.4c-1.8-8.1-2.6-16.6-1.4-24.9c0.2-1,0.4-2.1,0.5-3.1c0.3-1,0.5-2,0.7-3.1c0.3-1,0.5-1.9,0.9-2.9c0.4-1,0.7-2,1.1-3c1.6-3.8,3.6-7.5,5.9-10.8c4.7-6.8,10.3-12.6,16.2-17.9c5.9-5.3,12-10.2,18-15.1c6-4.9,11.8-9.7,17.2-14.9c5.4-5.2,10.2-10.7,14.9-16.3c9.4-11.2,18.1-22.7,28.6-32c5.3-4.6,11-8.7,17.2-11.5c6.2-2.8,12.9-4.2,19.5-4.4c6.6-0.2,12.9,0.7,19,2c6,1.4,11.8,3.3,17.3,5.3c11,4,21.2,8.5,31,11.8c4.9,1.7,9.7,3.1,14.4,4.2c4.7,1.1,9.3,1.9,13.8,2.7c8.9,1.5,17.1,2.7,24.4,4.1c7.3,1.4,13.8,3.2,19.3,5.2c5.5,2,9.9,4.3,13.3,6.5c3.4,2.2,5.8,4.1,7.3,5.5C328,74.2,328.7,74.9,328.7,74.9z"/></g>
//     </svg>
//   `;
//   ball.addEventListener('mouseenter', () => {
//     ball.style.boxShadow = '0 4px 16px rgba(0,0,0,0.28)';
//   });
//   ball.addEventListener('mouseleave', () => {
//     ball.style.boxShadow = '0 2px 8px rgba(0,0,0,0.18)';
//   });
//   document.body.appendChild(ball);
//
//   // 拖動功能
//   let isDragging = false;
//   let dragOffsetX = 0;
//   let dragOffsetY = 0;
//
//   ball.addEventListener('mousedown', function(e) {
//     if (e.button !== 0) return; // 只允許左鍵
//     isDragging = true;
//     ball.style.transition = 'none';
//     ball.style.zIndex = '1000000';
//     // 取得滑鼠與懸浮球左上角的距離
//     const rect = ball.getBoundingClientRect();
//     dragOffsetX = e.clientX - rect.left;
//     dragOffsetY = e.clientY - rect.top;
//     // 切換為 left/top 定位
//     ball.style.left = rect.left + 'px';
//     ball.style.top = rect.top + 'px';
//     ball.style.right = '';
//     ball.style.bottom = '';
//     document.body.style.userSelect = 'none';
//   });
//   document.addEventListener('mousemove', function(e) {
//     if (!isDragging) return;
//     let x = e.clientX - dragOffsetX;
//     let y = e.clientY - dragOffsetY;
//     // 邊界判斷
//     const minX = 0, minY = 0;
//     const maxX = window.innerWidth - ball.offsetWidth;
//     const maxY = window.innerHeight - ball.offsetHeight;
//     x = Math.max(minX, Math.min(maxX, x));
//     y = Math.max(minY, Math.min(maxY, y));
//     ball.style.left = x + 'px';
//     ball.style.top = y + 'px';
//   });
//   document.addEventListener('mouseup', function() {
//     if (isDragging) {
//       isDragging = false;
//       ball.style.transition = '';
//       ball.style.zIndex = '999999';
//       document.body.style.userSelect = '';
//     }
//   });
//
//   // 防止在特殊頁面插入浮出介面
//   const forbiddenProtocols = ['chrome:', 'chrome-extension:', 'chrome-search:', 'chrome-untrusted:', 'about:', 'edge:', 'file:'];
//   if (forbiddenProtocols.some(proto => window.location.protocol.startsWith(proto))) {
//     return;
//   }
//
//   // 點擊懸浮球顯示/隱藏 App.vue 視圖（iframe）
//   ball.addEventListener('click', function(e) {
//     if (isDragging) return; // 拖動時不觸發點擊
//     const iframeId = 'todolist-app-iframe';
//     let iframe = document.getElementById(iframeId);
//     let wrapper = document.getElementById('todolist-app-iframe-wrapper');
//     if (iframe) {
//       // 已存在則切換顯示/隱藏
//       if (wrapper.style.display === 'none') {
//         wrapper.style.display = 'block';
//       } else {
//         wrapper.style.display = 'none';
//       }
//       return;
//     }
//     // 創建 iframe
//     iframe = document.createElement('iframe');
//     iframe.id = iframeId;
//     iframe.src = chrome.runtime.getURL('index.html');
//     iframe.style.cssText = `
//       position: fixed;
//       bottom: 110px;
//       right: 40px;
//       width: 420px;
//       height: 600px;
//       background: #fff;
//       border: none;
//       border-radius: 16px;
//       box-shadow: 0 8px 32px rgba(0,0,0,0.25);
//       z-index: 1000000;
//       transition: box-shadow 0.2s;
//       overflow: hidden;
//       display: block;
//     `;
//     // CSP/安全策略防護：監聽 onerror/onload
//     let loaded = false;
//     iframe.onload = function() {
//       loaded = true;
//       // 嘗試訪問內容，若被 CSP 阻擋會報錯
//       try {
//         const test = iframe.contentWindow.location.href;
//       } catch (err) {
//         showFloatingBallNotification('⚠️ 此網站安全策略阻擋了擴展操作介面，請換到其他網站使用', 'error');
//         if (wrapper && wrapper.parentNode) wrapper.parentNode.removeChild(wrapper);
//       }
//     };
//     iframe.onerror = function() {
//       showFloatingBallNotification('⚠️ 此網站安全策略阻擋了擴展操作介面，請換到其他網站使用', 'error');
//       if (wrapper && wrapper.parentNode) wrapper.parentNode.removeChild(wrapper);
//     };
//     // 關閉按鈕
//     const closeBtn = document.createElement('div');
//     closeBtn.textContent = '✕';
//     closeBtn.style.cssText = `
//       position: absolute;
//       top: 8px;
//       right: 12px;
//       width: 28px;
//       height: 28px;
//       background: rgba(0,0,0,0.08);
//       color: #333;
//       border-radius: 50%;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       font-size: 18px;
//       cursor: pointer;
//       z-index: 1000001;
//       box-shadow: 0 2px 6px rgba(0,0,0,0.08);
//       user-select: none;
//     `;
//     closeBtn.addEventListener('click', function(e) {
//       e.stopPropagation();
//       wrapper.style.display = 'none';
//     });
//     // 用 wrapper 包住 iframe 及關閉鈕
//     wrapper = document.createElement('div');
//     wrapper.id = 'todolist-app-iframe-wrapper';
//     wrapper.style.cssText = 'position: fixed; bottom: 110px; right: 40px; z-index: 1000000;';
//     wrapper.appendChild(iframe);
//     wrapper.appendChild(closeBtn);
//     document.body.appendChild(wrapper);
//   });
//
//   // 浮出介面安全提示通知
//   function showFloatingBallNotification(message, type = 'info') {
//     // 移除現有的通知（如果有的話）
//     const existingNotification = document.getElementById('todolist-floatingball-notification');
//     if (existingNotification) {
//       existingNotification.remove();
//     }
//     let backgroundColor = '#409EFF';
//     if (type === 'error') backgroundColor = '#F56C6C';
//     if (type === 'success') backgroundColor = '#67C23A';
//     const notification = document.createElement('div');
//     notification.id = 'todolist-floatingball-notification';
//     notification.style.cssText = `
//       position: fixed;
//       top: 20px;
//       right: 20px;
//       background: ${backgroundColor};
//       color: white;
//       padding: 12px 16px;
//       border-radius: 6px;
//       z-index: 1000001;
//       font-size: 14px;
//       font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
//       box-shadow: 0 4px 12px rgba(0,0,0,0.25);
//       max-width: 350px;
//       word-wrap: break-word;
//       animation: slideIn 0.3s ease-out;
//       pointer-events: auto;
//       cursor: pointer;
//     `;
//     notification.textContent = message;
//     notification.addEventListener('click', () => {
//       if (notification.parentNode) {
//         notification.parentNode.removeChild(notification);
//       }
//     });
//     document.body.appendChild(notification);
//     setTimeout(() => {
//       if (notification.parentNode) {
//         notification.parentNode.removeChild(notification);
//       }
//     }, 4000);
//   }
//
//   // 新增：監聽來自 iframe 的關閉懸浮球訊息
//   window.addEventListener('message', function(event) {
//     if (event && event.data && event.data.type === 'CLOSE_FLOATING_BALL') {
//       // 關閉懸浮球
//       const ball = document.getElementById('todolist-floating-ball');
//       if (ball && ball.parentNode) ball.parentNode.removeChild(ball);
//       // 關閉 todolist-app-iframe-wrapper
//       const wrapper = document.getElementById('todolist-app-iframe-wrapper');
//       if (wrapper && wrapper.parentNode) wrapper.parentNode.removeChild(wrapper);
//     }
//   });
// })();
