'use strict';

const app = require('app');
const BrowserWindow = require('browser-window');

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

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
