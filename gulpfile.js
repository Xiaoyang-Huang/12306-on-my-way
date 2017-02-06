var path = require('path');

var gulp = require('gulp');
var webpack = require('gulp-webpack');
var concat = require('gulp-concat');
var gulpWatch = require('gulp-watch');

var browserSync = require('browser-sync').create();

var webpackConfig = {
  output:{
    filename: 'script.js'
  },
  devtool: 'inline-source-map',
  module:{
    loaders:[
      {test: /\.jsx$/, loader: 'jsx-loader'}
    ]
  },
  resolve:{
    extensions:['','.js','.jsx']
  }
}

gulp.task('default', ['style', 'script'], function(){
  browserSync.init({
    server:{
      baseDir:'./www/'
    },
    open: false
  })
  gulpWatch(['./script/**/*.jsx', './script/**/*.js'], function(){
    gulp.start('script');
  });
  gulpWatch('./style/*.css', function(){
    gulp.start('style');
  });
})

gulp.task('style', function(){
  gulp.src('./style/*.css')
    .pipe(concat('style.css'))
    .pipe(gulp.dest('./www/dest/'))
    .pipe(browserSync.stream());
})

gulp.task('script', function(){
  gulp.src('./script/main.jsx')
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest('./www/dest/'))
    .pipe(browserSync.stream());
})
