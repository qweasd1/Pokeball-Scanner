var chai = require('chai');
var expect = chai.expect;

var Scanner = require('../lib/Scanner');


describe("Scanner",function () {
  it("initialize with default config",function () {
    var text = "test";
    var scan = new Scanner(text);
    expect(scan.text).to.be.equal(text);
    expect(scan._textLength).to.be.equal(text.length);
    expect(scan._cursor).to.be.equal(0);
    expect(scan._hasSkipPattern).to.be.equal(false);
    expect(scan._skipPatterns).to.be.undefined;

  })

  describe("initialize with skip patterns",function () {


    it("(isCollect is missing)",function () {
      var text = "test";
      var skip = [
        {
          name:"comment",
          pattern:/\/\/.*?\n/
        }
      ]
      var scan = new Scanner(text,{skip:skip});
      expect(scan.text).to.be.equal(text);
      expect(scan._textLength).to.be.equal(text.length);
      expect(scan._cursor).to.be.equal(0);
      expect(scan._hasSkipPattern).to.be.equal(true);
      expect(scan._skipPatterns).to.be.deep.equal([{name:"comment",pattern:/^\/\/.*?\n/,isCollect:false}]);
    })

    it("(isCollect is false)",function () {
      var text = "test";
      var skip = [
        {
          name:"comment",
          pattern:/\/\/.*?\n/,
          isCollect:false
        }
      ]
      var scan = new Scanner(text,{skip:skip});
      expect(scan.text).to.be.equal(text);
      expect(scan._textLength).to.be.equal(text.length);
      expect(scan._cursor).to.be.equal(0);
      expect(scan._hasSkipPattern).to.be.equal(true);
      expect(scan._skipPatterns).to.be.deep.equal([{name:"comment",pattern:/^\/\/.*?\n/,isCollect:false}]);
    })

    it("(isCollect is true)",function () {
      var text = "test";
      var skip = [
        {
          name:"comment",
          pattern:/\/\/.*?\n/,
          isCollect:true
        }
      ]
      var scan = new Scanner(text,{skip:skip});
      expect(scan.text).to.be.equal(text);
      expect(scan._textLength).to.be.equal(text.length);
      expect(scan._cursor).to.be.equal(0);
      expect(scan._hasSkipPattern).to.be.equal(true);
      expect(scan._skipPatterns).to.be.deep.equal([{name:"comment",pattern:/^\/\/.*?\n/,isCollect:true}]);
    })
  })

  describe("initialize with location info",function () {
    it("location is missing",function () {
      var text = "test";

      var scan = new Scanner(text);
      expect(scan.text).to.be.equal(text);
      expect(scan._textLength).to.be.equal(text.length);
      expect(scan._cursor).to.be.equal(0);
      expect(scan._hasSkipPattern).to.be.equal(false);

      expect(scan._isCatchLocationIndex).to.be.false;
      expect(scan._isCatchLocationRowCol).to.be.false;
    })

    it("location = 'index'",function () {
      var text = "test";
      var location = "index"
      var scan = new Scanner(text,{location:location});
      expect(scan.text).to.be.equal(text);
      expect(scan._textLength).to.be.equal(text.length);
      expect(scan._cursor).to.be.equal(0);
      expect(scan._hasSkipPattern).to.be.equal(false);

      expect(scan._isCatchLocationIndex).to.be.true;
      expect(scan._isCatchLocationRowCol).to.be.false;
    })

    it("location = 'row-col'",function () {
      var text = "test";
      var location = "row-col"
      var scan = new Scanner(text,{location:location});
      expect(scan.text).to.be.equal(text);
      expect(scan._textLength).to.be.equal(text.length);
      expect(scan._cursor).to.be.equal(0);
      expect(scan._hasSkipPattern).to.be.equal(false);

      expect(scan._isCatchLocationIndex).to.be.false;
      expect(scan._isCatchLocationRowCol).to.be.true;
    })

    it("location = ['row-col','index']",function () {
      var text = "test";
      var location = ['row-col','index'];
      var scan = new Scanner(text,{location:location});
      expect(scan.text).to.be.equal(text);
      expect(scan._textLength).to.be.equal(text.length);
      expect(scan._cursor).to.be.equal(0);
      expect(scan._hasSkipPattern).to.be.equal(false);

      expect(scan._isCatchLocationIndex).to.be.true;
      expect(scan._isCatchLocationRowCol).to.be.true;
    })

  })
})
