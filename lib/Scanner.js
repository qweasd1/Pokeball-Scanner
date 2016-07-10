var util = require('util');

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
    this.__location_row_base = location_row_base || 0;
    this.__location_col_base = location_col_base; || 0;
    this.__lineEnds = [];



    this.indexToRowCol = function (index) {

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
        this._move(str.length);
        return str;
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
        this._move(n);
        return matchText;
      }
    }
  },
  // make sure pattern is sticky and delegate function to _matchRegex
  matchRegex:function (pattern) {
    pattern = new RegExp("^"+pattern.source);
    return this._matchRegex(pattern);

  },
  _matchRegex:function (pattern) {
    var match = pattern.exec(this.rest());
    if (match == null) {
      return null;
    }
    else {
      match = match[0]
      this._move(match.length);
      return match;
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
      throw new ScannerError("transaction stack is empty, can't rollback");
    }
    else {
      this._cursor = checkpoint;
    }
  },
  commit:function () {
    var checkpoint = this._transctionStack.pop();
    if (checkpoint === undefined) {
      throw new ScannerError("transaction stack is empty, can't commit");
    }
  },
  rest:function () {
    return this.text.substr(this._cursor);
  },
  _move:function (n) {
    this._cursor += n;
  }
}

Scanner.prototype.matchi = Scanner.prototype.matchInt
Scanner.prototype.matchr = Scanner.prototype.matchRegex
Scanner.prototype.peeki = Scanner.prototype.peekInt
Scanner.prototype.peekr = Scanner.prototype.peekRegex


function ScannerError(message) {
  this.message = message;
}

util.inherits(ScannerError,Error);




function _setStringLocationInfo(locationInfo) {

    if (locationInfo == "index") {
      this._isCatchLocationIndex = true

    }
    else if (locationInfo == "row-col") {
      this._isCatchLocationRowCol = true
    }
    else{
      throw new ScannerError(locationInfo + " is not a valid location,location only support(index,row-col)");
    }
}

Scanner.Error = ScannerError;


module.exports = Scanner;
