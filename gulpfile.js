var gulp = require('gulp');
var request = require('request');
var fs = require('fs');
var rename = require('gulp-rename');


gulp.task('contentful_api',['clean'], function () {
  return request('https://cdn.contentful.com/spaces/rtzf554imq6s/entries?access_token=63a2ac32a758e5f148eca9353d4ee4fd69c4d93ea0d49c355c4673a572b7ac3b&content_type=2wKn6yEnZewu2SCCkus4as&order=-sys.updatedAt').pipe(fs.createWriteStream('contentful.json'));
});

gulp.task('load_json',['contentful_api'],function()
{
  var keyValue = new Array();
  var resultJson = new Array();
  var articleJson = new Array();
  var result =new Object();

  var json = JSON.parse(fs.readFileSync('./contentful.json'));
  if (typeof json !== "undefined" && json !== null) {
    for (var item in json.includes.Asset)
      keyValue[json.includes.Asset[item].sys.id]=json.includes.Asset[item].fields.file.url;

    for (var item in json.items)
    {
        resultJson.push(
        {
          "title":json.items[item].fields.title,
          "createdTime":json.items[item].sys.createdAt,
          "ID":json.items[item].sys.id,
          "updatedTime":json.items[item].sys.updatedAt,
          "slug":json.items[item].fields.slug,
          "body":json.items[item].fields.body,
          "description":json.items[item].fields.description,
          "isItContentfulArticle":json.items[item].fields.isItContentfulArticle,
          "featuredImageId":json.items[item].fields.featuredImage.sys.id,
          "comments":json.items[item].fields.comments,
          "imageFileUrl":keyValue[json.items[item].fields.featuredImage.sys.id]
        });

        fs.writeFile("./src/article_json/"+json.items[item].fields.title+".json",JSON.stringify(  {
              "title":json.items[item].fields.title,
              "createdTime":json.items[item].sys.createdAt,
              "updatedTime":json.items[item].sys.updatedAt,
              "slug":json.items[item].fields.slug,
              "body":json.items[item].fields.body,
              "description":json.items[item].fields.description,
              "imageFileUrl":keyValue[json.items[item].fields.featuredImage.sys.id],
              "comments":json.items[item].fields.comments
          }));
    }
  //  console.log("******************************************* resultJson "+JSON.stringify(resultJson));
    fs.writeFile('./main.json', "{\"list\":"+JSON.stringify(resultJson)+"}");
    console.log("Written to file.");
  }
});

var util = require('util');
gulp.task('website-generator',['load_json'], function() {
  setTimeout(function() {
    var data = fs.readFileSync("./main.json", "utf8");
      return gulp.src('./src/index-markup.html')
      .pipe(nunjucks.compile(JSON.parse(data)))
      .pipe(rename("index.html"))
      .pipe(gulp.dest('./src/'));
  }, 500);
});
const nunjucks = require('gulp-nunjucks');

var foreach = require('gulp-foreach');
var markdown = require('gulp-markdown');

const arrayHtmlFiles=[];
gulp.task('article-generator',['website-generator'], function() {

    return gulp.src('./src/article_json/*.json')
      .pipe(foreach(function(stream, file){
        var pathFile = file.path;
        var finalPath = pathFile.substring(0,pathFile.lastIndexOf("/")+1);
        var data = fs.readFileSync(pathFile, "utf8");
        var contents = JSON.parse(data);
        var replaceSlug =contents.slug.replace("/","");

          return gulp.src('./src/article.html')
            .pipe(nunjucks.compile(contents))
            .pipe(rename(replaceSlug+'.html'))
            .pipe(gulp.dest('./src/article/'));
        return stream
      }));
});

var webserver = require('gulp-webserver');

gulp.task('default',['article-generator'], function() {
  // gulp.src('./build/')
  //   .pipe(webserver({
  //     livereload: true,
  //     directoryListing: false,
  //     open: true,
  //     port:8080
  //   }));
});

var del = require('del');
gulp.task('clean', function () {
  return del([
    './src/article_json/**/*',
    './src/article/**/*',
    './build/article_json/**/*',
    './build/article.html',
    './build/common/**/*',
  ]);
 });

 gulp.task('full-clean', function () {
   return del([
     './src/article_json/**/*',
     './src/article/**/*',
     './build//**/*',
   ]);
  });


//Getting all the entries
//https://cdn.contentful.com/spaces/rtzf554imq6s/entries?access_token=63a2ac32a758e5f148eca9353d4ee4fd69c4d93ea0d49c355c4673a572b7ac3b&content_type=2wKn6yEnZewu2SCCkus4as&order=-sys.updatedAt

//Getting only the selected fields.
//https://cdn.contentful.com/spaces/rtzf554imq6s/entries?select=sys.id,fields.title,fields.slug,fields.description,fields.isItContentfulArticle,sys.createdAt,sys.updatedAt&access_token=63a2ac32a758e5f148eca9353d4ee4fd69c4d93ea0d49c355c4673a572b7ac3b&content_type=2wKn6yEnZewu2SCCkus4as&order=-sys.updatedAt

//Getting the entry information.
//https://cdn.contentful.com/spaces/rtzf554imq6s/entries/6uUq1WaNKEcG8SUuaUmI6K?access_token=63a2ac32a758e5f148eca9353d4ee4fd69c4d93ea0d49c355c4673a572b7ac3b

//getting the image using this google apis
//https://cdn.contentful.com/spaces/rtzf554imq6s/assets/3Zzqi9TM4g6sosgKkuK8Ii?access_token=63a2ac32a758e5f148eca9353d4ee4fd69c4d93ea0d49c355c4673a572b7ac3b
