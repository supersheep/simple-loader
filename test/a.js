define("a",["b","c"],function(require,module,exports){
    console.log("a");
    var b = require("b");
    var c = require("c");
    exports.b = b;
    exports.c = c;
});