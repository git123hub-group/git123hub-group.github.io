/* ElectronicsCA.js */
var part_state = 1, paused = true;
var channel_num = 0;

(function () {

var width = 84, height = 68;
var wireless = [0];
var ISWIRE = 0;
var pmap = [];

for (var i = height - 1; i >= 0; i--)
{
	pmap[i] = [];
	for (var j = width - 1; j >= 0; j--)
	{
		pmap[i][j] = new Int32Array(6);
	}
}

for (var i = 0; i < 100; i++)
{
	wireless[i] = 0;
}

var canvas = document.getElementById("PartLayer");
var ctx = canvas.getContext("2d");
var colors = [
	"#000000", "#444466", "#FFFFCC", "#AAAAAA", "#805050", "#505080", "#003000", "#20CC20", "#108010", "#554040",
	"#40403C", "#858505", "#FFC000", "#FFFFFF", "#DCAD2C", "#FD9D18", "#902090", "#FFCC00", "#40A060", "#405050",
	"#505040", "#002080", "#707070", "#383838"
];

var Electrodes = [];

var PART_METAL = 1;
var PART_SPARK = 2;
var PART_INSUL = 3;
var PART_PSCN = 4;
var PART_NSCN = 5;
var PART_SWITCH_OFF = 6;
var PART_SWITCH_ON = 7;
var PART_SWITCH_MID = 8;
var PART_INSUL_WIRE = 9;
var PART_INSTC = 10;
var PART_BATTERY = 11;
var PART_RAY_EMIT = 12;
var PART_RAY = 13;
var PART_GOLD = 14;
var PART_RAY_DTEC = 15;
var PART_DELAY = 16;
var PART_WIREWORLD = 17;
var PART_WIFI = 18;
var PART_PTC = 19;
var PART_NTC = 20;
var PART_RANDOMC = 21;
var PART_CNDTR2 = 22;
var PART_ETRD = 23;

var conduct  = [
	0, 1, 0, 0, 1, 1, 0, 1, 0, 1,
	0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
	1, 1, 1, 0
];
var isswitch = [
	0, 0, 0, 0, 0, 0, 1, 1, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0
];
var nradius = [
	2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
	2, 2, 2, 2, 2, 2, 2, 1, 1, 2,
	2, 2, 2, 2
];

function clickPixel (x, y)
{
	x >= 82 && (x = 81);
	y >= 66 && (y = 65);

	var tmpi, tmpj;
	
	var temp = pmap[y+1][x+1];
	if (part_state !== PART_SPARK)
	{
		if (!paused)
			return;
		if (!part_state)
		{
			if (temp[0] === PART_ETRD)
			{
				tmpi = temp[2];
				tmpj = Electrodes.length - 1;
				Electrodes[tmpi] = Electrodes[tmpj];
				pmap[Electrodes[tmpi][1]][Electrodes[tmpi][0]][2] = tmpi;
				Electrodes.length = tmpj;
			}
			temp[0] = 0;
			renderPixel (x+1, y+1, temp);
		}
		else if (!pmap[y+1][x+1][0])
		{
			temp[0] = part_state;
			temp[1] = 0;
			temp[2] = 0;
			temp[3] = 0;
			temp[4] = 0;
			temp[5] = 0;
			if (part_state === PART_DELAY)
			{
				tmpi = prompt ("Enter number value for delay:");
				temp[2] = (tmpi >= 1 ? tmpi : 1);
			}
			else if (part_state === PART_WIFI)
			{
				temp[2] = channel_num;
			}
			else if (part_state === PART_ETRD) // allocate electrode ID
			{
				tmpi = Electrodes.length;
				Electrodes[tmpi] = [x+1, y+1];
				temp[2] = tmpi;
			}
			renderPixel (x+1, y+1, temp);
		}
	}
	else // if particle's type is spark
	{
		ctype = temp[0];
		if (!temp[1] && ctype === PART_INSTC)
		{
			floodINST(x+1, y+1, ctype);
			return renderAll ();
		}
		else if (!temp[1] && ctype === PART_WIREWORLD)
		{
			temp[1] = 2;
			return renderPixel (x+1, y+1, temp);
		}
		else if (!temp[1] && ctype === PART_ETRD)
		{
			temp[1] = 12;
			return renderPixel (x+1, y+1, temp);
		}
		conductTo(x+1, y+1, temp);
		renderPixel (x+1, y+1, temp);
	}
}

function conductTo (x, y, array, extra)
{
	ctype = array[0];
	if (conduct[ctype] && array[1] <= 0)
	{
		array[2] = ctype;
		array[0] = PART_SPARK;
		array[1] = 4;
	}
}

function renderPixel (x, y, array)
{
	var num, num2;
	ctx.fillStyle = colors[array[0]];
	switch (array[0])
	{
	case PART_RAY:
		if (array[1] > 0)
		{
			if (array[2] !== 5)
			{
				num = num2 = (array[1] * 12.79) | 0;
				(array[2] === 6) && (num2 = num2 > 80 ? (num2 - 80) : 0);
				ctx.fillStyle = "rgb(" + num + "," + num2 + "," + num + ")";
			}
			else
			{
				ctx.fillStyle = "rgb(" + (num = (array[1] * 100) | 0) + "," + (num * 3 / 5) + "," + (num / 5) + ")";
			}
		}
	break;
	case PART_DELAY:
		if (array[1] > 0)
		{
			ctx.fillStyle = "#D078D0";
		}
	break;
	case PART_WIREWORLD:
		if (array[1] === 2)
			ctx.fillStyle = "#3366FF";
		else if (array[1] === 1)
			ctx.fillStyle = "#FF6633";
	break;
	case PART_WIFI:
		{
			var q = array[2];
			var colr = Math.sin(0.0628318 * q + 0) * 127 + 128;
			var colg = Math.sin(0.0628318 * q + 2) * 127 + 128;
			var colb = Math.sin(0.0628318 * q + 4) * 127 + 128;
			ctx.fillStyle = "rgb(" + [colr|0, colg|0, colb|0].join(",") + ")";
		}
	break;
	case PART_ETRD:
		if (array[1] > 0)
		{
			num = 14*array[1];
			ctx.fillStyle = "rgb(" + [64+num, 60+num, 56+num].join(",") + ")";
		}
	break;
	}
	ctx.fillRect ((x - 1) * 10, (y - 1) * 10, 10, 10);
}

function renderAll ()
{
	var part_y_index, k;
	for (var y = 1; y < 67; y++)
	{
		for (var x = 1; x < 83; x++)
		{
			renderPixel (x, y, pmap[y][x]);
		}
	}
}

function run_frame ()
{
	var part_y_index;
	var i, k, l;
	if (ISWIRE > 0)
	{
		for (i = 0; i < 100; i++)
			wireless[i] >>= 1;
	}
	for (var y = 0; y < height; y++)
	{
		part_y_index = 4 * y * width;
		for (var x = 0; x < width; x++)
		{
			k = pmap[y][x];
			switch (k[0])
			{
			case PART_SPARK:
				if (k[2] === PART_PTC || k[2] === PART_NTC) {
					k[4] = k[3];
					if (k[3]) k[3] --;
				}
				else if (isswitch[k[2]]) {
					k[3] = 0;
				}
			break;
			case PART_SWITCH_ON:
				if (k[3] === 5) {
					k[0] = PART_SWITCH_MID;
					k[1] = 4;
					k[2] = PART_SWITCH_OFF;
				}
				k[3] = 0;
			break;
			case PART_SWITCH_OFF:
				if (k[3] === 5) {
					k[0] = PART_SWITCH_MID;
					k[1] = 4;
					k[2] = PART_SWITCH_ON;
				}
				k[3] = 0;
			break;
			case PART_RAY_DTEC:
				k[1] = k[2];
				k[2] = 0;
			break;
			case PART_DELAY:
				k[3] = k[1]; // save old .life property
			break;
			case PART_WIREWORLD:
				k[2] = k[1]; // save previous WWLD state
			break;
			case PART_PTC:
			case PART_NTC:
				k[4] = k[3];
				if (k[3]) k[3] --;
			break;
			// more particle type in any .life value
			}
			if (k[1])
			{
				k[1] --;
				switch (k[0])
				{
				case PART_RAY:
					if (!k[1]) { k[0] = 0; }
				break;
				// more particle type in .life = 0
				}
			}
		}
	}
	
	for (i = 0; i < height; i++)
	{
		pmap[i][0][0] = 0;
		pmap[i][width - 1][0] = 0;
	}
	
	for (i = 0; i < width; i++)
	{
		pmap[0][i][0] = 0;
		pmap[height - 1][i][0] = 0;
	}
	
	for (var y = 0; y < height; y++)
	{
		k = pmap[y];
		for (var x = 0; x < width; x++)
		{
			simPart (x, y, k[x]);
		}
	}
	renderAll ();
}

function checkBounds (x, y)
{
	return x >= 0 && x < width && y >= 0 && y < height;
}

function simPart (x, y, array)
{
	var type = array[0], nx, ny;
	var hasConductor = false;
	var ctype, tmp, id, absID;
	var tmpArray, tmpArray2;
	var sender, receiver;
	var nxi, nyi, _xx, _yy;
	var xy;
	var nostop, destroy, radius = nradius[type];
	var leftBound   = Math.min(radius, x);
	var topBound    = Math.min(radius, y);
	var rightBound  = Math.min(radius, width  - x - 3);
	var bottomBound = Math.min(radius, height - y - 3);
	switch (type)
	{
		case PART_SPARK:
			if (!array[1])
			{
				array[1] = 4;
				array[0] = array[2];
				return;
			}
			if (array[1] >= 4)
			{
				return;
			}
			for (var ry = -topBound; ry <= bottomBound; ry++)
			{
				tmpArray = pmap[ny = y+ry];
				for (var rx = -leftBound; rx <= rightBound; rx++)
				{
					if ((rx > 0 ? rx : -rx) + (ry > 0 ? ry : -ry) >= 4) continue;
					tmpArray2 = tmpArray[nx = x+rx];
					sender = array[2];
					receiver = tmpArray2[0];
					if (pmap[(y + ny)>>1][(x + nx)>>1][0] === PART_INSUL)
						continue;
					switch (sender)
					{
					case PART_SWITCH_ON:
						if (receiver === PART_METAL || receiver === PART_SWITCH_ON || receiver === PART_GOLD || receiver === PART_CNDTR2)
						{
							conductTo(nx, ny, tmpArray2);
						}
						continue;
					case PART_INSUL_WIRE:
						if (receiver === PART_INSUL_WIRE || receiver === PART_PSCN || receiver === PART_NSCN)
						{
							conductTo(nx, ny, tmpArray2);
						}
						continue;
					case PART_INSTC:
						if (receiver === PART_NSCN)
						{
							conductTo(nx, ny, tmpArray2);
						}
						continue;
					case PART_PTC:
						if (receiver === PART_PSCN || receiver === PART_PTC || receiver === PART_NSCN && !array[4])
						{
							conductTo(nx, ny, tmpArray2);
						}
						continue;
					case PART_NTC:
						if (receiver === PART_PSCN || receiver === PART_NTC || receiver === PART_NSCN && array[4])
						{
							conductTo(nx, ny, tmpArray2);
						}
						continue;
					case PART_RANDOMC:
						if (receiver === PART_RANDOMC)
						{
							conductTo(nx, ny, tmpArray2);
							tmpArray2[3] = array[3];
						}
						if (array[3] === 0 && receiver === PART_METAL || array[3] === 1 && receiver === PART_CNDTR2)
						{
							conductTo(nx, ny, tmpArray2);
						}
						continue;
					}
					switch (receiver)
					{
					case PART_SPARK:
						switch (tmpArray2[2])
						{
						case PART_SWITCH_ON:
							if (sender === PART_NSCN)
							{
								tmpArray2[0] = PART_SWITCH_MID;
								tmpArray2[1] = 5;
								tmpArray2[2] = PART_SWITCH_OFF;
							}
							break;
						case PART_PTC:
						case PART_NTC:
							if (sender === PART_METAL && array[1] === 3)
							{
								tmpArray2[3] = 8;
							}
							break;
						}
						continue;
					case PART_PSCN:
						if (sender === PART_NSCN) continue;
						break;
					case PART_SWITCH_OFF:
						if (sender === PART_PSCN)
						{
							tmpArray2[0] = PART_SWITCH_MID;
							tmpArray2[1] = 5;
							tmpArray2[2] = PART_SWITCH_ON;
						}
						break;
					case PART_SWITCH_ON:
						if (sender !== PART_METAL && sender !== PART_GOLD && sender !== PART_CNDTR2)
						{
							if (sender === PART_NSCN)
							{
								tmpArray2[0] = PART_SWITCH_MID;
								tmpArray2[1] = 5;
								tmpArray2[2] = PART_SWITCH_OFF;
							}
							continue;
						}
						break;
					case PART_SWITCH_MID:
						if (tmpArray2[1] < 5)
						{
							if (tmpArray2[2] === PART_SWITCH_ON)
							{
								if (sender === PART_METAL || sender === PART_GOLD || sender === PART_CNDTR2)
								{
									tmpArray2[0] = PART_SPARK;
									tmpArray2[1] = 4;
								}
								else if (sender === PART_NSCN)
								{
									tmpArray2[1] = 5;
									tmpArray2[2] = PART_SWITCH_OFF;
								}
							}
							else if (tmpArray2[2] === PART_SWITCH_OFF && sender === PART_PSCN)
							{
								tmpArray2[1] = 5;
								tmpArray2[2] = PART_SWITCH_ON;
							}
						}
						continue;
					case PART_INSUL_WIRE:
						if (sender === PART_PSCN || sender === PART_NSCN)
						{
							conductTo(nx, ny, tmpArray2);
						}
						continue;
					case PART_INSTC:
						if (sender === PART_PSCN)
						{
							floodINST(nx, ny, receiver);
						}
						continue;
					case PART_PTC:
						if (sender === PART_METAL && array[1] === 3)
						{
							tmpArray2[3] = 8;
						}
						if (sender === PART_NSCN || sender === PART_PSCN && !tmpArray2[4])
						{
							conductTo(nx, ny, tmpArray2);
						}
						continue;
					case PART_NTC:
						if (sender === PART_METAL && array[1] === 3)
						{
							tmpArray2[3] = 8;
						}
						if (sender === PART_NSCN || sender === PART_PSCN && tmpArray2[4])
						{
							conductTo(nx, ny, tmpArray2);
						}
						continue;
					case PART_RANDOMC:
						tmpArray2[3] = Math.random() < 0.5 ? 0 : 1;
						break;
					case PART_ETRD:
						if (tmpArray2[1] <= 0)
							tmpArray2[1] = 12;
						continue;
					}
					conductTo(nx, ny, tmpArray2);
				}
			}
		break;
		case PART_SWITCH_MID:
			if (array[1] <= 0)
			{
				array[0] = array[2];
				return;
			}
			if (array[1] > 1 && array[1] < 5)
			{
				for (var ry = -topBound; ry <= bottomBound; ry++)
				{
					tmpArray = pmap[y+ry];
					for (var rx = -leftBound; rx <= rightBound; rx++)
					{
						if ((rx > 0 ? rx : -rx) + (ry > 0 ? ry : -ry) >= 4) continue;
						tmpArray2 = tmpArray[nx=x+rx];
						if (isswitch[tmpArray2[0]] || tmpArray2[0] === PART_SPARK && isswitch[tmpArray2[2]]
							|| tmpArray2[0] === PART_SWITCH_MID && tmpArray2[2] === PART_SWITCH_ON && array[2] === PART_SWITCH_OFF)
						{
							tmpArray2[2] = array[2];
							tmpArray2[0] = PART_SWITCH_MID;
							tmpArray2[1] = 5;
						}
					}
				}
			}
		break;
		case PART_BATTERY:
			for (var ry = -topBound; ry <= bottomBound; ry++)
			{
				tmpArray = pmap[ny = y+ry];
				for (var rx = -leftBound; rx <= rightBound; rx++)
				{
					if ((rx > 0 ? rx : -rx) + (ry > 0 ? ry : -ry) >= 4) continue;
					tmpArray2 = tmpArray[nx = x+rx];
					if (pmap[(y + ny)>>1][(x + nx)>>1][0] !== PART_INSUL && tmpArray2[0] !== PART_INSUL_WIRE && tmpArray2[0] !== PART_PTC && tmpArray2[0] !== PART_NTC)
					{
						conductTo (nx = x+rx, ny, tmpArray2);
						if (tmpArray2[0] == PART_RANDOMC)
							tmpArray2[3] = Math.random() < 0.5 ? 1 : 0;
					}
				}
			}
		break;
		case PART_RAY_EMIT:
			id = -4;
			for (var ry = -1; ry < 2; ry++)
			{
				tmpArray = pmap[ny = y+ry];
				for (var rx = -1; rx < 2; rx++, id++)
				{
					tmpArray2 = tmpArray[nx = x+rx];
					if (tmpArray2[0] === PART_SPARK && tmpArray2[1] === 3 && id)
					{
						absID = id < 0 ? -id : id;
						nxi = -rx; nyi = -ry;
						_xx = x+nxi; _yy = y+nyi;
						nostop = (tmpArray2[2] === PART_INSTC);
						destroy = (tmpArray2[2] === PART_PSCN);
						while (checkBounds(_xx, _yy))
						{
							if (!(ctype = (tmp = pmap[_yy][_xx])[0]))
							{
								tmp[0] = PART_RAY;
								tmp[1] = destroy ? 2 : 20;
								tmp[2] = destroy ? 5 : absID;
							}
							else if (tmp[0] === PART_RAY_DTEC)
							{
								tmp[2] = 1;
								break;
							}
							else if (!destroy)
							{
								if (tmp[0] === PART_INSUL_WIRE || tmp[0] === PART_SPARK && tmp[2] === PART_INSUL_WIRE || tmp[0] === PART_RAY_EMIT || tmp[0] === PART_SWITCH_ON || tmp[0] === PART_SWITCH_MID && tmp[2] === PART_SWITCH_ON)
								{
									_xx += nxi; _yy += nyi;
									continue;
								}
								if (tmp[0] === PART_RAY)
								{
									if (!tmp[1])
									{
										_xx += nxi; _yy += nyi;
										// long life?
										continue;
									}
									else if (tmp[2] === absID || tmp[2] === 6)
									{
										break;
									}
									else
									{
										if (tmp[2] !== 5)
											tmp[1] = 0;
										break;
									}
								}
								conductTo (_xx, _yy, tmp);
								if (!nostop || !(tmp[0] === PART_SPARK && conduct[tmp[2]]))
									break;
							}
							else
							{
								if (isswitch[tmp[0]])
								{
									tmp[3] |= 1 << (absID - 1);
								}
								if (tmp[0] === PART_INSUL_WIRE || tmp[0] === PART_SPARK && tmp[2] === PART_INSUL_WIRE || tmp[0] === PART_RAY_EMIT || tmp[0] === PART_SWITCH_ON || tmp[0] === PART_SWITCH_MID && tmp[2] === PART_SWITCH_ON)
								{
									_xx += nxi; _yy += nyi;
									continue;
								}
								if (tmp[0] === PART_RAY)
								{
									tmp[1] = 1;
									tmp[2] = 5;
									_xx += nxi; _yy += nyi;
									continue;
								}
								break;
							}
							_xx += nxi; _yy += nyi;
						}
					}
				}
			}
		break;
		case PART_GOLD:
			if (!array[1])
			{
				var checkCoordsX = [ -4, 4,  0, 0 ];
				var checkCoordsY = [  0, 0, -4, 4 ];
				for (var k = 0; k < 4; k ++)
				{
					rx = checkCoordsX [k];
					ry = checkCoordsY [k];
					if (checkBounds(x + rx, y + ry) && (tmpArray2 = pmap[y + ry][x + rx])[0] === PART_SPARK && tmpArray2[1] < 4)
					{
						conductTo (x, y, array);
					}
				}
			}
		break;
		case PART_RAY_DTEC:
			if (array[1] === 1)
			{
				for (var ry = -topBound; ry <= bottomBound; ry++)
				{
					tmpArray = pmap[ny=y+ry];
					for (var rx = -leftBound; rx <= rightBound; rx++)
					{
						if ((rx > 0 ? rx : -rx) + (ry > 0 ? ry : -ry) >= 4) continue;
						tmpArray2 = tmpArray[nx=x+rx];
						conductTo (nx, ny, tmpArray2);
					}
				}
			}
		break;
		case PART_DELAY:
			for (var ry = -topBound; ry <= bottomBound; ry++)
			{
				tmpArray = pmap[ny=y+ry];
				for (var rx = -leftBound; rx <= rightBound; rx++)
				{
					if ((rx > 0 ? rx : -rx) + (ry > 0 ? ry : -ry) >= 4) continue;
					if (pmap[(y + ny)>>1][(x + nx)>>1][0] === PART_INSUL)
					{
						continue;
					}
					tmpArray2 = tmpArray[nx=x+rx];
					switch (tmpArray2[0])
					{
					case PART_SPARK:
						if (tmpArray2[1] > 0 && tmpArray2[1] < 4 && tmpArray2[2] === PART_PSCN && array[1] <= 0)
						{
							array[1] = array[2];
						}
					break;
					case PART_DELAY:
						if (tmpArray2[1] < array[1] && !tmpArray2[3] && array[3])
						{
							tmpArray2[1] = array[1];
						}
					break;
					case PART_NSCN:
						if (array[3] === 1)
						{
							conductTo (nx, ny, tmpArray2);
						}
					break;
					}
				}
			}
		break;
		case PART_WIREWORLD:
			tmp = 0;
			for (var ry = -topBound; ry <= bottomBound; ry++)
			{
				tmpArray = pmap[ny=y+ry];
				for (var rx = -leftBound; rx <= rightBound; rx++)
				{
					tmpArray2 = tmpArray[nx=x+rx];
					switch (tmpArray2[0])
					{
					case PART_SPARK:
						if (tmpArray2[1] === 3 && tmpArray2[2] === PART_PSCN)
						{
							array[1] = 2; return;
						}
					break;
					case PART_NSCN:
						if (array[2] === 2) conductTo (nx, ny, tmpArray2);
					break;
					case PART_WIREWORLD:
						if (tmpArray2[2] === 2) tmp ++;
					break;
					}
				}
			}
			if (array[2] === 0 && (tmp === 1 || tmp === 2))
				array[1] = 2;
		break;
		case PART_WIFI:
			id = array[2]; // channel ID
			for (var ry = -topBound; ry <= bottomBound; ry++)
			{
				tmpArray = pmap[ny=y+ry];
				for (var rx = -leftBound; rx <= rightBound; rx++)
				{
					tmpArray2 = tmpArray[nx=x+rx];
					// wireless[] & 1 - whether channel is active on this frame
					// wireless[] & 2 - whether channel should be active on next frame
					if (wireless[id] & 1)
					{
						tmp = tmpArray2[0];
						if (tmp === PART_NSCN || tmp === PART_PSCN || tmp === PART_INSUL_WIRE)
							conductTo (nx, ny, tmpArray2);
					}
					if (tmpArray2[0] === PART_SPARK && tmpArray2[1] === 3 && tmpArray2[2] !== PART_NSCN)
					{
						wireless[id] |= 2;
						ISWIRE = 2;
					}
				}
			}
		break;
		case PART_ETRD:
			if (array[1] === 11)
			{
				for (var ry = -topBound; ry <= bottomBound; ry++)
				{
					tmpArray = pmap[ny=y+ry];
					for (var rx = -leftBound; rx <= rightBound; rx++)
					{
						tmpArray2 = tmpArray[nx=x+rx];
						if (((rx < 2 && rx > -2) || (ry < 2 && ry > -2)) && (tmpArray2[0] === PART_METAL || tmpArray2[0] === PART_CNDTR2 || tmpArray2[0] === PART_PSCN || tmpArray2[0] === PART_NSCN) && tmpArray2[1] <= 0)
						{
							conductTo (nx, ny, tmpArray2);
							hasConductor = true;
						}
					}
				}
				if (!hasConductor)
				{
					var xy = findNearestSparkableElectrode(x, y);
					nx = xy[0];
					if (nx >= 0)
					{
						ny = xy[1];
						createPlasmaArc(x, y, nx, ny) && (pmap[ny][nx][1] = 12);
					}
				}
			}
		break;
	}
}

function findNearestSparkableElectrode (x, y)
{
	var tmpArray, tmpArray2, xx, yy, retc = [-1], diff, mindiff = 1e4;
	for (var i = 0, l = Electrodes.length; i < l; i++)
	{
		tmpArray = Electrodes[i];
		tmpArray2 = pmap[yy = tmpArray[1]][xx = tmpArray[0]];
		if (tmpArray2[0] === PART_ETRD && tmpArray2[1] <= 0)
		{
			diff = (x>xx ? x-xx : xx-x) + (y>yy ? y-yy : yy-y);
			if (diff < mindiff)
			{
				mindiff = diff;
				retc[0] = xx;
				retc[1] = yy;
			}
		}
	}
	return retc;
}

function createPlasmaArc (x1, y1, x2, y2)
{
	var points = [], pointsL = 0;
	var reverseXY = Math.abs(y2-y1) > Math.abs(x2-x1), backw = false;
	var x, y, dx, dy, Ystep, e = 0, de, ta;
	if (reverseXY)
	{
		y = x1, x1 = y1, y1 = y;
		y = x2, x2 = y2, y2 = y;
	}
	if (x1 > x2)
	{
		y = x1, x1 = x2, x2 = y;
		y = y1, y1 = y2, y2 = y;
	}
	dx = x2 - x1;
	dy = Math.abs(y2 - y1);
	de = dy/dx;
	y = y1; Ystep = (y1<y2) ? 1 : -1;
	for (x=x1; x<=x2; x++)
	{
		ta = (reverseXY ? pmap[x][y] : pmap[y][x]);
		points[pointsL++] = ta;
		if (ta[0] === PART_INSUL)
		{
			return false;
		}
		e += de;
		if (e >= 0.5)
		{
			y += Ystep;
			e -= 1;
		}
	}
	for (x = 0; x < pointsL; x++)
	{
		ta = points[x];
		if (!ta[0] || (ta[0] === PART_RAY) && (ta[2] = 6))
		{
			ta[0] = PART_RAY;
			ta[1] = 20;
			ta[2] = 6;
		}
	}
	return true;
}


function cmp_conduct (type, array)
{
	return array[0] === type || array[0] === PART_SPARK && array[2] === type;
}

function floodINST (x, y, type)
{
	if (pmap[y][x][1])
		return 0;
	var xStack = [x];
	var yStack = [y];
	var ay1, ay2, ay3;
	var ny1, ny2, ny3;
	var xm1, xp1;
	var cy;
	var ptr = 1;
	var xx, x1, x2; // x bounds
	do
	{
		x1 = x2 = x = xStack[--ptr];
		y = yStack[ptr];
		cy = pmap[y];
		while ((xm1 = x1-1) >= 0)
		{
			// check left bound
			if (cy[xm1][0] !== type || cy[xm1][1])
				break;
			x1 = xm1;
		}
		while ((xp1 = x2+1) < width)
		{
			// check left bound
			if (cy[xp1][0] !== type || cy[xp1][1])
				break;
			x2 = xp1;
		}
		for (xx = x1; xx <= x2; xx++)
		{
			cy[xx][0] = PART_SPARK;
			cy[xx][1] = 4;
			cy[xx][2] = type;
		}
		ny1 = y - 1;
		ay1 = pmap[ny1];
		ny2 = y + 1;
		ay2 = pmap[ny2];

		if (x1 === x2 && cmp_conduct(type, ay1[x-1]) && cmp_conduct(type, ay1[x+1]) && cmp_conduct(type, ay1[x])
			&& cmp_conduct(type, (ay3 = pmap[ny3 = y-2])[x]) && !cmp_conduct(type, ay3[x-1]) && !cmp_conduct(type, ay3[x+1]))
		{
			if (ay3[x][0] === type && !ay3[x][1])
			{
				xStack[ptr] = x;
				yStack[ptr++] = ny3;
			}
		}
		else
		{
			for (xx = x1; xx <= x2; xx++)
			{
				if (ay1[xx][0] === type && !ay1[xx][1])
				{
					if (xx === x1 || xx === x2 || !cmp_conduct(type, ay2[xx]) || cmp_conduct(type, ay2[xx+1]) || cmp_conduct(type, ay2[xx-1]) )
					{
						xStack[ptr] = xx;
						yStack[ptr++] = ny1;
					}
				}
			}
		}
		
		if (x1 === x2 && cmp_conduct(type, ay2[x-1]) && cmp_conduct(type, ay2[x+1]) && cmp_conduct(type, ay2[x])
			&& cmp_conduct(type, (ay3 = pmap[ny3 = y+2])[x]) && !cmp_conduct(type, ay3[x-1]) && !cmp_conduct(type, ay3[x+1]))
		{
			if (ay3[x][0] === type && !ay3[x][1])
			{
				xStack[ptr] = x;
				yStack[ptr++] = ny3;
			}
		}
		else
		{
			for (xx = x1; xx <= x2; xx++)
			{
				if (ay2[xx][0] === type && !ay2[xx][1])
				{
					if (xx === x1 || xx === x2 || !cmp_conduct(type, ay1[xx]) || cmp_conduct(type, ay1[xx+1]) || cmp_conduct(type, ay1[xx-1]) )
					{
						xStack[ptr] = xx;
						yStack[ptr++] = ny2;
					}
				}
			}
		}
	}
	while (ptr);
}

var framenum = 0;
function simLoopFn ()
{
	if (!framenum)
	{
		run_frame ();
		framenum = 5;
	}
	if (!paused)
		requestAnimationFrame(simLoopFn);
	framenum--;
}

renderAll ();

window.run_frame  = run_frame;
window.simLoopFn  = simLoopFn;
window.clickPixel = clickPixel;

})();