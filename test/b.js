define("b",["c","d"],function(require,module,exports){
    console.log("b");
    var c = require("c");
    var d = require("d");
    module.exports = c + d + 2;
});