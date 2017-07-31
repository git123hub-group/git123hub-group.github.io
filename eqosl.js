var trace = false;

function getOffsetSum(elem) {
  var top=0, left=0

  while(elem) {
    top = top + parseInt(elem.offsetTop)
    left = left + parseInt(elem.offsetLeft)
    elem = elem.offsetParent       
  }

  return {top: top, left: left}
}

var changePoints = function () {
	function points2line (x0, y0, x1, y1) {
		var m, b, minv, binv;
		var xdif = x0-x1;
		var ydif = y0-y1;

		m = ydif / xdif;
		b = y0 - x0 * m;
		minv = xdif / ydif;
		binv = x0 - y0 * minv;
		
		return [m, b, minv, binv];
	}
	var canvases = document.getElementsByClassName("canvas1");
	var ctx1 = canvases[0].getContext("2d");
	var ctx2 = canvases[1].getContext("2d");

	ctx1.strokeStyle = "#0000FF";
	for (var i = -52; 52 >= i; ++i) {
		if (i === 0) { continue; }
		ctx1.globalAlpha = i % 5 ? 0.1 : 0.3;
		ctx1.beginPath();
		ctx1.moveTo(0,420.5+8*i);
		ctx1.lineTo(841,420.5+8*i);
		ctx1.moveTo(420.5+8*i,0);
		ctx1.lineTo(420.5+8*i,841);
		ctx1.stroke();
	}
	ctx1.globalAlpha = 1;
	ctx1.lineWidth = 2;
	ctx1.strokeStyle = "#0000FF";
	ctx1.beginPath();
	ctx1.moveTo(0,420.5);
	ctx1.lineTo(841,420.5);
	ctx1.stroke();
	ctx1.strokeStyle = "#FF0000";
	ctx1.beginPath();
	ctx1.moveTo(420.5,0);
	ctx1.lineTo(420.5,841);
	ctx1.stroke();
	ctx2.textBaseline = "middle";
	function drawTwoPoints (x1, y1, x2, y2) {
		var twopi = 2 * Math.PI;
		ctx2.globalAlpha = 0.3;
		ctx2.fillStyle = "#5000FF";
		ctx2.beginPath();
		ctx2.arc(420.5 + x2*40, 420.5 - y2*40, 12, 0, twopi);
		ctx2.fill();
		ctx2.beginPath();
		ctx2.arc(420.5 + x2*40, 420.5 - y2*40, 5, 0, twopi);
		ctx2.fill();
		ctx2.beginPath();
		ctx2.arc(420.5 + x1*40, 420.5 - y1*40, 12, 0, twopi);
		ctx2.fill();
		ctx2.beginPath();
		ctx2.arc(420.5 + x1*40, 420.5 - y1*40, 5, 0, twopi);
		ctx2.fill();
		ctx2.globalAlpha = 1;
		ctx2.fillStyle = "#000000";
		ctx2.font="13px sans-serif";
		if (x1 < 8) {
			ctx2.textAlign = "left";
			ctx2.fillText("(" + x1 + "," + y1 + ")", 433 + x1*40, 420.5 - y1*40);
		} else {
			ctx2.textAlign = "right";
			ctx2.fillText("(" + x1 + "," + y1 + ")", 408 + x1*40, 420.5 - y1*40);
		}
		if (x2 < 8) {
			ctx2.textAlign = "left";
			ctx2.fillText("(" + x2 + "," + y2 + ")", 433 + x2*40, 420.5 - y2*40);
		} else {
			ctx2.textAlign = "right";
			ctx2.fillText("(" + x2 + "," + y2 + ")", 408 + x2*40, 420.5 - y2*40);
		}
	}
	ctx1.fillStyle = "#0000FF";
	ctx1.font="16px sans-serif";
	ctx1.textAlign = "center";
	ctx1.textBaseline = "top";
	for (var i = -10; 10 >= i; ++i) {
		ctx1.fillText(i, 420.5-40*i, 425);
	}
	ctx1.fillStyle = "#FF0000";
	ctx1.textAlign = "right";
	ctx1.textBaseline = "middle";
	for (var i = -10; 10 >= i; ++i) {
		ctx1.fillText(i, 414, 420.5-40*i);
	}
	function drawLine (x1, y1, x2, y2) {
		var leqe = document.getElementById("linear_equation_1"), tmp, tmp2;
		if (x1 === x2 && y1 === y2) {
			return leqe.innerHTML = "需要两个不同的点";
		}
		ctx2.globalAlpha = 1;
		ctx2.strokeStyle = "#5000FF";
		ctx2.lineWidth = 2;
		ctx2.beginPath();
		if (x1 === x2) {
			ctx2.moveTo(420.5+x1*40,0);
			ctx2.lineTo(420.5+x1*40,841);
			leqe.innerHTML = "x = " + x1;
		} else if (y1 === y2) {
			ctx2.moveTo(0,420.5-y1*40);
			ctx2.lineTo(841,420.5-y1*40);
			leqe.innerHTML = "y = " + y1;
		} else {
			var lineq = points2line (x1, y1, x2, y2);
			var x3 = -10.5, y3 = lineq[0] * x3 + lineq[1];
			var x4 = 10.5, y4 = lineq[0] * x4 + lineq[1];
			tmp = "x";
			if (lineq[0] > 0) {
				y3 < -10.5 && (y3 = -10.5, x3 = lineq[2] * y3 + lineq[3]);
				y4 >  10.5 && (y4 =  10.5, x4 = lineq[2] * y4 + lineq[3]);
				if (lineq[0] !== 1) {
					tmp = lineq[0] + tmp;
				}
			} else {
				y3 >  10.5 && (y3 =  10.5, x3 = lineq[2] * y3 + lineq[3]);
				y4 < -10.5 && (y4 = -10.5, x4 = lineq[2] * y4 + lineq[3]);
				if (lineq[0] === -1) {
					tmp = "-" + tmp;
				} else {
					tmp = lineq[0] + tmp;
				}
			}
			ctx2.moveTo(420.5+x3*40,420.5-y3*40);
			ctx2.lineTo(420.5+x4*40,420.5-y4*40);
			tmp += lineq[1] === 0 ? "" : (lineq[1] > 0 ? " + " + lineq[1] : " - " + -lineq[1])
			leqe.innerHTML = "y = " + tmp;
		}
		ctx2.stroke();
	}
	var points = {
		x1: 40, y1: 40,
		x2: 80, y2: 120
	};
	var oldPtr = {
		x: undefined, y: undefined
	};
	var __mode = 0;
	ctx2.clearRect(0,0,841,841);
	drawLine(points.x1/40,points.y1/40,points.x2/40,points.y2/40);
	drawTwoPoints(points.x1/40,points.y1/40,points.x2/40,points.y2/40);

	function changePoints(x, y) {
		// alert([x,y]);
		var ox = oldPtr.x, oy = oldPtr.y;
		if (+__mode) {
			points["x" + __mode] += x - ox, points["y" + __mode] += y - oy;
			ctx2.clearRect(0,0,841,841);
			drawLine(points.x1/40,points.y1/40,points.x2/40,points.y2/40);
			drawTwoPoints(points.x1/40,points.y1/40,points.x2/40,points.y2/40);
		}
		oldPtr.x = x;
		oldPtr.y = y;
	}
	changePoints.begin = function(x, y) {
		oldPtr.x = x, oldPtr.y = y;
		var maxrad = 12 * 12;
		var rad1 = (points.x1-x)*(points.x1-x) + (points.y1-y)*(points.y1-y);
		var rad2 = (points.x2-x)*(points.x2-x) + (points.y2-y)*(points.y2-y);
		if (rad1 <= maxrad) { __mode = 1 } else
		if (rad2 <= maxrad) { __mode = 2 } else
		__mode = 0;
	}
	changePoints.set = function(id) {
		var prompt_ing = prompt("请输入数值:");
		prompt_ing && (points[id] = prompt_ing * 40);
		ctx2.clearRect(0,0,841,841);
		drawLine(points.x1/40,points.y1/40,points.x2/40,points.y2/40);
		drawTwoPoints(points.x1/40,points.y1/40,points.x2/40,points.y2/40);
	}
	return changePoints;
} ();