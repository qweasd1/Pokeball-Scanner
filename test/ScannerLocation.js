var chai = require('chai');
var expect = chai.expect;

var Scanner = require('../lib/Scanner');

describe("Scanner with Location",function () {
  var location,scan

  it("location='index'",function () {
    location = "index"
    scan = new Scanner('abc\nabc2',{location:location});
    m1 = scan.match("abc");
    scan.match("\n");
    m2 = scan.match("abc2");
    expect(m1).to.be.deep.equal({locIndex:[0,3],value:"abc"});
    expect(m2).to.be.deep.equal({locIndex:[4,8],value:"abc2"});
  })

  it("location='row-col'",function () {
    location = "row-col"
    scan = new Scanner('abc\nabc2',{location:location});
    m1 = scan.match("abc");
    scan.match("\n");
    m2 = scan.match("abc2");
    expect(m1).to.be.deep.equal({locRowCol:{start:[0,0],end:[0,3]},value:"abc"});
    expect(m2).to.be.deep.equal({locRowCol:{start:[1,0],end:[1,4]},value:"abc2"});
  })

  it("location='row-col'",function () {
    location = ["row-col","index"];
    scan = new Scanner('abc\nabc2',{location:location});
    m1 = scan.match("abc");
    scan.match("\n");
    m2 = scan.match("abc2");
    expect(m1).to.be.deep.equal({locRowCol:{start:[0,0],end:[0,3]},value:"abc",locIndex:[0,3]});
    expect(m2).to.be.deep.equal({locRowCol:{start:[1,0],end:[1,4]},value:"abc2",locIndex:[4,8]});
  })
})
