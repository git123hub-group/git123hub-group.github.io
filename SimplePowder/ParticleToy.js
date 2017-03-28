(function () {

var canvas_I = document.getElementById("InvisLayer");
var canvas_P = document.getElementById("PartLayer");
var canvas_F = document.getElementById("PhotonsLayer");
var ctx_I = canvas_I.getContext("2d");
var ctx_P = canvas_P.getContext("2d");
var ctx_F = canvas_F.getContext("2d");
var currentType = 2;
var currentProp = 0;
// update 5000 times
var params_P = 6;
var params_F = 4;
var runningFlag, __frames = 0;
var map_I = new Uint8Array(82*66);
var map_P = new Int32Array(82*66*params_P); // particle table: type, ctype, param3, param4, dcolour, flags
var map_F = new Int16Array(82*66); // photons map
var parts_F = new Int16Array(6000*params_F); // photons table: type, direction, x, y
var photons_count = 0;
var pfree = 0;

for (var i = 0; i < 82; i++)
{
	map_P[i*params_P] = 1;
	map_P[(i+82*65)*params_P] = 1;
}
for (var i = 0; i < 66; i++)
{
	map_P[i*82*params_P] = 1;
	map_P[(i*82+81)*params_P] = 1;
}
for (var i = 0; i < 5999;)
{
	parts_F[i*4+1] = ++i;
}
parts_F[5999*4+1] = -1;

for (var i = 0; i < 82*66; i++)
{
	map_F[i] = -1;
}
var partName = ["X","BLCK","DUST","WATR","CLNE","VOID","VIRS","CURE","ACID","OIL", "MERC","FIRE"];

var default_color = ["#000000", "#AAAAAA", "#FFE0A0", "#2030D0", "#CCCC00", "#790B0B", "#FE11F6", "#F5F5DC", "#EE66FF", "#483810", "#746A6A", "#FF0000"];

var can_clone = [0,0,1,1,0,0,1,1,1,1 ,1,1];

var can_infe = [0,0,1,1,1,1,0,0,1,1 ,1,1];

var acidAffect = [0,0,1,0,0,0,1,1,0,0.2, 1,0];

var flammable = [0,0,1,0,0,0,0,0,0,1, 0,0];

// 0: solid, 1: powder, 2: liquid, 3: gas, 4: go upward
var ST_List = [0,0,1,2,0,0,2,2,2,2, 2,4];

// 0: solid, 1: powder, 2: liquid, 3: gas, 4: special solid
var ST_Menu_List = [4,4,1,2,4,4,2,2,2,2, 2,3];

var ST_Weight = [0,1000,800,400,1000,0,420,420,390,300,900,1];

var type_count = 13;

var Update_P = [
	null,
	null,
	null,
	null,
	function (x, y) /* clone */
	{
		var tmp, ctypeOffset = (82*y+x)*params_P+1;
		if ((tmp = map_P[ctypeOffset]) !== 0)
		{
			var newX = x + ((Math.random() * 3) | 0) - 1;
			var newY = y + ((Math.random() * 3) | 0) - 1;
			if (checkBounds (newX, newY))
			{
				create_part( newX, newY, tmp /* ctype */ );
			}
		}
		else
		{
			loop_clone:
			for (var rx = -1; rx < 2; rx++)
			{
				for (var ry = -1; ry < 2; ry++)
				{
					if (checkBounds (newX = x + rx, newY = y + ry))
					{
						tmp = map_P[(82*newY+newX)*params_P];
						if (can_clone[tmp])
						{
							map_P[ctypeOffset] = tmp;
							break loop_clone;
						}
					}
				}
			}
		}
	},
	null,
	function (x, y) /* virus */
	{
		var self_P = (82*y+x)*params_P;
		var newX, newY, infectingOffset, tmp;
		if (map_P[self_P+5] > 0) /* curing virus */
		{
			for (var trade = 0; trade < 4; trade++)
			{
				newX = x + ((Math.random() * 3) | 0) - 1;
				newY = y + ((Math.random() * 3) | 0) - 1;
				if (!checkBounds (newX, newY))
				{
					continue;
				}
				infectingOffset = (82*newY+newX)*params_P;
				if (map_P[infectingOffset] === 6 && map_P[infectingOffset+5] <= 0)
				{
					map_P[infectingOffset+5] = map_P[self_P+5] + 2;
				}
			}
			if (!--map_P[self_P+5])
			{
				map_P[self_P] = map_P[self_P+3];
				map_P[self_P+3] = 0;
			}
			return;
		}
		newX = x + ((Math.random() * 3) | 0) - 1;
		newY = y + ((Math.random() * 3) | 0) - 1;
		if (!checkBounds (newX, newY))
		{
			return;
		}
		infectingOffset = (82*newY+newX)*params_P;
		tmp = map_P[infectingOffset];
		if (tmp === 7)
		{
			map_P[infectingOffset] = 0;
			map_P[self_P+5] = 30;
		}
		else if (can_infe[tmp])
		{
			map_P[infectingOffset] = 6;
			map_P[infectingOffset+3] = tmp;
			map_P[infectingOffset+5] = 0;
		}
		console.log (map_P[self_P+5]);
	},
	null,
	function (x, y) /* acid */
	{
		var MAX_ACID_AFFECTED = 30;
		var lifeOffset = (82*y+x)*params_P + 1;
		var affectOffset, tmp;
		if (0.6 < Math.random())
		{
			newX = x + ((Math.random() * 3) | 0) - 1;
			newY = y + ((Math.random() * 3) | 0) - 1;
			if (!checkBounds (newX, newY))
			{
				return;
			}
			affectOffset = (82*newY+newX)*params_P;
			tmp = map_P[affectOffset];
			if ( tmp === 3 ) // dissolved by water
			{
				tmp = (map_P[lifeOffset] + MAX_ACID_AFFECTED) >> 1;
				map_P[affectOffset] = 8;
				map_P[affectOffset+1] = map_P[lifeOffset] = tmp;
				return;
			}
			if ( tmp === 8 )
			{
				if (map_P[lifeOffset] >= MAX_ACID_AFFECTED )
				{
					map_P[lifeOffset-1] = 0;
				}
				else
				{
					// acid's concentration transfer
					tmp = (map_P[affectOffset+1] - map_P[lifeOffset]) >> 1;
					map_P[affectOffset+1] -= tmp;
					map_P[lifeOffset] += tmp;
				}
				return;
			}
			if ( Math.random() < acidAffect[tmp] )
			{
				map_P[affectOffset] = 0;
				map_P[lifeOffset] += 2;
			}
		}
		return;
	},
	null,
	null,
	function (x, y) /* fire */
	{
		var lifeOffset = (82*y+x)*params_P + 1;
		if (map_P[lifeOffset] > 18)
			map_P[lifeOffset-1] = 0;
		for (var trade = 0; trade < 2; trade++)
		{
			newX = x + ((Math.random() * 3) | 0) - 1;
			newY = y + ((Math.random() * 3) | 0) - 1;
			if (!checkBounds (newX, newY))
			{
				continue;
			}
			var flameOffset = (82*newY+newX)*params_P;
			if (flammable[map_P[flameOffset]])
			{
				map_P[flameOffset] = 11;
				map_P[flameOffset+1] = 0;
			}
		}
		map_P[lifeOffset] ++;
	},
];

function renderParts ()
{
	var tmp;
	for (var y = 0; y < 66; y++)
	{
		for (var x = 0; x < 82; x++)
		{
			renderPart ( x, y, map_P[tmp = (82*y+x)*params_P], map_P[tmp+4]);
		}
	}
}
function renderPhoton (id)
{
	var phot_offset = id*params_F;
	var x = parts_F[phot_offset+2] | 0;
	var y = parts_F[phot_offset+3] | 0;
	ctx_F.fillStyle = "#FFFFFF";
	ctx_F.fillRect(x*10, y*10, 10, 10);
}
function renderPhotons ()
{
	ctx_F.clearRect(0, 0, 82*10, 66*10);
	for (var i = 0, j = 0; j < photons_count; i++)
	{
		if (parts_F[i*params_F] !== 0)
		{
			j++; renderPhoton ( i );
		}
	}
}
function create_part (x, y, type)
{
	var t = (82*y+x)*params_P;
	if (map_P[t] !== 0)
		return false;
	map_P[t] = type;
	map_P[t+1] = 0;
	map_P[t+2] = 0;
	map_P[t+3] = 0;
	map_P[t+4] = 0;
	map_P[t+5] = 0;
	return true;
}
function renderPart (x, y, type, dcolour)
{
	ctx_P.globalAlpha = 1;
	ctx_P.clearRect(x*10, y*10, 10, 10);
	if (type !== 0)
	{
		ctx_P.fillStyle = default_color[type];
		ctx_P.fillRect(x*10, y*10, 10, 10);
		if (type !== 6 && (dcolour & 0xFF000000))
		{
			ctx_P.globalAlpha = (dcolour >>> 24) / 255.0;
			ctx_P.fillStyle = "#" + (dcolour>>>0).toString(16).slice(-6);
			ctx_P.fillRect(x*10, y*10, 10, 10);
		}
	}
}
function mouse_partOP (x, y, type, prop)
{
	var tmp = (82*y+x)*params_P, id;
	if (prop <= 0)
	{
		if (type !== 0)
		{
			if ( !create_part (x, y, type) )
			{
				map_P[tmp] !== 8 && map_P[tmp] !== 11 && (map_P[tmp+1] = type);
				return;
			}
		}
		else
		{
			map_P[tmp] = 0;
		}
		renderPart (x, y, type, 0);
		// console.debug(map_P[tmp+5]);
	}
	else if (prop <= 6)
	{
		if (map_P[tmp] !== 0)
		{
			map_P[tmp+prop-1] = type;
			(prop === 1 || prop === 5) && renderPart (x, y, type, map_P[tmp+4]);
		}
	}
	else if (prop === 7)
	{
		if (type === 0)
		{
			map_I[y*82+x] = 0;
			ctx_I.clearRect(x*10, y*10, 10, 10);
		}
		else if (type < 256)
		{
			map_I[y*82+x] = type;
			ctx_I.fillStyle = invisColours[type-1];
			ctx_I.fillRect(x*10, y*10, 10, 10);
		}
		else if (!mouseEntered)
		{
			switch (type)
			{
			case 256:
				if (map_I[y*82+x] === 1)
				{
					floodInvis (x, y, 1, 2);
				}
				else if (map_I[y*82+x] === 2)
				{
					floodInvis (x, y, 2, 1);
				}
				break;
			case 257:
				id = alloc_phot(x,y,Math.random()*4,1);
				map_F[tmp = 82*y+x] = id;
				renderPhoton(id);
				break;
			}
		}
	}
}

function floodInvis (x, y, _from, _to)
{
	console.debug(_to);
	debugger;
	var cstack = [x, y], cptr = 2, x1, x2, y_offset, temp_y;
	do
	{
		y_offset = (y = cstack[--cptr])*82;
		x1 = x2 = x = cstack[--cptr];
		// go left as far as possible
		while (x1 >= 0)
		{
			if ( map_I[y_offset + x1 - 1] !== _from ) { break; }
			x1--;
		}
		// go right as far as possible
		while (x2 < 82)
		{
			if ( map_I[y_offset + x2 + 1] !== _from ) { break; }
			x2++;
		}
		// fill span
		ctx_I.fillStyle = invisColours[_to-1];
		ctx_I.fillRect(x1*10, y*10, (x2 - x1 + 1) * 10, 10);
		for (x = x1; x <= x2; x++)
		{
			map_I[y_offset + x] = _to;
		}
		if (y >= 1)
		{
			temp_y = y - 1;
			y_offset -= 82;
			for (x=x1; x<=x2; x++)
			{
				if (map_I[y_offset + x] === _from)
				{
					cstack[cptr++] = x;
					cstack[cptr++] = temp_y;
				}
			}
		}
		if (y < 81)
		{
			temp_y = y + 1;
			y_offset += 164; // 82 * 2
			for (x=x1; x<=x2; x++)
			{
				if (map_I[y_offset + x] === _from)
				{
					cstack[cptr++] = x;
					cstack[cptr++] = temp_y;
				}
			}
		}
	}
	while (cptr);
}
var invisColours = ["#00CCCC", "#0F0064"];
function checkBounds (x, y)
{
	return x >= 0 && x < 82 && y >= 0 && y < 66;
}
function try_move (x, y)
{
	if (map_I[82*y+x] === 1)
	{
		return;
	}
	var type = map_P[(82*y+x)*params_P];
	if (Update_P[type] != null)
	{
		Update_P[type](x, y);
	}
	var state = ST_List[type], osc;
	var rnd = Math.random()<0.5 ? 1 : -1;
	var inBound, newX, newY = y + 1, newPosType, _base = false;
	var disappearOld = false, newPartFlag = false;
	switch (state)
	{
	case 1:
		for (osc = 0; osc <= 1; osc = -2*osc + 1)
		{
			inBound = checkBounds (newX = x + osc * rnd, newY);
			newPosType = map_P[(82*newY + newX)*params_P];
			if (!inBound || newPosType === 5) {
				disappearOld = true; break;
			}
			if (ST_Weight[newPosType] < ST_Weight[type])
			{
				newPartFlag = true;
				newPosType = type;
				disappearOld = true; break;
			}
		}
		break;
	case 2:
		for (osc = 0; osc <= 1; osc = -2*osc + 1)
		{
			inBound = checkBounds (newX = x + osc * rnd, newY);
			newPosType = map_P[(82*newY + newX)*params_P];
			if (!inBound || newPosType === 5) {
				disappearOld = true; break;
			}
			if (ST_Weight[newPosType] < ST_Weight[type])
			{
				newPartFlag = true;
				newPosType = type;
				disappearOld = true; break;
			}
			if (osc === 1) {
				newY = y;
			}
		}
		break;
	case 3:
		inBound = checkBounds (newX = x + Math.round(Math.random() * 2 - 1), newY = y + Math.round(Math.random() * 2 - 1));
		newPosType = map_P[(82*newY + newX)*params_P];
		if (!inBound || newPosType === 5) {
			disappearOld = true; break;
		}
		if (newPosType === 0)
		{
			newPartFlag = true;
			newPosType = type;
			disappearOld = true; break;
		}
		break;
	case 4:
		inBound = checkBounds (newX = x + Math.round(Math.random() * 2 - 1), newY = y - 1);
		newPosType = map_P[(82*newY + newX)*params_P];
		if (!inBound || newPosType === 5) {
			disappearOld = true; break;
		}
		if (ST_Weight[newPosType] < ST_Weight[type])
		{
			newPartFlag = true;
			newPosType = type;
			disappearOld = true; break;
		}
	}
	if (disappearOld)
	{
		if (newPartFlag)
		{
			for (var i = 0; i < params_P; i++)
			{
				osc = map_P[rnd = (82*newY+newX)*params_P+i];
				map_P[rnd] = map_P[type = (82*y+x)*params_P+i];
				map_P[type] = osc;
			}
		}
		else
		{
			map_P[(82*y+x)*params_P] = 0;
		}
	}
}

var rx_table = [1,0,-1,0];
var ry_table = [0,-1,0,1];

function try_move_phot (id)
{
	var phot_offset = id*params_F;
	var d = parts_F[phot_offset+1] & 3;
	var x = parts_F[phot_offset+2] | 0;
	var y = parts_F[phot_offset+3] | 0;
	var ox = x, oy = y;
	var rx = rx_table[d];
	var ry = ry_table[d];
	x += rx, y += ry;
	if (!checkBounds(x, y))
	{
		free_phot (id);
		kill_phot_pos (id, ox, oy);
		return;
	}
	if (map_P[(82*y + x)*params_P] === 0)
	{
		x += rx, y += ry;
	}
	if (!checkBounds(x, y))
	{
		free_phot (id);
		kill_phot_pos (id, ox, oy);
		return;
	}
	kill_phot_pos (id, ox, oy);
	map_F[tmp = 82*y+x] = id; // create_phot_pos (id, x, y);
	parts_F[phot_offset+2] = x;
	parts_F[phot_offset+3] = y;
}

function free_phot (id)
{
	parts_F[id*params_F] = 0;
	parts_F[id*params_F+1] = pfree;
	pfree = id;
	photons_count --;
}

function alloc_phot (x, y, dir, type)
{
	var id = pfree, tmp;
	pfree = parts_F[(tmp = id*params_F)+1];
	parts_F[tmp++] = type
	parts_F[tmp++] = dir;
	parts_F[tmp++] = x;
	parts_F[tmp] = y;
	photons_count ++;
	return id;
}

function kill_phot_pos (id, x, y)
{
	var tmp;
	if (map_F[tmp = 82*y+x] === id)
	{
		map_F[tmp] = -1;
	}
}

/*
function create_phot_pos (id, x, y)
{
	map_F[tmp = 82*y+x] = id;
}
 */

function recalc_phot ()
{
	var x, y;
	for (var i = 0; i < 82*66; i++)
	{
		map_F[i] = -1;
	}
	for (var i = 0, j = 0; j < photons_count; i++)
	{
		if (parts_F[i*params_F] !== 0)
		{
			j++;
			var phot_offset = i*params_F;
			x = parts_F[phot_offset+2] | 0;
			y = parts_F[phot_offset+3] | 0;
			map_F[82*y+x] = i;
		}
	}
}

function frame_render ()
{
	// if (photons_count > 0)
	// {
		for (var i = 0, j = 0; j < photons_count; i++)
		{
			if (parts_F[i*params_F] !== 0)
			{
				j++; try_move_phot ( i );
			}
		}
	// }
	for (var i = 0; i < 4500; i++)
	{
		try_move ((Math.random()*82)|0, (Math.random()*66)|0);
	}
	if (photons_count > 0)
	{
		recalc_phot ();
	}
	renderPhotons();
	renderParts();
}

var fnList = ["PAUS","FRAM","SOLD","PWDR","LIQD","GAS","SPEC","INVS","PROP","BACK","TYPE","CTYP","ARG3","ARG4","DECO","TMP"];
var fnListID = [];
var fnList2 = [0, 9, 16];

function getFnMenu (id)
{
	var j = fnList2[id++];
	var k = fnList2[id];
	for (var i = 0; i < 15; i++)
	{
		if (j < k)
		{
			fnListID[i] = j;
			document.getElementById("Menu_" + i).value = fnList[j++];
		}
		else
		{
			fnListID[i] = -1;
			document.getElementById("Menu_" + i).value = "";
		}
	}
}

getFnMenu (0);

function selectOpt (id)
{
	switch (fnListID[id])
	{
	case 0:
		runningFlag = !runningFlag;
		break;
	case 1:
		runningFlag = false;
		frame_render();
		break;
	case 2:
		showPartMenu (0);
		break;
	case 3:
		showPartMenu (1);
		break;
	case 4:
		showPartMenu (2);
		break;
	case 5:
		showPartMenu (3);
		break;
	case 6:
		showPartMenu (4);
		break;
	case 7:
		currentProp = 7;
		currentType = prevElem[1];
		ElemType = 1;
		for (var i = 4; i < 15; i++)
		{
			menu2partID[i] = -1;
			document.getElementById("Part_"+i).value = "";
		}
		for (var i = 0; i < 4; i++)
		{
			menu2partID[i] = invisMenuID[i];
			document.getElementById("Part_"+i).value = invisMenu[i];
		}
		break;
	case 8:
		getFnMenu (1);
		break;
	case 9:
		getFnMenu (0);
		break;
	case 10:
		propertyTool (1);
		break;
	case 11:
		propertyTool (2);
		break;
	case 12:
		propertyTool (3);
		break;
	case 13:
		propertyTool (4);
		break;
	case 14:
		propertyTool (5);
		break;
	case 15:
		propertyTool (6);
		break;
	}
}

function propertyTool (id)
{
	var type = prompt("Change particle property");
	if (type == null)
	{
		return;
	}
	currentProp = id;
	if (type.charAt(0) === "#" || type.substr(0,2) === "0x")
	{
		currentType = parseInt(type.slice(-8), 16);
	}
	else
	{
		currentType = parseInt(type);
	}
}

var invisMenu = ["X", "INVS", "TOGL", "PHOT"]
var invisMenuID = [0, 1, 256, 257]

var ElemType = 0;
var prevElem = [2,1];
function selectPart (id)
{
	if (id >= 0)
	{
		prevElem[ElemType] = currentType = menu2partID[id];
	}
}
renderParts();

var menu2partID = [];

function showPartMenu (id)
{
	if (currentProp !== 7)
	{
		currentProp = 0;
		ElemType = 0;
		currentType = prevElem[0];
	}
	var filt_c = 0, tmp;
	for (var i = 0; i < 15; i++)
	{
		menu2partID[i] = -1;
		document.getElementById("Part_"+i).value = "";
	}
	for (var i = 0; i < type_count; i++)
	{
		if (ST_Menu_List[i] === id)
		{
			menu2partID[filt_c] = i;
			filt_c ++;
		}
	}
	for (var i = 0; i < 15 && i < filt_c; i++)
	{
		tmp = menu2partID[i];
		document.getElementById("Part_"+i).value = partName[tmp];
	}
}

showPartMenu (1);

!function UpdateSelf(){
	if(runningFlag && __frames > 5)
	{
		frame_render();
		__frames = 0;
	}
	__frames++;
	requestAnimationFrame(UpdateSelf);
}();

window.selectOpt = selectOpt;
window.selectPart = selectPart;
window.mouse_partOP = mouse_partOP;

})();