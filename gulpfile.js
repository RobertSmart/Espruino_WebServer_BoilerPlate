var gulp = require('gulp'),
    inline = require('gulp-inline'),
    rename = require('gulp-rename');
    minifyJs = require('gulp-uglify'),
    concat = require('gulp-concat'),
    minifyCss = require('gulp-minify-css'),
    minifyHTML = require('gulp-htmlmin'),
    replace = require('gulp-replace-task'),
    fs = require('fs');
    var quotedString = require('./gulp_modules/gulp_quoted_string.js')

gulp.task('minifyCss', function(done) {
	gulp.src('./code/css/*.css')
    .pipe(quotedString())
		// .pipe(minifyCss())
    .pipe(concat('style.min.css'))
		.pipe(gulp.dest('./code/dist'));

    done()
});

gulp.task('minifyJs', function(done) {
	gulp.src('./code/js/*.js')
    .pipe(quotedString())
		// .pipe(minifyJs())
		.pipe(rename({
            suffix: '.min'
        }))
		.pipe(gulp.dest('./code/dist'));
    done()
});

gulp.task('site', function(done) {
	var opts = {
	    empy: true,
	    spare: true
	};

	gulp.src('./code/html/site.html')
    .pipe(quotedString())
		// .pipe(minifyHTML({ collapseWhitespace: true }))
		.pipe(gulp.dest('./code/dist'));

    done()
});

gulp.task('mergehtml', function (done) {
  gulp
    .src('./code/modules/webserver.js')
    .pipe(
      replace({
        patterns: [
          {
            match: 'js',
            replacement: fs.readFileSync('./code/dist/site.min.js', 'utf8')
          },
          {
            match: 'css',
            replacement: fs.readFileSync('./code/dist/style.min.css', 'utf8')
          },
          {
            match: 'blePage',
            replacement: fs.readFileSync('./code/dist/site.html', 'utf8')
          }
        ]
      })
    )
    .pipe(gulp.dest('modules'));
    done()
});

gulp.task('default', gulp.series('minifyCss', 'minifyJs', 'site', 'mergehtml'));

// gulp.watch('**/*.html', ['default']);
