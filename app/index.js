'use strict';

const app = require('app');
const ipc = require('ipc');
const net = require('net');
const BrowserWindow = require('browser-window');

const darwin = process.platform === 'darwin';

require('crash-reporter').start();
require('electron-debug')();

let mainWindow;
let client;

app.on('ready', function () {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    resizable: false
  });

  startServer();

  mainWindow.loadUrl(`file://${__dirname}/index.html`);

  mainWindow.webContents.on('did-finish-load', function() {
    mainWindow.webContents.send('params', JSON.stringify({
      url: 'https://trello.com'
    }));
  });

  mainWindow.on('focus', function () {
    mainWindow.flashFrame(false);
    if (client) {
      msgToServer("off");
    }
  });

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});

ipc.on('title-changed', function() {
  if (!mainWindow.isFocused()) {
    mainWindow.flashFrame(true);

    msgToServer("blink");
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

function msgToServer(msg) {

    client = net.connect({
            port: 8124
        },
        function() {
            client.write(msg);
        });

    client.on('error', function(err) {
        startServer(function(error) {
          if(error){
            alert("Ocorreu um erro, por favor reinicie a aplicação!")
          }else{
            msgToServer(msg);
          }
        });
    });
}


function startServer(callback) {
    var exec = require('child_process').exec;
    var cmd = `node ${__dirname}/ledServer.js`;
    exec(cmd, callback);
}
