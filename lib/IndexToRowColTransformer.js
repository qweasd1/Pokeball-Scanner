// This module is used to transform index(which means[startIndex,endIndex]) to col-row(which means {start:[start_row,start_col],end:[end_row,end_col]}) for given text

function _indexToRowCol(lineEnds, rowBase, colBase, indexUBound,n) {
  if (n >=0 && n < indexUBound) {
    for (var i = 0; i < lineEnds.length; i++) {
      var endIndex = lineEnds[i];
      if (n <= endIndex) {
        return [i + rowBase, (i == 0 ? n : (n-lineEnds[i-1]-1)) + colBase ]
      }
    }
  }
  else {
    return null;
  }

}

function indexToRowColTransformerFactory(text, rowBase, colBase) {
  var char;
  var lineEnds = [];
  var indexUBound = text.length;

  for (var i = 0; i < text.length; i++) {
    char = text[i];
    if (char == '\n') {
      lineEnds.push(i);
    }
  }

  if (lineEnds[lineEnds.length-1] != text.length-1) {
    lineEnds.push(text.length-1);
  }

  var transformer =  _indexToRowCol.bind(null,lineEnds,rowBase,colBase,indexUBound);

  return {
    transformBound: function (index) {
        return {
          start:transformer(index[0]),
          end:  transformer(index[1])
        };
    },
    transformPoint:transformer
  }

}

module.exports = indexToRowColTransformerFactory;
