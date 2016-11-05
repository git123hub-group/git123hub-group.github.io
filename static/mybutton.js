;!function () {
	var buttons = document.getElementsByClassName("btn");
	for (len = buttons.length, btnid = 0; btnid < len; ++btnid) {
		function toBtn(html) {
			var r = '<div class="bef"></div>', ccd, tmp, tmp2, flags, stack = [], sptr = -1, attr = 0, tlen = 8;
			entity = {
				"nbsp": 0,
				"quot": 2,
				"amp": 6,
				"apos": 7,
				"lt": 28,
				"gt": 30,
			};
			for (var i = 0, len = html.length; i < len; i++) {
				flags = "";
				(attr & 1) && (flags += " ul")
				switch (ccd = html.charCodeAt(i) - 32) {
					case 6:
						i++;
						if (html.charAt(i) === "#") {
							i++; tmp = 0;
							for (; i < len; i++) {
								if (html.charAt(i) === ";") {
									break;
								}
								tmp = tmp * 10 + +html.charAt(i);
							}
							r += '<div class="c' + (tmp - 32) + flags + '"></div>'
							tlen += 8;
						} else {
							tmp = "";
							for (; i < len; i++) {
								if (html.charAt(i) === ";") {
									break;
								}
								tmp += html.charAt(i);
							}
							r += '<div class="c' + entity[tmp] + flags + '"></div>'
							tlen += 8;
						}
					break;
					case 28:
						tmp = ""; ++i;
						for (; i < len; i++) {
							if (html.charAt(i) === ">") {
								break;
							}
							tmp += html.charAt(i);
						}
						if (tmp.charAt(0) === "/") {
							attr = stack[sptr--];
						} else {
							stack[++sptr] = attr;
							tmp2 = tmp.match(/\bclass=((?:[^'"]\S*)|'[^']*'|"[^"]*")/)
							tmp2 = tmp2 ? tmp2[1] : " ";
							/\bunderline\b/.test(tmp2) && (attr |= 1);
						}
					break;
					default:
						r += '<div class="c' + ccd + flags + '"></div>'
						tlen += 8;
					break;
				}
			}
			buttons[btnid].style.width = tlen + "px";
			return r + '<div class="aft"></div>';
		}
		buttons[btnid].innerHTML = toBtn(buttons[btnid].innerHTML);
		buttons[btnid].style.display = "inline-block";
		buttons[btnid].onmousedown = function (event) {
			this.classList.add("active");
		}
		buttons[btnid].onmouseup = function (event) {
			this.classList.remove("active");
		}
	}
	var head = document.head || document.getElementsByTagName("head")[0];
	var icss = document.createElement("link");
	icss.rel = "stylesheet";
	icss.href = "https://git123hub.github.io/static/mybutton.css";
	head.appendChild(icss);
}();