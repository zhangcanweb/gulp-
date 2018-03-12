var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var open = require('open');
let path = {
    srcPath: './src',
    devPath: './dev',
    proPath: './pro'
};
gulp.task('html', function () {
    return gulp.src(path.srcPath + '/**/*.html')
        .pipe(gulp.dest(path.devPath))
        .pipe(gulp.dest(path.proPath))
    // .pipe($.livereload())
    // .pipe($.connect.reload())
});
gulp.task('css', function () {
    return gulp.src(path.srcPath + '/style/**/*.less')
        .pipe($.less())
        .pipe($.autoprefixer({
            browsers: ['last 2 versions'],
            cascade: true
        }))
        .pipe(gulp.dest(path.devPath + '/style'))
        .pipe($.cssmin())
        .pipe(gulp.dest(path.proPath + '/style'))
    // .pipe($.connect.reload())
});
gulp.task('image', function () {
    return gulp.src(path.srcPath + '/images/**/*')
        .pipe(gulp.dest(path.devPath + '/images'))
        .pipe($.cache($.imagemin({
            progressive: true //类型：Boolean 默认：false 无损压缩jpg图片
        })))
        .pipe(gulp.dest(path.proPath + '/images'))
    // .pipe($.connect.reload())
});
gulp.task('js', function () {
    return gulp.src(path.srcPath + '/script/**/*.js')
        // .pipe($.jslint())
        .pipe(gulp.dest(path.devPath + '/script'))
        .pipe($.uglify())
        .pipe(gulp.dest(path.proPath + '/script'))
    // .pipe($.connect.reload())
});
gulp.task('build', ['html', 'css', 'js', 'image']);
gulp.task('clean', function () {
    return gulp.src([path.proPath, path.devPath])
        .pipe($.clean());
});
gulp.task('server', ['build'], function () {
    return gulp.src(path.devPath)
        .pipe($.webserver({
            livereload: true,
            open: true,
            port: 1234
        }))
})
// gulp.task('server',['build'],function(){
//     $.connect.server({
//         root:path.devPath,
//         livereload:true,
//         poot:1234
//     })
//     open('http://localhost:1234');
// })
gulp.task('watch', function () {
    gulp.watch(path.srcPath + '/**/*.html', ['html']);
    gulp.watch(path.srcPath + '/style/**/*.less', ['css']);
    gulp.watch(path.srcPath + '/script/**/*.js', ['js']);
    gulp.watch(path.srcPath + '/images/**/*', ['image']);
})
gulp.task('default', ['clean'], function () {
    //gulp.start()使得gulp先执行clean在执行['watch', 'server']
    return gulp.start(['watch', 'server'])
});