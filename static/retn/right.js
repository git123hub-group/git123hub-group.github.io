var doc_head = document.head || document.getElementsByTagName("head")[0];
var doc_body = document.body || document.getElementsByTagName("body")[0];

var cssP1 = document.createElement("link");
	cssP1.rel = "stylesheet";
	cssP1.href = "https://git123hub.github.io/static/retn/right.css";
	doc_head.appendChild(cssP1);

var cssP1b = document.createElement("div");
	cssP1b.className = "linkh"
	cssP1b.style.top = (+window._bd_share_config.slide.bdTop + 58) + "px";
	cssP1b.onclick = function (event) {
		location.href = "/index/"
	}
	doc_body.appendChild(cssP1b);
