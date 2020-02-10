const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
const stylint = require('gulp-stylint');
const browserSync = require('browser-sync').create();

//Порядок подключения стилей SCSS
const cssFiles = ['./src/css/main.scss', './src/css/color.scss'];

//Порядок подключения js

const jsFiles = ['./src/js/lib.js', './src/js/main.js'];

//Таск на стили css
function styles() {
  //Шаблон для поиска файлов css
  //Все файлы по шаблону ./src/css/**/*.css'
  return (
    gulp
      .src(cssFiles)
      //Обьединение файлов в один
      .pipe(concat('style.css'))
      //
      .pipe(sourcemaps.init())
      .pipe(sass())
      //Добавить префиксы
      .pipe(
        autoprefixer({
          Browserslist: "['last 2 versions']",
          cascade: false,
        })
      )
      //stylelint
      .pipe(
        stylint({
          reportets: [{formatter: 'string', console: true}],
        })
      )

      //Минификация CSS
      .pipe(cleanCSS({level: 2}))
      .pipe(sourcemaps.write('./'))
      //Выходная папка для стилей
      .pipe(gulp.dest('./build/css'))
      .pipe(browserSync.stream())
  );
}

//Таск на скрипты js
function scripts() {
  //Шаблон для поиска файлов js
  //Все файлы по шаблону ./src/js/**/*.js'
  return (
    gulp
      .src(jsFiles)
      //Обьединение в один файл
      .pipe(concat('app.js'))
      //Минификация
      .pipe(uglify())
      //Выходная папка для js
      .pipe(gulp.dest('./build/js'))
      .pipe(browserSync.stream())
  );
}

//Удалить все в указаной папке
function clean() {
  return del(['build/*']);
}

//Просматривать файлы
function watch() {
  browserSync.init({
    server: {
      baseDir: './',
    },
  });
  //Следить за файлами Css
  gulp.watch('./src/css/**/*.scss', styles);
  gulp.watch('./src/css/**/*.sass', styles);

  //Следить за файлами JS
  gulp.watch('./src/js/**/*.js', scripts);
  //При изменении HTML запускать синхронизацию
  gulp.watch('./*.html').on('change', browserSync.reload);
}
//Таск вызывающий функцию styles
gulp.task('styles', styles);

//Таск вызывающий функцию scripts
gulp.task('scripts', scripts);

//Таск для очистки папки build
gulp.task('del', clean);

//Таск для отслеживания изменений
gulp.task('watch', watch);

//Таск для удаления файлов в папке Build и запуск style , scripts
gulp.task('build', gulp.series(clean, gulp.parallel(styles, scripts)));

//Запускает build и watch последовательно
gulp.task('dev', gulp.series('build', 'watch'));
