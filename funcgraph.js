function functiongraphMain() {
	this.version = '1.08';
	w = 570;
	h = 510;
	graphLt = 0;
	graphTp = 0;
	graphWd = 550;
	graphHt = 340;
	coords = new Coords(graphLt, graphTp, graphWd, graphHt, -5, -3, 5, 3, true);
	canvasWd = graphWd;
	canvasHt = graphHt;
	clrs = ["darkblue", "orange"];
	var s = '';
	s += '<div style="position:relative; width:' + w + 'px; height:' + h + 'px; border-radius: 10px;  margin:auto; display:block; background-color: #ddeeff; ">';
	s += '<div style="position:absolute; left:50px; top:6px; color:' + clrs[0] + '; font: bold 20px Arial; width:96%; z-index: 2;">y =</div>';
	s += '<input type="text" id="f0" style="position:absolute; left:90px; top:6px; color:' + clrs[0] + '; background-color: #eeffee; text-align:center; font: bold 20px Arial; width:420px; border-radius: 10px;  z-index: 2;" value="" onKeyUp="doGraph()" />';
	s += '<div style="position:absolute; left:50px; top:36px; color:' + clrs[1] + '; font: bold 20px Arial; width:96%; z-index: 2;">y =</div>';
	s += '<input type="text" id="f1" style="position:absolute; left:90px; top:36px; color:' + clrs[1] + '; background-color: #eeffee; text-align:center; font: bold 20px Arial; width:420px; border-radius: 10px;  z-index: 2;" value="" onKeyUp="doGraph()" />';
	s += '<div style="position:absolute; left:135px; top:68px; color:black; font: 13px Arial; z-index: 2;">缩放:</div>';
	s += '<input type="range" id="r1"  value="0.5" min="0" max="1" step=".01"  style="z-index:2; position:absolute; top:66px; left:170px; width:200px; height:17px; border: none; " oninput="onZoomChg(0,this.value)" onchange="onZoomChg(1,this.value)" />';
	s += '<button style="font: 12px Arial; position:absolute; left:380px; top:66px;" class="togglebtn"  onclick="zoomReset()" >重置</button>';
	s += '<canvas id="canvasId" width="' + canvasWd + '" height="' + canvasHt + '" style="position:absolute; left:5px; top:22px; z-index:1; margin-top: 70px; margin-left: 5px; background-color: #ffffff; border: 1px solid black;"></canvas>';
	s += '<button id="polarBtn" style="font: 16px Arial; position:absolute; left:3px; bottom:23px;" class="togglebtn lo"  onclick="polarClick()" >极坐标</button>';
	s += '<div id="aval" style="position:absolute; left:265px; bottom:39px; color:black; font: bold 17px Arial; z-index: 2; text-align: : center;">1</div>';
	s += '<div style="position:absolute; left:160px; bottom:25px; color:black; font: bold 13px Arial; z-index: 2;">a:</div>';
	s += '<input type="range" id="ra" value="1" min="0" max="2" step=".001"  style="z-index:2; position:absolute; left:170px; bottom:23px; width:200px; height:17px; border: none; " oninput="onaChg(0,this.value)" onchange="onaChg(1,this.value)" />';
	s += '<button style="font: 16px Arial; position:absolute; right:120px; bottom:33px;" class="togglebtn"  onclick="linkPop()" >链接</button>';
	s += '<button style="font: 16px Arial; position:absolute; right:64px; bottom:33px;" class="togglebtn"  onclick="printCanvas()" >打印</button>';
	s += '<button style="font: 16px Arial; position:absolute; right:3px; bottom:33px;" class="togglebtn"  onclick="saveCanvas()" >保存</button>';
	s += '<button style="font: 16px Arial; position:absolute; right:3px; bottom:3px;" class="togglebtn"  onclick="doExample()" >例子</button>';
	s += '<div id="linkpop" style="position:absolute; left:-450px; top:240px; padding: 5px; border: 1px solid red; border-radius: 9px; background-color: #88aaff; box-shadow: 10px 10px 5px 0px rgba(40,40,40,0.75); z-index:1; transition: all linear 0.3s; opacity:0; ">';
	s += '<textarea  id="linkbox" value="ddd" style="width: 400px; height: 120px; font: 16px Arial; border: 1px solid red; border-radius: 9px; background-color: #eeeeff; display: block;">';
	s += '</textarea >';
	s += '<div style="float:right; margin: 0 0 5px 10px;">';
	s += '<button onclick="linkPopClose()" style="z-index:2; font: 22px Arial;" class="togglebtn" >&#x2714;</button>';
	s += '</div>';
	s += '</div>';
	s += '<div id="copyrt" style="font: bold 10px Arial; color: #6600cc; position:absolute; left:5px; bottom:3px;">&copy; 2015 MathsIsFun.com  v' + this.version + '</div>';
	s += '</div>';
	document.write(s);
	el = document.getElementById('canvasId');
	ratio = 3;
	el.width = canvasWd * ratio;
	el.height = canvasHt * ratio;
	el.style.width = canvasWd + "px";
	el.style.height = canvasHt + "px";
	g = el.getContext("2d");
	g.setTransform(ratio, 0, 0, ratio, 0, 0);
	g.translate(0.5, 0.5);
	examples = ['tan(x)/x', '(x-1)(x+1)', '2x', 'e^x'];
	exampleNo = 0;
	currZoom = 1;
	polarQ = false;
	aVal = 1;
	var inStr = getQueryVariable('func1');
	if (inStr) {
		inStr = decodeURIComponent(inStr);
		document.getElementById('f0').value = inStr;
	}
	inStr = getQueryVariable('func2');
	if (inStr) {
		inStr = decodeURIComponent(inStr);
		document.getElementById('f1').value = inStr;
	}
	if (inStr = getQueryVariable('xmin')) coords.xStt = parseFloat(inStr);
	if (inStr = getQueryVariable('xmax')) coords.xEnd = parseFloat(inStr);
	if (inStr = getQueryVariable('ymin')) coords.yStt = parseFloat(inStr);
	if (inStr = getQueryVariable('ymax')) coords.yEnd = parseFloat(inStr);
	coords.calcScale();
	parser = new Parser();
	dragging = false;
	downX = 0;
	downY = 0;
	prevX = 0;
	prevY = 0;
	el.addEventListener("mousedown", mouseDownListener, false);
	window.addEventListener("mousemove", mouseMoveListener, false);
	window.addEventListener("mouseup", mouseUpListener, false);
	el.addEventListener('touchstart', ontouchstart, false);
	window.addEventListener('touchmove', ontouchmove, false);
	window.addEventListener('touchend', ontouchend, false);
	doGraph();
}

