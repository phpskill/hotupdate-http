var http = require("./utils/http");

cc.Class({
    extends: cc.Component,

    properties: {
        url: "http://127.0.0.1:10001",
        hot_json: cc.JsonAsset
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {},

    start () {
        var self = this;
        if(!cc.sys.isNative){
            cc.log("非native环境无热更");
            return;
        }
        this._storagePath = jsb.fileUtils.getWritablePath();
        // cc.log("this._storagePath =", this._storagePath);
        this.set_hotupdate_search_path();
        var now_list = this.local_hotupdate_download_list(this.hotpath);
        if(!now_list){
            cc.log("解析本地hotupdate.json出错!");
            return;
        }
        var server_list = null;
        http.get(this.url, "/hotupdate/hotupdate.json", null, function(err, data){
            cc.log("读取远程data=", data);
            if(err){
                cc.log("err=", err);
                return;
            }

            server_list = JSON.parse(data);
            var download_array = [];
            for(var key in server_list){
                if(now_list[key] &&
                    now_list[key].md5 == server_list[key].md5){
                        continue;
                }
                download_array.push(server_list[key]);
            }

            if(download_array.length == 0){
                cc.log("下载列表为空!");
                return;
            }else{
                cc.log("download_array=", download_array, download_array.length);
            }

            var i = 0;
            var callback = function(){
                i++;
                if(i >= download_array.length){
                    jsb.fileUtils.writeStringToFile(data, self.hotpath + "/hotupdate.json");
                    cc.audioEngine.stopAll();
                    cc.game.restart();
                    return;
                }
                self.download_item(self._storagePath, download_array[i], callback);
            }
            self.download_item(self._storagePath, download_array[i], callback);
        });

    },

    set_hotupdate_search_path: function(){
        var path = jsb.fileUtils.getSearchPaths();
        var write_path = this._storagePath;
        var hotpath = write_path + "/hotupdate";

        if(!jsb.fileUtils.isDirectoryExist(hotpath)){
            jsb.fileUtils.createDirectory(hotpath);
        }
        path.unshift(hotpath);
        jsb.fileUtils.setSearchPaths(path);

        cc.log("searchpath=", path);
        this.hotpath = hotpath;
    },

    local_hotupdate_download_list: function(hotpath){
        var json = null;
        var str;
        var hotupdate_json_path =  hotpath + "/hotupdate.json";

        try{
            if(jsb.fileUtils.isFileExist(hotupdate_json_path)){
                str = jsb.fileUtils.getStringFromFile(hotupdate_json_path); // 可写路径下面是一个json文件
                json = JSON.parse(str);
            }else{
                json = this.hot_json.json; // 本地的直接是一个json文件
            }
        }catch(e){
            json = null;
        }
        return json;
    },

    download_item: function(write_path, server_item, end_func){
        // return;
        // cc.log("server_item=", server_item.file);
        if(server_item.file.indexOf(".json") >= 0){
            http.get(this.url, "/" + server_item.file, null, function(err, data){

                cc.log("get file=", server_item.file);
                
                if(err){
                    if(end_func){
                        end_func();
                    }
                    return;
                }

                var dir_array = server_item.dir.split("/");
                var walk_dir = write_path;
                for(var j = 0; j < dir_array.length; j++){
                    walk_dir += "/" + dir_array[j];
                    if(!jsb.fileUtils.isDirectoryExist(walk_dir)){
                        jsb.fileUtils.createDirectory(walk_dir);
                    }
                }

                jsb.fileUtils.writeStringToFile(data, write_path+"/"+server_item.file);
                if(end_func){
                    end_func();
                }
            });
        }else{
            http.download(this.url, "/"+server_item.file, null, function(err, data){

                cc.log("download file=", server_item.file);

                if(err){
                    if(end_func){
                        end_func();
                    }
                    return;
                }
                
                var dir_array = server_item.dir.split("/");
                var walk_dir = write_path;
                for(var j = 0; j < dir_array.length; j++){
                    walk_dir += "/" + dir_array[j];
                    if(!jsb.fileUtils.isDirectoryExist(walk_dir)){
                        jsb.fileUtils.createDirectory(walk_dir);
                    }
                }

                jsb.fileUtils.writeDataToFile(data, write_path+"/"+server_item.file);
                if(end_func){
                    end_func();
                }
            });
        }
    }
});
