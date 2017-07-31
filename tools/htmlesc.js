function $ (id) {
	return document.getElementById(id);
}
function escapeHTML (str) {
	return ("" + str)
		.replace(/&/g, '&amp;')
		.replace(/["'`\x80-\uffff]/g, function (c) {
			return "&#" + c.charCodeAt(0) + ";";
		})
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');
};
function unescapeHTML (str) {
	var unescl = {amp: "&", lt: "<", gt: ">", quot: '"'};
	return ("" + str).replace(/&([^;]+);/g, function (a, b) {
		if (b.charAt(0) !== "#") return unescl[b];
		if (b.charAt(1).toLowerCase() !== "x") return String.fromCharCode(b.slice(1));
		return String.fromCharCode(parseInt(b.slice(2), 16));
	})
};
window._bd_share_config={"common":{"bdSnsKey":{},"bdText":"","bdMini":"2","bdMiniList":false,"bdPic":"","bdStyle":"0","bdSize":"32"},"share":{"bdSize":16},"slide":{"type":"slide","bdImg":"0","bdPos":"right","bdTop":"100"},"image":{"viewList":["qzone","tsina","tqq","renren","weixin"],"viewText":"分享到：","viewSize":"32"},"selectShare":{"bdContainerClass":null,"bdSelectMiniList":["qzone","tsina","tqq","renren","weixin"]}};with(document)0[(getElementsByTagName('head')[0]||body).appendChild(createElement('script')).src='https://git123hub.github.io/static/api/js/share.js?v=89860593.js?cdnversion='+~(-new Date()/36e5)];