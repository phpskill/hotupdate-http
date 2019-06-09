var fs = require("fs");
var path = require("path");
var crypto = require("crypto");

var HOTUPDATE_DIR = "./www_root/hotupdate"; // 热更新资源所在目录

if(!fs.existsSync(HOTUPDATE_DIR)){
    console.log(HOTUPDATE_DIR, "is not exist!");
    return;
}

function readDir(dir, obj){
    var stat = fs.statSync(dir);
    if(!stat.isDirectory()){
        console.log(dir, "is not directory, exist!");
        return;
    }

    var subpaths = fs.readdirSync(dir);
    // console.log(subpaths);

    var subpath;
    var md5;
    for(var i = 0; i < subpaths.length; i++){
        if(subpaths[i][0] === "."){
            continue;
        }

        subpath = path.join(dir, subpaths[i]);
        // console.log(subpath);

        stat = fs.statSync(subpath);

        if(stat.isDirectory()){
            readDir(subpath, obj);
        }else{
            md5 = crypto.createHash("md5").update(fs.readFileSync(subpath)).digest("hex"); // 32位的md5
            obj[subpath] = {
                "md5": md5,
                "file": subpath,
                "dir": dir
            };
        }

    }

}

var obj = {};

process.chdir("./www_root");

readDir("hotupdate/res", obj);
readDir("hotupdate/src", obj);

// console.log(obj);

var str = JSON.stringify(obj);

fs.writeFileSync("./hotupdate/hotupdate.json", str);

str = "var hotupdate = \n" + str + "\nmodule.exports = hotupdate;";
fs.writeFileSync("./hotupdate/hotupdate.js", str);