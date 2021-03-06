'use strict';

const app = require('app');
const ipc = require('ipc');
const BrowserWindow = require('browser-window');

const darwin = process.platform === 'darwin';

require('crash-reporter').start();
require('electron-debug')();

let mainWindow;

app.on('ready', function () {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    resizable: false
  });

  mainWindow.loadUrl(`file://${__dirname}/index.html`);

  mainWindow.webContents.on('did-finish-load', function() {
    mainWindow.webContents.send('params', JSON.stringify({
      url: 'https://trello.com'
    }));
  });

  mainWindow.on('focus', function () {
    mainWindow.flashFrame(false);
  });

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});

ipc.on('title-changed', function() {
  if (!mainWindow.isFocused()) {
    mainWindow.flashFrame(true);

    if (darwin) {
      app.dock.bounce('critical');
    }
  }
});

app.on('window-all-closed', function () {
  if (!darwin) {
    app.quit();
  }
});
