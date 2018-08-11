const gulp = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-ruby-sass');
const autoprefixer = require('gulp-autoprefixer');
const browserify = require('browserify');
const babel = require('babelify');
const browserSync = require('browser-sync').create();
const hotReload = browserSync.reload;
const colors = require('ansi-colors');
const fs = require('fs');


//Production
const cssMinify = require('gulp-csso');

//paths
const pugPath = ['./src/pug/*.pug', './src/pug/**/*.pug'];
const sassPath = ['./src/sass/*.sass', './src/sass/**/*.sass'];
const jsPath = ['./src/js/*.js', './src/js/**/*.js'];
const distPath = ['./dist/*.html', './dist/css/*.css', './dist/js/*.js']

//Pug
gulp.task('pug', function() {
    gulp.src(pugPath[0])
        .pipe(pug())
        .pipe(gulp.dest('dist/'))
})

//Sass
gulp.task('styles', function() {
    sass(sassPath[0], {
            style: 'expanded'
        })
        .on('error', sass.logError)
        .pipe(autoprefixer())
        .pipe(gulp.dest('./dist/css/'));
});

//watch 
gulp.task('watch', function() {
    gulp.watch(pugPath, ['pug']);
    gulp.watch(sassPath, ['styles', function() {
        console.log(colors.blueBright('CSS Updated!'))}]);
    gulp.watch(jsPath, ['scripts', function() {
     console.log(colors.yellow('JS Updated!'))}]);
    gulp.watch(distPath[0], function() {
        console.log(colors.green('HTML Updated!'))
    });
    gulp.watch(distPath, hotReload);
})

//bundle
gulp.task('scripts', function() {
    browserify("./src/js/main.js")
        .transform("babelify", {
            presets: ["es2015"]
        })
        .bundle()
        .pipe(fs.createWriteStream("./dist/js/main.js"));
})

//CSS minify
gulp.task('stylesMinify', function() {
    gulp.src('./dist/css/*.css')
        .pipe(cssMinify())
        .pipe(gulp.dest('./dist/css/'));
});

//Localhost 
gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: "dist"
        }
    })
})

//Fire!
gulp.task('dev', ['watch', 'serve']); //Dev
gulp.task('build', ['styles', 'stylesMinify', 'scripts']); //Build
gulp.task('default', ['styles', 'scripts', 'watch', 'serve']); //All