// <![CDATA[
function _pOK (that) { // 确认键
	var p1 = that.parentElement;
	variableList["var_" + vnam1] = p1.getElementsByTagName("input")[0].value;
	p1.parentElement.remove();
	flag = true
	continueF(stepO1);
}
function _pCan (that) { // 取消键
	variableList["var_" + vnam1] = "";
	that.parentElement.parentElement.remove();
	flag = false
	continueF(stepO1);
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
// ]]>
