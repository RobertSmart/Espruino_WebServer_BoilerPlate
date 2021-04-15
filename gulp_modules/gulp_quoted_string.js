var through = require('through2');    // npm install --save through2

module.exports = function() {

  var processFile = ((file) => {
    // console.dir(file)

    var dqStr = "";
    var tmpStr = "";
    var lastCh = 0;
    for (var i=0;i<file.contents.length;i++) {
      var ch = file.contents[i];
      // templated string
      if (ch==92) tmpStr += "\\\\"; // escaping slash
      else if (ch==96) tmpStr += "\\\`"; // template quote
      else if (lastCh==36 && ch==126) tmpStr += "\\{" // ${
      else tmpStr += String.fromCharCode(ch);
      // double-quoted string
      if (ch==34) dqStr += "\\\"";
      else if (ch==9) dqStr += "\\t";
      else if (ch==10) dqStr += "\\n";
      else if (ch==13) dqStr += "\\r";
      else if (ch==92) dqStr += "\\\\";
      else if (ch>=32 && ch<127)
        dqStr += String.fromCharCode(ch);
      else { // hex code
        if (ch<64 && (i+1>=file.contents.length || (file.contents[i+1]<48/*0*/ || file.contents[i+1]>55/*7*/)))
          dqStr += "\\"+ch.toString(8/*octal*/); // quick compactness hack
        else
          dqStr += "\\x"+(ch+256).toString(16).substr(-2); // hex
      }
      lastCh = ch;
    }

    var finalStr = "";

    finalStr = '"'+dqStr+'"';
    // console.log(finalStr)
    var buf = Buffer.from(finalStr, 'utf-8');
    file.contents= buf

    return(file)
  })

  return through.obj(function(file, encoding, callback) {
    callback(null, processFile(file));
  });
};
