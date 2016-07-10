var chai = require('chai');
var expect = chai.expect;

var makeTransformer = require('../lib/IndexToRowColTransformer');

describe("IndexToRowColTransformerFactory",function () {
  var transformer
     ,rowCol;

  function testTransformer(index,expectedStart, expectedEnd) {
    rowCol = transformer.rangeToRowCol(index);
    expect(rowCol).to.be.deep.equal({start:expectedStart,end:expectedEnd});
  }

  describe("one line without NEWLINE",function () {
    beforeEach(function () {
      transformer = makeTransformer("abc",0,0);
    })

    it("index = [0,0]",function () {
      testTransformer([0,0],[0,0],[0,0]);
    })

    it("index = [0,1]",function () {
      testTransformer([0,1],[0,0],[0,1]);
    })

    it("index = [0,2]",function () {
      testTransformer([0,2],[0,0],[0,2]);
    })

    it("index = [0,4] endIndex out of bound",function () {
      testTransformer([0,4],[0,0],null);
    })

  })


    describe("one line with NEWLINE",function () {
      beforeEach(function () {
        transformer = makeTransformer("abc\n",0,0);
      })

      it("index = [0,0]",function () {
        testTransformer([0,0],[0,0],[0,0]);
      })

      it("index = [0,1]",function () {
        testTransformer([0,1],[0,0],[0,1]);
      })

      it("index = [0,2]",function () {
        testTransformer([0,2],[0,0],[0,2]);
      })

      it("index = [0,3]",function () {
        testTransformer([0,3],[0,0],[0,3]);
      })

      it("index = [0,5]",function () {
        testTransformer([0,5],[0,0],null);
      })
    })

    describe("multiple line without last NEWLINE",function () {
      beforeEach(function () {
        transformer = makeTransformer("a1\nb1\nc1",0,0);
      })

      it("end-point = [0,0]",function () {
        testTransformer([0,0],[0,0],[0,0]);
      })

      it("end-point = [0,1]",function () {
        testTransformer([0,1],[0,0],[0,1]);
      })

      it("end-point = [1,0] ",function () {
        testTransformer([0,3],[0,0],[1,0]);
      })

      it("end-point = [2,1]",function () {
        testTransformer([0,7],[0,0],[2,1]);
      })

      it("row-col = [2,0],[2,1]",function () {
        testTransformer([3,7],[1,0],[2,1]);
      })

      it("row-col = [2,0],[2,2]",function () {
        testTransformer([3,8],[1,0],[2,2]);
      })
    })

    describe("multiple line with last NEWLINE",function () {
      beforeEach(function () {
        transformer = makeTransformer("a1\nb1\nc1\n",0,0);
      })

      it("end-point = [0,0]",function () {
        testTransformer([0,0],[0,0],[0,0]);
      })

      it("end-point = [0,1]",function () {
        testTransformer([0,1],[0,0],[0,1]);
      })

      it("end-point = [1,0] ",function () {
        testTransformer([0,3],[0,0],[1,0]);
      })

      it("end-point = [2,1]",function () {
        testTransformer([0,7],[0,0],[2,1]);
      })

      it("row-col = [2,0],[2,1]",function () {
        testTransformer([3,7],[1,0],[2,1]);
      })

      it("row-col = [2,0],[2,2] ",function () {
        testTransformer([3,8],[1,0],[2,2]);
      })

      it("row-col = [2,0],[3,0] ",function () {
        testTransformer([3,9],[1,0],[3,0]);
      })
    })

    //describe("out of bound")

    describe("colBase = 1, rowBase = 1",function () {
      beforeEach(function () {
        transformer = makeTransformer("a1\nb1\nc1\n",1,1);
      })

      it("end-point = [0,0]",function () {
        testTransformer([0,0],[1,1],[1,1]);
      })

      it("end-point = [0,1]",function () {
        testTransformer([0,1],[1,1],[1,2]);
      })

      it("end-point = [1,0] ",function () {
        testTransformer([0,3],[1,1],[2,1]);
      })

      it("end-point = [2,1]",function () {
        testTransformer([0,7],[1,1],[3,2]);
      })

      it("row-col = [2,0],[3,1]",function () {
        testTransformer([3,7],[2,1],[3,2]);
      })

      it("row-col = [2,0],[3,2] ",function () {
        testTransformer([3,8],[2,1],[3,3]);
      })

      it("row-col = [2,0],[4,0] ",function () {
        testTransformer([3,9],[2,1],[4,1]);
      })
    })

})
