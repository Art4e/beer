const { src, dest, series, watch } = require(`gulp`)
const gulp = require(`gulp`)
const gulpCli = require(`gulp-cli`)

// -------- Используем для выбора сборки
const gulpif = require('gulp-if');
const argv = require('yargs').argv;

// -------- Удаление
const del = require(`del`)
// -------- Соединение файлов
const concat = require(`gulp-concat`)
const rigger = require(`gulp-rigger`)

// -------- Обработка css 
const autoPrefixer = require(`gulp-autoprefixer`)
const cleanCss = require(`gulp-clean-css`)
const notify = require(`gulp-notify`)
const uglify = require(`gulp-uglify-es`).default
const sourceMaps = require(`gulp-sourcemaps`)

// -------- Обработка html 
const htmlmin = require(`gulp-htmlmin`)

// -------- Создание svg спрайта
const svgSprite = require('gulp-svg-sprite')
const svgmin = require('gulp-svgmin')
const cheerio = require('gulp-cheerio')
const replace = require('gulp-replace')

// -------- Обработка изображений 
const image = require(`gulp-image`)
const webp = require(`gulp-webp`);

// const rigger = require(`gulp-rigger`)

// -------- Babel обработка JS
const babel = require(`gulp-babel`)
// const @babel/core = require(`@babel/core`)
// const @babel/preset-env = require(`@babel/preset-env`)
const babelLoader = require(`babel-loader`)

// -------- Сервер 
const browserSync = require(`browser-sync`).create()

const path = {
  source: { //Пути откуда брать исходники
    html: `source/*.html`, //Синтаксис source/*.html говорит gulp что мы хотим взять все файлы с расширением .html
    scripts: `source/js/index.js`,//В стилях и скриптах нам понадобятся только main файлы
    style: [
      `source/css/normalize.css`,
      `source/css/swiper-bundle.min.css`,
      `source/css/utilities.css`,
      `source/css/wave-style.css`,
      `source/css/style.css`,
      `source/css/header.css`,
      `source/css/hero.css`,
      `source/css/beer-map.css`,
      `source/css/footer.css`,
      `source/css/media.css`
    ],
    img: [
      `source/img/**/*.png`,
      `source/img/**/*.jpg`,
      `source/img/**/*.jpeg`,
      `source/img/*.svg`,
    ], //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
    webp: `source/img/**/*.webp`,
    svg: `source/img/svg/*.svg`,
    fonts: `source/fonts/**/*.*`
  },
  dev: { //Kуда складывать файлы dev сборки
    html: `dev/`,
    scripts: `dev/js/`,
    style: `dev/css/`,
    img: `dev/img/`,
    fonts: `dev/fonts/`
  },
  build: { //Kуда складывать файлы build сборки
    html: `build/`,
    scripts: `build/js/`,
    style: `build/css/`,
    img: `build/img/`,
    fonts: `build/fonts/`
  },
  watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
    html: `source/**/*.html`,
    scripts: `source/js/**/*.js`,
    style: `source/css/**/*.css`,
    img: `source/img/**/*.*`,
    svg: `src/img/svg/**/*.svg`,
    fonts: `source/fonts/**/*.*`
  },
  clean: { //Укажем папки для удаления перед каждым новым запуском gulp 
    dev: `dev`,
    build: `build`,
  }
};

// -------- Перенос шрифтов
const fontsAll = () => {
  return src(path.source.fonts)
    .pipe(gulpif(argv.build, dest(path.build.fonts), dest(path.dev.fonts)))
}

// -------- Обработка HTML файлов
const htmlMinify = () => {
  return src(path.source.html)
    .pipe(rigger())
    .pipe(gulpif(argv.build, htmlmin({
      collapseWhitespace: true
    })))
    // .pipe(htmlValidator())
    .pipe(gulpif(argv.build, dest(path.build.html), dest(path.dev.html)))
    .pipe(browserSync.stream())
}

// -------- Обработка стилей
const styles = () => {
  return src(path.source.style)
    .pipe(gulpif(!argv.build, sourceMaps.init()))
    .pipe(concat('main.css'))
    .pipe(autoPrefixer({
      cascade: false
    }))
    .pipe(gulpif(argv.build, cleanCss({
      level: 2
    })))
    .pipe(gulpif(!argv.build, sourceMaps.write()))
    .pipe(gulpif(argv.build, dest(path.build.style), dest(path.dev.style)))
    .pipe(browserSync.stream())
}

// -------- Обработка JS
const scripts = () => {
  return src(path.source.scripts)
    .pipe(gulpif(!argv.build, sourceMaps.init()))
    .pipe(rigger())
    .pipe(babel({
      presets: [`@babel/env`]
    }))
    .pipe(gulpif(argv.build, uglify().on(`error`, notify.onError())))
    .pipe(gulpif(!argv.build, sourceMaps.write()))
    .pipe(gulpif(argv.build, dest(path.build.scripts), dest(path.dev.scripts)))
    .pipe(browserSync.stream())
}

// -------- Иницилизация browserSyn, папка сервера - 'dev' или 'build'
const watchFailes = () => {
  browserSync.init({
    server: {
      baseDir: gulpif(!argv.build, 'dev', 'build')
    }
  })
}

// -------- Создаем svg sprite
const svgSpriteBuild = () => {
  return gulp.src(path.source.svg)
    // -------- minify svg
    .pipe(svgmin({
      js2svg: {
        pretty: true
      }
    }))
    // -------- Удаление аттрибутов из svg файлов для обращения к ним из css
    .pipe(cheerio({
      run: function ($) {
        $('[fill]').removeAttr('fill');
        $('[stroke]').removeAttr('stroke');
        $('[style]').removeAttr('style');
      },
      parserOptions: { xmlMode: true }
    }))
    // -------- Плагин cheerio plugin вставлет '&gt;' вместо >, заменяем обратно
    .pipe(replace('&gt;', '>'))
    // -------- Создание svg sprite
    .pipe(svgSprite({
      mode: {
        symbol: {
          sprite: "../sprite.svg",
          render: {
            css: false
          },
        }
      }
    }))
    .pipe(gulpif(argv.build, dest(path.build.img), dest(path.dev.img)))
    .pipe(browserSync.stream())
}

// -------- Зжатие изображений
const images = () => {
  return src(path.source.img)
    .pipe(image())
    .pipe(gulpif(argv.build, dest(path.build.img), dest(path.dev.img)))
}
const webps = () => {
  return src(path.source.webp)
    .pipe(webp())
    .pipe(gulpif(argv.build, dest(path.build.img), dest(path.dev.img)))
}

// -------- Удаляем папки dev и build прежде чесм собрать обновлённую сборку
const delAll = () => {
  return del([path.clean.dev, path.clean.build])
}

// -------- Следим за изменениями в файлах
watch(path.watch.html, htmlMinify)
watch(path.watch.style, styles)
watch(path.watch.scripts, scripts)
watch(path.watch.svg, svgSpriteBuild)
watch(path.watch.fonts, fontsAll)

// --------  Сборка по умолчанию dev, запуск - gulp 
// --------  Сборка по build, запуск - gulp --build
exports.default = series(delAll, fontsAll, htmlMinify, styles, svgSpriteBuild, images, webps, scripts, watchFailes)