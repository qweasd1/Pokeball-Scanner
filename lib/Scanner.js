var util = require('util');
var indexToRowColTransformerFactory = require('./IndexToRowColTransformer');

function Scanner(text,option) {
  this.text = text;
  this.option = option || {};

  // init state
  this._cursor = 0;
  this._textLength = this.text.length;
  this._transctionStack = [];

  // initialize Skip configuration
  if (this._hasSkipPattern = (!!this.option.skip)) {
    this._skipPatterns = [];
    this.skips ={};
    //[not test yet] [boost performance] compile the skip pattern first
    // [TODO] check if
    for (var i = 0; i <this.option.skip.length; i++) {
      var p = this.option.skip[i];
      var compiled_p = {
        name:p.name,
        pattern:new RegExp("^"+p.pattern.source),
        isCollect: p.isCollect || false
      };
      this._skipPatterns.push(compiled_p);
      if (compiled_p.isCollect) {
        this.skips[compiled_p.name] = [];
      }
    }

    // implement the skip logic
    var origMove = this._move.bind(this);

    var skipPatterns = this._skipPatterns;
    var self = this;

    this._move = function (n) {
      origMove(n);
      var skipMatch;
      var p;
      do {
        for (var i = 0; i < skipPatterns.length; i++) {
          p = skipPatterns[i]
          skipMatch = self._matchRegex(p.pattern);
          if (skipMatch) {
            if (p.isCollect) {
              self.skips[p.name].push(skipMatch);
            }
            break;
          }
        }
      } while (skipMatch);
    }
  }

  // initialize location configuration
  var locationInfo = this.option.location;

  if (locationInfo != undefined) {
    if (typeof locationInfo == "string") {

      _setStringLocationInfo.call(this,locationInfo);

    }
    else if (Array.isArray(locationInfo)) {
      for (var i = 0; i < locationInfo.length; i++) {
        var l = locationInfo[i]
        _setStringLocationInfo.call(this,l);
      }
    }
  }
  if (this._isCatchLocationIndex === undefined) {
    this._isCatchLocationIndex = false;
  }

  if (this._isCatchLocationRowCol === undefined) {
    this._isCatchLocationRowCol = false;
  }
  else {
    this._location_row_base = option.location_row_base || 0;
    this._location_col_base = option.location_col_base || 0;

    var transformer = indexToRowColTransformerFactory(this.text,this._location_row_base, this._location_col_base);
    this.pointToRowCol = transformer.pointToRowCol;
    this.rangeToRowCol = transformer.rangeToRowCol;
  }

  // determine the return type
  if (this.option.matchReturnType == 'token') {
    this._matchReturnType = Scanner.matchReturnType.token;
  }
  else if (this.option.matchReturnType == 'value') {
    this._matchReturnType = Scanner.matchReturnType.value;
  }
  else if (this.option.matchReturnType === undefined) {
    this._matchReturnType = Scanner.matchReturnType.value;
  }
  else {
    this.raiseError(this.option.matchReturnType + " is not a valid matchReturnType. matchReturnType can only be 'token' and 'value'")
  }
  // switch on the location, we must return token
  if (this._matchReturnType == Scanner.matchReturnType.value) {
    if (this._isCatchLocationRowCol || this._isCatchLocationIndex) {
      this._matchReturnType = Scanner.matchReturnType.token;
    }
  }

}


