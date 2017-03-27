var canvas_I = document.getElementById("InvisLayer");
var canvas_P = document.getElementById("PartLayer");
var ctx_I = canvas_I.getContext("2d");
var ctx_P = canvas_P.getContext("2d");
var currentType = 2;
var currentProp = 0;
// update 5000 times
var params_P = 6;
var runningFlag, __frames = 0;
var map_I = new Int8Array(82*66);
var map_P = new Int32Array(82*66*params_P); // type, ctype, param3, param4, dcolour, flags
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
var default_color = ["#000000", "#AAAAAA", "#FFE0A0", "#2030D0", "#CCCC00", "#790B0B", "#FE11F6", "#F5F5DC"];

var default_color_a = [0,1,1,1,1,1,1,1];

var can_clone = [0,0,1,1,0,0,1,1];

var can_infl = [0,0,1,1,1,1,0,0];

var Update_P = [
	null,
	null,
	null,
	null,
	function (x, y)
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
	function (x, y)
	{
		var self_P = (82*y+x)*params_P;
		var newX, newY, infectingOffset, tmp;
		if (map_P[self_P+5] > 0)
		{
			for (var trade = 0; trade < 4; trade++)
			{
				newX = x + ((Math.random() * 3) | 0) - 1;
				newY = y + ((Math.random() * 3) | 0) - 1;
				infectingOffset = (82*newY+newX)*params_P;
				if (map_P[infectingOffset] === 6 && map_P[infectingOffset+5] === 0)
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
		infectingOffset = (82*newY+newX)*params_P;
		tmp = map_P[infectingOffset];
		if (tmp === 7)
		{
			map_P[infectingOffset] = 0;
			map_P[self_P+5] = 30;
		}
		else if (can_infl[tmp])
		{
			map_P[infectingOffset] = 6;
			map_P[infectingOffset+3] = tmp;
			map_P[infectingOffset+5] = 0;
		}
	},
	null
];

// 0: solid, 1: powder, 2: liquid, 3: gas
var ST_List = [0,0,1,2,0,0,2,2];

var ST_Weight = [0,1000,800,400,1000,0,410,420];

function renderParts ()
{
	var partType;
	for (var y = 0; y < 66; y++)
	{
		for (var x = 0; x < 82; x++)
		{
			ctx_P.globalAlpha = 1;
			ctx_P.clearRect(x*10, y*10, 10, 10);
			partType = map_P[(82*y+x)*params_P]
			ctx_P.globalAlpha = default_color_a[partType];
			ctx_P.fillStyle = default_color[partType];
			ctx_P.fillRect(x*10, y*10, 10, 10);
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
function renderPart (x, y, type)
{
	ctx_P.globalAlpha = 1;
	ctx_P.clearRect(x*10, y*10, 10, 10);
	ctx_P.globalAlpha = default_color_a[type];
	ctx_P.fillStyle = default_color[type];
	ctx_P.fillRect(x*10, y*10, 10, 10);
}
function mouse_partOP (x, y, type, prop)
{
	if (prop <= 0)
	{
		if (type !== 0)
		{
			if ( !create_part (x, y, type) )
			{
				map_P[(82*y+x)*params_P+1] = type;
				return;
			}
		}
		else
		{
			map_P[(82*y+x)*params_P] = 0;
		}
		renderPart (x, y, type);
	}
	else (prop <= 6)
	{
		map_P[(82*y+x)*params_P+prop-1] = type;
		prop === 1 && renderPart (x, y, type);
	}
}
function checkBounds (x, y)
{
	return x >= 0 && x < 82 && y >= 0 && y < 66;
}
function try_move (x, y)
{
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
		for (osc = 0;;)
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
			if (osc === -1) {
				if (_base)
				{
					break;
				}
				_base = true; newY = y;
			}
			else if (osc === 0) {
				osc = -1;
			}
			osc = -osc;
		}
		break;
	case 3:
		inBound = checkBounds (newX = x + osc * rnd, newY);
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
function frame_render ()
{
	for (var i = 0; i < 4500; i++)
	{
		try_move ((Math.random()*82)|0, (Math.random()*66)|0);
	}
	renderParts();
}
function selectOpt (id)
{
	switch (id)
	{
	case 0:
		runningFlag = !runningFlag;
		break;
	case 1:
		runningFlag = false;
		frame_render();
		break;
	case 2:
		currentType = 0;
		break;
	case 3:
		currentType = 1;
		break;
	case 4:
		currentType = 2;
		break;
	case 5:
		currentType = 3;
		break;
	case 6:
		currentType = 4;
		break;
	case 7:
		currentType = 5;
		break;
	case 8:
		currentType = 6;
		break;
	case 9:
		currentType = 7;
		break;
	}
}
renderParts();
!function UpdateSelf(){
	if(runningFlag && __frames > 5)
	{
		frame_render();
		__frames = 0;
	}
	__frames++;
	requestAnimationFrame(UpdateSelf);
}();
document.getElementById("Menu_0").value = "PAUS";
document.getElementById("Menu_1").value = "FRAM";
document.getElementById("Menu_2").value = "X";
document.getElementById("Menu_3").value = "BLCK";
document.getElementById("Menu_4").value = "PWDR";
document.getElementById("Menu_5").value = "WATR";
document.getElementById("Menu_6").value = "CLNE";
document.getElementById("Menu_7").value = "VOID";
document.getElementById("Menu_8").value = "VIRS";
document.getElementById("Menu_9").value = "CURE";