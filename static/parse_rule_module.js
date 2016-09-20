var parseRule = function (rule_str) {
var table = [], tablecnt = [];
var add4f = function (n, v) {
  var r = n & 0x88 | (n * 0x101 >> 4) & 0x77;
  r = r & 0xAA | (r << 2) & 0x44 | (r >> 2) & 0x11;
  var n2 = n * 0x101, r2 = r * 0x101;
  table[n] = v, table[r] = v;
  table[(n2>>2)&255] = v, table[(r2>>2)&255] = v;
  table[(n2>>4)&255] = v, table[(r2>>4)&255] = v;
  table[(n2>>6)&255] = v, table[(r2>>6)&255] = v;
}
for (var i = 0, j; i < 256; ++i) {
  j = (i & 0x55) + ((i>>1) & 0x55);
  j = (j & 0x33) + ((j>>2) & 0x33);
  tablecnt[i] = (j + (j>>4)) & 15;
}
var nbrhd = [
  {c: 0x00},
  {c: 0x01, e: 0x02},
  {c: 0x05, e: 0x0a, k: 0x09, a: 0x03, i: 0x22, n: 0x11},
  {c: 0x15, e: 0x2a, k: 0x29, a: 0x0e, i: 0x07, n: 0x0d, y: 0x49, q: 0x13, j: 0x0b, r: 0x23},
  {c: 0x55, e: 0xaa, k: 0x4b, a: 0x0f, i: 0x36, n: 0x17, y: 0x35, q: 0x39, j: 0x2b, r: 0x2e, t: 0x27, w: 0x1b, z: 0x33},
  {c: 0xea, e: 0xd5, k: 0xd6, a: 0xf1, i: 0xf8, n: 0xf2, y: 0xb6, q: 0xec, j: 0xf4, r: 0xdc},
  {c: 0xfa, e: 0xf5, k: 0xf6, a: 0xfc, i: 0xdd, n: 0xee},
  {c: 0xfe, e: 0xfd},
  {c: 0xff}
]
var nbrcnt = [1,2,6,10,13,10,6,2,1];
var nbrstr = "cekainyqjrtwz".split("");
var parsePartRule = function (pstr) {
  var pstr = pstr.split(""), index = -1, n = [[0],[0,0],[0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0],[0,0],[0]], nstr = "", m, invert, nh, exist = [false,false,false,false,false,false,false,false,false];
  for (var i = 0; i < 256; ++i) {
    table[i] = 0;
  }
  for (var i = pstr.length - 1; i >= 0; i--) {
    nstr += pstr[i];
    if (pstr[i] >= '0' && pstr[i] <= '8') {
      nh = +pstr[i];
      if (exist[nh]) { throw(Error("Repeated number found")); }
      exist[nh] = true
      invert = false
      m = nstr.length - 1;
      if (m === 0 || nh === 0 || nh === 8) { invert = true; } else {
        if (nstr[m - 1] === "-") {
          invert = true;
          m--;
        }
        for (var i2 = 0; i2 < m; ++i2) {
          var indstr = nbrstr.indexOf(nstr[i2]);
          n[nh][indstr] = 1
        }
      }
      if (invert) {
        for (var i3 = nbrcnt[nh]-1; i3 >= 0; i3--) { n[nh][i3] ^= 1; }
      }
      for (i3 = nbrcnt[nh]-1; i3 >= 0; i3--) { (m = n[nh][i3]) && add4f(nbrhd[nh][nbrstr[i3]], 1) }
      nstr = "";
    }
  }
  return table;
}
return (function (rstr) {
  rstr = rstr.replace(/\//g, "_");
  var params = rstr.split("_");
  if (params.length === 1) {params[1] = "";}
  if (params[0].charAt(0).toUpperCase() === "B" || params[1].charAt(0).toUpperCase() === "S") {
    syntax = [params[0], params[1]];
  } else {
    syntax = [params[1], params[0]];
  }
  var m2, arr, syntax;
  parsePartRule(syntax[0]); arr = table.slice();
  parsePartRule(syntax[1]); return [arr, table];
})(rule_str);
}
