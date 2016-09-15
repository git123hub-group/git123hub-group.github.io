function RLELineBreak (s) {
   var array = [], n = 0;
   for(var i = 0; i < s.length;) {
      var backupI = i;
      i += 70;
      while (/\d/.test(s[i - 1]) || s[i] === "!") {
        --i;
      }
      array[n++] = s.substring(backupI, i);
   }
   return array.join("\n");
}
var exportRLE = function () {
  var code = "", currState, prevState, rowCode = "", emptyRows = 0, symbols = [".","A","B","C"];
  for (var y = 0; y < 128; ++y) {
    currState = array[currOffset+y*128] + 2 * array[prevOffset+y*128], counts = 0;
    for (var x = 0; x < 128; ++x) {
      prevState = currState;
      currState = array[currOffset+y*128+x] + 2 * array[prevOffset+y*128+x];
      if (prevState !== currState) {
        rowCode += (counts === 1 ? "" : counts) + symbols[prevState];
        counts = 0;
      }
      ++counts;
    }
    if (currState) { rowCode += (counts === 1 ? "" : counts) + symbols[currState]; }
    if (rowCode) { emptyRows && (code += (emptyRows === 1 ? "" : emptyRows) + "$"); code += rowCode; emptyRows = 1; } else { ++emptyRows; }
    rowCode = "";
  }
  WlAntCode.value = "#CXRLE Pos=-64,-64\nx = 128, y = 128, rule = "+crule+":T128,128\n" + RLELineBreak(code + "!");
}
var importRLE = function (e) {
  currOffset = 0, prevOffset = 16384, symbols = {"A": 1, "B": 2, "C": 3};
  for (var i = 0; i < 32768; ++i) {
    array[i] = 0;
  }
  var lines = e.value.split("\n"), x = 0, y = 0, alignX = 0, alignY = 0;
  for (var i = 0; i < lines.length; ++i) {
    if (lines[i].charAt(0) === "x" && (lines[i].charAt(1) === " " || lines[i].charAt(1) === "=")) {
      var patternX = +lines[i].match(/\bx = (\d+)/)[1].toLowerCase();
      var patternY = +lines[i].match(/\by = (\d+)/)[1].toLowerCase();
      alignX = (128 - patternX) >> 1;
      alignY = (128 - patternY) >> 1;
    } else if (lines[i].charAt(0) !== "#") {
      for (var line = lines[i]; line.length > 0;) {
        var part = line.match(/\d*\D/)[0];
        var last = part.slice(-1);
        var num = +part.slice(0,-1);
        num || (num = 1);
        if (last === "$") {
          y += num; x = 0;
        } else if (/[ABC]/.test(last)) {
          while(num--) {
            array[prevOffset + ((alignY + y) << 7) + alignX + x] = symbols[last] & 2;
            array[currOffset + ((alignY + y) << 7) + alignX + x] = symbols[last] & 1;
            x++;
          }
        } else if (last === ".") {
          x += num;
        } else {
		  rerender();
          return;
        }
        line = line.slice(part.length);
      }
    }
  }
}