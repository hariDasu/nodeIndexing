var fs = require('fs');
var html_strip = require('htmlstrip-native');

exports.indexOneDoc=function(htmlDoc2Index, cbFunc) {
    var oneDocIndex = {};
    var text = "";
    // console.log(htmlDoc2Index)
    htmlFileContent=fs.readFileSync(htmlDoc2Index,"utf8")
    //console.log(htmlFileContent)
    var options ={
            include_script : false, // include the content of <script> tags
            include_style : false, // include the content of <style> tags
            compact_whitespace : true // compact consecutive '\s' whitespace into single char
        }
    var text = html_strip.html_strip(htmlFileContent,options)
    var tokens = tokenizer.tokenize(text);
    for (var i=0;i<tokens.length;i++){
        var oneWord = tokens[i];
        if(!(oneWord in oneDocIndex)) {
            oneDocIndex[oneWord]=[]
            console.log( "herer ....")
        }
        oneDocIndex[oneWord].concat(i);
    }
    cbFunc(oneDocIndex)
};

