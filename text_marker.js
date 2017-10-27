(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["textMarker"] = factory();
   //Text Marker Library DEVELOPMENT version
	else
		root["textMarker"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.escapeStringForRegex = escapeStringForRegex;
exports.setTokensForIndex = setTokensForIndex;
exports.getTokensForIndex = getTokensForIndex;
exports.updateStack = updateStack;
exports.handleBufferedTokens = handleBufferedTokens;
exports.isBlock = isBlock;
exports.isRange = isRange;
exports.isEndToken = isEndToken;
exports.isStartToken = isStartToken;
exports.isMatching = isMatching;
exports.createVirtualToken = createVirtualToken;
exports.createMatch = createMatch;
exports.closesPreviousToken = closesPreviousToken;
exports.closeOpenTokens = closeOpenTokens;
exports.isVisibleToken = isVisibleToken;
exports.normalize = normalize;

var _token_stack = __webpack_require__(4);

var _token_stack2 = _interopRequireDefault(_token_stack);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function escapeStringForRegex(s) {
  return s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}
function setTokensForIndex(index, token, tokens) {
  var key = '' + index;
  if (tokens[key] instanceof Array === false) tokens[key] = [];
  return tokens[key].push(token);
}

function getTokensForIndex(index, tokens) {
  if (!tokens['' + index]) return [];
  return tokens['' + index].reverse();
}

function updateStack(stack, token) {
  // todo: add check to handle dangling end token
  switch (token.type) {
    case 'BLOCK_END':
      stack.pop();
      break;
    case 'RANGE_END':
      stack.pop();
      break;
    case 'BLOCK_START':
      stack.push(token);
      break;
    case 'RANGE_START':
      stack.push(token);
      break;
    default:
      break;
  }
}

function handleBufferedTokens(tokens, stack, fixedTokens) {
  if (tokens.length > 0) {
    tokens.forEach(function (token) {
      fixedTokens.push(token);
      updateStack(stack, token);
    });
  }
}

function isBlock(token) {
  return token.type === 'BLOCK_START' || token.type === 'BLOCK_END';
}

function isRange(token) {
  return token.type === 'RANGE_START' || token.type === 'RANGE_END';
}

function isEndToken(token) {
  return token.type === 'RANGE_END' || token.type === 'BLOCK_END';
}

function isStartToken(token) {
  return token.type === 'RANGE_START' || token.type === 'BLOCK_START';
}

function isMatching(t1, t2) {
  if (t1.name !== t2.name) return false;

  if (isStartToken(t1) && isEndToken(t2) || isStartToken(t2) && isEndToken(t1)) {
    return true;
  }

  return false;
}

function createVirtualToken(token) {
  return Object.assign({}, token, { _virtual: true });
}

function createMatch(token) {
  var type = void 0;
  if (isBlock(token) && isStartToken(token)) type = 'BLOCK_END';
  if (isBlock(token) && isEndToken(token)) type = 'BLOCK_START';
  if (isRange(token) && isStartToken(token)) type = 'RANGE_END';
  if (isRange(token) && isEndToken(token)) type = 'RANGE_START';
  return Object.assign({}, createVirtualToken(token), { type: type });
}

// Returns true if the given token end the most recent token in the stack
function closesPreviousToken(token, stack) {
  var lastStackToken = stack.at(stack.length - 1);
  if (lastStackToken.name === token.name && isStartToken(lastStackToken) && isEndToken(token)) {
    return true;
  }
  return false;
}

function closeOpenTokens(fixedTokens, stack) {
  // push ending tokens until we find a start
  var stackAllIndex = stack.length - 1;
  while (stack.length > 0) {
    var newMatchingToken = createMatch(stack.at(stackAllIndex));
    fixedTokens.push(newMatchingToken);
    updateStack(stack, newMatchingToken);
    stackAllIndex -= 1;
  }
}

var hasVisibleChars = /\S/;
function isVisibleToken(token) {
  if (!token.chars) return false;
  return !!hasVisibleChars.exec(token.chars);
}

// todo: add middleware to handle tables
function normalize(tokens) {
  var tokensForIndex = {}; // buffer for tokens waiting to be inserted
  var stack = new _token_stack2.default();
  var newMatchingToken = void 0;
  var fixedTokens = [];
  var stackAllIndex = void 0;
  tokens.forEach(function (token, index) {
    var bufferedTokens = getTokensForIndex(index, tokensForIndex);
    handleBufferedTokens(bufferedTokens, stack, fixedTokens);

    if (!isEndToken(token)) {
      fixedTokens.push(token);
      updateStack(stack, token);
      return;
    }

    // At this point we know we are dealing with a block or range ending token

    // The happy path. This ending token matches the opening token
    if (closesPreviousToken(token, stack)) {
      fixedTokens.push(token);
      updateStack(stack, token);
      return;
    }

    // if there can be no matching start token dont add to fixed tokens.
    if (!stack.contains(token.name)) {
      return;
    }

    // if closing a table cell close any open tokens
    // blocks / ranges are not allowed to span multiple table cells
    if (token.name === 'TABLE_CELL') {
      // push ending tokens until we find a TABLE_CELL start
      stackAllIndex = stack.length - 1;
      while (!isMatching(token, stack.at(stackAllIndex))) {
        newMatchingToken = createMatch(stack.at(stackAllIndex));
        fixedTokens.push(newMatchingToken);
        updateStack(stack, newMatchingToken);
        stackAllIndex -= 1;
      }
      fixedTokens.push(token);
      updateStack(stack, token);
      return;
    }

    // push ending tokens until we find a start
    stackAllIndex = stack.length - 1;
    while (!isMatching(token, stack.at(stackAllIndex))) {
      // drop ending tokens if they are not properly nested in a table cell.
      if (stack.at(stackAllIndex).name === 'TABLE_CELL' && isStartToken(stack.at(stackAllIndex))) {
        return;
      }
      newMatchingToken = createMatch(stack.at(stackAllIndex));
      setTokensForIndex(index + 1, createVirtualToken(stack.at(stackAllIndex)), tokensForIndex);
      fixedTokens.push(newMatchingToken);
      updateStack(stack, newMatchingToken);
      // buffer starting tokens to be pushed for the next index
      stackAllIndex -= 1;
    }
    fixedTokens.push(token);
    updateStack(stack, token);
  });

  // if there are any open tokens still left on the tack close them
  closeOpenTokens(fixedTokens, stack);
  return fixedTokens;
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = newIndex;
function newIndex(symbol, text) {
  var index = [];
  var pattern = new RegExp('' + symbol, 'gi');

  var matches = pattern.exec(text);
  while (matches) {
    index.push(matches.index);
    matches = pattern.exec(text);
  }
  return index;
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lexer = __webpack_require__(3);

var _lexer2 = _interopRequireDefault(_lexer);

var _range = __webpack_require__(11);

var _range2 = _interopRequireDefault(_range);

var _keyword = __webpack_require__(12);

var _keyword2 = _interopRequireDefault(_keyword);

var _block = __webpack_require__(13);

var _block2 = _interopRequireDefault(_block);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var version = __webpack_require__(14).version;

exports.default = {
  parse: _lexer2.default,
  range: _range2.default,
  keyword: _keyword2.default,
  block: _block2.default,
  version: version
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findPatterns = findPatterns;
exports.tokensToString = tokensToString;
exports.printTokens = printTokens;
exports.applyMiddleware = applyMiddleware;
exports.default = lex;

var _utils = __webpack_require__(0);

var _pattern_buffer = __webpack_require__(5);

var _pattern_buffer2 = _interopRequireDefault(_pattern_buffer);

var _scanner = __webpack_require__(6);

var _scanner2 = _interopRequireDefault(_scanner);

var _tree = __webpack_require__(9);

var _tree2 = _interopRequireDefault(_tree);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function findPatterns(text, buffer, _ref) {
  var pattern = _ref.pattern,
      onMatch = _ref.onMatch;

  if (!text || !pattern || !onMatch || !buffer) return;
  var tokens = void 0;
  var match = pattern.exec(text);
  while (match) {
    tokens = onMatch(match);
    buffer.push(tokens);
    match = pattern.exec(text);
  }
}

function tokensToString(tokens) {
  var output = '';
  var content = void 0;
  tokens.forEach(function (token) {
    content = token.type === 'LITERAL' ? ', ' + token.chars : '';
    content = content.replace('\n', '\\n').replace('\t', '\\t');
    output += token.index + ', ' + token.type + ', ' + token.name + content + '\n';
  });
  return output;
}

function printTokens(tokens) {
  console.log(tokensToString(tokens));
}

function applyMiddleware(text, middleware) {
  try {
    var result = text;
    middleware.forEach(function (func) {
      result = func.apply(null, [result]);
    });
    return result;
  } catch (e) {
    console.error('[Middleware] ' + e.message);
  }
  return text;
}

function lex(inputText, patterns) {
  var middleware = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  var text = applyMiddleware(inputText, middleware);
  if (!text && inputText) {
    return inputText;
  }
  var count = patterns.length;
  // initialize buffer
  var buffer = new _pattern_buffer2.default();
  while (count--) {
    findPatterns(text, buffer, patterns[count]);
  }
  var tokens = new _scanner2.default(text, buffer).scan();
  var fixedTokens = (0, _utils.normalize)(tokens);

  return (0, _tree2.default)(fixedTokens);
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.isInTable = isInTable;
exports.isInTableCell = isInTableCell;
exports.isInTableRow = isInTableRow;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TokenStack = function () {
  function TokenStack() {
    _classCallCheck(this, TokenStack);

    this.stack = { all: [] };
  }

  _createClass(TokenStack, [{
    key: 'at',
    value: function at(index) {
      var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'all';

      return this.stack[name] && this.stack[name][index];
    }
  }, {
    key: 'push',
    value: function push(token) {
      this.stack.all.push(token);
      if (this.stack[token.name] instanceof Array === false) {
        this.stack[token.name] = [];
      }
      this.stack[token.name].push(token);
    }
  }, {
    key: 'pop',
    value: function pop() {
      var token = this.stack.all.pop();
      if (token) this.stack[token.name].pop();
      return token;
    }
  }, {
    key: 'contains',
    value: function contains(name) {
      if (this.stack[name]) {
        if (this.stack[name].length > 0) return true;
      }
      return false;
    }
  }, {
    key: 'length',
    get: function get() {
      return this.stack.all.length;
    }
  }, {
    key: 'last',
    get: function get() {
      var index = this.stack.all.length - 1;
      return this.stack.all[index];
    }
  }]);

  return TokenStack;
}();

exports.default = TokenStack;
function isInTable(stack) {
  return stack.contains('TABLE');
}

function isInTableCell(stack) {
  return stack.contains('TABLE_CELL');
}

function isInTableRow(stack) {
  return stack.contains('TABLE_ROW');
}

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.sortByPriority = sortByPriority;
exports.offsetSort = offsetSort;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// sorting function for an array of tokens
// used to sort tokens assigned to the same string index
function sortByPriority(a, b) {
  var aPriority = a.priority || 0;
  var bPriority = b.priority || 0;
  if (aPriority < bPriority) return -1;
  if (aPriority > bPriority) return 1;
  return 0;
}

function offsetSort() {
  var a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

// Manages queues of tokens to be flushed when scanning a specific index OR character

var PatternBuffer = function () {
  function PatternBuffer() {
    _classCallCheck(this, PatternBuffer);

    // used for looking up tokens by the string index they are associated with
    this.atOffset = {};
    // the string offsets that are associated  with tokens
    this.offsets = [];
  }

  _createClass(PatternBuffer, [{
    key: 'on',
    value: function on(when, index) {
      var key = '' + index;
      if (!this.atOffset[key]) return [];
      return this.atOffset[key][when].sort(sortByPriority);
    }
  }, {
    key: 'getOffsets',
    value: function getOffsets() {
      return [].concat(this.offsets.sort(offsetSort));
    }
  }, {
    key: 'push',
    value: function push(matches) {
      var count = void 0;
      var index = void 0;
      if (matches instanceof Array === false) {
        if (!this.hasIndexAtOffset(matches.index)) this.offsets.push(matches.index);
        index = this.getTokenIndex(matches.index);
        index[matches.handle].push(matches);
      } else {
        count = matches.length;
        while (count--) {
          if (!this.hasIndexAtOffset(matches[count].index)) this.offsets.push(matches[count].index);
          index = this.getTokenIndex(matches[count].index);
          index[matches[count].handle].push(matches[count]);
        }
      }
    }
  }, {
    key: 'hasIndexAtOffset',
    value: function hasIndexAtOffset(key) {
      var i = typeof key !== 'string' ? '' + key : key;
      return !!this.atOffset[i];
    }
  }, {
    key: 'getTokenIndex',
    value: function getTokenIndex(key) {
      var index = this.atOffset;
      // let i = typeof index === 'number' ? `${key}` : key;
      var i = typeof key !== 'string' ? '' + key : key;
      if (!index[i]) {
        this.atOffset[i] = {
          before: [], // tokens intended to be inserted before a char at index is processed
          at: [], // tokens intended to replace char at index
          after: [] // tokens intended to be inserted before a char at index is processed
        };
      }
      return this.atOffset[i];
    }
  }]);

  return PatternBuffer;
}();

exports.default = PatternBuffer;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.getTokenLength = getTokenLength;
exports.getCharIndexFromTokens = getCharIndexFromTokens;
exports.appendLineData = appendLineData;

var _literal = __webpack_require__(7);

var _literal2 = _interopRequireDefault(_literal);

var _char_index = __webpack_require__(1);

var _char_index2 = _interopRequireDefault(_char_index);

var _line_parser = __webpack_require__(8);

var _line_parser2 = _interopRequireDefault(_line_parser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function getTokenLength(token) {
  var length = 0;
  switch (token.type) {
    case 'BLOCK_START':
      length = token.delimiters.open.length;
      break;
    case 'BLOCK_END':
      length = token.delimiters.close.length;
      break;
    default:
      length = token.chars ? token.chars.length : 0;
      break;
  }
  return length;
}

function getCharIndexFromTokens(before, at, after) {
  if (before[0]) return before[0].index;
  if (at[0]) return at[0].index;
  // if (after[0]) return after[0].index;
  return false;
}

function appendLineData(tokens, line) {
  return tokens.map(function (token) {
    return Object.assign({}, token, { line: line });
  });
}
// Manages queues of tokens to be flushed when scanning a specific index or character

var Scanner = function () {
  function Scanner(text, patternMatches) {
    _classCallCheck(this, Scanner);

    this.text = text;
    this.patternMatches = patternMatches;
  }

  /**
   * Does 4 things.
   * Creates a string literal for all the characters between the tokens
   * Takes all tokens queued for BEFORE this index and adds them to tokens.
   * Inserts the last token assigned AT this index and replaces the character in the string.
   * Takes all tokens queued for AFTER this index and adds them to tokens.
   */


  _createClass(Scanner, [{
    key: 'scan',
    value: function scan() {
      var tokens = [];
      var tokenAt = void 0;
      var offsets = this.patternMatches.getOffsets();
      var count = void 0;
      var start = void 0;
      var end = void 0;
      var literal = void 0;
      var before = void 0;
      var after = void 0;
      var at = void 0;
      var lineParser = (0, _line_parser2.default)(this.text);

      // add the beginning and end of string to the offsets the text literal substrings are based on
      if (offsets[0] !== 0) offsets.unshift(0);
      if (offsets[offsets.length - 1] !== this.text.length) offsets.push(this.text.length);

      // process index one greater because there may be tokens that need to be processed
      // before the end of the string
      count = offsets.length + 1;

      while (count--) {
        tokenAt = null;
        start = start || offsets.shift();
        var literalStart = start;
        var lineNumber = void 0;
        end = offsets.shift();

        // todo: replace before/at/after with insert/replace
        before = this.patternMatches.on('before', start);
        after = this.patternMatches.on('after', start);
        at = this.patternMatches.on('at', start);

        // todo: remove line number if no longer needed
        lineNumber = lineParser(getCharIndexFromTokens(before, at, after));

        if (at && at.length) {
          tokenAt = at[at.length - 1];
          literalStart += getTokenLength(tokenAt);
        }

        if (before && before.length) tokens.push.apply(tokens, _toConsumableArray(appendLineData(before, lineNumber)));
        if (tokenAt) tokens.push.apply(tokens, _toConsumableArray(appendLineData([tokenAt], lineNumber)));
        if (literalStart < this.text.length && literalStart < end) {
          // there are no literals after the end of the string.
          literal = (0, _literal2.default)(this.text.substring(literalStart, end), literalStart);
          tokens.push.apply(tokens, _toConsumableArray(appendLineData([literal], lineParser(literal.index))));
        }

        // if (after && after.length) tokens.push(...appendLineData(after, lineNumber));

        start = end;
      }
      return tokens;
    }
  }]);

  return Scanner;
}();

exports.default = Scanner;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = literal;

// anything left over after getting the markup symbols is a string literal.
// unlike the BLOCK anf KEYWORD tokenizers there are no more patterns to match
// we should have the index before the tokenizer is called
function literal(text, start) {
  if (typeof text !== 'string') {
    console.error('LITERAL requires text index to be a string. Got', typeof text === 'undefined' ? 'undefined' : _typeof(text));
    return false;
  }

  if (typeof start !== 'number') {
    console.error('LITERAL requires start index to be a number. Got', typeof start === 'undefined' ? 'undefined' : _typeof(start));
    return false;
  }

  return {
    type: 'LITERAL',
    name: 'TEXT',
    chars: text,
    index: start
  };
}

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = newLineParser;

var _char_index = __webpack_require__(1);

var _char_index2 = _interopRequireDefault(_char_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// returns a function that, for a given token, returns the line number it is on
function newLineParser(text) {
  var newLinesAt = (0, _char_index2.default)('\n', text);
  var lines = newLinesAt.length;
  var cursor = 0;
  return function (index) {
    if (newLinesAt.length === 0) return 1;
    if (index <= newLinesAt[cursor]) return cursor + 1;
    while (index > newLinesAt[cursor]) {
      cursor += 1;
    }
    return cursor + 1;
  };
}

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = makeTree;

var _tree_builder = __webpack_require__(10);

var _tree_builder2 = _interopRequireDefault(_tree_builder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function makeTree(tokens) {
  var Builder = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _tree_builder2.default;

  var treeBuilder = new Builder();

  tokens.forEach(function (token) {
    switch (token.type) {
      case 'LITERAL':
        treeBuilder.addLeaf(token);
        break;
      case 'KEYWORD':
        treeBuilder.addLeaf(token);
        break;
      case 'RANGE_START':
      case 'BLOCK_START':
        treeBuilder.startBranch(token);
        break;
      case 'RANGE_END':
      case 'BLOCK_END':
        treeBuilder.endBranch();
        break;
      default:
        break;
    }
  });

  return treeBuilder.tree;
}

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TreeBuilder = function () {
  function TreeBuilder() {
    _classCallCheck(this, TreeBuilder);

    this.tree = this.currentNode = { name: 'root', children: [] };
    this.nodeStack = [];
  }

  _createClass(TreeBuilder, [{
    key: 'tokenToLeaf',
    value: function tokenToLeaf(token) {
      if (!token) return false;
      return {
        name: token.name,
        text: token.chars
      };
    }
  }, {
    key: 'addLeaf',
    value: function addLeaf(token) {
      var leaf = this.tokenToLeaf(token);
      if (leaf) this.currentNode.children.push(leaf);
    }
  }, {
    key: 'tokenToBranch',
    value: function tokenToBranch(token) {
      if (!token) return false;
      return {
        name: token.name,
        children: []
      };
    }
  }, {
    key: 'startBranch',
    value: function startBranch(token) {
      var branch = this.tokenToBranch(token);
      if (!branch) return;
      this.currentNode.children.push(branch);
      this.currentNode = branch;
      this.nodeStack.push(branch);
    }
  }, {
    key: 'endBranch',
    value: function endBranch() {
      this.nodeStack.pop();
      this.currentNode = this.nodeStack[this.nodeStack.length - 1];
      if (!this.currentNode) this.currentNode = this.tree;
    }
  }]);

  return TreeBuilder;
}();

exports.default = TreeBuilder;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = range;
/**
 * This is a variation of the BLOCK type of token handlers
 * since things can be embedded in them (like other words to highlight)
 * the difference is that instead of a predefine visible characters
 * they have only their text to delineate where they begin and end
 * */

function range(symbol, name) {
  var pattern = void 0;
  if (symbol instanceof RegExp) pattern = symbol;
  if (typeof symbol === 'string') pattern = new RegExp('' + symbol, 'gi');
  if (!pattern) {
    console.error('Cannot create a text range token without a string or regex. Cannot use:', typeof symbol === 'undefined' ? 'undefined' : _typeof(symbol));
    return false;
  }

  return {
    pattern: pattern,
    onMatch: function onMatch(match) {
      var start = match.index;
      var end = match.index + match[0].length;
      return [{
        name: name,
        type: 'RANGE_START',
        chars: null,
        index: start,
        pairedWith: end,
        delimiters: { open: null, close: null },
        priority: start + end,
        handle: 'before'
      }, {
        name: name,
        type: 'RANGE_END',
        chars: null,
        index: end,
        pairedWith: start,
        delimiters: { open: null, close: null },
        priority: (start + end) * -1,
        handle: 'before'
      }];
    }
  };
}

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = keyword;

var _utils = __webpack_require__(0);

function keyword(symbol, name) {
  var search = (0, _utils.escapeStringForRegex)('' + symbol);
  return {
    pattern: new RegExp(search, 'gi'),
    onMatch: function onMatch(match) {
      var start = match.index;
      return {
        name: name,
        type: 'KEYWORD',
        chars: '' + symbol,
        index: start,
        handle: 'at'
      };
    }
  };
}

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeBlockRegex = makeBlockRegex;
exports.default = block;

var _utils = __webpack_require__(0);

/**
 * Intended to produce a basic block patterns from simple characters
 * for example. if open and close are * then it will match *lorem ipsum*
 * In the event of multiple delimiters surounding text it will treat
 * the outer most delimiters as the token. The others will not be marked as
 * tokens and later treated as literals
 */
function makeBlockRegex(_ref) {
  var open = _ref.open,
      _ref$close = _ref.close,
      close = _ref$close === undefined ? open : _ref$close;

  var escOpen = (0, _utils.escapeStringForRegex)(open);
  var escClose = (0, _utils.escapeStringForRegex)(close);
  // return new RegExp(`(${escOpen})(${escOpen})*[^${escOpen}]+(${escClose})*(${escClose})`, 'g');
  return new RegExp('(' + escOpen + ')+[\\s\\S]+?(' + escClose + ')+', 'gi');
}

function block(delimiters) {
  var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'DEFAULT';

  var start = void 0;
  var end = void 0;

  return {
    pattern: delimiters instanceof RegExp ? delimiters : makeBlockRegex(delimiters),
    onMatch: function onMatch(match) {
      start = match.index;
      end = match.index + match[0].length - match[2].length;
      return [{
        name: name,
        type: 'BLOCK_START',
        index: start,
        pairedWith: end,
        chars: match[1],
        handle: 'at',
        delimiters: delimiters
      }, {
        name: name,
        index: end,
        pairedWith: start,
        type: 'BLOCK_END',
        chars: match[2],
        handle: 'at',
        delimiters: delimiters
      }];
    }
  };
}

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = {"name":"text-marker","version":"0.9.0","description":"A lexical analyzer for parsing text","main":"dist/text_marker.js","repository":{"type":"git","url":"https://github.com/Paul-Guerra/text-marker.git"},"scripts":{"postinstall":"npm run mkdirs","mkdirs":"mkdir -p tmp/","rmdirs":"rm -rf tmp/","start":"npm run build && npm run webpack:watch & babel src/ --out-dir tmp/ --watch","compile":"rm -rf tmp/* && babel src/ --out-dir tmp/","build":"npm run compile && webpack","webpack:watch":"webpack --watch","build:prod":"npm run compile && webpack --config ./webpack.prod.config.js","test":"jest","test:config":"jest --showConfig","lint":"eslint src/**/*.js"},"author":"","license":"MIT","devDependencies":{"babel-cli":"^6.24.1","babel-preset-es2015":"^6.24.1","eslint":"^4.3.0","eslint-config-airbnb":"^15.1.0","eslint-loader":"^1.9.0","eslint-plugin-babel":"^4.1.2","eslint-plugin-import":"^2.7.0","eslint-plugin-react":"^7.1.0","jest":"^20.0.4","uglifyjs-webpack-plugin":"^0.4.6","webpack":"^3.4.1","webpack-merge":"^4.1.0"},"dependencies":{}}

/***/ })
/******/ ])["default"];
});
