function click1(){var _;clinenum=0,mainprog=$("box1").value.split("\n"),breakpt=!1,delayf=!1,running=!1,parsed=!0,$("odoc1").innerHTML=outHtml="",changed=!1,tlines=mainprog.length,__user_vars__={},callstack=stack=[],callptr=0;for(var a=0,n=mainprog.length;n>a;++a)_=mainprog[a],":"===_.charAt(0)&&(__user_vars__["z"+_.slice(1)]=a)}function click2(){parsed||click1(),stepinto(),changed&&($("odoc1").innerHTML=outHtml),changed=!1,breakpt=!1}function click3(){for(parsed||click1(),running=!0;!breakpt;)stepinto();changed&&($("odoc1").innerHTML=outHtml),changed=!1,breakpt=!1,running&&delayf&&requestAnimationFrame(click3)}function stepinto(){try{var _;if((tmpline=clinenum)>=tlines)return parsed=!1,breakpt=!0,void(delayf=!1);if(tmpnl=clinenum+1,"#"===(_=mainprog[clinenum].charAt(0))||":"===_)return void++clinenum;for(var a=mainprog[clinenum];(_=mainprog[clinenum].match(/\\*$/))&&_[0].length%2===1;)a+="\n"+mainprog[++clinenum],++tmpnl;__expr_eval__(a),clinenum=tmpnl}catch(n){console.error(n),parsed=!1,breakpt=!0,delayf=!1}}var mainprog,clinenum,breakpt,delayf,parsed=!1,outHtml,changed,tmpnl,tlines,callstack,callptr,stack,running,tmpline;__variables__.print=function(_){outHtml+=escapeHTML(_),changed=!0},__variables__.println=function(_){outHtml+=escapeHTML(_)+"\n",changed=!0},__variables__.printf=function(){outHtml+=escapeHTML(sprintf.apply(null,arguments)),changed=!0},__variables__.sprintf=function(){return sprintf.apply(null,arguments)},__variables__.clear=function(_){outHtml="",changed=!0},__variables__.breakpoint=function(){breakpt=!0,delayf=!1},__variables__.jump=function(_){"string"==typeof _?tmpnl=__user_vars__["z"+_]:"number"==typeof _&&(tmpnl=tmpline+_)},__variables__.jumpc=function(_,a){a&&__variables__.jump(_)},__variables__.call=function(_){callstack[callptr++]=tmpnl,"string"==typeof _?tmpnl=__user_vars__["z"+_]:"number"==typeof _&&(tmpnl=tmpline+_)},__variables__["return"]=function(){return 0===callptr?(parsed=!1,breakpt=!0,void(delayf=!1)):void(tmpnl=callstack[--callptr])},__variables__.nextframe=function(){breakpt=delayf=!0},__variables__.sin=Math.sin,__variables__.sinh=Math.sinh||function(_){return(Math.exp(_)-Math.exp(-_))/2},__variables__.asin=Math.asin,__variables__.asinh=Math.asinh||function(_){return sgn=1,0>_&&(_=-_,sgn=-1),sgn*Math.log(_+Math.sqrt(_*_+1))},__variables__.cos=Math.cos,__variables__.cosh=Math.cosh||function(_){return(Math.exp(_)+Math.exp(-_))/2},__variables__.acos=Math.acos,__variables__.acosh=Math.acosh||function(_){return Math.log(_+Math.sqrt(_*_-1))},__variables__.tan=Math.tan,__variables__.tanh=Math.tanh||function(_){return _===1/0?1:_===-(1/0)?-1:(Math.exp(_)-Math.exp(-_))/(Math.exp(_)+Math.exp(-_))},__variables__.atan=Math.atan,__variables__.atan2=Math.atan2,__variables__.atanh=Math.atanh||function(_){return sgn=1,0>_&&(_=-_,sgn=-1),sgn*Math.log((1+_)/(1-_))/2},__variables__.cot=function(_){return 1/Math.tan(_)},__variables__.coth=function(_){return 1/__variables__.tanh(_)},__variables__.acot=function(_){return Math.atan(1/_)},__variables__.acoth=function(_){return __variables__.atanh(1/_)},__variables__.sqr=function(_){return _*_},__variables__.sqrt=Math.sqrt,__variables__.ln=Math.log,__variables__.log=function(_,a){return a||(a=10),Math.log(_)/Math.log(a)},__variables__.log1p=Math.log1p||function(_){return Math.log(_)+1},__variables__.log2=Math.log2||function(_){return Math.log(_)*Math.LOG2E},__variables__.lg=__variables__.log10=Math.log10||function(_){return Math.log(_)*Math.LOG10E},__variables__.exp=Math.exp,__variables__.expm1=Math.expm1||function(_){return Math.exp(_)-1},__variables__.pow=Math.pow,__variables__.mod=function(_,a){return _%a},__variables__.quotient=function(_,a){return(_-_%a)/a},__variables__.abs=function(_){return _>=0?_:-_},__variables__.sign=Math.sign||function(_){return _=+_,0===_||isNaN(_)?+_:_>0?1:-1},__variables__.ident=function(_){return _},__variables__.neg=function(_){return-_},__variables__.recip=function(_){return 1/_},__variables__.zero=function(){return 0},__variables__.one=function(){return 1},__variables__.floor=Math.floor,__variables__.ceil=Math.ceil,__variables__.trunc=Math.trunc||function(_){return _-_%1},__variables__.round=Math.round,__variables__.hypot=Math.hypot||function(){for(var _=0,a=arguments.length,n=0;a>n;n++){if(arguments[n]===1/0||arguments[n]===-(1/0))return 1/0;_+=arguments[n]*arguments[n]}return Math.sqrt(_)},__variables__.erf=function(_){var a=.140012,n=_*_,r=(4/Math.PI+a*n)/(1+a*n);return __variables__.sign(_)*Math.sqrt(1-Math.exp(-n*r))},__variables__.max=Math.max,__variables__.min=Math.min,__variables__.and=function(_,a){return _&&a},__variables__.bit_and=function(_,a){return _&a},__variables__.or=function(_,a){return _||a},__variables__.bit_or=function(_,a){return _|a},__variables__.not=function(_){return!_},__variables__.bit_not=function(_){return~_},__variables__.bit_xor=function(_,a){return _^a},__variables__["if"]=function(_,a,n){return _?a:n},__variables__.bit_sal=__variables__.bit_shl=function(_,a){return _<<a},__variables__.bit_sar=function(_,a){return _>>>a},__variables__.bit_shr=function(_,a){return _>>a},__variables__.equ=function(_,a){return _===a},__variables__.neq=function(_,a){return _!==a},__variables__.lss=function(_,a){return a>_},__variables__.leq=function(_,a){return a>=_},__variables__.gtr=function(_,a){return _>a},__variables__.geq=function(_,a){return _>=a},__variables__.pi=Math.PI,__variables__.e=Math.E,__variables__.phi=(Math.sqrt(5)+1)/2,__variables__.infinity=__variables__.Infinity=1/0,__variables__.NaN=NaN,__variables__["true"]=!0,__variables__["false"]=!1,__variables__["null"]=null,__variables__.undefined=void 0,__variables__.random=Math.random,__variables__.alert=function(_){alert(_)},__variables__.confirm=function(_){confirm(_)},__variables__.prompt=function(_,a){prompt(_,a)},__variables__.noop=function(){},__variables__.escape=escapeHTML,__variables__.unescape=function(_){var a={amp:"&",lt:"<",gt:">",quot:'"'};return(""+_).replace(/&([^;]+);/g,function(_,n){return"#"!==n.charAt(0)?a[n]:"x"!==n.charAt(1).toLowerCase()?String.fromCharCode(n.slice(1)):String.fromCharCode(parseInt(n.slice(2),16))})},__variables__.beginCSS=function(_){outHtml+='<span style="'+escapeHTML(_)+'">'},__variables__.endCSS=function(){outHtml+="</span>"},__variables__.multilineString=function(_){for(var a="",n=_;n>0;n--,++tmpnl)a+=mainprog[tmpnl]+"\n";return a},__variables__.assign=function(_,a){return __user_vars__["x"+_]=a},__variables__["delete"]=function(_){return delete __user_vars__["x"+_]},__variables__.indirect=function(_){return null==(tmp2=__user_vars__["x"+_])?__variables__[_]:tmp2},__variables__.arglen=function(){return arguments.length},__variables__.argjoin=function(_){return Array.prototype.slice.call(arguments,1).join(_)},__variables__.array=Array.of||function(){return Array.prototype.slice.call(arguments)},__variables__.method=function(_,a){return null!=_&&_[a]!==Function?_[a].apply(_,Array.prototype.slice.call(arguments,2)):void 0};