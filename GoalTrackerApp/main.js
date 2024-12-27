const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow () {
  // 创建浏览器窗口
  const win = new BrowserWindow({
    width: 300,
    height: 200,
    alwaysOnTop: true,
    frame: false, // 无边框窗口
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // 可选：如果需要预加载脚本
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // 加载 index.html
  win.loadFile('index.html');

  // 打开开发者工具（可选）
  // win.webContents.openDevTools();
}

// 当 Electron 完成初始化并准备创建浏览器窗口时调用
app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    // 在 macOS 上，当点击 dock 图标并且没有其他窗口打开时，重新创建一个窗口
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// 当所有窗口关闭时退出应用
app.on('window-all-closed', function () {
  // 在 macOS 上，通常应用会保持激活，直到用户使用 Cmd + Q 退出
  if (process.platform !== 'darwin') app.quit();
});
