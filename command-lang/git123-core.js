/* git123-core.js */
var firstTime = new Date();
var zpadd2 = function (num) {
	if (z < 10) return "0" + num;
	return num;
}
var zpadd3 = function (num) {
	if (z < 10) return "00" + num;
	if (z < 100) return "0" + num;
	return num;
}
function parseFmt1 (str) {
	var cdate = new Date();
	return str.replace(/\$((?:\\[\s\S]|[^\\\$])*)\$/g, function /* template */ ($0,$1) {
		if ($1 === "") return "$";
		var search;
		var $1p1 = $1.match(/(.*?)(?::|$)/)[1], $1r;
		if ($1p1.charAt(0) !== "~") {
			$1r = variableList["var_" + $1p1];
		} else switch ($1p1) {
			case "~date":
				return cdate.getFullYear() + "/" + cdate.getMonth() + "/" + cdate.getDate();
			break;
			case "~time":
				return cdate.getHours() + ":" + cdate.getMinutes() + ":" + cdate.getSeconds();
			break;
		}
		var $1p2 = $1.slice($1p1.length+1);
		if (search = $1p2.match(/^((?:\\[\s\S]|[^\\\=])*)=((?:\\[\s\S]|[^\\\=])*)$/)) {
			var s$1 = search[1].replace(/\\([\s\S])/g, "$1");
			var s$2 = search[2].replace(/\\([\s\S])/g, "$1");
			return $1r.split(s$1).join(s$2);
		};
		if (search = $1p2.match(/^(-?\d+)$/)) {
			return $1r.slice(search[1]);
		};
		if (search = $1p2.match(/^(-?\d+),(-?\d+)$/)) {
			return $1r.slice(search[1], search[2]);
		};
		return $1r;
	});
}
function cmpF (opr, str1, str2) {
	opr = opr.toLowerCase();
	switch (opr) {
		case "==": case "equ": return str1 === str2; break;
		case "!=": case "neq": return str1 !== str2; break;
		case "<":  case "lss": return str1 < str2; break;
		case "<=": case "leq": return str1 <= str2; break;
		case ">":  case "gtr": return str1 > str2; break;
		case ">=": case "geq": return str1 >= str2; break;
	}
}
function HTMLEscape (str) {
	return (""+str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function KernelStep (cmd) {
	cmd = String(cmd).replace(/[\s\t\xa0\u3000]*/, "")
	if (cmd.charAt(0) === ":" || cmd.charAt(0) === "#" || cmd === "") {++lineNum; return;}
	var cmdn = cmd.match(/[A-Za-z0-9\-\_$]+(:[A-Za-z0-9\-\_$]*)?/)[0];
	var cmdnl = cmdn.split(":");
	cmdnl.length < 2 && (cmdnl[1] = "");
	var content = cmd.slice(cmdn.length+1);
	switch (cmdnl[0]) {
		case "write":
			switch (cmdnl[1]) {
				case "var":
					hout += HTMLEscape(variableList["var_" + content]);
				break;
				case "format":
					hout += HTMLEscape(parseFmt1(content));
				break;
				default:
					hout += HTMLEscape(content);
			}
			++lineNum;
		break;
		case "writeln":
			switch (cmdnl[1]) {
				case "format":
					hout += HTMLEscape(parseFmt1(content)) + "\n";
				break;
				default:
					hout += HTMLEscape(content) + "\n";
			}
			++lineNum;
		break;
		case "clear":
			hout = "";
			++lineNum;
		break;
		case "goto":
			switch (cmdnl[1]) {
				case "abs":
					lineNum  = +content;
				break;
				case "rel":
					lineNum += +content;
				break;
				default:
					lineNum = variableList["tag_" + content];
			}
		break;
		case "loop":
			var tmp = content.match(/(\S*)\s*([\s\S]*)/);
			var nextL = variableList["tag_" + tmp[2]];
			switch (cmdnl[1]) {
				case "inc":
					variableList["var_" + tmp[1]]++;
				break;
				case "dec":
				default:
					variableList["var_" + tmp[1]]--;
				break;
			}
			variableList["var_" + tmp[1]] ? (lineNum = nextL) : ++lineNum;
			variableList["var_" + tmp[1]] = "" + variableList["var_" + tmp[1]];
		break;
		case "call":
			switch (cmdnl[1]) {
				case "abs":
					calls[callsp++] = ++lineNum;
					lineNum  = +content;
				break;
				case "rel":
					calls[callsp++] = ++lineNum;
					lineNum += +content;
				break;
				case "ret":
					lineNum = calls[--callsp];
				break;
				default:
					calls[callsp++] = ++lineNum;
					lineNum = variableList["tag_" + content];
			}
		break;
		case "break":
			++lineNum; breakpoint = true; rframe = false;
		break;
		case "nextf":
			++lineNum; breakpoint = true; rframe = true
		break;
		case "execf":
			KernelStep(parseFmt1(content));
		break;
		case "set":
			var tmp = content.match(/([^=]*)\s*=([\s\S]*)/);
			switch (cmdnl[1]) {
				case "f":
					variableList["var_" + tmp[1]] = parseFmt1(tmp[2]);
				break;
				case "a": // 表达式 
					variableList["var_" + tmp[1]] = "" + execNumExpr(tmp[2]);
				break;
				case "af":
					variableList["var_" + tmp[1]] = "" + execNumExpr(parseFmt1(tmp[2]));
				break;
				case "p": // 输入
					variableList["var_" + tmp[1]] = "" + prompt(tmp[2]);
				break;
				case "pf":
					variableList["var_" + tmp[1]] = "" + prompt(parseFmt1(tmp[2]));
				break;
				default:
					variableList["var_" + tmp[1]] = tmp[2];
			}
			++lineNum;
		break;
		case "terminate":
			breakpoint = true; rframe = false;
		break;
		case "if":
			var tmp = content.match(/(\S*)\s*(\S*)\s*(\S*)\s*([\s\S]*)/);
			var compare1 = cmpF(tmp[2],+parseFmt1(tmp[1]),+parseFmt1(tmp[3]));
			cmdnl[1] === "not" && (compare1 = !compare1);
			if (compare1) {KernelStep(tmp[4])} else ++lineNum;
		break;
		case "if_str":
			var tmp = content.match(/(\S*)\s*(\S*)\s*(\S*)\s*([\s\S]*)/);
			var compare1 = cmpF(tmp[2],parseFmt1(tmp[1]),parseFmt1(tmp[3]));
			cmdnl[1] === "not" && (compare1 = !compare1);
			if (compare1) {KernelStep(tmp[4])} else ++lineNum;
		break;
	}
}