function linkPop() {
	var pop = document.getElementById('linkpop');
	pop.style.transitionDuration = "0.3s";
	pop.style.opacity = 1;
	pop.style.zIndex = 12;
	pop.style.left = '100px';
	document.getElementById('linkbox').value = makeURL();
}

function makeURL() {
	var s = "https://git123hub.github.io/function-grapher.html?";
	var f0 = document.getElementById('f0').value;
	if (f0.length > 0) {
		s += "func1=" + encodeURIComponent(f0) + "&";
	}
	var f1 = document.getElementById('f1').value;
	if (f1.length > 0) {
		s += "func2=" + encodeURIComponent(f1) + "&";
	}
	s += "xmin=" + coords.xStt.toPrecision(4) + "&";
	s += "xmax=" + coords.xEnd.toPrecision(4) + "&";
	s += "ymin=" + coords.yStt.toPrecision(4) + "&";
	s += "ymax=" + coords.yEnd.toPrecision(4) + "&";
	s = s.substr(0, s.length - 1);
	return (s);
}

function linkPopClose() {
	var pop = document.getElementById('linkpop');
	pop.style.opacity = 0;
	pop.style.zIndex = 1;
	pop.style.left = '-500px';
}

function onaChg(n, v) {
	aVal = v;
	var div = document.getElementById('aval');
	div.innerHTML = v;
	div.style.left = (170 + v * 100) + 'px';
	doGraph();
}

function polarClick() {
	polarQ = !polarQ;
	toggleBtn('polarBtn', polarQ);
	doGraph();
}

function toggleBtn(btn, onq) {
	if (onq) {
		document.getElementById(btn).classList.add("hi");
		document.getElementById(btn).classList.remove("lo");
	} else {
		document.getElementById(btn).classList.add("lo");
		document.getElementById(btn).classList.remove("hi");
	}
}

function zoomReset() {
	coords = new Coords(graphLt, graphTp, graphWd, graphHt, -5, -3, 5, 3, true);
	doGraph();
}

function doExample() {
	exampleNo = (++exampleNo) % examples.length;
	document.getElementById('f1').value = examples[exampleNo];
	doGraph();
}

function ontouchstart(evt) {
	var touch = evt.targetTouches[0];
	evt.clientX = touch.clientX;
	evt.clientY = touch.clientY;
	evt.touchQ = true;
	mouseDownListener(evt)
}

function ontouchmove(evt) {
	var touch = evt.targetTouches[0];
	evt.clientX = touch.clientX;
	evt.clientY = touch.clientY;
	evt.touchQ = true;
	mouseMoveListener(evt);
	evt.preventDefault();
}

function ontouchend(evt) {
	dragging = false;
}

function mouseDownListener(evt) {
	var bRect = el.getBoundingClientRect();
	var mouseX = (evt.clientX - bRect.left) * (el.width / ratio / bRect.width);
	var mouseY = (evt.clientY - bRect.top) * (el.height / ratio / bRect.height);
	downX = mouseX;
	downY = mouseY;
	prevX = mouseX;
	prevY = mouseY;
	dragging = true;
	if (evt.preventDefault) {
		evt.preventDefault();
	} else if (evt.returnValue) {
		evt.returnValue = false;
	}
	return false;
}

function mouseUpListener(evt) {
	var bRect = el.getBoundingClientRect();
	var mouseX = (evt.clientX - bRect.left) * (el.width / ratio / bRect.width);
	var mouseY = (evt.clientY - bRect.top) * (el.height / ratio / bRect.height);
	if (Math.abs(mouseX - downX) < 2 && Math.abs(mouseY - downY) < 2) {
		coords.newCenter(mouseX, mouseY);
		doGraph();
	}
	dragging = false;
}

function mouseMoveListener(evt) {
	var bRect = el.getBoundingClientRect();
	var mouseX = (evt.clientX - bRect.left) * (el.width / ratio / bRect.width);
	var mouseY = (evt.clientY - bRect.top) * (el.height / ratio / bRect.height);
	if (dragging) {
		var moveX = prevX - mouseX;
		var moveY = mouseY - prevY;
		if (Math.abs(moveX) > 1 || Math.abs(moveY) > 1) {
			coords.drag(moveX, moveY);
			doGraph();
			prevX = mouseX;
			prevY = mouseY;
		}
	}
}

function onZoomChg(n, v) {
	var scaleBy = (v * 2 + 0.01) / currZoom; // add 0.01 to avoid zero
	coords.scale(scaleBy);
	currZoom *= scaleBy;
	if (n == 1) {
		currZoom = 1;
		document.getElementById('r1').value = 0.5;
	}
	doGraph();
}

