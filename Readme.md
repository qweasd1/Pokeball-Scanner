# Scanner
Pokeball-Scanner is a transactional text scanner help you to extract sub-text from original text. It's helpful to use it to write complex compiler.

## install
```
npm install --save Pokeball-Scanner
```

## Basic usage
create Scanner
```javascript

var Scanner = require('Pokeball-Scanner')
var text = "test"
var scan = new Scanner(text);

```

match and peek
```javascript

// use match() to fetch text from origin text

//if match success, return the match string and move forward the curosr
var s = scan.match('test')

//if match failed, return null without move forward the cursor
var s = scan.match("abc")

// there are two other match related method

// matchInt(n): get next n string, return null if n exceeds the end of the origin text.length
var s = scan.matchInt(3)

// matchRegex(regExp):use the regExp to match the string
// regExp will start from the rest of string's head (e.g regExp="t" will only match "t" in "test", not "t" in "atest")
var s = scan.matchRegex(/t..t/)

//since matchInt and matchRegex is too long to type, we provide 2 alias for them: matchi for matchInt, matchr for matchRegex

// if want to peek the string but not move the cursor, use peek instead. Like match, there 3 different version peek,peekInt(peeki), peekRegex(peekr)
```
transcation
```javascript
// sometimes, to parse complex structure, we are not sure if we will success for all sub-structure. It's better we can rollback once we fail, that's what transaction means here
var scan = new Scanner("t1t2");
// the beginTx() will push the current position of cursor to the transaction stack
scan.beginTx();
scan.match('t1');
scan.match('t2');
// when rollback() is called, Scanner will pop out the last cursor position from transaction stack and  reset the cursor to it.
scan.rollback();
//now cussor is at the beginning

// when commit() is called, Scanner will remove the last cursor position from transaction stack without reset the cursor
scan.commit();

//Scanner supports nested transaction
scan.beginTx(); // check point 1
// match something here...
scan.beginTx(); // check point 2
// match other things here...

// reset to check point 2
scan.rollback();

// reset to check point 1
scan.rollback();

```

## Advanced Usage
[! test it]boost the performance
```javascript
// when we use matchRegex(RegExp), it's a waste of time to pass RegExp again and again. Each time you pass the RegExpr, it will compile it then use it. A better choice might be subclass the Scanner and add more specific match method on SubScanner's prototype by using defMatch(name,string),defMatchr(name,regExp),defMatchi(name,n). We wil cache the string, RegExp or n inside the SubScanner.prototype.cachRegExp...

class SubScanner extends Scanner{

}

SubScanner.prototype.defMatch("kw_import","import");
var scan = new SubScanner("import");
var import_text = scan.kw_import(); // equal to scan.match("import")

```
skip
```javascript
// when writing a compiler, we sometimes need to skip the whitespace and comment, that's what skip help
// set the skip configuration on the optional option object on Scanner's constructor

var scan = new Scanner('text',
{
  skip:[
      {
        name:whitespace,
        pattern:/\s+/

      },
      {
        name:oneLineComment,
        pattern:/\/\/.*?\n/,
        isCollect:true
      },
      {
        name:multiLineComment,
        pattern:/\/\*.*\*\//,
        isCollect:true
      }
  ]
});

// every time after the scan.match() was called, the Scanner will check if it match any of the skip pattern. If one of the pattern match, it will continue this process until none of the skip pattern is matched. if the skip pattern'isCollect is set to ```true```, we will collect it into Scanner.skip[patternName] (this is an array). You can then fetch them out


```

show location
```javascript
// there are times you need to add location info on your match item
// the config for it wis on option object
var scan = new Scanner({
  location:"index" // type can be string and array
})

// sometimes you want the location be the index of string which will return [start_index, end_index]. For this case, set location="index"
// sometimes you want the location be the row-col of string, which will return {start:[row,col],end:[row,col]}, For this case, set location = "row-col"
// sometimes you want both the location info, then set location:["index","row-col"]
// sometimes, the default row-col is not start with [0,0], we can set this by location_row_base:n,location_col_base:n

```

## Issue
* [solved] does skip has sequence?
  * [solution] we use array instead of map

## Performance tuning
* bench mark test
* implement regex locally in Scanner instead of fetch rest text again and again and use them with RegExp
* add more configuration for skip so that it might be helpful to the performance
* seperate scanner with location info and without location info

## Pattern we usually used (write it in another page)
* match brackets

## a little sample to use Scanner to write (write it in another page)
