var express = require("express");
var app = express();
var path = require("path");
var fs = require("fs");

var dir = "./www_root";
if(fs.existsSync(dir)){
    app.use(express.static(path.join(__dirname, dir)));
}else{
    console.log(dir, "is not exist!");
    return;
}

var port = 10001;
app.listen(port);

console.log("webserver start at port =", port);