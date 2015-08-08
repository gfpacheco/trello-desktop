'use strict';

var ipc = require('ipc');

ipc.on('params', function(message) {
  var params = JSON.parse(message),
      webView = document.createElement('webview');

  webView.setAttribute('id', 'webView');
  webView.setAttribute('src', params.url);
  webView.setAttribute('autosize', 'on');
  webView.setAttribute('minwidth', '100');
  webView.setAttribute('minheight', '100');

  webView.addEventListener('new-window', function(e) {
    require('shell').openExternal(e.url);
  });

  webView.addEventListener('did-finish-load', function(e) {
    webView.addEventListener('page-title-set', function(event) {
      ipc.send('title-changed');
    });
  });

  document.getElementById('container').appendChild(webView);
});
