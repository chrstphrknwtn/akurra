'use strict';

var gulp = require('gulp');
var util = require('gulp-util');
var rimraf = require('gulp-rimraf');
var sass = require('gulp-ruby-sass');
var jshint = require('gulp-jshint');
var refresh = require('gulp-livereload');

var fs = require('fs');
var nodemon = require('nodemon');

var http = require('http');
var openURL = require('open');
var tinylr = require('tiny-lr');

var livereloadServer = tinylr();

var checkAppReadyInterval;

var HTTP_HOST = 'localhost';
var HTTP_PORT = 3000;
var LIVERELOAD_PORT = 35729;

process.env.NODE_APP_READY = 'false';

///////////////////////////////////////////////
/////////// SERVE / WATCH / RELOAD ////////////
///////////////////////////////////////////////
gulp.task('default', ['gulpfile', 'deleteTemp', 'sass', 'serverJs', 'clientJs', 'startLivereloadServer', 'startNode', 'launchProject', 'watch']);

gulp.task('gulpfile', function () {
  return gulp.src('gulpfile.js')
    .pipe(jshint('.jshintrcnode'))
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('deleteTemp', function () {
  return gulp.src('.tmp', {read: false})
    .pipe(rimraf());
});

gulp.task('sass', ['deleteTemp'], function () {
  return gulp.src('app/styles/**/*.scss')
    .pipe(sass({
      loadPath: ['app/bower_components']
    })
    .on('error', function (data) {

    }))
    .pipe(gulp.dest('.tmp/styles'))
    .pipe(refresh(livereloadServer));
});

gulp.task('serverJs', function () {
  return gulp.src(['lib/**/*.js', 'server.js'])
    .pipe(jshint('.jshintrcnode'))
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('clientJs', function () {
  return gulp.src('app/scripts/**/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(refresh(livereloadServer));
});

function checkAppReady() {
  if (process.env.NODE_APP_READY === 'true') {
    clearInterval(checkAppReadyInterval);
  } else {
    var options = {
      host: HTTP_HOST,
      port: HTTP_PORT,
      path: '/api/clients/'
    };
    http.get(options, function () {
      process.env.NODE_APP_READY = 'true';
    }).on('error', function () {
      process.env.NODE_APP_READY = 'false';
    });
  }
}
function onNodeServerLog(log) {
  console.log(util.colors.white('[') + util.colors.yellow('nodemon') + util.colors.white('] ') + log.message);
}
function onNodeServerRestart(files) {
  if (files) {
    process.env.NODE_APP_READY = 'false';
    for (var i = 0; i < files.length; i++) {
      console.log(util.colors.grey('  ' + files[i]));
    }
    checkAppReadyInterval = setInterval(function () {
      checkAppReady();
      if (process.env.NODE_APP_READY === 'true') {
        gulp.src(files)
          .pipe(refresh(livereloadServer));
      }
    }, 100);
  }
}

gulp.task('startNode', ['gulpfile', 'deleteTemp', 'sass', 'clientJs', 'serverJs'], function (callback) {
  nodemon('-w server server.js')
    .on('restart', onNodeServerRestart)
    .on('log', onNodeServerLog);

  checkAppReadyInterval = setInterval(function () {
    checkAppReady();
    if (process.env.NODE_APP_READY === 'true') {
      callback();
    }
  }, 100);
});

gulp.task('startLivereloadServer', function () {
  livereloadServer.listen(LIVERELOAD_PORT);
});

gulp.task('launchProject', ['startNode'], function () {
  openURL('http://' + HTTP_HOST + ':' + HTTP_PORT);
});



gulp.task('watch', ['launchProject'], function () {
  gulp.watch('app/styles/**/*.scss', ['sass']);
  gulp.watch('app/views/**/*.html', function (event) {
    gulp.src(event.path)
      .pipe(refresh(livereloadServer));
  });
  gulp.watch('app/scripts/**/*.js', function (event) {
    gulp.src(event.path)
      .pipe(jshint('.jshintrc'))
      .pipe(jshint.reporter('jshint-stylish'))
      .pipe(refresh(livereloadServer));
  });
  gulp.watch('server/**/*.js', function (event) {
    gulp.src(event.path)
      .pipe(jshint('.jshintrcnode'))
      .pipe(jshint.reporter('jshint-stylish'));
  });
  gulp.watch('Gulpfile.js', function () {
    console.log(util.colors.red('\n------------------------\nRestart the Gulp process\n------------------------'));
  });
});