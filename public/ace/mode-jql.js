define("ace/mode/jql_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var JqlHighlightRules = function() {

    var keywords = (
        "SELECT|DESCRIBE|SEARCH|DISTINCT|FROM|WHERE|KEYS|VALUES|WITH|KEY|VALUE|AS|JSON|PRETTY|CASE|SENSITIVE|FOR|ANY|BY|ELEMENT|ORDER|BY|DESC|LIMIT|OFFSET"
    );

    var builtinConstants = (
        "TRUE|FALSE|OBJECT|ARRAY|NUMBER|STRING|BOOLEAN|NULL"
    );

    var builtinFunctions = (
        "MIN|MAX|SUM|COUNT"
    );

    var keywordMapper = this.createKeywordMapper({
        "support.function": builtinFunctions,
        "keyword": keywords,
        "constant.language": builtinConstants
    }, "identifier", true);

    this.$rules = {
        "start" : [ {
            token : "string",           // " string
            regex : '".*?"'
        }, {
            token : "string",           // ' string
            regex : "'.*?'"
        }, {
            token : "constant.numeric", // float
            regex : "-?\\d+(?:\\.\\d+)?\\b"
        }, {
            token : keywordMapper,
            regex : "[a-zA-Z]+\\b"
        }, {
            token : "keyword.operator",
            regex : "==|!=|#|!#|<|>|<=|>="
        }, {
            token : "paren.lparen",
            regex : "[\\(]"
        }, {
            token : "paren.rparen",
            regex : "[\\)]"
        }, {
            token : "text",
            regex : "\\s+"
        } ]
    };
    this.normalizeRules();
};

oop.inherits(JqlHighlightRules, TextHighlightRules);

exports.JqlHighlightRules = JqlHighlightRules;
});

define("ace/mode/jql",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/jql_highlight_rules"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var JqlHighlightRules = require("./jql_highlight_rules").JqlHighlightRules;

var Mode = function() {
    this.HighlightRules = JqlHighlightRules;
    this.$behaviour = this.$defaultBehaviour;
};
oop.inherits(Mode, TextMode);

(function() {

    this.$id = "ace/mode/jql";
}).call(Mode.prototype);

exports.Mode = Mode;

});                (function() {
                    window.require(["ace/mode/jql"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            