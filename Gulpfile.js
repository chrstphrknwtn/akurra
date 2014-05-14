'use strict';

// npm install -D gulp gulp-util gulp-rimraf gulp-ruby-sass gulp-jshint gulp-autoprefixer gulp-plumber gulp-ngmin gulp-shell tiny-lr-quiet nodemon http open inquirer

/*global shell */
/*global $ */
require('shellscript').globalize();

var gulp      = require('gulp')
  , gutil     = require('gulp-util')
  , rimraf    = require('gulp-rimraf')
  , sass      = require('gulp-ruby-sass')
  , jshint    = require('gulp-jshint')
  , prefix    = require('gulp-autoprefixer')
  , plumber   = require('gulp-plumber')
  , ngmin     = require('gulp-ngmin')
  , gulpShell = require('gulp-shell')
  , gulpLR    = require('gulp-livereload')

  , tinylr    = require('tiny-lr-quiet')
  , nodemon   = require('nodemon')
  , http      = require('http')
  , openURL   = require('open')
  , inquirer  = require('inquirer')

  , fs        = require('fs')
  , cp        = require('child_process');

var HTTP_HOST = 'localhost';
var HTTP_PORT = process.env.PORT = 9000;
var NODE_APP_READY_TEST_PATH = '/api/clients/all';
var LIVERELOAD_PORT = 35729;
var lr = tinylr();
lr.listen(LIVERELOAD_PORT);

// ///////////////////////////////////////////////
// /////////// Helper Methods ////////////////////
// ///////////////////////////////////////////////
function err() {
  /*jshint validthis:true */
  gutil.beep();
  this.emit('end');
}
function onNodeServerLog(log) {
  console.log(gutil.colors.white('[') + gutil.colors.yellow('nodemon') + gutil.colors.white('] ') + log.message);
}
function onNodeServerRestart(files) {
  waitForNode(reload, [{path: files[0]}]);
}
function onNodeServerStart() {
  console.log('[' + gutil.colors.yellow('nodemon') + '] waiting for route ' + gutil.colors.cyan(NODE_APP_READY_TEST_PATH) + ' to return successfully');
}
function waitForNode(callback, params) {
  setTimeout(function () {
    http.get({
      host: HTTP_HOST,
      port: HTTP_PORT,
      path: NODE_APP_READY_TEST_PATH
    }, function () {
      callback.apply(callback, params);
    }).on('error', function () {
      waitForNode(callback, params);
    });
  }, 100);
}
function errBuild(err) {
  gutil.beep();
  console.log(gutil.colors.red('✖ Build Failed'));
  process.exit(1);
}
function reload(file) {
  var log = '[' + gutil.colors.blue('LiveReload') + ']';
  if (file) {
    log += ' ' + file.path;
  }
  console.log(log);
  file = file || {path: 'app/scripts/app.js'};
  lr.changed({body: {files: file.path}});
}
function spawnProcess(cmd, args, exitCallback) {
  cp.spawn(cmd, args, {env: process.env, cwd: process.cwd(), stdio:'inherit'})
    .on('exit', exitCallback || function () {});
}



///////////////////////////////////////////////
/////////// SERVE / WATCH / RELOAD ////////////
///////////////////////////////////////////////
gulp.task('default', ['serve']);
gulp.task('go', ['serve', 'launchProject']);
gulp.task('serve', ['gulpfile', 'wiredep', 'cleanTmp', 'sass', 'serverJs', 'clientJs', 'startNode', 'watch'], function () {
  reload(); // TODO: make this work consistantly
});

gulp.task('gulpfile', function () {
  return gulp.src('gulpfile.js')
    .pipe(jshint('.jshintrcnode'))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'))
    .on('error', err);
});

gulp.task('cleanTmp', function () {
  return gulp.src('.tmp/styles/*', {read: false})
    .pipe(rimraf());
});

