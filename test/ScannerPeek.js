var chai = require('chai');
var expect = chai.expect;

var Scanner = require('../lib/Scanner');

describe("Scanner",function () {
  var scan = new Scanner("test");

  it("peek() success",function () {
    var p  = scan.peek("te");
    expect(p).to.equal("te");
    expect(scan._cursor).to.equal(0);
  })

  it("peek() fail",function () {
    var p  = scan.peek("ts");
    expect(p).to.be.null;
    expect(scan._cursor).to.equal(0);
  })

  it("peeki() success",function () {
    var p  = scan.peeki(2);
    expect(p).to.equal("te");
    expect(scan._cursor).to.equal(0);
  })

  it("peeki() fail",function () {
    var p  = scan.peeki(5);
    expect(p).to.be.null;
    expect(scan._cursor).to.equal(0);
  })

  it("peekr() success",function () {
    var p  = scan.peekr(/../);
    expect(p).to.equal("te");
    expect(scan._cursor).to.equal(0);
  })

  it("peeki() fail",function () {
    var p  = scan.peekr(/a.*/);
    expect(p).to.be.null;
    expect(scan._cursor).to.equal(0);
  })


})
