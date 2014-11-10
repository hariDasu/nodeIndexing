
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Inverted Index' })
};

var importedIndex = {};

exports.search = function(invertedIndex) {
    importedIndex = invertedIndex;
    return function (req,res) {


    var lookup = req.param('searchTerm') || 'film';
    var jadeResult = [];
    lookupResult=importedIndex[lookup]
        for(i in lookupResult){
            console.log(i + " positions: ");
            var theDoc = i;


            var positions = "";
            for (j in i){
                var positions = positions + ","+j;
            }
            console.log(positions);
            jadeResult.push({"doc":i,"positions":positions});
        }

        res.render('index',{'jadeRes': jadeResult})
   
    }
};
