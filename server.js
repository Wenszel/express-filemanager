const express = require("express");
const app = express();
const PORT = 3000;
const path = require("path");
var uploadedFiles = [];
var context = {
    files: uploadedFiles,
    layout: 'main.hbs' 
}

var hbs = require('express-handlebars');
var formidable = require('formidable');
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs({ defaultLayout: 'main.hbs' }));
app.set('view engine', 'hbs');
app.use(express.static('static'));

app.post('/handleUpload', function (req, res) {
    var form = new formidable.IncomingForm();
    form.uploadDir = __dirname + '/static/upload/';
    form.keepExtensions = true;
    form.multiples = true;                  
    form.parse(req, function (err, fields, files) { 
        files.filetoupload.forEach(file => {
            uploadedFiles.push(file)
        });
        res.redirect("/filemanager");
    });
});
app.get("/", function (req, res) { 
    res.redirect("/upload")
});
app.get("/upload",function(req,res){
    res.render('upload.hbs', context);
});
app.get("/filemanager",function(req,res){
    res.render('filemanager.hbs', context);
});
app.get("/info",function(req,res){
    res.render('info.hbs', context);
});
app.listen(PORT, function(){
    console.log("Aplikacja uruchamiona na porcie "+PORT);
});