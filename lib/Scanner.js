var util = require('util');

function Scanner(text,option) {
  this.text = text;
  this.option = option || {};

  this._cursor = 0;
  this._textLength = this.text.length;

  // initialize Skip configuration
  if (this._hasSkipPattern = (!!this.option.skip)) {
    this._skipPatterns = [];
    //[not test yet] [boost performance] compile the skip pattern first
    // [TODO] check if
    for (var i = 0; i <this.option.skip.length; i++) {
      var p = this.option.skip[i];
      var compiled_p = {
        name:p.name,
        pattern:new RegExp(p.pattern),
        isCollect: p.isCollect || false
      };
      this._skipPatterns.push(compiled_p);
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
}

function ScannerError(message) {
  this.message = message;
}




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




module.exports = Scanner;
