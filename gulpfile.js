const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const browsersync = require('browser-sync').create();

// Sass Task
function scssTask() {
  return src('src/style/**/*.scss', {
    sourcemaps: true,
  })
  .pipe(sass())
  .pipe(postcss([cssnano()]))
  .pipe(concat('style.css'))
  .pipe(dest('dist/', {
    sourcemaps: '.'
  }));
}

// Javascript Task
function jsTask() {
  return src('src/script/**/*.js', {
    sourcemaps: true,
  })
  .pipe(terser())
  .pipe(concat('app.js'))
  .pipe(dest('dist', {
    sourcemaps: '.'
  }));
}


// Browsersync Tasks
function browsersyncServe(cb) {
  browsersync.init({
    server: {
      baseDir: '.'
    }
  });
  cb();
}

function browsersyncReload(cb) {
  browsersync.reload();
  cb();
}

function watchTask(){
  watch('*.html', browsersyncReload);
  watch([
    'src/style/*.scss',
    'src/script/**/*.js'
  ], series(scssTask, jsTask, browsersyncReload))
}


// Default Gulp Task
exports.default = series(
  scssTask,
  jsTask,
  browsersyncServe,
  watchTask,
);