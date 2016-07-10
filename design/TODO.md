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
