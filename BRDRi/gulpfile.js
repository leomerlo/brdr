var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');

var sourcemaps = require('gulp-sourcemaps');
var paths = {
  sass: ['./scss/**/*.scss']
};

gulp.task('default', ['sass','vendorCSS','js']);

gulp.task('js', function() {

  gulp.src(['./www/js/*.js', './www/js/**/*.js'])
    .pipe(sourcemaps.init())
    .pipe(concat('bundle.js'))
    .pipe(sourcemaps.write('./../maps'))
    .pipe(gulp.dest('./www/dist/'));
});

gulp.task('vendorJS', function() {

  gulp.src(['./vendor/js/*.js', './vendor/js/**/*.js'])
    .pipe(sourcemaps.init())
    .pipe(concat('vendor.js'))
    .pipe(sourcemaps.write('./../maps'))
    .pipe(gulp.dest('./www/dist/'));
});

gulp.task('js:watch', ['js'], function() {
  gulp.watch(['./www/js/*.js', './www/js/**/*.js'], ['js']);
});

gulp.task('vendorCSS', function(done) {
  gulp.src('./vendor/*/*.css')
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest('./www/dist/'))
    .on('end', done);
});

gulp.task('sass', function(done) {
  gulp.src('./scss/*.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/dist/'))
    .on('end', done);
});

gulp.task('watch', ['sass'], function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
