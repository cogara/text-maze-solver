var gulp = require('gulp');
var sass = require('gulp-sass');
var html = require('gulp-html');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

gulp.task('styles', function() {
    gulp
        .src('./src/styles/**/main.scss')
        .pipe(sass())
        .pipe(gulp.dest('./client/styles'))
        .pipe(reload({stream: true}));
});

gulp.task('html', function() {
    gulp
        .src('./src/*.html')
        .pipe(gulp.dest('./client'))
        .pipe(reload({stream: true}));
    gulp
        .src('./src/templates/*.html')
        .pipe(gulp.dest('./client/templates'))
        .pipe(reload({stream: true}));
})

gulp.task('scripts', function() {
    gulp
        .src(['./src/scripts/main.js','./src/scripts/main.controller.js'])
        .pipe(concat('scripts.min.js'))
        // .pipe(gulp.dest('./dist'))
        // .pipe(rename('all.min.js'))
        // .pipe(uglify())
        .pipe(gulp.dest('./client/scripts'));
})

gulp.task('vendor', function() {
    gulp    
        .src('./node_modules/angular/angular.min.js')
        .pipe(gulp.dest('./client/scripts/vendor'));
})

gulp.task("build", ['html','styles','scripts','vendor']);

gulp.task('watch', function() {
    browserSync.init(null, {
        proxy: "http://localhost:3000",
        port: '3001'
    });
    gulp.watch('./src/**/*.html', ['html']);
    gulp.watch('./src/styles/**/*.scss', ['styles']);
    // gulp.watch('./src/styles/partials/*.scss', ['styles']);
    gulp.watch('./src/**/*.js', ['scripts'], reload);
})

gulp.task('default', ['styles', 'html', 'watch'])