function drawPlot(plotType, gaps) {
	gaps = null;
	switch (plotType) {
	case "implicit":
		drawNewton(1);
		break;
	case "newton2":
		drawNewton(2);
		break;
	case "signchange":
		drawImplicitSign(2, plotType);
		break;
	case "shaded":
		drawShaded(2, plotType);
		break;
	default:
	}
	var breakQ = true;
	var prevxPix = -1;
	var prevyPix = -1;
	var yState = 9;
	var ptNumMin;
	var ptNumMax;
	switch (plotType) {
	case "xy":
	case "dydx":
		ptNumMin = 0;
		ptNumMax = coords.width;
		break;
	case "polar":
		var revFrom = 0;
		var revTo = 4;
		var angle0 = revFrom * 6.2832;
		var angle1 = revTo * 6.2832;
		points = Math.min(Math.max(600, (revTo - revFrom) * 250), 3000);
		stepSize = (angle1 - angle0) / points;
		if (stepSize == 0) stepSize = 1;
		ptNumMin = Math.floor(angle0 / stepSize);
		ptNumMax = Math.ceil(angle1 / stepSize);
		break;
	case "para":
		var tFrom = 0;
		var tTo = 3;
		var points = Math.min(Math.max(600, (tTo - tFrom) * 250), 3000);
		var stepSize = (tTo - tFrom) / points;
		if (stepSize == 0) stepSize = 1;
		ptNumMin = Math.floor(tFrom / stepSize);
		ptNumMax = Math.ceil(tTo / stepSize);
		break;
	default:
	}
	var line = [];
	var prevxVal = Number.NEGATIVE_INFINITY;
	var prevyVal = Number.NEGATIVE_INFINITY;
	var recipdx = 1 / coords.xScale;
	for (var ptNum = 0; ptNum <= ptNumMax; ptNum++) {
		var xVal;
		var yVal;
		var xPix;
		var yPix;
		switch (plotType) {
		case "xy":
			xPix = ptNum;
			xVal = coords.xStt + xPix * coords.xScale;
			parser.setVarVal("x", xVal);
			yVal = parser.getVal();
			yPix = coords.toYPix(yVal, false);
			break;
		case "dydx":
			xPix = ptNum;
			xVal = coords.xStt + xPix * coords.xScale;
			parser.setVarVal("x", xVal);
			var thisyVal = parser.getVal();
			yVal = (thisyVal - prevyVal) * recipdx;
			prevyVal = thisyVal;
			break;
		case "polar":
			var angle = ptNum * stepSize;
			parser.setVarVal("x", angle);
			var radius = parser.getVal();
			xVal = radius * Math.cos(angle);
			yVal = radius * Math.sin(angle);
			break;
		case "para":
			xPix = ptNum;
			var t = coords.xStt + xPix * coords.xScale;
			var xy = conicVals(t);
			xVal = xy[0];
			yVal = xy[1];
			if (this.vals["b"] > 1.1) {
				if (yVal < -0.95 && yVal > -1.05) {
					pt1[0] = xy[0];
					pt1[1] = xy[1];
				}
			} else {
				if (yVal < -this.vals["b"] * 0.7 && yVal > -this.vals["b"] * 0.8) {
					pt1[0] = xy[0];
					pt1[1] = xy[1];
				}
			}
			break;
		default:
		}
		var prevbreakQ = breakQ;
		breakQ = false;
		var prevyState = yState;
		yState = 0;
		if (yVal < coords.yStt) yState = -1;
		if (yVal > coords.yEnd) yState = 1;
		if (yVal == Number.NEGATIVE_INFINITY) {
			yState = -1;
			yVal = coords.yStt - coords.yScale * 10;
		}
		if (yVal == Number.POSITIVE_INFINITY) {
			yState = 1;
			yVal = coords.yEnd + coords.yScale * 10;
		}
		breakQ = prevyState * yState != 0;
		if (isNaN(yVal)) {
			yState = 9;
			breakQ = true;
		}
		if (plotType == "polar" || plotType == "para") {
			xVal = Math.min(Math.max(coords.xStt - coords.xScale * 10, xVal), coords.xEnd + coords.xScale * 10);
			xPix = (xVal - coords.xStt) / coords.xScale;
		}
		yVal = Math.min(Math.max(coords.yStt - coords.yScale * 10, yVal), coords.yEnd + coords.yScale * 10);
		yPix = (coords.yEnd - yVal) / coords.yScale;
		if (breakQ) {
			if (prevbreakQ) {} else {
				if (yState < 9) {
					line.push([xPix, yPix]);
				}
			}
		} else {
			if (prevbreakQ) {
				if (prevyState < 9) {
					line.push(0);
					line.push([prevxPix, prevyPix]);
					line.push([xPix, yPix]);
				} else {
					line.push(0);
					line.push([xPix, yPix]);
				}
			} else {
				line.push([xPix, yPix]);
			}
		}
		prevxVal = xVal;
		prevxPix = xPix;
		prevyPix = yPix;
	}
	var sttQ = true;
	g.beginPath();
	for (var i = 0, len = line.length; i < len; i++) {
		var pt = line[i];
		if (pt == 0) {
			g.stroke();
			sttQ = true;
		} else {
			if (sttQ) {
				g.beginPath();
				g.moveTo(pt[0], pt[1]);
				sttQ = false;
			} else {
				g.lineTo(pt[0], pt[1]);
			}
		}
	}
	g.stroke();
}

function doGraph() {
	g.clearRect(0, 0, el.width, el.height);
	var graph = new Graph(g, coords);
	graph.drawGraph();
	var start = new Date().getTime();
	for (var i = 0; i < 2; i++) {
		var s = document.getElementById('f' + i).value;
		if (s.length > 0) {
			s = s.substr(0, 1000);
			parser.radiansQ = this.radQ;
			parser.setVarVal('a', aVal);
			parser.newParse(s);
			g.strokeStyle = clrs[i];
			g.lineWidth = 1.5;
			if (polarQ) {
				drawPlot('polar');
			} else {
				drawPlot('xy');
			}
		}
	}
	var end = new Date().getTime();
	var time = end - start;
	g.fillStyle = "#000000";
	g.strokeStyle = "#000000";
	g.font = "bold 14px Verdana";
	g.textAlign = "center";
	var anss = [];
	for (var i = 0; i < anss.length; i++) {
		var ans = anss[i];
		if (ans >= coords.xStt && ans < coords.xEnd) {
			g.fillText(ans.toPrecision(5), coords.toXPix(ans), coords.toYPix(0) - 10);
			g.beginPath();
			g.arc(coords.toXPix(ans), coords.toYPix(0), 5, 0, Math.PI * 2);
			g.stroke();
		}
	}
}

function fmt(num, digits) {
	digits = 14;
	if (num == Number.POSITIVE_INFINITY) return "undefined";
	if (num == Number.NEGATIVE_INFINITY) return "undefined";
	num = num.toPrecision(digits);
	num = num.replace(/0+$/, "");
	if (num.charAt(num.length - 1) == ".") num = num.substr(0, num.length - 1);
	if (Math.abs(num) < 1e-15) num = 0;
	return num;
}

