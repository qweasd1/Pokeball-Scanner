var chai = require('chai');
var expect = chai.expect;

var Scanner = require('../lib/Scanner');


describe("Scanner skip",function () {
  var scan;
  var skip;

  function collectMatches(scan) {
    var m,matches=[];
    while (m = scan.matchr(/\w+/)) {
      matches.push(m);
    }
    return matches;
  }

  it("skip one pattern (IsCollect is false)",function () {
    skip =[
      {
        name:'whitespace',
        pattern: /\s+/
      }
    ]
    scan = new Scanner("a b   c\r\n   test",{skip:skip});
    var matches = collectMatches(scan);
    expect(matches).to.deep.equal(["a","b","c","test"]);
    expect(scan.isEnd()).to.be.true;
  })

  it("skip one pattern (IsCollect is true)",function () {
    skip =[
      {
        name:'whitespace',
        pattern: /\s+/,
        isCollect: true
      }
    ]
    scan = new Scanner("a b   c\r\n   test",{skip:skip});
    var matches = collectMatches(scan);
    expect(matches).to.deep.equal(["a","b","c","test"]);
    expect(scan.skips).to.deep.equal({whitespace:[" ","   ","\r\n   "]})
    expect(scan.isEnd()).to.be.true;
  })

  it("skip multiple pattern (one of them's IsCollect is true)",function () {
    skip =[
      {
        name:'whitespace',
        pattern: /\s+/,
        isCollect: false
      },
      {
        name:'one-line-commnt',
        pattern: /\/\/(.|\r)*(\n|$)/,
        isCollect: true
      }
    ]
    scan = new Scanner("a b   //comment1\r\n   test //comment2",{skip:skip});
    var matches = collectMatches(scan);
    expect(matches).to.deep.equal(["a","b","test"]);
    expect(scan.skips).to.deep.equal({'one-line-commnt':["//comment1\r\n","//comment2"]});
    expect(scan.isEnd()).to.be.true;
  })
})
