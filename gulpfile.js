'use strict';

var gulp = require('gulp'),
    del = require('del'),
    path = require('path'),
    plugins = require('gulp-load-plugins')();

/**
 * Scripts
 */

gulp.task('scripts:vendor', function (cb) {
    gulp.src([
        './bower_components/react/react.js',
        './bower_components/firebase/firebase.js',
        './bower_components/marked/lib/marked.js'
    ])
        .pipe(plugins.concat('vendor.js'))
        .pipe(plugins.uglify({ mangle: false }))
        .pipe(plugins.size({ showFiles: true }))
        .pipe(gulp.dest('./dist/js'))
        .on('end', cb)
        .on('error', plugins.util.log);
});

gulp.task('scripts:main', function (cb) {
    gulp.src('./src/js/**/*.js')
        .pipe(plugins.plumber())
        .pipe(plugins.jshint())
        .pipe(plugins.concat('main.js'))
        .pipe(plugins.uglify({ mangle: false }))
        .pipe(plugins.size({ showFiles: true }))
        .pipe(gulp.dest('./dist/js'))
        .on('end', cb)
        .on('error', plugins.util.log);
});

gulp.task('scripts', ['scripts:vendor', 'scripts:main']);

gulp.task('scripts:clean', function (cb) {
    del(['./dist/js/vendor.js', './dist/js/main.js'], cb);
});

gulp.task('scripts:watch', function () {
    gulp.watch('./src/js/**/*.js', ['scripts:main']);
});

/**
 * Index
 */

gulp.task('index', function (cb) {
    gulp.src('./src/index.html')
        .pipe(plugins.plumber())
        .pipe(plugins.minifyHtml())
        .pipe(gulp.dest('./dist/'))
        .on('end', cb)
        .on('error', plugins.util.log);
});

gulp.task('index:watch', function () {
    gulp.watch('./src/index.html', ['index']);
});

gulp.task('index:clean', function (cb) {
    del('./dist/index.html', cb);
});

/**
 * So let's go
 */

gulp.task('clean', ['scripts:clean', 'index:clean']);
gulp.task('watch', ['scripts:watch', 'index:watch']);
gulp.task('build', ['scripts', 'index']);
gulp.task('default', ['clean', 'build', 'watch']);
