/*jshint globalstrict:true, trailing:false, unused:true, node:true */
'use strict';

var fs = require('fs');
var less = require('less');

var DIR = __dirname + '/emojifyjs/less';
var OUTPUT_DIR = __dirname + '/output/';
var PREFIX = 'data:image/png;base64,';

function die(err) {
  console.error(err);
  process.exit(1);
}

function processLess(filename, callback) {
  function callbackOnce(err) {
    var cb = callback;
    callback = null;
    if(cb) cb(err);
  }

  fs.readFile(filename, function(err, contents) {
    if(err) return callback(err);


    var parser = new less.Parser({ filename: filename });

    parser.parse(contents.toString('utf8'), function (err, tree) {
        if (err) return callback(err);

        var count = tree.rules.length;
        tree.rules.forEach(function(topRule) {
          try {
            if(!topRule.importedFilename) return;

            topRule.root.rules.forEach(function(rule) {
              var selector = rule.selectors[0].elements[1].value;
              var data = rule.rules[0].value.value[0].value[0].value.value;

              if(data.indexOf(PREFIX) !== 0) return;
              var b = new Buffer(data.substring(PREFIX.length), 'base64');

              var pngFileName = selector.substring(1) + '.png';
              rule.rules[0].value.value[0].value[0].value.value = pngFileName;

              fs.writeFile(OUTPUT_DIR + pngFileName, b, function(err) {
                if(err) return callbackOnce(err);

                if(--count === 0) {
                  var css = tree.toCSS({ compress: true });

                  var baseFileName = filename.replace(/^.*\//,'').replace(/\.less$/, '');
                  fs.writeFile(OUTPUT_DIR + baseFileName + '.css', css, callbackOnce);
                }
              });


            });
          } catch(e) {}
        });

    });
  });
}

if(!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

processLess(DIR + '/emojify.less', function(err) {
  if(err) return die(err);
});
