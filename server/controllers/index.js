'use strict';

var path = require('path');

exports.partials = function (req, res) {
  var stripped = req.url.split('.')[0];
  var requestedView = path.join('./', stripped);
  res.render(requestedView, function (err, html) {
    if (err) {
      console.log('----------------------------------- Something broke, index.js -----------------------------------------');
      console.log('Error rendering partial ' + requestedView + '\n', err);
      console.log('----------------------------------------------------------------------------');
      res.status(404);
      res.send(404);
    } else {
      res.send(html);
    }
  });
};

exports.index = function (req, res) {
  res.render('index');
};