function fixParentheses(s) {
	var sttParCount = 0;
	var endParCount = 0;
	for (var i = 0; i < s.length; i++) {
		if (s.charAt(i) == "(") sttParCount++;
		if (s.charAt(i) == ")") endParCount++;
	}
	while (sttParCount < endParCount) {
		s = "(" + s;
		sttParCount++;
	}
	while (endParCount < sttParCount) {
		s += ")";
		endParCount++;
	}
	return (s);
}

function Pt(x, y) {
	this.x = x;
	this.y = y;
}

function Coords(left, top, width, height, xStt, yStt, xEnd, yEnd, uniScaleQ) {
	this.left = left;
	this.top = top;
	this.width = width;
	this.height = height;
	this.xStt = xStt;
	this.yStt = yStt;
	this.xEnd = xEnd;
	this.yEnd = yEnd;
	this.uniScaleQ = uniScaleQ;
	this.xLogQ = false;
	this.yLogQ = false;
	this.calcScale();
}
Coords.prototype.calcScale = function() {
	if (this.xLogQ) {
		if (this.xStt <= 0) this.xStt = 1;
		if (this.xEnd <= 0) this.xEnd = 1;
	}
	if (this.yLogQ) {
		if (this.yStt <= 0) this.yStt = 1;
		if (this.yEnd <= 0) this.yEnd = 1;
	}
	var temp;
	if (this.xStt > this.xEnd) {
		temp = this.xStt;
		this.xStt = this.xEnd;
		this.xEnd = temp;
	}
	if (this.yStt > this.yEnd) {
		temp = this.yStt;
		this.yStt = this.yEnd;
		this.yEnd = temp;
	}
	var xSpan = this.xEnd - this.xStt;
	if (xSpan <= 0) xSpan = 1e-9;
	this.xScale = xSpan / this.width;
	this.xLogScale = (Math.log(this.xEnd) - Math.log(this.xStt)) / this.width;
	var ySpan = this.yEnd - this.yStt;
	if (ySpan <= 0) ySpan = 1e-9;
	this.yScale = ySpan / this.height;
	this.yLogScale = (Math.log(this.yEnd) - Math.log(this.yStt)) / this.height;
	if (this.uniScaleQ && !this.xLogQ && !this.yLogQ) {
		var newScale = Math.max(this.xScale, this.yScale);
		this.xScale = newScale;
		xSpan = this.xScale * this.width;
		var xMid = (this.xStt + this.xEnd) / 2;
		this.xStt = xMid - xSpan / 2;
		this.xEnd = xMid + xSpan / 2;
		this.yScale = newScale;
		ySpan = this.yScale * this.height;
		var yMid = (this.yStt + this.yEnd) / 2;
		this.yStt = yMid - ySpan / 2;
		this.yEnd = yMid + ySpan / 2;
	}
};
Coords.prototype.scale = function(factor, xMid, yMid) {
	if (typeof xMid == 'undefined') xMid = (this.xStt + this.xEnd) / 2;
	this.xStt = xMid - (xMid - this.xStt) * factor;
	this.xEnd = xMid + (this.xEnd - xMid) * factor;
	if (typeof yMid == 'undefined') yMid = (this.yStt + this.yEnd) / 2;
	this.yStt = yMid - (yMid - this.yStt) * factor;
	this.yEnd = yMid + (this.yEnd - yMid) * factor;
	this.calcScale();
};
Coords.prototype.drag = function(xPix, yPix) {
	this.xStt += xPix * this.xScale;
	this.xEnd += xPix * this.xScale;
	this.yStt += yPix * this.yScale;
	this.yEnd += yPix * this.yScale;
	this.calcScale();
};
Coords.prototype.newCenter = function(x, y) {
	var xMid = this.xStt + x * this.xScale;
	var xhalfspan = (this.xEnd - this.xStt) / 2;
	this.xStt = xMid - xhalfspan;
	this.xEnd = xMid + xhalfspan;
	var yMid = this.yEnd - y * this.yScale;
	var yhalfspan = (this.yEnd - this.yStt) / 2;
	this.yStt = yMid - yhalfspan;
	this.yEnd = yMid + yhalfspan;
	this.calcScale();
};
Coords.prototype.fitToPts = function(pts, borderFactor) {
	for (var i = 0; i < pts.length; i++) {
		var pt = pts[i];
		if (i == 0) {
			this.xStt = pt.x;
			this.xEnd = pt.x;
			this.yStt = pt.y;
			this.yEnd = pt.y;
		} else {
			this.xStt = Math.min(this.xStt, pt.x);
			this.xEnd = Math.max(this.xEnd, pt.x);
			this.yStt = Math.min(this.yStt, pt.y);
			this.yEnd = Math.max(this.yEnd, pt.y);
		}
	}
	var xMid = (this.xStt + this.xEnd) / 2;
	var xhalfspan = borderFactor * (this.xEnd - this.xStt) / 2;
	this.xStt = xMid - xhalfspan;
	this.xEnd = xMid + xhalfspan;
	var yMid = (this.yStt + this.yEnd) / 2;
	var yhalfspan = borderFactor * (this.yEnd - this.yStt) / 2;
	this.yStt = yMid - yhalfspan;
	this.yEnd = yMid + yhalfspan;
	this.calcScale();
};
Coords.prototype.toXPix = function(val, useCornerQ) {
	if (this.xLogQ) {
		return this.left + (Math.log(val) - Math.log(xStt)) / this.xLogScale;
	} else {
		return this.left + ((val - this.xStt) / this.xScale);
	}
};
Coords.prototype.toYPix = function(val) {
	if (this.yLogQ) {
		return this.top + (Math.log(yEnd) - Math.log(val)) / this.yLogScale;
	} else {
		return this.top + ((this.yEnd - val) / this.yScale);
	}
};
Coords.prototype.toPtVal = function(pt, useCornerQ) {
	return new Pt(this.toXVal(pt.x, useCornerQ), this.toYVal(pt.y, useCornerQ));
};
Coords.prototype.toXVal = function(pix, useCornerQ) {
	if (useCornerQ) {
		return this.xStt + (pix - this.left) * this.xScale;
	} else {
		return this.xStt + pix * this.xScale;
	}
};
Coords.prototype.toYVal = function(pix, useCornerQ) {
	if (useCornerQ) {
		return yEnd - (pix - top) * this.yScale;
	} else {
		return yEnd - pix * this.yScale;
	}
};
Coords.prototype.getTicks = function(stt, span, ratio) {
	var ticks = [];
	var inter = this.tickInterval(span / ratio, false);
	var tickStt = Math.ceil(stt / inter) * inter;
	var i = 0;
	do {
		var tick = tickStt + i * inter;
		tick = Number(tick.toPrecision(8));
		ticks.push([tick, 1]);
		i++;
	} while (tick < span);
	inter = this.tickInterval(span / ratio, true);
	for (i = 0; i < ticks.length; i++) {
		var t = ticks[i][0];
		if (Math.abs(Math.round(t / inter) - (t / inter)) < 0.001) {
			ticks[i][1] = 0;
		}
	}
	return ticks;
};
Coords.prototype.tickInterval = function(span, majorQ) {
	var pow10 = Math.pow(10, Math.floor(Math.log(span) * Math.LOG10E));
	var mantissa = span / pow10;
	if (mantissa >= 5) {
		if (majorQ) {
			return (5 * pow10);
		} else {
			return (1 * pow10);
		}
	}
	if (mantissa >= 3) {
		if (majorQ) {
			return (2 * pow10);
		} else {
			return (0.2 * pow10);
		}
	}
	if (mantissa >= 1.4) {
		if (majorQ) {
			return (0.5 * pow10);
		} else {
			return (0.2 * pow10);
		}
	}
	if (mantissa >= 0.8) {
		if (majorQ) {
			return (0.5 * pow10);
		} else {
			return (0.1 * pow10);
		}
	}
	if (majorQ) {
		return (0.2 * pow10);
	} else {
		return (0.1 * pow10);
	}
};

