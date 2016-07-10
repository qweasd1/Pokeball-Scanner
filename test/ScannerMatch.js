var chai = require('chai');
var expect = chai.expect;

var Scanner = require('../lib/Scanner');

describe("Scanner",function () {
  var scan;
  beforeEach(function () {
    scan = new Scanner("test");
  })

  describe("match()",function () {
    it("match one",function () {
      var m = scan.match("te");
      expect(scan._cursor).to.be.equal(2);
      expect(m).to.be.equal("te");
    })

    it("match multiple",function () {
      var m1 = scan.match("te");
      var m2 = scan.match("st");

      expect(scan._cursor).to.be.equal(4);
      expect(m1).to.be.equal("te");
      expect(m2).to.be.equal("st");
    })

    it("match out of bound",function () {
      var m = scan.match("test more");

      expect(scan._cursor).to.be.equal(0);
      expect(m).to.be.null;
    })
  })

  describe("matchInt() and matchi",function () {
    it("match one",function () {
      var m = scan.matchInt(2);
      expect(scan._cursor).to.be.equal(2);
      expect(m).to.be.equal("te");
    })

    it("match multiple",function () {
      var m1 = scan.matchInt(2);
      var m2 = scan.matchInt(2);

      expect(scan._cursor).to.be.equal(4);
      expect(m1).to.be.equal("te");
      expect(m2).to.be.equal("st");
    })

    it("match out of bound",function () {
      var m = scan.matchInt(5);

      expect(scan._cursor).to.be.equal(0);
      expect(m).to.be.null;
    })

    it("matchi",function () {
      var m = scan.matchi(3);

      expect(scan._cursor).to.be.equal(3);
      expect(m).to.be.equal("tes");
    })
  })

  describe("matchRegex() and matchr",function () {
    it("match one",function () {
      var m = scan.matchRegex(/te/);
      expect(scan._cursor).to.be.equal(2);
      expect(m).to.be.equal("te");
    })

    it("match multiple",function () {
      var m1 = scan.matchRegex(/te/);
      var m2 = scan.matchRegex(/../);

      expect(scan._cursor).to.be.equal(4);
      expect(m1).to.be.equal("te");
      expect(m2).to.be.equal("st");
    })

    it("match fail",function () {
      var m = scan.matchRegex(/ates/);

      expect(scan._cursor).to.be.equal(0);
      expect(m).to.be.null;
    })

    it("matchr",function () {
      var m = scan.matchr(/te/);

      expect(scan._cursor).to.be.equal(2);
      expect(m).to.be.equal("te");
    })
  })

  describe("matchUntil",function () {
    beforeEach(function () {
      scan = new Scanner("test'+");
    })

    it("matchUntil one item",function () {
      var m = scan.matchUntil("'");
      expect(m).to.deep.equal(["test","'"]);
      expect(scan._cursor).to.equal(5);
    })

    it("matchUntil mutiple item",function () {
      scan = new Scanner("test,,+");
      var m = scan.matchUntil("'",",,");
      expect(m).to.deep.equal(["test",",,"]);
      expect(scan._cursor).to.equal(6);
    })

    it("matchUnitilExclude",function () {
      var m = scan.matchUnitilExclude("'");
      expect(m).to.deep.equal("test");
      expect(scan._cursor).to.equal(4);
    })
  })

  describe("set matchReturnType",function () {
    it("matchReturnType='token'",function () {
      var scan = new Scanner("test",{matchReturnType:'token'});
      var m =scan.matchi(4);
      expect(m).to.deep.equal({value:"test"});
    })
  })

})
