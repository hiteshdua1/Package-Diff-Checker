require('colors');
var fs = require('fs');
var jsdiff = require('diff');
var recursive = require("recursive-readdir");
var path = require('path')
path.extname('index.html')

var originalBasePath = "F:\\css_package_8";
var updatedBasePath =  "F:\\28-1_Package";

recursive(originalBasePath, [ignoreFunc], function (err, files) {
  console.log(files);
  files.forEach(function(file){
  		return writeToCsv(file);
  });
});



function ignoreFunc(file, stats) {
    // `file` is the absolute path to the file, and `stats` is an `fs.Stats` 
    // object returned from `fs.lstat()`. 
    
    if (stats.isDirectory() || path.extname(file) === '.css') {
        return false;
    }
    return true;
}


function getDiff(originalPath, updatePath) {
	
	var originalFile = fs.readFileSync(originalPath);
	var updatedFile = fs.readFileSync(updatePath);
    
    var diff = jsdiff.diffChars(originalFile.toString(), updatedFile.toString());
    
    // console.log(diff);
    return diff;
}

function writeToCsv(originalPath) {
	
	return function(diff) {

    diff.forEach(function(part) {
        // green for additions, red for deletions
        // grey for common parts
        var color = part.added ? 'green' :
            part.removed ? 'red' : 'grey';
      
        // process.stderr.write(part.value[color]);
      
            if(part.added){
				fs.appendFileSync('sample.csv', originalPath.replace(originalBasePath,"") +',added,'+part.value + '\n' );
            }
            if(part.removed){
				fs.appendFileSync('sample.csv', originalPath.replace(originalBasePath,"") +',removed,'+part.value + '\n');
            }
           
    });
  }(getDiff(originalPath, getUpdatedFilePath(originalPath)));
}

function getUpdatedFilePath(path) {
	return path.replace(originalBasePath,updatedBasePath)
}