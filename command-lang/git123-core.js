/* git123-core.js */
var firstTime = new Date(), elseCon = false, lastIF, st1, st1p, flag, vnam1, vnam2, ptitle;
var zpadd2 = function (num) { // 补零到 2 个字符
	if (num < 10) return "0" + num;
	return num;
}
var zpadd3 = function (num) { // 补零到 3 个字符
	if (num < 10) return "00" + num;
	if (num < 100) return "0" + num;
	return num;
}
function parseFmt1 (str) { // 格式变量
	var cdate = new Date();
	var cdt = cdate.getFullYear() + "/" + zpadd2(cdate.getMonth()) + "/" + zpadd2(cdate.getDate());
	var ctm = zpadd2(cdate.getHours()) + ":" + zpadd2(cdate.getMinutes()) + ":" + zpadd2(cdate.getSeconds()) + "." + zpadd3(cdate.getMilliseconds());
	return str.replace(/\$((?:\\[\s\S]|[^\\\$])*)\$/g, function /* template */ ($0,$1) {
		if ($1 === "") return "$";
		var search, s$1, s$2;
		var $1p1 = $1.match(/(.*?)(?::|$)/)[1], $1r;
		var $1p2 = $1.slice($1p1.length+1);
		if ($1p1.charAt(0) !== "~") {
			$1r = variableList["var_" + $1p1];
		} else switch ($1p1) { // return 之后不应该是 break
			case "~date":
				$1r = cdt;
			break;
			case "~expr":
				return execNumExpr($1p2.replace(/\s/g,""));
			// break;
			case "~time":
				$1r = ctm;
			break;
			case "~rtime":
				$1r = cdate.getTime() - firstTime.getTime() + "";
			break;
			case "~random":
				$1r = "" + ((Math.random() * 4294967296) | 0);
			break;
			case "~randr":
				var sp1 = $1p2.split(",");
				return +sp1[0] + (Math.random() * (sp1[1] - sp1[0] + 1)) | 0;
			// break;
			case "~line": // 换行符
				return "\n";
			// break;
			case "~space": // 空格
				return "\ ";
			// break;
			case "~tab": // 制表符
				return "\t";
			// break;
			case "~cline": // 当前行号
				return +lineNum + +$1p2;
			// break;
			case "~tline": // 总行数
				return +significantLines + +$1p2;
			// break;
		}
		if (search = $1p2.match(/^((?:\\[\s\S]|[^\\\=])*)=((?:\\[\s\S]|[^\\\=])*)$/)) {
			s$1 = search[1].replace(/\\([\s\S])/g, "$1");
			s$2 = search[2].replace(/\\([\s\S])/g, "$1");
			return $1r.split(s$1).join(s$2);
		};
		if (search = $1p2.match(/^(\w+):([\s\S]*)$/)) {
			s$1 = search[1], s$2 = search[2].replace(/\\([\s\S])/g, "$1");
			switch (true) {
				case /\bfirst\b/.test(s$1): // 第一个
					return $1r.indexOf(s$2);
				// break;
				case /\blast\b/.test(s$1): // 最后一个
					return $1r.lastIndexOf(s$2);
				// break;
			}
		};
		if (search = $1p2.match(/^(-?\d+)$/)) {
			return $1r.slice(search[1]);
		};
		if (search = $1p2.match(/^(-?\d+),(-?\d+)$/)) {
			return $1r.slice(search[1], search[2]);
		};
		switch($1p2) { // 字符串操作
			case "rev": case "reverse": return esrever.reverse($1r);
			case "len": case "length":  return $1r.length;
			case "lower": return $1r.toLowerCase();
			case "upper": return $1r.toUpperCase();
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
function cmpF (opr, str1, str2) { // 比较函数
	opr = opr.toLowerCase();
	switch (opr) { // 比较运算符
		case "==": case "equ": return str1 === str2; // break;
		case "!=": case "neq": return str1 !== str2; // break;
		case "<":  case "lss": return str1  <  str2; // break;
		case "<=": case "leq": return str1  <= str2; // break;
		case ">":  case "gtr": return str1  >  str2; // break;
		case ">=": case "geq": return str1  >= str2; // break;
	}
}
function HTMLEscape (str) { // HTML 转义
	return (""+str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function KernelStep (cmd) {
	cmd = String(cmd).replace(/[\s\t\xa0\u3000]*/, "");
	if (cmd.charAt(0) === ":" || cmd.charAt(0) === "#" || cmd === "") {++lineNum; return;}
	var cmdn = cmd.match(/[A-Za-z0-9\-\_$]+(:[A-Za-z0-9\-\_$]*)?/)[0];
	var cmdnl = cmdn.split(":"), compare1;
	cmdnl.length < 2 && (cmdnl[1] = "");
	var content = cmd.slice(cmdn.length).replace(/\s/,""), tmp;
	switch (cmdnl[0]) {
		case "write": // 写
			switch (cmdnl[1]) {
				case "cssf": // CSS 样式 + 格式
					content = parseFmt1("var_" + content);
					hout += '<span style="' + HTMLEscape(content) + '">';
					KernelStep(compiled[lineNum+1]);
					hout += '</span>';
				break;
				case "css": // CSS 样式
					hout += '<span style="' + HTMLEscape(content) + '">';
					KernelStep(compiled[lineNum+1]);
					hout += '</span>';
				break;
				case "multi": // 多行字符串
					var rlines = parseInt(content);
					while (rlines) {
						if (lineNum + 1 >= significantLines) {break;}
						hout += HTMLEscape(compiled[++lineNum]);
						--rlines; // 剩余行数递减
					}
				break;
				case "var":
					hout += HTMLEscape(variableList["var_" + content]);
				break;
				case "format":
					hout += HTMLEscape(parseFmt1(content));
				break;
				case "readln":
					hout += HTMLEscape(compiled[content]);
				break;
				default:
					hout += HTMLEscape(content);
			}
			++lineNum;
		break;
		case "writeln": // 写
			switch (cmdnl[1]) {
				case "format":
					hout += HTMLEscape(parseFmt1(content)) + "\n";
				break;
				case "readln":
					hout += HTMLEscape(compiled[content]) + "\n";
				break;
				case "multi": // 多行字符串带换行
					var rlines = parseInt(content);
					while (rlines) {
						if (lineNum + 1 >= significantLines) {break;}
						hout += HTMLEscape(compiled[++lineNum]) + "\n";
						--rlines; // 剩余行数递减
					}
				break;
				default:
					hout += HTMLEscape(content) + "\n";
			}
			++lineNum;
		break;
		case "alert": // 提示文字
			breakpoint = true; rframe = false;
			switch (cmdnl[1]) {
				case "format":
					_calert(ptitle,parseFmt1(content));
				break;
				default:
					_calert(ptitle,content);
			}
			++lineNum;
		break;
		case "rem": ++lineNum; break; // 注释 (remark)
		case "clear": // 清除输出
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
			tmp = content.match(/(\S*)\s*([\+\-]?)\s*([\s\S]*)/); var nextL;
			switch (tmp[2]) {
				case "+": nextL = lineNum + +tmp[3]; break;
				case "-": nextL = lineNum -  tmp[3]; break;
				default:
					nextL = variableList["tag_" + tmp[3]];
			}
			switch (cmdnl[1]) {
				case "inc": // 递增
					variableList["var_" + tmp[1]]++;
				break;
				case "call": // 循环调用
					if (!elseCon) { // 不是否则
						calls[++callsp] = lastIF;
						calls[++callsp] = lastIF;
						calls[++callsp] = false;
						lineNum = variableList["tag_" + content];
					} else lineNum++;
				return;
				default: // 递减
					variableList["var_" + tmp[1]]--;
				break;
			}
			variableList["var_" + tmp[1]] ? (lineNum = nextL) : ++lineNum;
			variableList["var_" + tmp[1]] = "" + variableList["var_" + tmp[1]];
		break;
		case "call":
			switch (cmdnl[1]) {
				case "abs": // 绝对
					calls[++callsp] = ++lineNum;
					calls[++callsp] = lastIF;
					calls[++callsp] = elseCon;
					lineNum  = +content;
				break;
				case "abs-last":
					calls[++callsp] = ++lineNum;
					calls[++callsp] = lastIF;
					calls[++callsp] = elseCon;
					lineNum  = significantLines-content;
				break;
				case "rel": // 相对
					calls[++callsp] = ++lineNum;
					calls[++callsp] = lastIF;
					calls[++callsp] = elseCon;
					lineNum += +content;
				break;
				case "ret": // 返回
					elseCon = calls[callsp--];
					lastIF  = calls[callsp--];
					lineNum = calls[callsp--];
				break;
				default: // 标记
					calls[++callsp] = ++lineNum;
					calls[++callsp] = lastIF;
					calls[++callsp] = elseCon;
					lineNum = variableList["tag_" + content];
			}
		break;
		case "cflag": // 条件标志
			switch (cmdnl[1]) {
				case "set":   flag = true;  break; // 设置条件标志
				case "clear": flag = false; break; // 清除条件标志
				case "compl": flag = ~flag; break;
				case "push":  st1[++st1p] = flag; break;
				case "pop":   flag = st1[st1p--]; break;
				default: // 比较后设置条件标志
					tmp = content.split(" "); flag = cmpF(tmp[1], tmp[0], tmp[2]);
			}
		break;
		case "break": // 断点 
			++lineNum; breakpoint = true; rframe = false;
		break;
		case "terminate": // 程序终结
			for (var i = 1; i <= 4; ++i) $id("rb" + i).disabled = true;
			breakpoint = true; rframe = false; // 设置断点, 不执行下一帧。
		break;
		// case "terminate": // 程序终结
		// 	breakpoint = true; rframe = false;
		// break;
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
					vnam1 = tmp[1]; _cprompt(ptitle,"text",tmp[2]);
					breakpoint = true; rframe = false;
				break;
				case "pf":
					vnam1 = tmp[1]; _cprompt(ptitle,"text",parseFmt1(tmp[2]));
					breakpoint = true; rframe = false;
				break;
				case "pw": // 输入密码
					vnam1 = tmp[1]; _cprompt(ptitle,"password",tmp[2]);
					breakpoint = true; rframe = false;
				break;
				case "pwf":
					vnam1 = tmp[1]; _cprompt(ptitle,"password",parseFmt1(tmp[2]));
					breakpoint = true; rframe = false;
				break;
				case "ln":
					if (/^\s*\d\s*$/.test(tmp[1])) {
						compiled[+tmp[1]] = variableList["var_" + tmp[2]];
					} else {
						variableList["var_" + tmp[1]] = compiled[+tmp[2]];
					}
				break;
				case "del": // 删除变量
					delete variableList["var_" + tmp[1]];
				break;
				case "push": // 变量传送到堆栈
					st0[++st0p] = variableList["var_" + tmp[1]];
				break;
				case "pop": // 从堆栈取出来
					variableList["var_" + tmp[1]] = st0[st0p--];
				break;
				default:
					variableList["var_" + tmp[1]] = tmp[2];
			}
			++lineNum;
		break;
		case "title": // 设置标题
			switch (cmdnl[1]) {
				case "": // 同 default
				case "set":
					ptitle = content;
				break;
				case "push":
					st0[++st0p] = ptitle;
				break;
				case "pop":
					ptitle = st0[st0p--];
				break;
				default: // 默认值
					ptitle = content;
				break;
			}
			++lineNum;
		break;
		case "if": // 条件
			tmp = content.match(/(\S*)\s*(\S*)\s*(\S*)\s*([\s\S]*)/);
			compare1 = cmpF(tmp[2],+parseFmt1(tmp[1]),+parseFmt1(tmp[3]));
			cmdnl[1] === "not" && (compare1 = !compare1);
			elseCon = !compare1; lastIF = lineNum;
			if (compare1) KernelStep(tmp[4]); else ++lineNum;
		break;
		case "if_str": // 条件
			tmp = content.match(/(\S*)\s*(\S*)\s*(\S*)\s*([\s\S]*)/);
			compare1 = cmpF(tmp[2],parseFmt1(tmp[1]),parseFmt1(tmp[3]));
			cmdnl[1] === "not" && (compare1 = !compare1);
			elseCon = !compare1; lastIF = lineNum;
			if (compare1) KernelStep(tmp[4]); else ++lineNum;
		break;
		case "if_flag": // 条件
			compare1 = cmdnl[1] === "not" ? !flag : flag;
			elseCon = !compare1; lastIF = lineNum;
			if (compare1) KernelStep(content); else ++lineNum;
		break;
		case "confirm": // 条件是确认
			tmp = content.match(/("?)(.*?)\1(?:\s+([\s\S]*))?/);
			breakpoint = true; rframe = false; lastIF = lineNum;
			vnam1 = cmdnl[1] === "not"; vnam2 = tmp[3];
			_cconfirm(ptitle,tmp[2]);
		break;
		case "else": // 其他条件
			if (elseCon) {elseCon = false; KernelStep(content);} else ++lineNum;
		break;
		default:
			alert("找不到 " + cmdnl[0] + " 指令");
			console.error("找不到 " + cmdnl[0] + " 指令");
			breakpoint = true; rframe = false;
	}
}
