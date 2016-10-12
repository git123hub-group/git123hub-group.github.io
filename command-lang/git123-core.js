/* git123-core.js */
var firstTime = new Date();
var zpadd2 = function (num) {
	if (num < 10) return "0" + num;
	return num;
}
var zpadd3 = function (num) {
	if (num < 10) return "00" + num;
	if (num < 100) return "0" + num;
	return num;
}
function parseFmt1 (str) {
	var cdate = new Date();
	var cdt = cdate.getFullYear() + "/" + zpadd2(cdate.getMonth()) + "/" + zpadd2(cdate.getDate());
	var ctm = zpadd2(cdate.getHours()) + ":" + zpadd2(cdate.getMinutes()) + ":" + zpadd2(cdate.getSeconds()) + "." + zpadd3(cdate.getMilliseconds());
	return str.replace(/\$((?:\\[\s\S]|[^\\\$])*)\$/g, function /* template */ ($0,$1) {
		if ($1 === "") return "$";
		var search;
		var $1p1 = $1.match(/(.*?)(?::|$)/)[1], $1r;
		var $1p2 = $1.slice($1p1.length+1);
		if ($1p1.charAt(0) !== "~") {
			$1r = variableList["var_" + $1p1];
		} else switch ($1p1) {
			case "~date":
				$1r = cdt;
			break;
			case "~expr":
				return execNumExpr($1p2.replace(/\s/g,""));
			break;
			case "~time":
				$1r = ctm;
			break;
			case "~rtime":
				$1r = cdate.getTime() - firstTime.getTime() + "";
			break;
			case "~random":
				$1r = "" + ((Math.random() * 4294967296) | 0);
			break;
			case "~line": // 换行符
				return "\n";
			break;
			case "~space": // 空格
				return "\ ";
			break;
			case "~tab": // 制表符
				return "\t";
			break;
		}
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
		switch($1p2) {
			case "rev": case "reverse": return esrever.reverse($1r);
			case "len": case "length":  return $1r.length;
			case "bin": return (+$1r>>>0).toString(2);
			case "chr": return String.fromCharCode($1r);
			case "oct": return (+$1r>>>0).toString(8);
			case "hex": return (+$1r>>>0).toString(16);
			case "fbin": return parseInt($1r,2);
			case "ord": return $1r.charCodeAt(0);
			case "foct": return parseInt($1r,8);
			case "fhex": return parseInt($1r,16);
			case "var": return variableList["var_" + $1r];
			case "fmt": return parseFmt1($1r);
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
	var content = cmd.slice(cmdn.length).replace(/\s/,"");
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
				case "abs-last":
					lineNum  = significantLines-content;
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
				case "abs-last":
					lineNum  = significantLines-content;
				break;
				case "rel":
					calls[callsp++] = ++lineNum;
					lineNum += +content;
				break;
				case "ret": // 返回
					lineNum = calls[--callsp];
				break;
				default:
					calls[callsp++] = ++lineNum;
					lineNum = variableList["tag_" + content];
			}
		break;
		case "break": // 断点 
			++lineNum; breakpoint = true; rframe = false;
		break;
		case "nextf": // 下一帧
			++lineNum; breakpoint = true; rframe = true
		break;
		case "execf":
			KernelStep(parseFmt1(content));
		break;
		case "set":
			var tmp = content.match(/^\s*([^=]*)\s*=([\s\S]*)$/) || [content, content, ""];
			switch (cmdnl[1]) {
				case "f":
					variableList["var_" + tmp[1]] = parseFmt1(tmp[2]);
				break;
				case "a": // 表达式 
					variableList["var_" + tmp[1]] = "" + execNumExpr(tmp[2].replace(/\s/g,""));
				break;
				case "af":
					variableList["var_" + tmp[1]] = "" + execNumExpr(parseFmt1(tmp[2]).replace(/\s/g,""));
				break;
				case "p": // 输入
					variableList["var_" + tmp[1]] = "" + prompt(tmp[2]);
				break;
				case "pf":
					variableList["var_" + tmp[1]] = "" + prompt(parseFmt1(tmp[2]));
				break;
				case "del": // 删除变量
					delete variableList["var_" + tmp[1]];
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
