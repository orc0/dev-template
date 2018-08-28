'use strict'
var gulp = require('gulp'), // подключение GULP
    sass = require('gulp-sass'), // подключение SASS
    browserSync = require('browser-sync'), // Подключение Browser Sync
    uglify = require('gulp-uglify'), // сжатие и минификация JS
    cleanCSS = require('gulp-clean-css'), // минификация css
    imagemin = require('gulp-imagemin'),
    imageminPngquant = require('imagemin-pngquant'),
    imageminSvgo = require('imagemin-svgo'),
    imageminMozjpeg = require('imagemin-mozjpeg'),
    autoprefixer = require('gulp-autoprefixer'),
    rigger = require('gulp-rigger'),
    sourceMaps = require('gulp-sourcemaps'), //генерация карт
    rimraf = require('rimraf'),
    watch = require('gulp-watch'),
    reload = browserSync.reload;

var path = {
  build: {
    html: 'build/',
    js: 'build/js/',
    css: 'build/css/',
    img: 'build/img/',
    fonts: 'build/fonts/'
  },
  dev: {
    html: 'dev/*.html',
    js: 'dev/js/script.js',
    css: 'dev/scss/style.scss',
    img: 'dev/img/**/*.*',
    fonts: 'dev/fonts/**/*.*'
  },
  watch: {
    html: 'dev/**/*.html',
    js: 'dev/js/script.js',
    css: 'dev/scss/**/*.scss',
    img: 'dev/img/**/*.*',
    fonts: 'dev/fonts/**/*.*'
  },
  clean: './build'
};

var config = {
  server: {
    baseDir: './build'
  },
  tunnel: true,
  host: 'localhost',
  port: 9000,
  logPrefix: 'default'
};

gulp.task('webserver', function () {
  browserSync(config);
});

gulp.task('build:html', function () {
  gulp.src(path.dev.html)
    .pipe(rigger())
    .pipe(gulp.dest(path.build.html))
    .pipe(reload({stream: true}));
});

gulp.task('build:js', function() {
  gulp.src(path.dev.js)
    .pipe(rigger())
    .pipe(sourceMaps.init())
    .pipe(uglify())
    .pipe(sourceMaps.write())
    .pipe(gulp.dest(path.build.js))
    .pipe(reload({stream: true}));
});

gulp.task('build:css', function () {
  gulp.src(path.dev.css)
    .pipe(sourceMaps.init())
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
    .pipe(cleanCSS())
    .pipe(sourceMaps.write())
    .pipe(gulp.dest(path.build.css))
    .pipe(reload({stream: true}));
});

gulp.task('build:images', function() {
  return gulp.src(path.dev.img)
    .pipe(imagemin([
        imageminPngquant({
        speed: 1,
        quality: 98
      }),
      imageminSvgo({
        removeViewBox: true
      }),
      imageminMozjpeg({
        quality: 90
      })
    ]))
    .pipe(gulp.dest(path.build.img))
    .pipe(reload({stream: true}));
});

gulp.task('build:fonts', function() {
  gulp.src(path.dev.fonts)
    .pipe(gulp.dest(path.build.fonts))
});

gulp.task('clean', function (cb) {
  rimraf(path.clean, cb);
});

gulp.task('build', [
  'build:html',
  'build:js',
  'build:css',
  'build:fonts',
  'build:images'
]);

gulp.task('watch', function () {
  watch([path.watch.html], function(event, cb) {
    gulp.start('build:html');
  });
  watch([path.watch.css], function(event, cb) {
    gulp.start('build:css');
  });
  watch([path.watch.js], function(event, cb) {
    gulp.start('build:js');
  });
  watch([path.watch.img], function(event, cb) {
    gulp.start('build:images');
  });
  watch([path.watch.fonts], function(event, cb) {
    gulp.start('build:fonts');
  });
});

gulp.task('start', ['build', 'webserver', 'watch']);
