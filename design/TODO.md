
## new feature
* add matchUntil(str1,str2,...)
  * match str1, str2,... one by one, if one success, return [matchValue,matchStr] and move the cursor after matchStr
* add matchUnitilExclude(str1, str2,...)
  * match str1, str2,... one by one, if one success, return matchValue,matchStr and move the cursor before matchStr
* add Scanner inherit on Scanner class
  * add defineParseMethod(name,type,config), this will add a method(which has the name of 'name' you give in defineMatch(name,...))
    * when you call the method on Scanner, if you got the return value as token
    * the define ParseMethod will have a special attribute: 'isMatchMethod' on it to tell it's actually a matchMethod, it's useful when we do mix and   inherit
    * the define method will compile to boost performance
    * type can be:
      * int: config is a int number
      * str: config is a string
      * regex: config is a regex
      * until:  config is an array of strings
      * untile:  config is an array of strings
      * function: config is a function

## enhancement
* [not doc] [done] create a Token class as the return value
* [not doc] [done] add rasieError(msg) on Scanner to help throw ScannerError
* [not doc] [done] add a matchReturnType switch on option object. It controls the kind of the return value of match-related methods
  * matchReturnType values:
    * value: only return the match string
    * token: return a token object
  * by default, Scanner's matchReturnType='value', but if you turn on the location api, it will use set implicityly as 'token'

## document
* how to create Scanner
* how to config Scanner with option object
* working with Location information
  * location
    * location
    * location_col_base
    * location_row_base
  * ...
* how to extend Scanner
  * createSubClass
  * mix(subScanner1,subScanner2,...)
* an sample DSL for Scanner
* how to use each matcher
  * especially for difficult usage


## testing
* add more test for Scanner initialize especially for skip pattern config checking



## performance tuning
* tuning the match logic to make it more efficient
  * find which kind of tuning is available
* check RegExp's compile property, to see if our soluton use the compiled version
* [! we didn't use it] we use RegExp's sticky to implement the Scanner.matchRegex()
  * [see here for explanation on RegExp.sticky](http://www.cr173.com/html/18523_1.html)
  * sticky is introduced in ES2015 so there might be compatible issue
* [!] check RegExp recreate (to add a ^ at the beginning) logic will slow down our performance
  * actually if we use SubScanner, this won't slow down the performance a lot
  * [!] however inside the ```_matchRegex()``` we call this.rest() which might slow down the performance
* [out] how we implement RegExp and make it efficiently


## [! this design is still not systematically analysis] IndexToRowColTransformer design
* how we define the range? (the start of the char and the next position of the end char)
  * [! see if this have any bad effect if we use it with editor selection] so we need to include a virtual next position if our range's end is the text's end
  * [!!] check the last point logic is correct
*  what happend if the index out of bound?  
  [current in code] return null

## sample
* to skip single-line-comment (```/\/\/(.|\r)*(\n|$)/```)
  * since '.' in javascript can't match \r or \n, we need to use (.|\r) to match text before \n
  * we also need to consider comment at the end of file without a '\n'
