var currentType = 2;
var currentProp = 0;
(function () {

var canvas_I = document.getElementById("InvisLayer");
var canvas_P = document.getElementById("PartLayer");
var canvas_F = document.getElementById("PhotonsLayer");
var ctx_I = canvas_I.getContext("2d");
var ctx_P = canvas_P.getContext("2d");
var ctx_F = canvas_F.getContext("2d");
// update 5000 times
var params_P = 10;
var params_F = 6;
var runningFlag, __frames = 0;
var map_I = new Uint8Array(82*66);
var map_P = new Int32Array(82*66*params_P); // particle table: type, ctype, param3, param4, param5, param6, infected type, dcolour, flags, tmp
var map_F = new Int16Array(82*66); // photons map
var parts_F = new Int16Array(6000*params_F); // photons table: type, x, y, vx, vy, flags
var laser_map = new Int16Array(82*66); // laser map
var laser_pos = new Int8Array(2000);
var laser_num = 0;
var photons_count = 0;
var pfree = 0;
var arg_deco = params_P - 3;
var arg_last = params_P - 1;
var arg_flags = params_P - 2;
var arg_infect = params_P - 4;

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
	parts_F[i*params_F+5] = ++i;
}
parts_F[5999*params_F+5] = -1;

for (var i = 0; i < 82*66; i++)
{
	map_F[i] = -1;
}
var partName = [
	"X",   "BLCK","DUST","WATR","CLNE","VOID","VIRS","CURE","ACID","OIL" ,
	"MERC","FIRE","WOOD","WTRV","BASE","SLTW","SALT","STNE","PLNT","WPIP",
	"VRSS","ANAR"
];

var default_color = [
	"#000000", "#AAAAAA", "#FFE0A0", "#2030D0", "#CCCC00", "#790B0B", "#FE11F6", "#F5F5DC", "#EE66FF", "#483810",
	"#746A6A", "#FF0000", "#BF9C1D", "#A0A0FF", "#13BDFF", "#505CD4", "#FFFFFF", "#999999", "#0CAC00" ,"#FFBE30",
	"#BE11B6", "#FFFFEE"
];

var can_clone = [0,0,1,1,0,0,1,1,1,1 ,1,1,0,1,1,1,1,0,0,0, 0,1];

// can_infe =
//   0: no effect,
//   1: infected to solid virus,
//   2: infected to liquid virus
var can_infe = [0,0,1,1,0,0,0,0,1,1 ,1,0,1,2,1,1,1,1,1,1, 0,1];

var acidAffect = [0,0,1,0,0,0,1,1,0,0.2, 1,0,1,1,0,0,0,0,1,1, 0.5,1];

var flammable = [0,0,1,0,0,0,0,0,0,1, 0,0,1,0,0,0,0,0,1,0, 0,0];

// 0: solid, 1: powder, 2: liquid, 3: gas, 4: go upward, 5: anti-gravity powder
var ST_List = [0,0,1,2,0,0,2,2,2,2, 2,4,0,4,2,2,1,0,0,0, 0,5];

// Menu Section ID:
//   0: solid
//   1: powder
//   2: liquid
//   3: gas
//   4: special solid
//  -1: hidden
var ST_Menu_List = [4,4,1,2,4,4,2,2,2,2, 2,3,0,3,2,2,1,0,0,4, -1,1];

var ST_Weight = [
	   0,1000, 800 ,400,1000,   0, 420,  420, 390, 300,
	 900,   1,1000,   1, 390, 440, 900, 1000,1000,1000,
	1000, 800
];

var type_count = 22;

var MAX_ACID_AFFECTED = 30;

var SALT_WATER_SATURE = 50;

var k01 = SALT_WATER_SATURE;


var smodtable = [
	[0,1,2,1],
	[2,0,1,1],
	[1,2,0,1],
	[2,2,2,0]
];

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
		var newX, newY, infectingOffset, tmp, tmp2;
		if (map_P[self_P+arg_last] > 0) /* curing virus */
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
				tmp = map_P[infectingOffset];
				if ((tmp === 6 || tmp === 20) && map_P[infectingOffset+arg_last] <= 0)
				{
					map_P[infectingOffset+arg_last] = map_P[self_P+arg_last] + 2;
				}
			}
			if (!--map_P[self_P+arg_last])
			{
				map_P[self_P] = map_P[self_P+arg_infect];
				map_P[self_P+arg_infect] = 0;
				map_P[self_P+arg_flags] = 0;
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
		tmp2 = self_P + arg_flags;
		if (map_P[tmp2] > 0) // cooling down?
			map_P[tmp2] --;
		switch (tmp)
		{
		case 6:
			if (map_P[self_P] === 20)
			{
				if (map_P[infectingOffset+arg_flags] > 0)
				{
					map_P[self_P] = 6;
					map_P[tmp2] = 50;
				}
				else
				{
					map_P[infectingOffset] = 20;
				}
			}
			break;
		case 7:
			map_P[infectingOffset] = 0;
			map_P[self_P+arg_last] = 30;
			break;
		case 11:
			map_P[self_P] = 6;
			map_P[tmp2] = 50;
			break;
		default:
			if (can_infe[tmp])
			{
				tmp2 = can_infe[tmp] === 2;
				map_P[infectingOffset] = (tmp2 ? 6 : 20);
				map_P[infectingOffset+arg_infect] = tmp;
				map_P[infectingOffset+arg_last] = 0;
				map_P[infectingOffset+arg_flags] = 50;
			}
		}
		// console.log (map_P[self_P+5]);
	},
	null,
	function (x, y) /* acid */
	{
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
			switch ( tmp )
			{
			case 3:// dissolved by water
				tmp = (map_P[lifeOffset] + MAX_ACID_AFFECTED) >> 1;
				map_P[affectOffset] = 8;
				map_P[affectOffset+1] = map_P[lifeOffset] = tmp;
				return;
			case 8:
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
		var lifeOffset = (82*y+x)*params_P + 1, tmp;
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
			var iflame = true;
			do
			{
				tmp = map_P[flameOffset];
				if (tmp === 3)
				{
					if ((2.5 * Math.random() - 1.25) > (newY - y))
					{
						map_P[flameOffset] = 13;
					}
					else
					{
						map_P[lifeOffset-1] = 0;
					}
					break;
				}
				else if (tmp === 15)
				{
					if ((2.5 * Math.random() - 1.25) > (newY - y))
					{
						k01 += map_P[flameOffset+1];
						if (k01 >= 2 * SALT_WATER_SATURE)
						{
							map_P[flameOffset] = 16;
							map_P[flameOffset+1] = SALT_WATER_SATURE;
							k01 -= 2 * SALT_WATER_SATURE;
						}
						else
						{
							map_P[flameOffset] = 13;
						}
					}
					else
					{
						map_P[lifeOffset-1] = 0;
					}
					break;
				}
				else if (flammable[tmp] && iflame)
				{
					map_P[flameOffset] = 11;
					map_P[flameOffset+1] = 0;
					break;
				}
				flameOffset -= 82 * params_P;
				if (flameOffset < 0) break;
				iflame = !iflame;
			} while (!iflame);
		}
		map_P[lifeOffset] ++;
	},
	null,
	function (x, y) /* steam */
	{
		var currOffset = (82*y+x)*params_P;
		if (y < 1) return;
		var topOffset = (82*(y-1)+x)*params_P;
		if (map_P[topOffset] === 17)
		{
			map_P[currOffset] = 3;
		}
	},
	function (x, y) /* base / alkali */
	{
		var lifeOffset = (82*y+x)*params_P + 1;
		var affectOffset, tmp, diff;
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
			switch ( tmp )
			{
			case 3: // dissolved by water 
				tmp = (map_P[lifeOffset] + MAX_ACID_AFFECTED) >> 1;
				map_P[affectOffset] = 14;
				map_P[affectOffset+1] = map_P[lifeOffset] = tmp;
				return;
			case 7:
				return;
			case 8:
				diff = map_P[affectOffset+1] - map_P[lifeOffset]; // base concentration
				if (diff >= 0) // if it's base or neutral
				{
					map_P[affectOffset] = 15; // salt water
					map_P[affectOffset+1] = SALT_WATER_SATURE;
				}
				else // if it's acid
				{
					map_P[affectOffset+1] = 30 + diff;
				}
				if (diff <= 0) // if it's acid or neutral
				{
					map_P[lifeOffset-1] = 15; // salt water
					map_P[lifeOffset] = SALT_WATER_SATURE;
				}
				else
				{
					map_P[lifeOffset] = 30 - diff;
				}
				return;
			case 9: // make soap?
				map_P[lifeOffset] += 8;
				map_P[affectOffset] = 7;
				if (map_P[lifeOffset] >= MAX_ACID_AFFECTED )
				{
					map_P[lifeOffset-1] = 0;
				}
				return;
			case 14:
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
	function (x, y) /* salt water */
	{
		newX = x + ((Math.random() * 3) | 0) - 1;
		newY = y + ((Math.random() * 3) | 0) - 1;
		if (!checkBounds (newX, newY) || (newX == x && newY == y))
		{
			return;
		}
		var concOffset  = (82*y+x)*params_P + 1;
		var otherOffset = (82*newY+newX)*params_P;
		var c1, c2;
		switch (map_P[otherOffset])
		{
		case 3: // water
			c1 = map_P[concOffset];
			c2 = c1 >> 1;
			c1 -= c2;
			// diffusion
			if (c2 > 0)
			{
				map_P[concOffset] = c2;
			}
			else
			{
				map_P[concOffset-1] = 3;
			}
			map_P[otherOffset] = 15;
			map_P[otherOffset+1] = c1;
			break;
		case 15: // salt water
			c1 = map_P[concOffset] + map_P[otherOffset+1];
			c2 = c1 >> 1;
			// diffusion
			map_P[otherOffset+1] = c1 - c2;
			map_P[concOffset] = c2
			break;	
		case 16: // salt
			c1 = map_P[concOffset] + map_P[otherOffset+1];
			// dissolved by water 
			map_P[concOffset] = SALT_WATER_SATURE;
			if (c1 > SALT_WATER_SATURE)
			{
				map_P[otherOffset+1] = c1 - SALT_WATER_SATURE;
			}
			else
			{
				map_P[otherOffset] = 15;
				map_P[otherOffset+1] = c1;
			}
			break;	
		}
	},
	function (x, y) /* salt */
	{
		newX = x + ((Math.random() * 3) | 0) - 1;
		newY = y + ((Math.random() * 3) | 0) - 1;
		if (!checkBounds (newX, newY))
		{
			return;
		}
		var saltOffset  = (82*y+x)*params_P;
		var waterOffset = (82*newY+newX)*params_P;

		if (map_P[waterOffset] === 3)
		{
			map_P[saltOffset] = 15;
			map_P[waterOffset] = 15;
			map_P[waterOffset+1] = SALT_WATER_SATURE;
		}
	},
	null,
	function (x, y) /* plant */
	{
		newX = x + ((Math.random() * 3) | 0) - 1;
		newY = y + ((Math.random() * 3) | 0) - 1;
		if (!checkBounds (newX, newY))
		{
			return;
		}
		var plantOffset = (82*y+x)*params_P;
		var waterOffset = (82*newY+newX)*params_P;

		if (Math.random() < 0.2)
		{
			switch (map_P[waterOffset])
			{
			case 3:
				map_P[waterOffset] = 18;
				break;
			case 15:
				map_P[plantOffset] = 0;
				break;
			}
		}
	},
	function (x, y) /* sponge/water pipe */
	{
		newX = x + ((Math.random() * 3) | 0) - 1;
		newY = y + ((Math.random() * 3) | 0) - 1;
		if (!checkBounds (newX, newY))
		{
			return;
		}
		var spongeOffset = (82*y+x)*params_P;
		var waterOffset  = (82*newY+newX)*params_P;
		var water_sum;
		var water_tmp;
		var modulo;
		var from_fn = map_P[spongeOffset+1];

		switch (map_P[waterOffset])
		{
		case 0:
			if (from_fn == 3 && map_P[spongeOffset+2])
			{
				create_part( newX, newY, 3 );
				map_P[spongeOffset+2] --;
			}
			break;
		case 3:
			if (from_fn != 3)
			{
				map_P[waterOffset] = 0;
				map_P[spongeOffset+2] ++;
			}
			break;
		case 15:
			if (from_fn != 3)
			{
				k01 += map_P[waterOffset+1];
				if (k01 >= 2 * SALT_WATER_SATURE)
				{
					map_P[waterOffset] = 16;
					map_P[waterOffset+1] = SALT_WATER_SATURE;
					k01 -= 2 * SALT_WATER_SATURE;
				}
				else
				{
					map_P[waterOffset] = 0;
					map_P[spongeOffset+2] ++;
				}
			}
			break;
		case 19:
			modulo = smodtable[from_fn][map_P[waterOffset+1]];
			water_sum = map_P[waterOffset+2] + map_P[spongeOffset+2];
			switch (modulo)
			{
				case 0: water_tmp = water_sum >> 1; break;
				case 1: water_tmp = 0; break;
				case 2: water_tmp = water_sum; break;
			}
			map_P[spongeOffset+2] = water_tmp;
			map_P[waterOffset+2] = water_sum - water_tmp;
			break;
		}
	},
	null
];

Update_P[20] = Update_P[6];

function renderParts ()
{
	var tmp;
	for (var y = 0; y < 66; y++)
	{
		for (var x = 0; x < 82; x++)
		{
			renderPart ( x, y, map_P[tmp = (82*y+x)*params_P], map_P[tmp+arg_deco], tmp );
		}
	}
}
function renderPhoton (id)
{
	var phot_offset = id*params_F;
	var x = parts_F[phot_offset+1] | 0;
	var y = parts_F[phot_offset+2] | 0;
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
	for (iter = 1; iter < params_P; iter++)
	{
		map_P[t+iter] = 0;
	}
	return true;
}
function renderPart (x, y, type, dcolour, other_prop_offset)
{
	var temp, tmpr, tmpg, tmpb, nodeco = false;
	ctx_P.globalAlpha = 1;
	ctx_P.clearRect(x*10, y*10, 10, 10);
	if (type !== 0)
	{
		switch (type)
		{
		case  6:
			nodeco = true;
			temp = map_P[other_prop_offset+arg_flags];
			tmpr = 254 - temp; tmpg =  17; tmpb = 246 - temp;
			ctx_P.fillStyle = "#" + (((256 + tmpr) * 256 + tmpg) * 256 + tmpb).toString(16).slice(-6);
			break;
		case 20:
			nodeco = true;
			ctx_P.fillStyle = default_color[type];
			break;
		case 19:
			temp = map_P[other_prop_offset+2];
			tmpr = 255 - 20 * temp; tmpr < 50 && (tmpr = 50);
			tmpg = 190 - 20 * temp; tmpg < 50 && (tmpg = 50);
			tmpb =  48 - 20 * temp; tmpb < 20 && (tmpb = 20);
			switch (map_P[other_prop_offset+1])
			{
			case 1:
				temp = tmpr;
				tmpr = tmpg;
				tmpg = temp;
				break;
			case 2:
				temp = tmpb;
				tmpb = tmpg;
				tmpg = tmpr;
				tmpr = temp;
				break;
			case 3:
				temp = tmpb;
				tmpb = tmpg;
				tmpg = temp;
				break;
			}
			ctx_P.fillStyle = "#" + (((256 + tmpr) * 256 + tmpg) * 256 + tmpb).toString(16).slice(-6);
			break;
		default:
			ctx_P.fillStyle = default_color[type];
		}
		ctx_P.fillRect(x*10, y*10, 10, 10);
		if (!nodeco && (dcolour & 0xFF000000))
		{
			ctx_P.globalAlpha = (dcolour >>> 24) / 255.0;
			ctx_P.fillStyle = "#" + (dcolour>>>0).toString(16).slice(-6);
			ctx_P.fillRect(x*10, y*10, 10, 10);
		}
	}
}

var photVX = [1,0,-1,0];
var photVY = [0,1,0,-1];
function mouse_partOP (x, y, type, prop)
{
	var tmp = (82*y+x)*params_P, id, dir, laser_id;
	if (prop <= 0)
	{
		if (type !== 0)
		{
			if ( !create_part (x, y, type) )
			{
				map_P[tmp] !== 8 && map_P[tmp] !== 11 && (map_P[tmp] < 14 || map_P[tmp] > 16) && map_P[tmp] !== 19 && (map_P[tmp+1] = type);
				return;
			}
			else if (map_P[tmp] == 15 || map_P[tmp] == 16)
			{
				map_P[tmp + 1] = SALT_WATER_SATURE;
			}
		}
		else
		{
			map_P[tmp] = 0;
		}
		renderPart (x, y, type, 0, tmp);
		// console.debug(map_P[tmp+5]);
	}
	else if (prop <= params_P)
	{
		if (map_P[tmp] !== 0)
		{
			map_P[tmp+prop-1] = type;
			/* (prop === 1 || prop === arg_deco+10) && */ renderPart (x, y, map_P[tmp], map_P[tmp+arg_deco], tmp);
		}
	}
	else if (prop === params_P+1)
	{
		if (type < 256)
		{
			var origType = map_I[y*82+x];
			if (origType === 6)
			{
				laser_id = laser_map [y*82+x];
				laser_num--;
				laser_pos [4*laser_id  ] = laser_pos [4*laser_num  ];
				laser_pos [4*laser_id+1] = laser_pos [4*laser_num+1];
				laser_pos [4*laser_id+2] = laser_pos [4*laser_num+2];
				laser_pos [4*laser_id+3] = laser_pos [4*laser_num+3];
			}
			if (type === 6)
			{
				laser_map [y*82+x] = laser_num;
				laser_pos [4*laser_num  ] = x;
				laser_pos [4*laser_num+1] = y;
				dir = Math.random()*4 | 0;
				laser_pos [4*laser_num+2] = photVX [dir];
				laser_pos [4*laser_num+3] = photVY [dir];
				laser_num++;
			}
			if (type === 0)
			{
				map_I[y*82+x] = 0;
				ctx_I.clearRect(x*10, y*10, 10, 10);
			}
			else
			{
				map_I[y*82+x] = type;
				ctx_I.fillStyle = invisColours[type-1];
				ctx_I.fillRect(x*10, y*10, 10, 10);
			}
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
				dir = Math.random()*4 | 0;
				id = alloc_phot(x,y,photVX[dir],photVY[dir],1);
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
	// debugger;
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
var invisColours = ["#00CCCC", "#0F0064", "#555577", "#775555", "#557755", "#885088"];
function checkBounds (x, y)
{
	return x >= 0 && x < 82 && y >= 0 && y < 66;
}

function isallowed (x, y, type, src)
{
	switch (map_I[82*y+x])
	{
	case 1:
	case 6:
		return false;
	case 3:
		if (ST_List[type] !== 2 && src !== 0)
			return false;
		break;
	case 4:
		if (ST_List[type] !== 1 && src !== 0)
			return false;
		break;
	case 5:
		if (ST_List[type] !== 3 && ST_List[type] !== 4 && src !== 0)
			return false;
		break;
	}
	return true;
}

function try_move (x, y)
{
	var type = map_P[(82*y+x)*params_P], tempTypeOffset;
	if (!isallowed (x, y, type, 0))
	{
		return;
	}
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
	case 5:
		if (state === 5)
			newY = y - 1;
		for (osc = 0; osc <= 1; osc = -2*osc + 1)
		{
			inBound = checkBounds (newX = x + osc * rnd, newY);
			newPosType = map_P[(82*newY + newX)*params_P];
			if (!inBound || newPosType === 5) {
				disappearOld = true; break;
			}
			if (!isallowed (newX, newY, type, 1))
			{
				continue;
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
			if (!isallowed (newX, newY, type, 1))
			{
				continue;
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
		inBound = checkBounds (newX = x + Math.round(Math.random() * 2.2 - 1.1), newY = y + Math.round(Math.random() * 2.2 - 1.1));
		newPosType = map_P[(82*newY + newX)*params_P];
		if (!inBound || newPosType === 5) {
			disappearOld = true; break;
		}
		if (!isallowed (newX, newY, type, 1))
		{
			return;
		}
		if (newPosType === 0)
		{
			newPartFlag = true;
			newPosType = type;
			disappearOld = true; break;
		}
		break;
	case 4:
		osc = 1;
		while (osc >= 0)
		{
			inBound = checkBounds (newX = x + (rnd = Math.round(Math.random() * 2 - 1)), newY = y - (osc--));
			newPosType = map_P[(82*newY + newX)*params_P];
			if (!inBound || newPosType === 5) {
				disappearOld = true; break;
			}
			if (!isallowed (newX, newY, type, 1))
			{
				return;
			}
			if (ST_Weight[newPosType] < ST_Weight[type])
			{
				newPartFlag = true;
				newPosType = type;
				disappearOld = true; break;
			}
		}
	}
	if (disappearOld)
	{
		if (newPartFlag)
		{
			tempTypeOffset = (82*newY+newX)*params_P;
			var t2 = map_P[tempTypeOffset];
			if (t2 && !isallowed (x, y, t2, 2))
			{
				return;
			}
			for (var i = 0; i < params_P; i++)
			{
				osc = map_P[rnd = tempTypeOffset+i];
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

function try_move_phot (id)
{
	var phot_offset = id*params_F;
	var x = parts_F[phot_offset+1] | 0;
	var y = parts_F[phot_offset+2] | 0;
	var ox = x, oy = y;
	var rx = parts_F[phot_offset+3] | 0;
	var ry = parts_F[phot_offset+4] | 0;
	if (parts_F[phot_offset+5] & 1)
	{
		parts_F[phot_offset+5] &= ~1;
		return 1;
	}
	x += rx, y += ry;
	if (!checkBounds(x, y))
	{
		free_phot (id);
		kill_phot_pos (id, ox, oy);
		return 0;
	}
	if (map_P[(82*y + x)*params_P] === 0)
	{
		x += rx, y += ry;
	}
	if (!checkBounds(x, y) || map_P[(82*y + x)*params_P] === 5)
	{
		free_phot (id);
		kill_phot_pos (id, ox, oy);
		return 0;
	}
	kill_phot_pos (id, ox, oy);
	map_F[tmp = 82*y+x] = id; // create_phot_pos (id, x, y);
	parts_F[phot_offset+1] = x;
	parts_F[phot_offset+2] = y;
	return 1;
}

function free_phot (id)
{
	parts_F[id*params_F] = 0;
	parts_F[id*params_F+5] = pfree;
	pfree = id;
	photons_count --;
}

function alloc_phot (x, y, vx, vy, type)
{
	var id = pfree, tmp;
	pfree = parts_F[(tmp = id*params_F)+5];
	parts_F[tmp++] = type;
	parts_F[tmp++] = x;
	parts_F[tmp++] = y;
	parts_F[tmp++] = vx;
	parts_F[tmp++] = vy;
	parts_F[tmp++] = 0;
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
			x = parts_F[phot_offset+1] | 0;
			y = parts_F[phot_offset+2] | 0;
			map_F[82*y+x] = i;
		}
	}
}

function frame_render ()
{
	var px, py, pdx, pdy, id = 0, id2;
	for (var i = 0; i < laser_num; i++)
	{
		px  = laser_pos[id++];
		py  = laser_pos[id++];
		pdx = laser_pos[id++];
		pdy = laser_pos[id++];
		id2 = alloc_phot(px,py,pdx,pdy,1);
		map_F[tmp = 82*py+px] = id2;
	}
	// if (photons_count > 0)
	// {
		for (var i = 0, j = 0; j < photons_count; i++)
		{
			if (parts_F[i*params_F] !== 0)
			{
				j += try_move_phot ( i );
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

var fnList = ["PAUS","FRAM","SOLID","PWDR","LIQD","GAS","SPEC","INVS","PROP","LINK","BACK","TYPE","CTYP","ARG3","ARG4","ARG5","ARG6","ITYPE","DECO","TMP","TMP2"];
var fnListID = [];
var fnList2 = [0, 10, 21];

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
		currentProp = params_P + 1;
		currentType = prevElem[1];
		ElemType = 1;
		for (var i = 4; i < 15; i++)
		{
			menu2partID[i] = -1;
			document.getElementById("Part_"+i).value = "";
		}
		for (var i = 0; i < 8; i++)
		{
			menu2partID[i] = invisMenuID[i];
			document.getElementById("Part_"+i).value = invisMenu[i];
		}
		break;
	case 8:
		getFnMenu (1);
		break;
	case 9:
		var link_abbr = ["TPT", "CNWL", "ETRC", "RETN"]
		for (var i = 0; i < 15; i++)
		{
			currentProp = -1;
			menu2partID[i] = i;
			document.getElementById("Part_"+i).value = i < 4 ? link_abbr[i] : "";
		}
		break;
	case 10:
		getFnMenu (0);
		break;
	case 11:
		propertyTool (1);
		break;
	case 12:
		propertyTool (2);
		break;
	case 13:
		propertyTool (3);
		break;
	case 14:
		propertyTool (4);
		break;
	case 15:
		propertyTool (5);
		break;
	case 16:
		propertyTool (6);
		break;
	case 17:
		propertyTool (7);
		break;
	case 18:
		propertyTool (8);
		break;
	case 19:
		propertyTool (9);
		break;
	case 20:
		propertyTool (10);
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

var invisMenu = ["X", "INVS", "ALOL", "ALOP", "ALOG", "LSER", "TOGL", "PHOT"]
var invisMenuID = [0, 1, 3, 4, 5, 6, 256, 257]

var ElemType = 0;
var prevElem = [2,1];
function selectPart (id)
{
	if (currentProp >= 0)
	{
		if (id >= 0)
		{
			prevElem[ElemType] = currentType = menu2partID[id];
		}
	}
	else
	{
		if (id < 3)
		{
			var _links = ["http://powdertoy.co.uk/", "http://conwaylife.com/", "SimplePowder/electronics", "https://git123hub.github.io/index/"];
			location.href = _links[id];
		}
	}
}
renderParts();

var menu2partID = [];

function showPartMenu (id)
{
	if (currentProp !== 0)
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
