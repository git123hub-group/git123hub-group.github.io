/* ElectronicsCA.js */
var part_state = 1, paused = true;

(function () {

var width = 84, height = 68;
var pmap = [];

for (var i = height - 1; i >= 0; i--)
{
	pmap[i] = [];
	for (var j = width - 1; j >= 0; j--)
	{
		pmap[i][j] = new Int32Array(4);
	}
}

var canvas = document.getElementById("PartLayer");
var ctx = canvas.getContext("2d");
var colors = ["#000000", "#444466", "#FFFFCC", "#AAAAAA", "#805050", "#505080", "#003000", "#20CC20", "#108010", "#554040", "#40403C", "#858505", "#FFC000", "#FFFFFF", "#DCAD2C"];

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

var conduct  = [0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1];
var isswitch = [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0];

function clickPixel (x, y)
{
	x >= 82 && (x = 81);
	y >= 66 && (y = 65);
	
	var temp = pmap[y+1][x+1];
	if (part_state !== PART_SPARK)
	{
		if (!part_state)
		{
			temp[0] = 0;
			renderPixel (x+1, y+1, temp);
		}
		else if (!pmap[y+1][x+1][0])
		{
			temp[0] = part_state;
			temp[1] = 0;
			temp[3] = 0;
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
	var num;
	ctx.fillStyle = colors[array[0]];
	if (array[0] === PART_RAY && array[1])
	{
		if (array[2] !== 5)
		{
			ctx.fillStyle = "rgb(" + (num = (array[1] * 15.95) | 0) + "," + num + "," + num + ")";
		}
		else
		{
			ctx.fillStyle = "rgb(" + (num = (array[1] * 100) | 0) + "," + (num * 3 / 5) + "," + (num / 5) + ")";
		}
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
	for (var y = 0; y < height; y++)
	{
		part_y_index = 4 * y * width;
		for (var x = 0; x < width; x++)
		{
			if ((k = pmap[y][x])[1])
			{
				k[1] --;
				if (k[0] === PART_RAY && !k[1])
					k[0] = 0;
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
	var ctype, tmp, id, absID;
	var tmpArray, tmpArray2;
	var sender, receiver;
	var nxi, nyi, _xx, _yy;
	var nostop, destroy;
	var leftBound   = Math.min(2, x);
	var topBound    = Math.min(2, y);
	var rightBound  = Math.min(2, width  - x - 3);
	var bottomBound = Math.min(2, height - y - 3);
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
					switch (sender)
					{
					case PART_SWITCH_ON:
						if (receiver === PART_METAL || receiver === PART_SWITCH_ON)
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
								tmpArray2[1] = 4;
								tmpArray2[2] = PART_SWITCH_OFF;
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
							tmpArray2[1] = 4;
							tmpArray2[2] = PART_SWITCH_ON;
						}
						break;
					case PART_SWITCH_ON:
						if (sender !== PART_METAL)
						{
							if (sender === PART_NSCN)
							{
								tmpArray2[0] = PART_SWITCH_MID;
								tmpArray2[1] = 4;
								tmpArray2[2] = PART_SWITCH_OFF;
							}
							continue;
						}
						break;
					case PART_SWITCH_MID:
						if (tmpArray2[2] === PART_SWITCH_ON && tmpArray2[1] < 4 && sender === PART_METAL)
						{
							tmpArray2[0] = PART_SPARK;
							tmpArray2[1] = 4;
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
					}
					if (pmap[(y + ny)>>1][(x + nx)>>1][0] !== PART_INSUL)
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
			if (array[1] < 4)
			{
				for (var ry = -topBound; ry <= bottomBound; ry++)
				{
					tmpArray = pmap[y+ry];
					for (var rx = -leftBound; rx <= rightBound; rx++)
					{
						if ((rx > 0 ? rx : -rx) + (ry > 0 ? ry : -ry) >= 4) continue;
						tmpArray2 = tmpArray[nx=x+rx];
						if (isswitch[tmpArray2[0]] || tmpArray2[0] === PART_SPARK && isswitch[tmpArray2[2]]
							|| tmpArray2[0] === PART_SWITCH_MID && tmpArray2[2] == PART_SWITCH_ON)
						{
							tmpArray2[2] = array[2];
							tmpArray2[0] = PART_SWITCH_MID;
							tmpArray2[1] = 4;
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
					if (pmap[(y + ny)>>1][(x + nx)>>1][0] !== PART_INSUL && tmpArray2[0] !== PART_INSUL_WIRE)
					{
						conductTo (nx = x+rx, ny, tmpArray2);
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
					debugger;
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
								tmp[1] = destroy ? 2 : 16;
								tmp[2] = destroy ? 5 : absID;
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
										continue;
									}
									else if (tmp[2] === absID)
									{
										tmp[1] = 16;
										_xx += nxi; _yy += nyi;
										continue;
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
					x = checkCoordsX [k];
					y = checkCoordsY [k];
					if (checkBounds(x + rx, y + ry) && (tmpArray2 = pmap[y + ry][x + rx]) == PART_SPARK && tmpArray2[1] < 4)
					{
						conductTo (x, y, array);
					}
				}
			}
		break;
	}
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