function Graph(g, coords) {
	this.g = g;
	this.coords = coords;
	this.xLinesQ = true;
	this.yLinesQ = true;
	this.xValsQ = true;
	this.yValsQ = true;
	this.skewQ = false;
}
Graph.prototype.drawGraph = function() {
	this.hzAxisY = coords.toYPix(0);
	if (this.hzAxisY < 0) this.hzAxisY = 0;
	if (this.hzAxisY > coords.height) this.hzAxisY = coords.height;
	this.hzNumsY = this.hzAxisY + 14;
	if (this.hzAxisY > coords.height - 10) this.hzNumsY = coords.height - 3;
	this.vtAxisX = coords.toXPix(0);
	if (this.vtAxisX < 0) this.vtAxisX = 0;
	if (this.vtAxisX > coords.width) this.vtAxisX = coords.width;
	this.vtNumsX = this.vtAxisX - 5;
	if (this.vtAxisX < 10) this.vtNumsX = 20;
	if (coords.xLogQ) {
		this.drawLinesLogX();
	} else {
		if (this.xLinesQ) {
			this.drawHzLines();
		}
	}
	if (coords.yLogQ) {
		this.drawLinesLogY();
	} else {
		if (this.yLinesQ) {
			this.drawVtLines();
		}
	}
};
Graph.prototype.drawVtLines = function() {
	var g = this.g;
	g.lineWidth = 1;
	var ticks = coords.getTicks(coords.xStt, coords.xEnd - coords.xStt, graphWd / 100);
	for (var i = 0; i < ticks.length; i++) {
		var tick = ticks[i];
		var xVal = tick[0];
		var tickLevel = tick[1];
		if (tickLevel == 0) {
			g.strokeStyle = "rgba(0,0,256,0.3)";
		} else {
			g.strokeStyle = "rgba(0,0,256,0.1)";
		}
		var xPix = coords.toXPix(xVal, false);
		g.beginPath();
		g.moveTo(xPix, coords.toYPix(coords.yStt, false));
		g.lineTo(xPix, coords.toYPix(coords.yEnd, false));
		g.stroke();
		if (tickLevel == 0 && this.xValsQ) {
			g.fillStyle = "#0000ff";
			g.font = "bold 12px Verdana";
			g.textAlign = "center";
			g.fillText(xVal.toString(), xPix, this.hzNumsY);
		}
	}
	if (this.skewQ) return;
	g.lineWidth = 1.5;
	g.strokeStyle = "#ff0000";
	g.beginPath();
	g.moveTo(this.vtAxisX, coords.toYPix(coords.yStt, false));
	g.lineTo(this.vtAxisX, coords.toYPix(coords.yEnd, false));
	g.stroke();
	g.beginPath();
	g.fillStyle = g.strokeStyle;
	g.drawArrow(this.vtAxisX, coords.toYPix(coords.yEnd), 15, 2, 20, 10, Math.PI / 2, 10, false);
	g.stroke();
	g.fill();
};
Graph.prototype.drawHzLines = function() {
	var g = this.g;
	g.lineWidth = 1;
	var ticks = coords.getTicks(coords.yStt, coords.yEnd - coords.yStt, graphHt / 100);
	for (var i = 0; i < ticks.length; i++) {
		var tick = ticks[i];
		var yVal = tick[0];
		var tickLevel = tick[1];
		if (tickLevel == 0) {
			g.strokeStyle = "rgba(0,0,256,0.3)";
		} else {
			g.strokeStyle = "rgba(0,0,256,0.1)";
		}
		var yPix = coords.toYPix(yVal, false);
		g.beginPath();
		g.moveTo(coords.toXPix(coords.xStt, false), yPix);
		g.lineTo(coords.toXPix(coords.xEnd, false), yPix);
		g.stroke();
		if (tickLevel == 0 && this.yValsQ) {
			g.fillStyle = "#ff0000";
			g.font = "bold 12px Verdana";
			g.textAlign = "right";
			g.fillText(yVal.toString(), this.vtNumsX, yPix + 5);
		}
	}
	if (this.skewQ) return;
	g.lineWidth = 2;
	g.strokeStyle = "#0000ff";
	g.beginPath();
	g.moveTo(coords.toXPix(coords.xStt, false), this.hzAxisY);
	g.lineTo(coords.toXPix(coords.xEnd, false), this.hzAxisY);
	g.stroke();
	g.beginPath();
	g.fillStyle = g.strokeStyle;
	g.drawArrow(coords.toXPix(coords.xEnd, false), this.hzAxisY, 15, 2, 20, 10, 0, 10, false);
	g.stroke();
	g.fill();
};

