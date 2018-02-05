//General
import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sourcemaps from 'gulp-sourcemaps';
import gutil from 'gulp-util';
import rename from 'gulp-rename';
import replace from 'gulp-replace';
import gulpSequence from 'gulp-sequence';
import browsersync from 'browser-sync';

//Pug
import pug from 'gulp-pug';

//CSS
import sass from 'gulp-sass';
import cleanCss from 'gulp-clean-css';
import postCss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import mqpacker from 'css-mqpacker';

//JS
import uglify from 'gulp-uglify';
import browserify from 'browserify';
import babelify from 'babelify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';

//Images
import imagemin from 'gulp-imagemin';

// Deployment
import ftp from 'vinyl-ftp';
import config from './config';

//Data
import data from './data';

gulp.task('pug', () => {
	return gulp.src('./src/index.pug')
		.pipe(plumber())
		.pipe(pug({
			locals: data,
			pretty: true
		}))
		.pipe(plumber.stop())
		.pipe(gulp.dest('./build'))
		.pipe(browsersync.stream())
});

gulp.task('js', () => {
	return browserify({
		entries: './src/js/app.js',
			debug: true
		})
		.transform("babelify", {
			presets: ["env"],
			sourceMaps: true
		})
		.bundle()
		.on('error', function(err) {
			console.log(err);
			this.emit('end');
		})
        .pipe(source('app.js'))
		.pipe(buffer())
		.pipe(sourcemaps.init({
			loadMaps: true
		}))				
		.pipe(rename({
			basename: "main",
            suffix: ".min"
        }))
		.pipe(uglify())
        .pipe(sourcemaps.write())
		.pipe(gulp.dest('./build/js'))
        .pipe(browsersync.stream())		
});

gulp.task('css', () => {
    return gulp.src('./src/sass/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .on('error', sass.logError)
        .pipe(postCss([
            autoprefixer(),
			mqpacker()
		]))
        .pipe(sourcemaps.write())				
        .pipe(gulp.dest('./build/css'))
        .pipe(rename({
            suffix: ".min"
        }))
		.pipe(cleanCss())
        .pipe(gulp.dest('./build/css'))
        .pipe(browsersync.stream())
});

gulp.task('img', () => {
    return gulp.src('./src/img/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./build/img'))
});

gulp.task('sync', () => {
    browsersync.init({
        proxy: config.proxy,
        open: false,
        // browser: ['chrome', 'firefox'],
        notify: false
    })
});

gulp.task('build', ['pug', 'css', 'js', 'img']);

gulp.task('watch', () => {
    gulp.watch(['./src/**/*.scss'], ['css']);
    gulp.watch(['./src/**/*.js'], ['js']);
	gulp.watch(['./src/**/*.pug'], ['pug']);
    gulp.watch(['./build/**/*.css',
				'./build/**/*.js',
				'./build/**/*.html',
                ]).on('change', browsersync.reload);
});

gulp.task('default', ['build', 'sync', 'watch']);

gulp.task('deploy', () => {
    const conn = ftp.create({
        host: config.host,
		user: config.user,
		password: config.password,
        parallel: 1,
        log: gutil.log
    } );

    const globs = [
        './build/**'
    ];

    return gulp.src(globs, {
            base: './build',
            buffer: false
        })
		.pipe(conn.newer(config.base))
		.pipe(conn.dest(config.base));
});

