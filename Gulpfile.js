'use strict';

var gulp     = require('gulp')
  , gutil    = require('gulp-util')
  , rimraf   = require('gulp-rimraf')
  , sass     = require('gulp-ruby-sass')
  , jshint   = require('gulp-jshint')
  , refresh  = require('gulp-livereload')
  , prefix   = require('gulp-autoprefixer')
  , shell    = require('gulp-shell')
  , plumber  = require('gulp-plumber')

  , map      = require('map-stream')
  , fs       = require('fs')
  , nodemon  = require('nodemon')
  , http     = require('http')
  , openURL  = require('open')
  , tinylr   = require('tiny-lr');


var livereloadServer;
var checkAppReadyInterval;
var HTTP_HOST = 'localhost';
var HTTP_PORT = process.env.PORT = 9000;
var LIVERELOAD_PORT = 35729;

///////////////////////////////////////////////
/////////// Helper Methods ////////////////////
///////////////////////////////////////////////
function err() {
  /*jshint validthis:true */
  gutil.beep();
  this.emit('end');
}

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
    return process.env.NODE_APP_READY;
  }
}
function onNodeServerLog(log) {
  console.log(gutil.colors.white('[') + gutil.colors.yellow('nodemon') + gutil.colors.white('] ') + log.message);
}
function onNodeServerRestart(files) {
  if (files) {
    for (var i = 0; i < files.length; i++) {
      console.log(gutil.colors.grey('  ' + files[i]));
    }
    waitForNode(reload);
  }
}
function waitForNode(callback) {
  process.env.NODE_APP_READY = 'false';
  checkAppReadyInterval = setInterval(function () {
    checkAppReady();
    if (process.env.NODE_APP_READY === 'true') {
      callback();
    }
  }, 100);
}
function reload() {
  gulp.src('').pipe(refresh(livereloadServer));
}
///////////////////////////////////////////////
/////////// SERVE / WATCH / RELOAD ////////////
///////////////////////////////////////////////
gulp.task('default', ['no', 'launchProject']);
gulp.task('no', ['gulpfile', 'deleteTemp', 'sass', 'serverJs', 'clientJs', 'runMongo', 'startLivereloadServer', 'startNode', 'runMongo', 'watch'])
  .doneCallback = function () {
    reload();
  };

gulp.task('gulpfile', function () {
  return gulp.src('gulpfile.js')
    .pipe(jshint('.jshintrcnode'))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'))
    .on('error', err);
});

gulp.task('deleteTemp', function () {
  return gulp.src('.tmp', {read: false})
    .pipe(rimraf());
});

gulp.task('sass', ['deleteTemp'], function () {
  return gulp.src('app/styles/main.scss')
    .pipe(plumber())
    .pipe(sass({loadPath: ['app/bower_components']}))
    .on('error', err)
    .pipe(prefix('last 2 versions'))
    .pipe(gulp.dest('.tmp/styles'));
});

gulp.task('serverJs', function () {
  return gulp.src(['server/**/*.js', 'server.js'])
    .pipe(jshint('.jshintrcnode'))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'))
    .on('error', err);
});

gulp.task('clientJs', function () {
  return gulp.src('app/scripts/**/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'))
    .on('error', err);
});

gulp.task('startNode', ['gulpfile', 'deleteTemp', 'sass', 'clientJs', 'serverJs', 'runMongo'], function (callback) {
  nodemon('-w server server.js')
    .on('restart', onNodeServerRestart)
    .on('log', onNodeServerLog);

  waitForNode(callback);
});

gulp.task('startLivereloadServer', function () {
  livereloadServer = tinylr();
  livereloadServer.listen(LIVERELOAD_PORT);
});

gulp.task('runMongo', function () {
   return gulp.src('').pipe(shell('mongod &'));
});

gulp.task('launchProject', ['startNode'], function () {
  openURL('http://' + HTTP_HOST + ':' + HTTP_PORT);
});

gulp.task('watch', function () {
  gulp.watch([
    'app/views/**/*.html',
    '.tmp/styles/**/*.css',
    'app/scripts/**/*.js',
    'server/**/*.js',
    'server.js'
  ]).on('change', function (file) {
    reload();
  });

  gulp.watch('app/styles/**/*.scss', ['sass']);
  gulp.watch('app/scripts/**/*.js', ['clientJs']);
  gulp.watch(['server/**/*.js', 'server.js'], ['serverJs']);

  gulp.watch('Gulpfile.js', function (event, err) {
    gutil.beep();
    console.log(gutil.colors.red('\n------------------------\nRestart the Gulp process\n------------------------'));
    process.kill();
  });
});