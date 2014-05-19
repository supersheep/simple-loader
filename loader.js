"use strict";
(function(host){
var _mods = {};

function doTasks(tasks,callback){

    var count = tasks.length;
    var results = [];
    if(tasks.length == 0){
        return callback();
    }
    tasks.forEach(function(task,i){
        task(function(result){
            results[i] = result;
            count--;
            if(count == 0){
                callback(results);
            }
        });
    });
}

function define(name, deps, factory){
    var _deps = {};
    var tasks = deps.map(function(depName){
        return function(done){
            /* 加载依赖 */
            require(depName, function(api){
                _deps[depName] = {
                    exports: api
                };
                _mods[depName].exports = api;
                done(api);
            });
        };
    });

    /* 加载所有依赖 */
    doTasks(tasks,function(){
        /* 所有依赖加载完成 */
        var module = _mods[name];
        var exports = module.exports = {};
        function _require(dep){
            return _deps[dep].exports;
        }
        factory(_require,module,exports);
        _mods[name].callbacks.forEach(function(callback){
            callback.call(null,module.exports);
        });
    });
}

function require(modName,callback){


    var mod = _mods[modName];

    if(mod){
        /* 模块已存在 */
        if(mod.exports){
            callback(mod);
        }else{
            /* 正在加载  */
            /* 等待加载完成 */
            mod.callbacks.push(callback);
        }

    }else{
        _mods[modName] = {
            name:modName,
            exports:null,
            // 注册依赖加载完成后的回调
            callbacks:[callback]
        };

        /* 模块不存在  */
        var src = resolveSrc(modName);
        loadScript(src, function(){
            /* 加载模块 */
            /* 等待模块依赖完成，这里不用做任何事情 */
        });

    }
}

function resolveSrc(modName){
    return modName + ".js";
}

function loadScript(src,callback){
    var script = document.createElement("script");
    script.src=src;
    script.onload = callback;
    document.head.appendChild(script);
}

host.require = require;
host.define = define;

})(window);