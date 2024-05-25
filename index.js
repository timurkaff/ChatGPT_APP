const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow () {
  const win = new BrowserWindow({
    width: 1300,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  win.loadFile('main.html').then(() => {
    win.webContents.openDevTools();
  });

  win.setMenuBarVisibility(false);
}

app.whenReady().then(createWindow);