function Parser() {
	this.operators = "+-*(/),^.";
	this.rootNode;
	this.tempNode = [];
	this.Variable = "x";
	this.errMsg = "";
	this.radiansQ = true;
	this.vals = [];
	for (var i = 0; i < 26; i++) {
		this.vals[i] = 0;
	}
	this.reset();
}
Parser.prototype.setVarVal = function(varName, newVal) {
	switch (varName) {
	case "x":
		this.vals[23] = newVal;
		break;
	case "y":
		this.vals[24] = newVal;
		break;
	case "z":
		this.vals[25] = newVal;
		break;
	default:
		if (varName.length == 1) {
			this.vals[varName.charCodeAt(0) - 'a'.charCodeAt(0)] = newVal;
		}
	}
};
Parser.prototype.getVal = function() {
	return (this.rootNode.walk(this.vals));
};
Parser.prototype.newParse = function(s) {
	this.reset();
	s = s.split(" ").join("");
	s = s.split("�").join("/");
	s = s.split("[").join("(");
	s = s.split("]").join(")");
	s = s.replace(/\u2212/g, '-');
	s = s.replace(/\u00F7/g, '/');
	s = s.replace(/\u00D7/g, '*');
	s = s.replace(/\u00B2/g, '^2');
	s = s.replace(/\u00B3/g, '^3');
	s = s.replace(/\u221a/g, 'sqrt');
	s = this.fixParentheses(s);
	s = this.fixUnaryMinus(s);
	s = this.fixImplicitMultply(s);
	this.rootNode = this.parse(s);
};
Parser.prototype.fixParentheses = function(s) {
	var sttParCount = 0;
	var endParCount = 0;
	for (var i = 0; i < s.length; i++) {
		if (s.charAt(i) == "(") sttParCount++;
		if (s.charAt(i) == ")") endParCount++;
	}
	while (sttParCount < endParCount) {
		s = "(" + s;
		sttParCount++;
	}
	while (endParCount < sttParCount) {
		s += ")";
		endParCount++;
	}
	return (s);
};
Parser.prototype.fixUnaryMinus = function(s) {
	var x = s + "\n";
	var y = "";
	var OpenQ = false;
	var prevType = "(";
	var thisType = "";
	for (var i = 0; i < s.length; i++) {
		var c = s.charAt(i);
		if (c >= "0" && c <= "9") {
			thisType = "N";
		} else {
			if (this.operators.indexOf(c) >= 0) {
				if (c == "-") {
					thisType = "-";
				} else {
					thisType = "O";
				}
			} else {
				if (c == "." || c == this.Variable) {
					thisType = "N";
				} else {
					thisType = "C";
				}
			}
			if (c == "(") {
				thisType = "(";
			}
			if (c == ")") {
				thisType = ")";
			}
		}
		x += thisType;
		if (prevType == "(" && thisType == "-") {
			y += "0";
		}
		if (OpenQ) {
			switch (thisType) {
			case "N":
				break;
			default:
				y += ")";
				OpenQ = false;
			}
		}
		if (prevType == "O" && thisType == "-") {
			y += "(0";
			OpenQ = true;
		}
		y += c;
		prevType = thisType;
	}
	if (OpenQ) {
		y += ")";
		OpenQ = false;
	}
	return (y);
};
Parser.prototype.fixImplicitMultply = function(s) {
	var x = s + "\n";
	var y = "";
	var prevType = "?";
	var prevName = "";
	var thisType = "?";
	var thisName = "";
	for (var i = 0; i < s.length; i++) {
		var c = s.charAt(i);
		if (c >= "0" && c <= "9") {
			thisType = "N";
		} else {
			if (this.operators.indexOf(c) >= 0) {
				thisType = "O";
				thisName = "";
			} else {
				thisType = "C";
				thisName += c;
			}
			if (c == "(") {
				thisType = "(";
			}
			if (c == ")") {
				thisType = ")";
			}
		}
		x += thisType;
		if (prevType == "N" && thisType == "C") {
			y += "*";
			thisName = "";
		}
		if (prevType == "N" && thisType == "(") {
			y += "*";
		}
		if (prevType == ")" && thisType == "(") {
			y += "*";
		}
		if (thisType == "(") {
			switch (prevName) {
			case "i":
			case "pi":
			case "e":
			case "a":
			case this.Variable:
				y += "*";
				break;
			}
		}
		y += c;
		prevType = thisType;
		prevName = thisName;
	}
	return (y);
};
Parser.prototype.reset = function() {
	this.tempNode = [];
	this.errMsg = "";
};
Parser.prototype.parse = function(s) {
	if (s == "") {
		return new MathNode("real", "0", this.radiansQ);
	}
	if (isNumeric(s)) {
		return new MathNode("real", s, this.radiansQ);
	}
	if (s.charAt(0) == "$") {
		if (isNumeric(s.substr(1))) {
			return this.tempNode[Number(s.substr(1))];
		}
	}
	var sLo = s.toLowerCase();
	if (sLo.length == 1) {
		if (sLo >= "a" && sLo <= "z") {
			return new MathNode("var", sLo, this.radiansQ);
		}
	}
	switch (sLo) {
	case "pi":
		return new MathNode("var", sLo, this.radiansQ);
		break;
	}
	var bracStt = s.lastIndexOf("(");
	if (bracStt > -1) {
		var bracEnd = s.indexOf(")", bracStt);
		if (bracEnd < 0) {
			this.errMsg += "Missing ')'\n";
			return new MathNode("real", "0", this.radiansQ);
		}
		var isParam = false;
		if (bracStt == 0) {
			isParam = false;
		} else {
			var prefix = s.substr(bracStt - 1, 1);
			isParam = this.operators.indexOf(prefix) <= -1;
		}
		if (!isParam) {
			this.tempNode.push(this.parse(s.substr(bracStt + 1, bracEnd - bracStt - 1)));
			return this.parse(s.substr(0, bracStt) + "$" + (this.tempNode.length - 1).toString() + s.substr(bracEnd + 1, s.length - bracEnd - 1));
		} else {
			var startM = -1;
			for (var u = bracStt - 1; u > -1; u--) {
				var found = this.operators.indexOf(s.substr(u, 1));
				if (found > -1) {
					startM = u;
					break;
				}
			}
			nnew = new MathNode("func", s.substr(startM + 1, bracStt - 1 - startM), this.radiansQ);
			nnew.addchild(this.parse(s.substr(bracStt + 1, bracEnd - bracStt - 1)));
			this.tempNode.push(nnew);
			return this.parse(s.substr(0, startM + 1) + "$" + (this.tempNode.length - 1).toString() + s.substr(bracEnd + 1, s.length - bracEnd - 1));
		}
	}
	var k;
	var k1 = s.lastIndexOf("+");
	var k2 = s.lastIndexOf("-");
	if (k1 > -1 || k2 > -1) {
		if (k1 > k2) {
			k = k1;
			var nnew = new MathNode("op", "add", this.radiansQ);
			nnew.addchild(this.parse(s.substr(0, k)));
			nnew.addchild(this.parse(s.substr(k + 1, s.length - k - 1)));
			return nnew;
		} else {
			k = k2;
			nnew = new MathNode("op", "sub", this.radiansQ);
			nnew.addchild(this.parse(s.substr(0, k)));
			nnew.addchild(this.parse(s.substr(k + 1, s.length - k - 1)));
			return nnew;
		}
	}
	k1 = s.lastIndexOf("*");
	k2 = s.lastIndexOf("/");
	if (k1 > -1 || k2 > -1) {
		if (k1 > k2) {
			k = k1;
			nnew = new MathNode("op", "mult", this.radiansQ);
			nnew.addchild(this.parse(s.substr(0, k)));
			nnew.addchild(this.parse(s.substr(k + 1, s.length - k - 1)));
			return nnew;
		} else {
			k = k2;
			nnew = new MathNode("op", "div", this.radiansQ);
			nnew.addchild(this.parse(s.substr(0, k)));
			nnew.addchild(this.parse(s.substr(k + 1, s.length - k - 1)));
			return nnew;
		}
	}
	k = s.indexOf("^");
	if (k > -1) {
		nnew = new MathNode("op", "pow", this.radiansQ);
		nnew.addchild(this.parse(s.substr(0, k)));
		nnew.addchild(this.parse(s.substr(k + 1, s.length - k - 1)));
		return nnew;
	}
	if (isNumeric(s)) {
		return new MathNode("real", s, this.radiansQ);
	} else {
		if (s.length == 0) {
			return new MathNode("real", "0", this.radiansQ);
		} else {
			this.errMsg += "'" + s + "' is not a number.\n";
			return new MathNode("real", "0", this.radiansQ);
		}
	}
};

