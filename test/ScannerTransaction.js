var chai = require('chai');
var expect = chai.expect;

var Scanner = require('../lib/Scanner');

describe("Scanner",function () {
  var scan;
  beforeEach(function () {
    scan = new Scanner("test");
  })

  it("single transaction rollback()",function () {
    scan.beginTx();
    scan.matchi(1);
    scan.match("es");
    scan.rollback();
    expect(scan._cursor).to.be.equal(0);
  })

  it("single transaction commit()",function () {
    scan.beginTx();
    scan.matchi(1);
    scan.match("es");
    scan.commit();
    expect(scan._cursor).to.be.equal(3);
    expect(scan._transctionStack.length).to.be.equal(0);
  })

  it("nested transaction rollback()",function () {
    scan.beginTx();
    scan.matchi(1);

    scan.beginTx();
    scan.matchi(1);
    scan.matchi(1);

    scan.rollback();
    expect(scan._cursor).to.be.equal(1);
    expect(scan._transctionStack.length).to.be.equal(1);

    scan.rollback();
    expect(scan._cursor).to.be.equal(0);
    expect(scan._transctionStack.length).to.be.equal(0);

  })

  it("call rollback() mutiple time and failed",function () {
    expect(function () {
      scan.beginTx();
      scan.matchi(1);
      scan.match("es");
      scan.rollback();
      scan.rollback();
    }).to.throw(Scanner.Error,"transaction stack is empty, can't rollback");

  })
})
