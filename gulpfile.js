const gulp = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-ruby-sass');
const autoprefixer = require('gulp-autoprefixer');
const browserify = require('browserify');
const babel = require('babelify');
const browserSync = require('browser-sync').create();
const hotReload = browserSync.reload;
const colors = require('ansi-colors');
const argv = require('minimist')(process.argv.slice(2));
const isProduction = argv.production;
const fs = require('fs');

//Production
const uglify = require('gulp-uglify');
const pump = require('pump');



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
            style: isProduction ? 'compressed' : 'expanded'
        })
        .on('error', sass.logError)
        .pipe(autoprefixer())
        .pipe(gulp.dest('./dist/css/'));
    if (isProduction) console.log(colors.blueBright('CSS Minified!'))
});

//watch 
gulp.task('watch', function() {
    gulp.watch(pugPath, ['pug']);
    gulp.watch(sassPath, ['styles', function() {
        console.log(colors.blueBright('CSS Updated!'))
    }]);
    gulp.watch(jsPath, ['scripts', function() {
        console.log(colors.yellow('JS Updated!'))
    }]);
    gulp.watch(distPath[0], function() {
        console.log(colors.green('HTML Updated!'))
    });
    gulp.watch(distPath, hotReload);
})

//bundle
gulp.task('scripts', function() {
    browserify("./src/js/main.js")
        .transform(babel, {
            presets: ["es2015"]
        })
        .bundle()
        .pipe(fs.createWriteStream("./dist/js/main.js"))
})


gulp.task('minifyJS', function(cb) {
    setTimeout(function() {
        pump([
                gulp.src('dist/js/*.js'),
                uglify(),
                gulp.dest('dist/js')
            ],
            cb
        );
        console.log(colors.yellow('JS Minified!'));
    }, 500)
})

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
gulp.task('default', ['styles', 'scripts', isProduction ? 'minifyJS' : 'scripts']); //build