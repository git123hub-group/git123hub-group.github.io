// <![CDATA[
var variableList = {};
function execNumExpr (input) {
	/* closures */
	var IMUL = Math.imul || function(a, b) {
	  var ah = (a >>> 16) & 0xffff;
	  var al = a & 0xffff;
	  var bh = (b >>> 16) & 0xffff;
	  var bl = b & 0xffff;
	  // the shift by 0 fixes the sign on the high part
	  // the final |0 converts the unsigned value into a signed value
	  return ((al * bl) + (((ah * bl + al * bh) << 16) >>> 0)|0);
	};
	function execMul () {
		if (oprsp === 0 || oprs[oprsp-1][0]) {
			return;
		}
		switch (oprs[--oprsp][1]) {
			case "*":
				nums[numsp-2] = IMUL(nums[numsp-2], nums[numsp-1]); numsp--;
			break;
			case "/":
				if (+nums[numsp-1] === 0) { throw "Divide by zero"; }
				nums[numsp-2] = (nums[numsp-2] / nums[numsp-1]) | 0; numsp--;
			break;
			case "%":
				if (+nums[numsp-1] === 0) { throw "Divide by zero"; }
				nums[numsp-2] %= nums[numsp-1]; numsp--;
			break;
			default:
				++oprsp;
			// no break;
		}
	};
	function execAddt () {
		execMul();
		if (oprsp === 0 || oprs[oprsp-1][0]) {
			return;
		}
		switch (oprs[--oprsp][1]) {
			case "+":
				nums[numsp-2] = (nums[numsp-2] + nums[numsp-1]) | 0; numsp--;
			break;
			case "-":
				nums[numsp-2] = (nums[numsp-2] - nums[numsp-1]) | 0; numsp--;
			break;
			default:
				++oprsp;
			// no break;
		}
	};
	function execShift () {
		execAddt();
		if (oprsp === 0 || oprs[oprsp-1][0]) {
			return;
		}
		switch (oprs[--oprsp][1]) {
			case "<<":
				nums[numsp-2] <<= nums[numsp-1]; numsp--;
			break;
			case ">>":
				nums[numsp-2] >>= nums[numsp-1]; numsp--;
			break;
			default:
				++oprsp;
			// no break;
		}
	};
	function execBAnd () {
		execShift();
		if (oprsp === 0 || oprs[oprsp-1][0]) {
			return;
		}
		switch (oprs[--oprsp][1]) {
			case "&":
				nums[numsp-2] &= nums[numsp-1]; numsp--;
			break;
			default:
				++oprsp;
			// no break;
		}
	};
	function execBXor () {
		execBAnd();
		if (oprsp === 0 || oprs[oprsp-1][0]) {
			return;
		}
		switch (oprs[--oprsp][1]) {
			case "^":
				nums[numsp-2] ^= nums[numsp-1]; numsp--;
			break;
			default:
				++oprsp;
			// no break;
		}
	};
	function execBOr () {
		execBXor();
		if (oprsp === 0 || oprs[oprsp-1][0]) {
			return;
		}
		switch (oprs[--oprsp][1]) {
			case "|":
				nums[numsp-2] |= nums[numsp-1]; numsp--;
			break;
			default:
				++oprsp;
			// no break;
		}
	};
	function closeParens () {
		execBOr();
		oprsp--;
	};
	function parseNum (s) {
		if (/\D/.test(s.charAt(0))) {
			return +variableList["var_"+s];
		}
		return +s;
	};
	function execUnary () {
		while (oprsp && oprs[oprsp-1][0]) {
			switch (oprs[--oprsp][1]) {
				case "+":
					nums[numsp-1] = +nums[numsp-1];
				break;
				case "-":
					nums[numsp-1] = (-nums[numsp-1]) | 0;
				break;
				case "~":
					nums[numsp-1] = ~nums[numsp-1];
				break;
				case "!":
					nums[numsp-1] = +!nums[numsp-1];
				break;
			}
		}
	};

	/* define part */
	var a = input;
	var b = a.match(/[A-Za-z0-9]+|<<|>>|[^A-Za-z0-9<>]/g);
	var unary = [];
	for (var i1 = 0, len = b.length; i1 < len; ++i1) {
		unary[i1] = false;
		if (b[i1] === "!" || b[i1] === "~") {unary[i1] = true;}
		if ((i1 === 0 || b[i1-1] === "!" || b[i1-1] === "~" || b[i1-1] === "+" || b[i1-1] === "-" || b[i1-1] === "\x28") && (b[i1] === "-" || b[i1] === "+")) {unary[i1] = true;}
	}
	var nums=[], oprs=[], numsp=0, oprsp=0;
	for (var i2 = 0; i2 < len; ++i2) {
		if (unary[i2]) {
			oprs[oprsp++] = [true, b[i2]];
		} else {
			switch (b[i2]) {
				case "(": 
					oprs[oprsp++] = [false, "("];
				break;
				case ")": 
					closeParens();
					execUnary();
				break;
				case "*": case "/": case "%":
					execMul();
					oprs[oprsp++] = [false, b[i2]];
				break;
				case "+": case "-":
					execAddt();
					oprs[oprsp++] = [false, b[i2]];
				break;
				case "<<": case ">>":
					execShift();
					oprs[oprsp++] = [false, b[i2]];
				break;
				case "&":
					execBAnd();
					oprs[oprsp++] = [false, b[i2]];
				break;
				case "^":
					execBXor();
					oprs[oprsp++] = [false, b[i2]];
				break;
				case "|":
					execBOr();
					oprs[oprsp++] = [false, b[i2]];
				break;
				default:
					nums[numsp++] = parseNum(b[i2]);
					execUnary();
				break;
			}
		}
	}
	execBOr();
	if (oprsp || numsp!==1) {
		throw "Syntax error";
	}
	return nums[0];
}
// ]]>