Scanner.prototype = {
  peek:function (str) {
    if (!this.isEnd()) {
      if (this.text.substr(this._cursor,str.length) == str) {
        return str;
      }
      else {
        return null;
      }
    }
  },
  peekInt:function (n) {
    if (!this.isEnd()) {
      if (this._cursor + n > this._textLength) {
        return null;
      }
      else{
        return this.text.substr(this._cursor,n);
      }
    }
  },
  peekRegex:function (pattern) {
    pattern = new RegExp("^"+pattern.source);
    return this._peekRegex(pattern);

  },
  _peekRegex:function (pattern) {
    var match = pattern.exec(this.rest());
    if (match == null) {
      return null;
    }
    else {
      return match[0];
    }
  },
  match:function (str) {
    if (!this.isEnd()) {
      if (this.text.substr(this._cursor,str.length) == str) {
        return this._makeMatchResult(str);
      }
      else {
        return null;
      }
    }
  },
  matchInt:function (n) {
    if (!this.isEnd()) {
      if (this._cursor + n > this._textLength) {
        return null
      }
      else{
        var matchText = this.text.substr(this._cursor,n);
        return this._makeMatchResult(matchText);

      }
    }
  },
  // make sure pattern is sticky and delegate function to _matchRegex
  matchRegex:function (pattern) {
    pattern = new RegExp("^"+pattern.source);
    return this._matchRegex(pattern);

  },
  matchUntil:function () {
    return this._matchUntil(Array.prototype.slice.call(arguments),false);
  },
  matchUnitilExclude:function () {
    return this._matchUntil(Array.prototype.slice.call(arguments),true);
  },
  _matchUntil:function (endStrings,isExclude) {
    for (var i = 0; i < endStrings.length; i++) {
      this.beginTx();
      var endStr = endStrings[i];
      var matchText = null,matchEndStr=null;
      var start = this._cursor;

      while (!this.isEnd()) {
        matchEndStr = this.peek(endStr);
        if (matchEndStr !== null) {

          matchText = this.text.substring(start,this._cursor);
          this.rollback();
          var matchResult = this._makeMatchResult(matchText);

          if (isExclude) {
            return matchResult;
          }
          else {
            var endStrResult = this._makeMatchResult(matchEndStr);
            return [matchResult,endStrResult];
          }

        }
        else {
          this._moveOneChar();
        }
      }
      this.rollback();
    }

    return null;
  },
  _matchRegex:function (pattern) {
    var match = pattern.exec(this.rest());
    if (match == null) {
      return null;
    }
    else {
      match = match[0]
      return this._makeMatchResult(match);
    }
  },

  isEnd:function () {
    return this._textLength == this._cursor;
  },
  beginTx:function(){
    this._transctionStack.push(this._cursor);
  },
  rollback:function () {
    var checkpoint = this._transctionStack.pop();
    if (checkpoint === undefined) {
      this.raiseError("transaction stack is empty, can't rollback");
    }
    else {
      this._cursor = checkpoint;
    }
  },
  commit:function () {
    var checkpoint = this._transctionStack.pop();
    if (checkpoint === undefined) {
      this.raiseError("transaction stack is empty, can't commit");
    }
  },
  rest:function () {
    return this.text.substr(this._cursor);
  },
  _move:function (n) {
    this._cursor += n;
  },
  _moveOneChar(){
    this._cursor += 1;
  },
  _makeMatchResult:function (str) {

    if (this._matchReturnType === Scanner.matchReturnType.token) {
      var indexBound = []
      indexBound[0] = this._cursor;
      this._move(str.length);
      indexBound[1] = this._cursor;
      var result = new Token(str);
      if (this._isCatchLocationIndex) {
        result.locIndex = indexBound;
      }

      if (this._isCatchLocationRowCol) {
        result.locRowCol = this.rangeToRowCol(indexBound);
      }

      return result;
    }
    else if(this._matchReturnType === Scanner.matchReturnType.value) {
      this._move(str.length);
      return str;
    }
    else{
      this.raiseError(this.option.matchReturnType + " is not a valid matchReturnType. matchReturnType can only be 'token' and 'value'")
    }
  },
  raiseError:function (message) {
    throw new ScannerError(message);
  }
}

function _setStringLocationInfo(locationInfo) {

    if (locationInfo == "index") {
      this._isCatchLocationIndex = true

    }
    else if (locationInfo == "row-col") {
      this._isCatchLocationRowCol = true
    }
    else{
      this.raiseError(locationInfo + " is not a valid location,location only support(index,row-col)");
    }
}

// add alias
Scanner.prototype.matchi = Scanner.prototype.matchInt
Scanner.prototype.matchr = Scanner.prototype.matchRegex
Scanner.prototype.peeki = Scanner.prototype.peekInt
Scanner.prototype.peekr = Scanner.prototype.peekRegex

// add class level const
Scanner.matchReturnType = {
  value:0,
  token:1
}


function ScannerError(message) {
  this.message = message;
}
util.inherits(ScannerError,Error);

Scanner.Error = ScannerError;

// represet Token
// it optionally has attribute like type,locIndex, locRowCol
function Token(value){
  this.value = value;
}

module.exports = Scanner;
