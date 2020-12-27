const express = require("express");
const app = express();
const PORT = 3000;
const path = require("path");
var uploadedFiles = [];
var context = {
    files: uploadedFiles,
    layout: 'main.hbs' 
}
var currentId = 1
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
        console.log(files)
        if(Array.isArray(files.filetoupload)){
            files.filetoupload.forEach(file => {
                file.id = currentId;
                currentId++;
                uploadedFiles.push(file);
            });
        }else{
            files.filetoupload.id = currentId;
            currentId++;
            uploadedFiles.push(files.filetoupload);
    }
        res.redirect("/filemanager");
    
    });
});
app.get('/deleteFileData', function(req,res){
    uploadedFiles.filter((file, index) => {
        if(file.id == req.query.id){
            uploadedFiles.splice(index,1);
        }
        res.redirect("/filemanager");
    });
});
app.get('/deleteFilesData', function(req,res){
    uploadedFiles.splice(0, uploadedFiles.length)
    res.redirect("/filemanager");
});
app.get('/downloadFile',function(req,res){
    uploadedFiles.filter(i => {
        if(i.id == req.query.id){
            res.download(i.path);
        }
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
    if(req.query.id==null){
        res.render('info.hbs', context);
    }else{
        uploadedFiles.filter(file => {
            if(file.id == req.query.id){
                res.render('info.hbs', file);
            }
        });
    }
});
app.listen(PORT, function(){
    console.log("Aplikacja uruchamiona na porcie "+PORT);
});