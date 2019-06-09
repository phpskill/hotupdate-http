var http = {
    get: function(url, path, params, callback){
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.timeout = 5000;
        var requestURL = url + path;
        if(params){
            requestURL += "?" + params;
        }
        xhr.open("GET", requestURL, true);
        if(cc.sys.isNative){
            xhr.setRequestHeader("Accept-Encoding", "gzip,deflate", "text/html;charset=UTF-8");
        }

        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 300){
                
                try{
                    cc.log("返回状态1", xhr.readyState + ":" + xhr.status, (url + path));
                    var ret = xhr.responseText;
                    callback(null, ret);
                    return;
                }catch(e){
                    cc.log("返回状态2", xhr.readyState + ":" + xhr.status, (url + path));
                    // callback(e, null);
                }
            }else{
                cc.log("其它状态", xhr.readyState + ":" + xhr.status);
                // callback(xhr.readyState + ":" + xhr.status, null);
            }
        };

        xhr.send();
        return xhr;
    },

    download: function(url, path, params, callback){
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.timeout = 5000;
        var requestURL = url + path;
        if(params){
            requestURL += "?" + params;
        }
        xhr.responseType = "arraybuffer";
        xhr.open("GET", requestURL, true);
        if(cc.sys.isNative){
            xhr.setRequestHeader("Accept-Encoding", "gzip,deflate", "text/html;charset=UTF-8");
        }
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 300){
                try{
                    var buffer = xhr.response;
                    var dataview = new DataView(buffer);
                    var ints = new Uint8Array(buffer.byteLength);
                    for(var i = 0; i < ints.length; i++){
                        ints[i] = dataview.getUint8(i);
                    }
                    callback(null, ints);
                }catch(e){
                    // callback(e, null);
                }
            }else{
                // callback(xhr.readyState + ":" + xhr.status, null);
            }
        }

        xhr.send();
        return xhr;
    }
};

module.exports = http;