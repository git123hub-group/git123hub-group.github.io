// <![CDATA[
function _pOK (that) {
	var p1 = that.parentElement;
	// alert(p1.getElementsByTagName("input")[0].value);
	p1.parentElement.remove();
}
function _pCan (that) {
	// alert("");
	that.parentElement.parentElement.remove();
}
function _cprompt (title, value) {
	var e = document.createElement("div");
	value == null && (value = "");
	e.className = "o0";
	e.innerHTML = "<div class=\"o1\"><\/div><div class=\"o2\"><div class=\"o3\">" + HTMLEscape(title) + "<\/div><div class=\"o6\">请输入字符串:<br /><input type=\"text\" class=\"o7\" value=\"" + HTMLEscape(value) + "\" /><\/div><div class=\"o4\" onclick=\"_pCan(this)\">取消<\/div><div class=\"o5\" onclick=\"_pOK(this)\">确认<\/div><\/div>"
	document.getElementById("_dialogs").appendChild(e);
}
// ]]>
