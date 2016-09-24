var parsePart_vN = function (s) {
  s = s.split("")
  var i = 0, value = 0;
  (s[i] === "0") && (++i, (value |= 1));
  (s[i] === "1") && (++i, (value |= 278));
  if (s[i] === "2") {
	++i;
	(s[i] === "r") ? (++i, (value |= 4680)) : (s[i] === "i") ? (++i, (value |= 1056)) : (value |= 5736);
  }
  (s[i] === "3") && (++i, (value |= 26752));
  (s[i] === "4") && (++i, (value |= 32768));
  return value;
}
