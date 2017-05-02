var gulp = require('gulp');
var gutil = require('gulp-util');
var mocha = require('gulp-mocha');
var exit = require('gulp-exit');
var argv = require('yargs').argv;

var paths = {
  sources: [
    './app/**/*.js'
  ],
  tests: [
    './tests/specs/*.js'
  ]
}

gulp.task('testConfig', function() {
  process.env.NODE_ENV = 'test';
  if(argv.seqerr) {
    process.env.SEQ_ERR = true;
  }
  if(argv.l){
    process.env.DB_LOG = true;
  }
});
gulp.task('setupApp', function() {
  require('./tests/setup');
});

gulp.task('test', ['testConfig'], function() {
  return gulp.src(paths.tests, {read: false})
    .pipe(mocha({
      recursive: true,
      reporter: 'spec',
      timeout: 10000,
      ui: 'bdd',
      globals: ['app']
    }))
    .once('error', () => {
			process.exit(1);
		})
		.once('end', () => {
			process.exit();
		});
});
