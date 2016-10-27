// <![CDATA[
var crafc = document.getElementById("craft1"); // craft canvas
var crafcc = crafc.getContext("2d"); // craft canvas context
var crafa = new Uint8Array(100*40); // craft array
var crcol = ["#000000", "#bfbfbf", "#404040", "#664422"]; // craft color
for (var y = 39; y >= 0; --y) { // initialize function
	for (var x = 99; x >= 0; --x) {
		crafa[x+y*100] = y > 38;
		crafcc.fillStyle = crcol[crafa[x+y*100]];
		crafcc.fillRect(x*9, y*10, 9, 10);
	}
}
// crafa[1949] = 0;
var ux = 49; uy = 19, ud = 1;
crafcc.fillStyle = "#ee3333";
crafcc.fillRect(441, 190, 9, 10);
var iswall = [0,1,0,1]; // this/that is wall?
var iselev = [0,0,1,0]; // this/that is elevator?
var fall1  = [1,0,1,0];
var swit1  = [0,1,3,2]; // switch transform
function falldown () { // fall down function
	var ty = (uy + 1) % 40;
	if (fall1[crafa[ux + ty*100]] && !iselev[crafa[ux + uy*100]]) {
		crafcc.fillStyle = crcol[crafa[ux + uy*100]];
		crafcc.fillRect(ux*9, uy*10, 9, 10);
		crafcc.fillStyle = "#ee3333";
		crafcc.fillRect(ux*9, ty*10, 9, 10);
		uy = ty;
	}
};
function movec (num) { // moving function
	ud = num;
	var tx = (ux + num + 100) % 100;
	var ty = (uy + 39) % 40;
	crafcc.fillStyle = crcol[crafa[ux + uy*100]];
	crafcc.fillRect(ux*9, uy*10, 9, 10);
	if (!iswall[crafa[tx + uy*100]]) ux = tx;
	if (iswall[crafa[tx + uy*100]] && crafa[ux + ty*100] === 0 && fall1[crafa[tx + ty*100]]) ux = tx, uy = ty;
	crafcc.fillStyle = "#ee3333";
	crafcc.fillRect(ux*9, uy*10, 9, 10);
};
function craftn (sx, sy) { // build/remove block
	var tx = (ux + sx + 100) % 100;
	var ty = (uy + sy + 40) % 40;
	if (crafa[tx + ty*100] === 0) crafa[tx + ty*100] = blockID; else crafa[tx + ty*100] = 0;
	crafcc.fillStyle = crcol[crafa[tx + ty*100]];
	crafcc.fillRect(tx*9, ty*10, 9, 10);
};
var blockID = 1;
function _keyup (e) {
	switch (e.keyCode) {
		case 37: movec(-1); break;
		case 38: elev_move(-1); break;
		case 39: movec(1); break;
		case 40: elev_move(1); break;
		case 97:  craftn(-1,+1); break;
		case 99:  craftn(+1,+1); break;
		case 100: craftn(-1, 0); break;
		case 102: craftn(+1, 0); break;
		case 103: craftn(-1,-1); break;
		case 105: craftn(+1,-1); break;
	}
};
function elev_move (num) { // elevator moving
	var ny = (uy + num + 40) % 40, tmp;
	if (iselev[tmp = crafa[ux + uy*100]] && crafa[ux + ny*100] === 0) {
		crafcc.fillStyle = "#000000";
		crafcc.fillRect(ux*9, uy*10, 9, 10)
		crafa[ux + uy*100] = 0;
		crafa[ux + ny*100] = tmp;
		uy = ny;
		crafcc.fillStyle = "#ee3333";
		crafcc.fillRect(ux*9, uy*10, 9, 10)
	}
}
function switchp (num) {
	var nx = (ux + num + 100) % 100;
	crafa[nx + uy*100] = swit1[crafa[nx + uy*100]];
	crafcc.fillStyle = crcol[crafa[nx + uy*100]];
	crafcc.fillRect(nx*9, uy*10, 9, 10)
}
!function () {
	var fnum = 0;
	!function autofall () {
		fnum = (fnum + 1) % 10;
		fnum || falldown();
		requestAnimationFrame(autofall);
	}();
}();
// ]]>
