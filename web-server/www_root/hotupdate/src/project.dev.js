window.__require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var b = o.split("/");
        b = b[b.length - 1];
        if (!t[b]) {
          var a = "function" == typeof __require && __require;
          if (!u && a) return a(b, !0);
          if (i) return i(b, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof __require && __require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  app: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "01a571oPSNFybS412caQiKC", "app");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        lbl_app: cc.Label
      },
      start: function start() {
        this.lbl_app.string = "\u8fd9\u662f\u70ed\u66f4\u6d4b\u8bd5\u4ee3\u7801";
      }
    });
    cc._RF.pop();
  }, {} ],
  checkhotupdate: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "bfe58OvpOdJ2qylyVKGhemX", "checkhotupdate");
    "use strict";
    var http = require("./utils/http");
    cc.Class({
      extends: cc.Component,
      properties: {
        url: "http://127.0.0.1:10001",
        hot_json: cc.JsonAsset
      },
      onLoad: function onLoad() {},
      start: function start() {
        var self = this;
        if (!cc.sys.isNative) {
          cc.log("\u975enative\u73af\u5883\u65e0\u70ed\u66f4");
          return;
        }
        this._storagePath = jsb.fileUtils.getWritablePath();
        this.set_hotupdate_search_path();
        var now_list = this.local_hotupdate_download_list(this.hotpath);
        if (!now_list) {
          cc.log("\u89e3\u6790\u672c\u5730hotupdate.json\u51fa\u9519!");
          return;
        }
        var server_list = null;
        http.get(this.url, "/hotupdate/hotupdate.json", null, function(err, data) {
          cc.log("\u8bfb\u53d6\u8fdc\u7a0bdata=", data);
          if (err) {
            cc.log("err=", err);
            return;
          }
          server_list = JSON.parse(data);
          var download_array = [];
          for (var key in server_list) {
            if (now_list[key] && now_list[key].md5 == server_list[key].md5) continue;
            download_array.push(server_list[key]);
          }
          if (0 == download_array.length) {
            cc.log("\u4e0b\u8f7d\u5217\u8868\u4e3a\u7a7a!");
            return;
          }
          cc.log("download_array=", download_array, download_array.length);
          var i = 0;
          var callback = function callback() {
            i++;
            if (i >= download_array.length) {
              jsb.fileUtils.writeStringToFile(data, self.hotpath + "/hotupdate.json");
              cc.audioEngine.stopAll();
              cc.game.restart();
              return;
            }
            self.download_item(self._storagePath, download_array[i], callback);
          };
          self.download_item(self._storagePath, download_array[i], callback);
        });
      },
      set_hotupdate_search_path: function set_hotupdate_search_path() {
        var path = jsb.fileUtils.getSearchPaths();
        var write_path = this._storagePath;
        var hotpath = write_path + "/hotupdate";
        jsb.fileUtils.isDirectoryExist(hotpath) || jsb.fileUtils.createDirectory(hotpath);
        path.unshift(hotpath);
        jsb.fileUtils.setSearchPaths(path);
        cc.log("searchpath=", path);
        this.hotpath = hotpath;
      },
      local_hotupdate_download_list: function local_hotupdate_download_list(hotpath) {
        var json = null;
        var str;
        var hotupdate_json_path = hotpath + "/hotupdate.json";
        try {
          if (jsb.fileUtils.isFileExist(hotupdate_json_path)) {
            str = jsb.fileUtils.getStringFromFile(hotupdate_json_path);
            json = JSON.parse(str);
          } else json = this.hot_json.json;
        } catch (e) {
          json = null;
        }
        return json;
      },
      download_item: function download_item(write_path, server_item, end_func) {
        server_item.file.indexOf(".json") >= 0 ? http.get(this.url, "/" + server_item.file, null, function(err, data) {
          cc.log("get file=", server_item.file);
          if (err) {
            end_func && end_func();
            return;
          }
          var dir_array = server_item.dir.split("/");
          var walk_dir = write_path;
          for (var j = 0; j < dir_array.length; j++) {
            walk_dir += "/" + dir_array[j];
            jsb.fileUtils.isDirectoryExist(walk_dir) || jsb.fileUtils.createDirectory(walk_dir);
          }
          jsb.fileUtils.writeStringToFile(data, write_path + "/" + server_item.file);
          end_func && end_func();
        }) : http.download(this.url, "/" + server_item.file, null, function(err, data) {
          cc.log("download file=", server_item.file);
          if (err) {
            end_func && end_func();
            return;
          }
          var dir_array = server_item.dir.split("/");
          var walk_dir = write_path;
          for (var j = 0; j < dir_array.length; j++) {
            walk_dir += "/" + dir_array[j];
            jsb.fileUtils.isDirectoryExist(walk_dir) || jsb.fileUtils.createDirectory(walk_dir);
          }
          jsb.fileUtils.writeDataToFile(data, write_path + "/" + server_item.file);
          end_func && end_func();
        });
      }
    });
    cc._RF.pop();
  }, {
    "./utils/http": "http"
  } ],
  hotupdate: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "26474kLEzNNzpwyD0mDnqrq", "hotupdate");
    "use strict";
    var hotupdate = {
      "hotupdate/res/import/0a/0ace855e6.json": {
        md5: "3e87465c89dc32638750206ba3e45d52",
        file: "hotupdate/res/import/0a/0ace855e6.json",
        dir: "hotupdate/res/import/0a"
      },
      "hotupdate/res/import/0c/0c84f8cb7.json": {
        md5: "1295bcfe4509ca41ee02cbc5dfc52872",
        file: "hotupdate/res/import/0c/0c84f8cb7.json",
        dir: "hotupdate/res/import/0c"
      },
      "hotupdate/res/import/0d/0d0fde617.json": {
        md5: "ae394ac05903b752fcf3d051d64dd47c",
        file: "hotupdate/res/import/0d/0d0fde617.json",
        dir: "hotupdate/res/import/0d"
      },
      "hotupdate/res/import/0e/0e93aeaa-0b53-4e40-b8e0-6268b4e07bd7.json": {
        md5: "0fb7f23c26141706d52169540374a435",
        file: "hotupdate/res/import/0e/0e93aeaa-0b53-4e40-b8e0-6268b4e07bd7.json",
        dir: "hotupdate/res/import/0e"
      },
      "hotupdate/res/import/11/115286d1-2e10-49ee-aab4-341583f607e8.json": {
        md5: "035ddeb01037278a61c4ed23d4ad715e",
        file: "hotupdate/res/import/11/115286d1-2e10-49ee-aab4-341583f607e8.json",
        dir: "hotupdate/res/import/11"
      },
      "hotupdate/res/import/14/144c3297-af63-49e8-b8ef-1cfa29b3be28.json": {
        md5: "136770105d6220675201dbced4b47eae",
        file: "hotupdate/res/import/14/144c3297-af63-49e8-b8ef-1cfa29b3be28.json",
        dir: "hotupdate/res/import/14"
      },
      "hotupdate/res/import/28/2874f8dd-416c-4440-81b7-555975426e93.json": {
        md5: "7c9b5ea45208c1e83fde870828f71034",
        file: "hotupdate/res/import/28/2874f8dd-416c-4440-81b7-555975426e93.json",
        dir: "hotupdate/res/import/28"
      },
      "hotupdate/res/import/2a/2a296057-247c-4a1c-bbeb-0548b6c98650.json": {
        md5: "8bd5883e722f957ddec43f050ae28b2e",
        file: "hotupdate/res/import/2a/2a296057-247c-4a1c-bbeb-0548b6c98650.json",
        dir: "hotupdate/res/import/2a"
      },
      "hotupdate/res/import/3a/3a7bb79f-32fd-422e-ada2-96f518fed422.json": {
        md5: "b1816625c4589d0c1d5adfe6e0f66060",
        file: "hotupdate/res/import/3a/3a7bb79f-32fd-422e-ada2-96f518fed422.json",
        dir: "hotupdate/res/import/3a"
      },
      "hotupdate/res/import/43/430eccbf-bf2c-4e6e-8c0c-884bbb487f32.json": {
        md5: "8c2d79c8bed8b580484058fdd23a7d42",
        file: "hotupdate/res/import/43/430eccbf-bf2c-4e6e-8c0c-884bbb487f32.json",
        dir: "hotupdate/res/import/43"
      },
      "hotupdate/res/import/6c/6c5cf6e1-b044-4eac-9431-835644d57381.json": {
        md5: "468c4088544a5b95472273cc4e902292",
        file: "hotupdate/res/import/6c/6c5cf6e1-b044-4eac-9431-835644d57381.json",
        dir: "hotupdate/res/import/6c"
      },
      "hotupdate/res/import/6d/6d91e591-4ce0-465c-809f-610ec95019c6.json": {
        md5: "d506b6fccd62c01b061dc3989a0d5035",
        file: "hotupdate/res/import/6d/6d91e591-4ce0-465c-809f-610ec95019c6.json",
        dir: "hotupdate/res/import/6d"
      },
      "hotupdate/res/import/79/79eafaef-b7ef-45d9-9c3f-591dc836fc7a.json": {
        md5: "ed7bdac4f771d17d34de4ccfc8f6949f",
        file: "hotupdate/res/import/79/79eafaef-b7ef-45d9-9c3f-591dc836fc7a.json",
        dir: "hotupdate/res/import/79"
      },
      "hotupdate/res/import/7a/7afd064b-113f-480e-b793-8817d19f63c3.json": {
        md5: "3df07ac606db6be8873bbfee3cc2fbf0",
        file: "hotupdate/res/import/7a/7afd064b-113f-480e-b793-8817d19f63c3.json",
        dir: "hotupdate/res/import/7a"
      },
      "hotupdate/res/import/ab/abc2cb62-7852-4525-a90d-d474487b88f2.json": {
        md5: "d475a0b7dee6712a9e1ed7cee235b0ce",
        file: "hotupdate/res/import/ab/abc2cb62-7852-4525-a90d-d474487b88f2.json",
        dir: "hotupdate/res/import/ab"
      },
      "hotupdate/res/import/c0/c0040c95-c57f-49cd-9cbc-12316b73d0d4.json": {
        md5: "2115086df85cd0d2fd2f30091fb16423",
        file: "hotupdate/res/import/c0/c0040c95-c57f-49cd-9cbc-12316b73d0d4.json",
        dir: "hotupdate/res/import/c0"
      },
      "hotupdate/res/import/c4/c4480a0a-6ac5-443f-8b40-361a14257fc8.json": {
        md5: "54cd59a8521e50e80c9b2b554d05d7f7",
        file: "hotupdate/res/import/c4/c4480a0a-6ac5-443f-8b40-361a14257fc8.json",
        dir: "hotupdate/res/import/c4"
      },
      "hotupdate/res/import/cf/cf7e0bb8-a81c-44a9-ad79-d28d43991032.json": {
        md5: "247fd79cda4bfa4c822745ce5adab12d",
        file: "hotupdate/res/import/cf/cf7e0bb8-a81c-44a9-ad79-d28d43991032.json",
        dir: "hotupdate/res/import/cf"
      },
      "hotupdate/res/import/ec/eca5d2f2-8ef6-41c2-bbe6-f9c79d09c432.json": {
        md5: "b40f86b66c679db2b02317cd8e6d0302",
        file: "hotupdate/res/import/ec/eca5d2f2-8ef6-41c2-bbe6-f9c79d09c432.json",
        dir: "hotupdate/res/import/ec"
      },
      "hotupdate/res/raw-assets/02/0275e94c-56a7-410f-bd1a-fc7483f7d14a.png": {
        md5: "cea68f0d7cba38440224f6f74531e2d8",
        file: "hotupdate/res/raw-assets/02/0275e94c-56a7-410f-bd1a-fc7483f7d14a.png",
        dir: "hotupdate/res/raw-assets/02"
      },
      "hotupdate/res/raw-assets/71/71561142-4c83-4933-afca-cb7a17f67053.png": {
        md5: "c06a93f5f1a8a1c6edc4fd8b52e96cbf",
        file: "hotupdate/res/raw-assets/71/71561142-4c83-4933-afca-cb7a17f67053.png",
        dir: "hotupdate/res/raw-assets/71"
      },
      "hotupdate/res/raw-assets/b4/b43ff3c2-02bb-4874-81f7-f2dea6970f18.png": {
        md5: "83fcc9912e01ae5411c357651fb8b1cf",
        file: "hotupdate/res/raw-assets/b4/b43ff3c2-02bb-4874-81f7-f2dea6970f18.png",
        dir: "hotupdate/res/raw-assets/b4"
      },
      "hotupdate/res/raw-assets/d1/d1d83689-c0f1-4e67-b188-81732f8bd712.jpg": {
        md5: "853e2319a073d4e3abdf7b08af95a2d4",
        file: "hotupdate/res/raw-assets/d1/d1d83689-c0f1-4e67-b188-81732f8bd712.jpg",
        dir: "hotupdate/res/raw-assets/d1"
      },
      "hotupdate/res/raw-assets/d8/d81ec8ad-247c-4e62-aa3c-d35c4193c7af.png": {
        md5: "cdbc996e9ab38bf90c517c528459810e",
        file: "hotupdate/res/raw-assets/d8/d81ec8ad-247c-4e62-aa3c-d35c4193c7af.png",
        dir: "hotupdate/res/raw-assets/d8"
      },
      "hotupdate/res/raw-assets/e8/e851e89b-faa2-4484-bea6-5c01dd9f06e2.png": {
        md5: "90cf45d059d0408bec327f66eae5764c",
        file: "hotupdate/res/raw-assets/e8/e851e89b-faa2-4484-bea6-5c01dd9f06e2.png",
        dir: "hotupdate/res/raw-assets/e8"
      },
      "hotupdate/src/cocos2d-jsb.js": {
        md5: "29d533c9fde955bf593645d9cde94ef7",
        file: "hotupdate/src/cocos2d-jsb.js",
        dir: "hotupdate/src"
      },
      "hotupdate/src/project.dev.js": {
        md5: "9ed66a37d5ed88afd25a0a038ae5cef7",
        file: "hotupdate/src/project.dev.js",
        dir: "hotupdate/src"
      },
      "hotupdate/src/settings.js": {
        md5: "42691285f4c124042037305c619532bd",
        file: "hotupdate/src/settings.js",
        dir: "hotupdate/src"
      }
    };
    module.exports = hotupdate;
    cc._RF.pop();
  }, {} ],
  http: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e387aiOj6pJcLRlWNAC7Aad", "http");
    "use strict";
    var http = {
      get: function get(url, path, params, callback) {
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.timeout = 5e3;
        var requestURL = url + path;
        params && (requestURL += "?" + params);
        xhr.open("GET", requestURL, true);
        cc.sys.isNative && xhr.setRequestHeader("Accept-Encoding", "gzip,deflate", "text/html;charset=UTF-8");
        xhr.onreadystatechange = function() {
          if (4 == xhr.readyState && xhr.status >= 200 && xhr.status < 300) try {
            cc.log("\u8fd4\u56de\u72b6\u60011", xhr.readyState + ":" + xhr.status, url + path);
            var ret = xhr.responseText;
            callback(null, ret);
            return;
          } catch (e) {
            cc.log("\u8fd4\u56de\u72b6\u60012", xhr.readyState + ":" + xhr.status, url + path);
          } else cc.log("\u5176\u5b83\u72b6\u6001", xhr.readyState + ":" + xhr.status);
        };
        xhr.send();
        return xhr;
      },
      download: function download(url, path, params, callback) {
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.timeout = 5e3;
        var requestURL = url + path;
        params && (requestURL += "?" + params);
        xhr.responseType = "arraybuffer";
        xhr.open("GET", requestURL, true);
        cc.sys.isNative && xhr.setRequestHeader("Accept-Encoding", "gzip,deflate", "text/html;charset=UTF-8");
        xhr.onreadystatechange = function() {
          if (4 == xhr.readyState && xhr.status >= 200 && xhr.status < 300) try {
            var buffer = xhr.response;
            var dataview = new DataView(buffer);
            var ints = new Uint8Array(buffer.byteLength);
            for (var i = 0; i < ints.length; i++) ints[i] = dataview.getUint8(i);
            callback(null, ints);
          } catch (e) {}
        };
        xhr.send();
        return xhr;
      }
    };
    module.exports = http;
    cc._RF.pop();
  }, {} ]
}, {}, [ "checkhotupdate", "hotupdate", "app", "http" ]);