function MathNode(typ, val, radQ) {
	this.tREAL = 0;
	this.tVAR = 1;
	this.tOP = 2;
	this.tFUNC = 3;
	this.radiansQ = true;
	this.setNew(typ, val, radQ);
}
MathNode.prototype.setNew = function(typ, val, radQ) {
	this.radiansQ = typeof radQ !== 'undefined' ? radQ : true;
	this.clear();
	switch (typ) {
	case "real":
		this.typ = this.tREAL;
		this.r = Number(val);
		break;
	case "var":
		this.typ = this.tVAR;
		this.v = val;
		break;
	case "op":
		this.typ = this.tOP;
		this.op = val;
		break;
	case "func":
		this.typ = this.tFUNC;
		this.op = val;
		break;
	}
	return (this);
};
MathNode.prototype.clear = function() {
	this.r = 1;
	this.v = "";
	this.op = "";
	this.child = [];
	this.childCount = 0;
};
MathNode.prototype.addchild = function(n) {
	this.child.push(n);
	this.childCount++;
	return (this.child[this.child.length - 1]);
};
MathNode.prototype.getLevelsHigh = function() {
	var lvl = 0;
	for (var i = 0; i < this.childCount; i++) {
		lvl = Math.max(lvl, this.child[i].getLevelsHigh());
	}
	return (lvl + 1);
};
MathNode.prototype.isLeaf = function() {
	return (this.childCount == 0);
};
MathNode.prototype.getLastBranch = function() {
	if (this.isLeaf()) {
		return (null);
	}
	for (var i = 0; i < this.childCount; i++) {
		if (!this.child[i].isLeaf()) {
			return (this.child[i].getLastBranch());
		}
	}
	return (this);
};
MathNode.prototype.fmt = function(htmlQ) {
	htmlQ = typeof htmlQ !== 'undefined' ? htmlQ : true;
	var s = "";
	if (this.typ == this.tOP) {
		switch (this.op.toLowerCase()) {
		case "add":
			s = "+";
			break;
		case "sub":
			s = htmlQ ? "&minus;" : "-";
			break;
		case "mult":
			s = htmlQ ? "&times;" : "x";
			break;
		case "div":
			s = htmlQ ? "&divide;" : "/";
			break;
		case "pow":
			s = "^";
			break;
		default:
			s = this.op;
		}
	}
	if (this.typ == this.tREAL) {
		s = this.r.toString();
	}
	if (this.typ == this.tVAR) {
		if (this.r == 1) {
			s = this.v;
		} else {
			if (this.r != 0) {
				s = this.r + this.v;
			}
		}
	}
	if (this.typ == this.tFUNC) {
		s = this.op;
	}
	return s;
};
MathNode.prototype.walkFmt = function() {
	var s = this.walkFmta(true, "");
	s = s.replace("Infinity", "Undefined");
	return s;
};
MathNode.prototype.walkFmta = function(noparq, prevop) {
	var s = "";
	if (this.childCount > 0) {
		var parq = false;
		if (this.op == "add") parq = true;
		if (this.op == "sub") parq = true;
		if (prevop == "div") parq = true;
		if (noparq) parq = false;
		if (this.typ == this.tFUNC) parq = true;
		if (this.typ == this.tOP) {} else {
			s += this.fmt(true);
		}
		if (parq) s += "(";
		for (var i = 0; i < this.childCount; i++) {
			if (this.typ == this.tOP && i > 0) s += this.fmt();
			s += this.child[i].walkFmta(false, this.op);
			if (this.typ == this.tFUNC || (parq && i > 0)) {
				s += ")";
			}
		}
	} else {
		s += this.fmt();
		if (prevop == "sin" || prevop == "cos" || prevop == "tan") {
			if (this.radiansQ) {
				s += " rad";
			} else {
				s += "&deg;";
			}
		}
	}
	return s;
};
MathNode.prototype.walkNodesFmt = function(level) {
	var s = "";
	for (var i = 0; i < level; i++) {
		s += "|   ";
	}
	s += this.fmt();
	s += "\n";
	for (i = 0; i < this.childCount; i++) {
		s += this.child[i].walkNodesFmt(level + 1);
	}
	return s;
};
MathNode.prototype.walk = function(vals) {
	if (this.typ == this.tREAL) return (this.r);
	if (this.typ == this.tVAR) {
		switch (this.v) {
		case "x":
			return (vals[23]);
			break;
		case "y":
			return (vals[24]);
			break;
		case "z":
			return (vals[25]);
			break;
		case "pi":
			return (Math.PI);
			break;
		case "e":
			return (Math.exp(1));
			break;
		case "a":
			return (vals[0]);
			break;
		case "n":
			return (vals[13]);
			break;
		default:
			return (0);
		}
	}
	if (this.typ == this.tOP) {
		var val = 0;
		for (var i = 0; i < this.childCount; i++) {
			var val2 = 0;
			if (this.child[i] != null) val2 = this.child[i].walk(vals);
			if (i == 0) {
				val = val2;
			} else {
				switch (this.op) {
				case "add":
					val += val2;
					break;
				case "sub":
					val -= val2;
					break;
				case "mult":
					val *= val2;
					break;
				case "div":
					val /= val2;
					break;
				case "pow":
					if (val2 == 2) {
						val = val * val;
					} else {
						val = Math.pow(val, val2);
					}
					break;
				default:
				}
			}
		}
		return val;
	}
	if (this.typ == this.tFUNC) {
		var lhs = this.child[0].walk(vals);
		var angleFact = 1;
		if (!this.radiansQ) angleFact = 180 / Math.PI;
		switch (this.op) {
		case "sin":
			val = Math.sin(lhs / angleFact);
			break;
		case "cos":
			val = Math.cos(lhs / angleFact);
			break;
		case "tan":
			val = Math.tan(lhs / angleFact);
			break;
		case "asin":
			val = Math.asin(lhs) * angleFact;
			break;
		case "acos":
			val = Math.acos(lhs) * angleFact;
			break;
		case "atan":
			val = Math.atan(lhs) * angleFact;
			break;
		case "sinh":
			val = (Math.exp(lhs) - Math.exp(-lhs)) / 2;
			break;
		case "cosh":
			val = (Math.exp(lhs) + Math.exp(-lhs)) / 2;
			break;
		case "tanh":
			val = (Math.exp(lhs) - Math.exp(-lhs)) / (Math.exp(lhs) + Math.exp(-lhs));
			break;
		case "exp":
			val = Math.exp(lhs);
			break;
		case "log":
			val = Math.log(lhs) * Math.LOG10E;
			break;
		case "ln":
			val = Math.log(lhs);
			break;
		case "abs":
			val = Math.abs(lhs);
			break;
		case "deg":
			val = lhs * 180. / Math.PI;
			break;
		case "rad":
			val = lhs * Math.PI / 180.;
			break;
		case "sign":
			if (lhs < 0) {
				val = -1;
			} else {
				val = 1;
			}
			break;
		case "sqrt":
			val = Math.sqrt(lhs);
			break;
		case "round":
			val = Math.round(lhs);
			break;
		case "int":
			val = Math.floor(lhs);
			break;
		case "floor":
			val = Math.floor(lhs);
			break;
		case "ceil":
			val = Math.ceil(lhs);
			break;
		case "fact":
			val = factorial(lhs);
			break;
		default:
			val = NaN;
		}
		return val;
	}
	return val;
};

