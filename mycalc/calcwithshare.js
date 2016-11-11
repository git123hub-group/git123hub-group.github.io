// <![CDATA[
	var BigNumber, pinit = true;
	var acccalc = document.createElement("script");
	acccalc.src = "bignumber.min.js";
	document.body.appendChild(acccalc);
	acccalc.onload = function () {
		BigNumber.set({ DECIMAL_PLACES: 25 });
		memory = ival = new BigNumber(0);
	}
	var memory, memstk = [];
	function pushmem () {
		memstk.push(memory);
		memory = ival
	}
	function popmem () {
		inputting = "0"
		document.getElementById("display1").value = ival = memory
		memory = memstk.length === 0 ? 0 : memstk.pop();
	}
	var inputting = "0", ival, havingDP = false;
	var OP_ADD = 0, OP_SUB = 1, OP_MUL = 2, OP_DIV = 3;
	var oplevel = [0,0,1,1,-1], nestParens = 0;
	function negateb () {
		var isneg = inputting.charAt(0) === "-";
		inputting = isneg ? inputting.slice(1) : "-" + inputting;
		ival = new BigNumber(inputting);
		document.getElementById("display1").value = inputting;
	}
	function evopr () {
		if (!isoprsmode) return;
		isoprsmode = false;
		if (oprsstk.length !== 0) {
			var lastOp = oprsstk.slice(-1)[0], OPR2 = OPR, tmp;
			while (oplevel[OPR] <= oplevel[lastOp]) {
				tmp = numstk.pop();
				var last1 = numstk.length - 1;
				switch (lastOp) {
					case OP_ADD:
						numstk[last1] = numstk[last1].add(tmp);
					break;
					case OP_SUB:
						numstk[last1] = numstk[last1].sub(tmp);
					break;
					case OP_MUL:
						numstk[last1] = numstk[last1].mul(tmp);
					break;
					case OP_DIV:
						numstk[last1] = numstk[last1].div(tmp);
					break;
				}
				// OPR2 = lastOp;
				oprsstk.pop();
				lastOp = oprsstk.slice(-1)[0];
			}
		}
		oprsstk.push(OPR);
	}
	function addparen () {
		if (!pinit) { alert ("Syntax Error."); return; }
		havingDP = false;
		isoprsmode && (oprsstk.push(OPR), isoprsmode = false);
		oprsstk.push(4);
		nestParens++;
		document.getElementById("display1").value = '"\x28" = ' + nestParens;
	}
	function evalparen () {
		havingDP = false;
		isoprsmode && oprsstk.push(OPR);
		var lastOp = oprsstk.slice(-1)[0], tmp, tmp2;
		numstk.push(ival), isoprsmode = false, inputting = "" + ival;
		(tmp2 = nestParens > 0) && --nestParens;
		while (oplevel[lastOp] >= 0) {
			tmp = numstk.pop();
			var last1 = numstk.length - 1;
			switch (lastOp) {
				case OP_ADD:
					numstk[last1] = numstk[last1].add(tmp);
				break;
				case OP_SUB:
					numstk[last1] = numstk[last1].sub(tmp);
				break;
				case OP_MUL:
					numstk[last1] = numstk[last1].mul(tmp);
				break;
				case OP_DIV:
					numstk[last1] = numstk[last1].div(tmp);
				break;
			}
			// OPR2 = lastOp;
			oprsstk.pop();
			lastOp = oprsstk.slice(-1)[0];
		}
		document.getElementById("display1").value = ival = numstk.pop();
		oprsstk.pop();
		return tmp2;
	}
	function evexpr () {
		while (evalparen()) ;
	}
	function entern (str) {
		evopr();
		inputting = (inputting === "0" ? str : inputting + str);
		ival = new BigNumber(inputting);
		document.getElementById("display1").value = inputting;
	}
	function enterdp () {
		evopr();
		havingDP || (inputting += ".");
		havingDP = true;
		ival = new BigNumber(inputting);
		document.getElementById("display1").value = inputting;
	}
	function backsp () {
		evopr();
		inputting.slice(-1) === "." && (havingDP = false);
		inputting = inputting.slice(0,-1);
		inputting === "" && (inputting = "0");
		ival = new BigNumber(inputting);
		document.getElementById("display1").value = inputting;
	}
	function mrecall () {
		evopr(); inputting = "0";
		document.getElementById("display1").value = ival = memory;
	}
	var numstk = [], oprsstk = [], isoprsmode = false, OPR;
	function addop(op) {
		if (!isoprsmode) {
			isoprsmode = true;
			numstk.push(ival);
		}
		OPR = op;
		inputting = "0";
		havingDP = false;
	}
	function sqrtkey () {
		ival = ival.sqrt();
		document.getElementById("display1").value = ival;
	}
	function allclear () {
		numstk = [], oprsstk = [], havingDP = isoprsmode = false, nestParens = ival = new BigNumber(0),
		document.getElementById("display1").value = inputting = "0";
	}
	function clear1 () {
		ival = new BigNumber(0), document.getElementById("display1").value = inputting = "0"; havingDP = false;
	}
	window._bd_share_config={"common":{"bdSnsKey":{},"bdText":"","bdMini":"2","bdMiniList":false,"bdPic":"","bdStyle":"0","bdSize":"32"},"slide":{"type":"slide","bdImg":"0","bdPos":"right","bdTop":"100"},"image":{"viewList":["qzone","tsina","tqq","renren","weixin"],"viewText":"分享到：","viewSize":"32"},"selectShare":{"bdContainerClass":null,"bdSelectMiniList":["qzone","tsina","tqq","renren","weixin"]}};with(document)0[(getElementsByTagName('head')[0]||body).appendChild(createElement('script')).src='https://git123hub.github.io/static/api/js/share.js?v=89860593.js?cdnversion='+~(-new Date()/36e5)];
// ]]>
