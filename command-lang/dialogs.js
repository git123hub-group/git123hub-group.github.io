// <![CDATA[
function _pOK (that) { // 确认键
	var p1 = that.parentElement;
	variableList["var_" + vnam1] = p1.getElementsByTagName("input")[0].value;
	p1.parentElement.remove();
	flag = true;
	continueF(stepO1);
}
function _pCan (that) { // 取消键
	variableList["var_" + vnam1] = "";
	that.parentElement.parentElement.remove();
	flag = false;
	continueF(stepO1);
}
function _pOK2 (that) { // 确认键
	elseCon = vnam1;
	vnam1 ? ++lineNum : KernelStep(vnam2);
	that.parentElement.parentElement.remove();
	continueF(stepO1);
	breakpoint = false;
	$id("COutput").innerHTML = hout;
	$id("CDebug").innerHTML = "Line " + (lineNum + 1) + ": " + compiled[lineNum];
}
function _pCan2 (that) { // 取消键
	elseCon = !vnam1;
	vnam1 ? KernelStep(vnam2) : ++lineNum;
	that.parentElement.parentElement.remove();
	continueF(stepO1);
	breakpoint = false;
	$id("COutput").innerHTML = hout;
	$id("CDebug").innerHTML = "Line " + (lineNum + 1) + ": " + compiled[lineNum];
}
function _pNop (that) { // 取消键
	_pNopOrig(that); continueF(stepO1);
}
function _pNopOrig (that) { // 取消键
	that.parentElement.parentElement.remove();
}
function _pkStep (that) { // 调试键
	var tmp = lineNum; // 存储行号
	KernelStep(that.parentElement.getElementsByTagName("input")[0].value);
	that.parentElement.parentElement.remove();
	lineNum = tmp; // 取出行号
	$id("COutput").innerHTML = hout;
}
function _calert (title, content) {
	var e = document.createElement("div");
	content == null && (content = "");
	e.className = "o0";
	e.innerHTML = "<div class=\"o1\"><\/div><div class=\"o2c\"><div class=\"o3\">" + HTMLEscape(title) + "<\/div><div class=\"o6\">" + HTMLEscape(content) + "<\/div><div class=\"o8\" onclick=\"_pNop(this)\">确认<\/div><\/div>";
	document.getElementById("_dialogs").appendChild(e);
}
function _cconfirm (title, content) {
	var e = document.createElement("div");
	content == null && (content = "");
	e.className = "o0";
	e.innerHTML = "<div class=\"o1\"><\/div><div class=\"o2c\"><div class=\"o3\">" + HTMLEscape(title) + "<\/div><div class=\"o6\">" + HTMLEscape(content) + "<\/div><div class=\"o4\" onclick=\"_pCan2(this)\">取消<\/div><div class=\"o5\" onclick=\"_pOK2(this)\">确认<\/div><\/div>";
	document.getElementById("_dialogs").appendChild(e);
}
function _cprompt (title, _type, content, value) {
	var e = document.createElement("div");
	_type == null && (_type = "");
	content == null && (content = "");
	value == null && (value = "");
	e.className = "o0";
	e.innerHTML = "<div class=\"o1\"><\/div><div class=\"o2\"><div class=\"o3\">" + HTMLEscape(title) + "<\/div><div class=\"o6\">" + HTMLEscape(content) + "<br /><input type=\"" + HTMLEscape(_type) + "\" class=\"o7\" value=\"" + HTMLEscape(value) + "\" /><\/div><div class=\"o4\" onclick=\"_pCan(this)\">取消<\/div><div class=\"o5\" onclick=\"_pOK(this)\">确认<\/div><\/div>";
	document.getElementById("_dialogs").appendChild(e);
}
function _cpDebug (title, _type, content, value) {
	var e = document.createElement("div");
	_type == null && (_type = "");
	content == null && (content = "");
	value == null && (value = "");
	e.className = "o0";
	e.innerHTML = "<div class=\"o1\"><\/div><div class=\"o2\"><div class=\"o3\">" + HTMLEscape(title) + "<\/div><div class=\"o6\">" + HTMLEscape(content) + "<br /><input type=\"" + HTMLEscape(_type) + "\" class=\"o7\" value=\"" + HTMLEscape(value) + "\" /><\/div><div class=\"o4\" onclick=\"_pNop(this)\">取消<\/div><div class=\"o5\" onclick=\"_pkStep(this)\">确认<\/div><\/div>";
	document.getElementById("_dialogs").appendChild(e);
}
function continueF (n) {
	if (n === 1) { // 继续执行
		if (!breakpoint && callsp > prevsp) return CommandStepOverC();
	}
	if (n === 2) return CommandRun();
}
function CommandStepOverC () {
	if (!iscompiled || !stillRunning) return;
	// prevsp = callsp; stepO1 = 1;
	do {
		KernelStep(compiled[lineNum]);
	} while (!breakpoint && callsp > prevsp);
	breakpoint = false;
	$id("COutput").innerHTML = hout;
	$id("CDebug").innerHTML = "Line " + (lineNum + 1) + ": " + compiled[lineNum];
	if (rframe && callsp > prevsp) {
		requestAnimationFrame(CommandRun);
	}
};
function insertText(myField, myValue) { // 插入
    if (document.selection) { //IE support
        myField.focus();
        sel = document.selection.createRange();
        sel.text = myValue;
    } else if (myField.selectionStart || myField.selectionStart == 0) { //MOZILLA/NETSCAPE support
        var startPos = myField.selectionStart;
        var endPos = myField.selectionEnd;
        myField.value = myField.value.substring(0, startPos) + myValue
        + myField.value.substring(endPos, myField.value.length);
        startPos += myValue.length;
        myField.selectionStart = myField.selectionEnd = startPos;
    } else {
        myField.value += myValue;
    }
    myField.focus();
};
function alternL () { // 左键
	var cib11 = cib1.getElementsByTagName("textarea")[0];
	var startPos = cib11.selectionStart;
	var endPos = cib11.selectionEnd;
	if (shiftingK & 1) {
		if (startPos === endPos) cib11.selectionStart--, cib11.selectionDirection = "backward";
		else if (cib11.selectionDirection === "forward") cib11.selectionEnd--;
		else cib11.selectionStart--;
	} else {
		if (startPos === endPos) {--startPos}
		cib11.selectionStart = cib11.selectionEnd = startPos;
	}
	cib11.focus();
}
function alternR () { // 右键
	var cib11 = cib1.getElementsByTagName("textarea")[0];
	var startPos = cib11.selectionStart;
	var endPos = cib11.selectionEnd;
	if (shiftingK & 1) {
		if (startPos === endPos) cib11.selectionEnd++, cib11.selectionDirection = "forward";
		else if (cib11.selectionDirection === "forward") cib11.selectionEnd++;
		else cib11.selectionStart++;
	} else {
		if (startPos === endPos) {++endPos}
		cib11.selectionStart = cib11.selectionEnd = endPos;
	}
	cib11.focus();
}
// ]]>