function factorial(n) {
	if (n < 0) return NaN;
	if (n < 2) return 1;
	n = n << 0;
	var i;
	i = n;
	var f = n;
	while (i-- > 2) {
		f *= i;
	}
	return f;
}

function isNumeric(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}
CanvasRenderingContext2D.prototype.drawArrow = function(x0, y0, totLen, shaftHt, headLen, headHt, angle, sweep, invertQ) {
	var g = this;
	var pts = [
		[0, 0],
		[-headLen, -headHt / 2],
		[-headLen + sweep, -shaftHt / 2],
		[-totLen, -shaftHt / 2],
		[-totLen, shaftHt / 2],
		[-headLen + sweep, shaftHt / 2],
		[-headLen, headHt / 2],
		[0, 0]
	];
	if (invertQ) {
		pts.push([0, -headHt / 2], [-totLen, -headHt / 2], [-totLen, headHt / 2], [0, headHt / 2]);
	}
	for (var i = 0; i < pts.length; i++) {
		var cosa = Math.cos(-angle);
		var sina = Math.sin(-angle);
		var xPos = pts[i][0] * cosa + pts[i][1] * sina;
		var yPos = pts[i][0] * sina - pts[i][1] * cosa;
		if (i == 0) {
			g.moveTo(x0 + xPos, y0 + yPos);
		} else {
			g.lineTo(x0 + xPos, y0 + yPos);
		}
	}
};

function getQueryVariable(variable) {
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split("=");
		if (pair[0] == variable) {
			return pair[1];
		}
	}
	return false;
}

function saveCanvas() {
	var c = document.getElementById("canvasId");
	window.open(c.toDataURL('image/png'));
}

function printCanvas() {
	var dataUrl = document.getElementById('canvasId').toDataURL();
	var s = '<!DOCTYPE html>';
	s += '<html>';
	s += '<head><title>打印画布</title></head>';
	s += '<body>';
	s += '<img src="' + dataUrl + '">';
	s += '</body>';
	s += '</html>';
	var printWin = window.open('', '', 'width=340,height=260');
	printWin.document.open();
	printWin.document.write(s);
	printWin.document.close();
	printWin.focus();
	printWin.print();
	printWin.close();
}

function dist(dx, dy) {
	return (Math.sqrt(dx * dx + dy * dy));
}

functiongraphMain();