"2016-10-04T04:56:18Z"

var partialParseISO8601 = function (i8601) {
  var y = i8601.slice(0,4),
      m = i8601.slice(5,7),
      d = i8601.slice(8,10),
      h = i8601.slice(11,13),
      i = i8601.slice(14,16),
      s = i8601.slice(17,19);
  return new Date(+y,m-1,+d,+h,+i,+s);
}