gulp.task('sass', ['cleanTmp'], function () {
  return gulp.src('app/styles/main.scss')
    .pipe(plumber())
    .pipe(sass({loadPath: ['app/bower_components']}))
    .on('error', err)
    .pipe(prefix('last 2 versions'))
    .pipe(gulp.dest('.tmp/styles'))
    .pipe(gulpLR(lr))
    .on('end', function () {
      console.log('[' + gutil.colors.blue('LiveReload') + '] app/styles/main.scss');
    });
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


gulp.task('startNode', ['gulpfile', 'cleanTmp', 'sass', 'clientJs', 'serverJs'], function (callback) {
  nodemon('--debug server.js --watch server --watch server.js --ignore node_modules/')
    .on('restart', onNodeServerRestart)
    .on('log', onNodeServerLog)
    .on('start', onNodeServerStart);

  waitForNode(callback);
});

gulp.task('launchProject', ['startNode'], function () {
  openURL('http://' + HTTP_HOST + ':' + HTTP_PORT);
});

gulp.task('wiredep', function () {
  var wiredep = require('wiredep').stream;

  gulp.src('app/styles/*.scss')
    .pipe(wiredep({
      directory: 'app/bower_components'
    }))
  .pipe(gulp.dest('app/styles'));

  gulp.src('app/views/index.html')
    .pipe(wiredep({
      directory: 'app/bower_components',
      exclude: ['bootstrap-sass-official']
    }))
    .pipe(gulp.dest('app/views'));
});

gulp.task('watch', ['sass', 'serverJs', 'clientJs'], function () {

  gulp.watch([
    'app/views/**/*.html',
    'app/scripts/**/*.js',
    'app/images/**/*.*'
  ], reload);

  gulp.watch('app/styles/**/*.scss', ['sass']);
  gulp.watch('app/scripts/**/*.js', ['clientJs']);
  gulp.watch(['server/**/*.js', 'server.js'], ['serverJs']);
  gulp.watch('bower.json', ['wiredep', 'sass']);

  gulp.watch('Gulpfile.js', function (event, err) {
    gutil.beep();
    console.log(gutil.colors.red('\n------------------------\nRestart the Gulp process\n------------------------'));
    process.kill();
  });
});





///////////////////////////////////////////////
/////////// BUILD /////////////////////////////
///////////////////////////////////////////////
gulp.task('buildBase', ['gulpfile:dist', 'cleanDist', 'sass:build', 'serverJs:dist', 'clientJs:dist', 'bowerComponents', 'heroku', 'favicon', 'images', 'views', 'testfiles']);
gulp.task('build', ['buildBase'], function (callback) {
  console.log(gutil.colors.green('\n✔ Build Success\n'));
  inquirer.prompt([{type: 'confirm', default:false, name: 'wantsRun', message: 'Would you like to run your build?'}], function (answers) {
    console.log();
    if (answers.wantsRun) {
      process.chdir('./dist');
      process.env.NODE_ENV = 'production';
      cp.spawn('npm', ['install', '--production'], {env: process.env, cwd: process.cwd(), stdio:'inherit'})
        .on('exit', function (err) {
          if (err) {
            console.log(gutil.colors.red('\n✖ npm install --production failed'));
            process.exit(1);
          }
          console.log(gutil.colors.green('\n✔ npm install --production success\n'));
          cp.spawn('node', ['server.js'], {env: process.env, cwd: process.cwd(), stdio:'inherit'});
        });
    } else {
      callback();
      process.exit(0);
    }
  });
});

gulp.task('gulpfile:dist', function () {
  return gulp.src('gulpfile.js')
    .pipe(jshint('.jshintrcnode'))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'))
    .on('error', errBuild);
});

gulp.task('cleanDist', function () {
  return gulp.src(['dist/*', '!dist/.git', '!dist/.gitignore', '!dist/node_modules/**/*.*'], {read: false})
    .pipe(rimraf());
});

gulp.task('sass:build', ['cleanDist'], function () {
  return gulp.src('app/styles/main.scss')
    .pipe(sass({loadPath: ['app/bower_components']}))
    .on('error', errBuild)
    .pipe(prefix('last 2 versions'))
    .pipe(gulp.dest('dist/public/styles'));
});

gulp.task('serverJs:dist', ['cleanDist'], function () {
  return gulp.src(['server.js', 'server/**/*.js'], {base: './'})
    .pipe(jshint('.jshintrcnode'))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'))
    .on('error', errBuild)
    .pipe(gulp.dest('dist'));
});

gulp.task('clientJs:dist', ['cleanDist'], function () {
  return gulp.src('app/scripts/**/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'))
    .on('error', err)
    .pipe(ngmin())
    .pipe(gulp.dest('dist/public/scripts'));
});

gulp.task('bowerComponents', ['cleanDist'], function () {
  return gulp.src('app/bower_components/**/*.*')
    .pipe(gulp.dest('dist/public/bower_components'));
});

gulp.task('heroku', ['cleanDist'], function () {
  return gulp.src(['Procfile', 'package.json'])
    .pipe(gulp.dest('dist'));
});

gulp.task('images', ['cleanDist'], function () {
  return gulp.src('app/images/**/*.*')
    .pipe(gulp.dest('dist/public/images'));
});

gulp.task('favicon', ['cleanDist'], function () {
  return gulp.src('app/favicon.ico')
    .pipe(gulp.dest('dist/public/'));
});

gulp.task('views', ['cleanDist'], function () {
  return gulp.src('app/views/**/*.html')
    .pipe(gulp.dest('dist/views'));
});

gulp.task('testfiles', ['cleanDist'], function () {
  return gulp.src('server/files-tmp/**/*.*')
    .pipe(gulp.dest('dist/server/files-tmp'));
});





///////////////////////////////////////////////
/////////// DEPLOY ////////////////////////////
///////////////////////////////////////////////
gulp.task('deploy', ['buildBase'], function (callback) {
  console.log(gutil.colors.green('\n✔ Build Success\n'));

  var lastCommitHash = $('command git log -1 --pretty=%h');
  var lastCommitMessage = $('command git log -1 --pretty=%B');


  var defaultCommit = '';
  lastCommitHash && ( defaultCommit += lastCommitHash.match(/[^$\n+]+/)[0] + ' ');
  lastCommitMessage && (defaultCommit += '(' + lastCommitMessage.match(/[^$\n+]+/)[0] + ') ');

  inquirer.prompt([
    {type: 'input', name: 'commitMessage', message: 'Write a commit message: ' + defaultCommit, filter: function (input) {
      return defaultCommit + input;
    }},
    {type: 'confirm', name: 'wantsLogs', message: 'Do you wanna see the logs?'}
    ], function (answers) {

      process.chdir('./dist');

      spawnProcess('git', ['add', '-A', '.'], function () {
        spawnProcess('git', ['commit', '-m', answers.commitMessage], function () {
          spawnProcess('git', ['push', 'heroku', 'master'], function () {
            if (answers.wantsLogs) {
              spawnProcess('heroku', ['logs', '-t']);
            } else {
              process.exit(0);
            }
          });
        });
      });

      console.log();
      callback();
  });
});