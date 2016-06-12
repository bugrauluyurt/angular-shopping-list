'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var autoprefixer = require('gulp-autoprefixer');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');

// 1. PRE-TASKS

	// 1.1 Scss to Css
	gulp.task('sass', function(){
	  return gulp.src('app/scss/**/*.scss')
	  	// Using gulp-sass
	    .pipe(sass())
	    .pipe(gulp.dest('app/css'))
	    // Sync browser whenever a scss file is changed
	    .pipe(browserSync.reload({
      		stream: true
    	}))
	});

	// 1.2 BrowserSync
	gulp.task('browserSync', function() {
	  browserSync.init({
	    server: {
	      baseDir: 'app' // Define the base directory
	    }
	  })
	});

	// 1.3 Useref (Concatenation of files mentioned in comments within the HTML)
	gulp.task('useref', function(){
	  return gulp.src('app/*.html')
	    .pipe(useref())
	    // Minifies only if it's a JavaScript file (minification is disabled)
    	// .pipe(gulpIf('*.js', uglify()))
    	// Minifies only if it's a CSS file (minification is disabled)
    	// .pipe(gulpIf('*.css', cssnano()))
    	// Autoprefixer for css files
    	.pipe(gulpIf('*.css', autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		})))
	    .pipe(gulp.dest('dist'))
	});

	// 1.4 Image minification
	gulp.task('images', function(){
	  	return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
	  	.pipe(cache(imagemin({
     	// Setting interlaced to true
	      interlaced: true
	   	})))
	  	.pipe(gulp.dest('dist/images'))
	});

	// 1.5 Fonts copy
	gulp.task('fonts', function() {
	  	return gulp.src('app/fonts/**/*')
	  	.pipe(gulp.dest('dist/fonts'))
	});

	// 1.6 Clean dist folder
	gulp.task('clean:dist', function() {
	  	return del.sync('dist');
	});

	// 1.7 Watch
	gulp.task('watch',['browserSync', 'sass'], function(){
		// Scss to Css watcher (whenever an scss file changes, sass task is executed)
		gulp.watch('app/scss/**/*.scss', ['sass']);
		// Reloads the browser whenever HTML or JS files change
		gulp.watch('app/*.html', browserSync.reload); 
		gulp.watch('app/js/**/*.js', browserSync.reload);
	});

// 2. ROCKET THE APP

	// 2.1 Build
	gulp.task('build', function (callback) {
		// Tasks given in the parenthesis run at the same time after clean:dist
	  	runSequence('clean:dist', ['sass', 'useref', 'images', 'fonts'], callback);
	});

	// 2.2 Default
	gulp.task('default', function (callback) {
  		runSequence(['sass','browserSync', 'watch'], callback);
	});	




		