const gulp = require('gulp');
const pug  = require('gulp-pug');
const format = require('html-formatter');


gulp.task('pug', function(){
	let html;
	gulp.src('src/pug/*.pug')
	.pipe(pug())
	
	.pipe(gulp.dest('dist/'))
})