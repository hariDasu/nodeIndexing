/*
vi:  sw=4 ts=4 expandtab
*/
var fs = require('fs');
var html_strip = require('htmlstrip-native');


var allDocs = [];

var documentCount = 0;

//-------------------------------------
var walk = function(dir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = dir + '/' + file;
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

//------------------------------------


var invertedIndex = {
                   /* word:{
                            doc1:[1,4,],
                            doc2:[56,76]
                          },
                    word2:{
                            doc1:[5,2],
                            doc3:[4,6]
                          },*/
                    };


exports.invertedIndex = invertedIndex;
//------------------------------------

var indexOneDoc=function(htmlDoc2Index, cbFunc) {
    var oneDocIndex=new Array()
    htmlFileContent=fs.readFileSync(htmlDoc2Index,"utf8")
    var options ={
            include_script : false, // include the content of <script> tags
            include_style : false, // include the content of <style> tags
            compact_whitespace : true // compact consecutive '\s' whitespace into single char
        }
    var text = html_strip.html_strip(htmlFileContent,options)
    var str = text.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ");
    //RegEx: removes everything except alphanumeric characters and whitespace, then collapses multiple adjacent characters to single spaces.
    var tokens = str.split(" ");
    for (var i=0;i<tokens.length;i++){
        var oneWord = tokens[i];
        if(!(oneWord in oneDocIndex)) {
            oneDocIndex[oneWord] = new Array()
        }
        var len= oneDocIndex[oneWord].length 
        oneDocIndex[oneWord][len]=i
    }
    //oneDocIndex returns the index generated from one document
    cbFunc(htmlDoc2Index, oneDocIndex)
};

//---------- MAIN HERE --------

var uniqWordCount = 0;
exports.doIndex = function(dir,cbIndexDone){
    walk(dir, function(err, allDocs) {
        if (err) throw err;
        var retCnt=0
    //------will be called when a document is indexed (@callback)--------
        var  docIndexDone = function( htmlDoc2Index, oneDocIndex) { 
             //console.log(oneDocIndex.length , "distinct words in",   htmlDoc2Index)
             // process.exit(0)
            for (var word in oneDocIndex) {
                
                if(!(word in invertedIndex)) {
                    invertedIndex[word] = {}
                    uniqWordCount+=1;
                }
                invertedIndex[word][htmlDoc2Index]=oneDocIndex[word];
                
            }
           
             retCnt +=1
             if  (retCnt == documentCount)  {
                console.log("Total Words: " + uniqWordCount + " Total documents: " + documentCount )
                 console.log(invertedIndex);
                 console.log("Total Words: " + uniqWordCount + " Total documents: " + documentCount )
                 cbIndexDone();
             }

        } 
        //------
        var documentCount = allDocs.length;

        //fire document indexing jobs for each document (async)
        allDocs.forEach(function(oneDoc){ 
            indexOneDoc(oneDoc, docIndexDone);//use docIndexOne as callback

        });
    })
};

