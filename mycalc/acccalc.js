// 来自: js浮点数精度问题(js计算中遇到的坑) [ http://blog.csdn.net/DADADIE/article/details/50385146 ]

// 大多数语言在处理浮点数的时候都会遇到精度问题，但是在JS里似乎特别严重，来看一个例子:
//     alert(45.6*13);
// 结果居然是592.800000000001，当然加法之类的也会有这个问题.
// 那这是js的错误吗？
// 当然不是，你的电脑做着正确的二进制浮点运算，但问题是你输入的是十进制的数，电脑以二进制运算，这两者并不是总是转化那么好的，有时候会得到正确的结果，但有时候就不那么幸运了
// alert(0.7+0.1); //输出 0.7999999999999999
// alert(0.6+0.2); //输出 0.8
// 你输入两个十进制数，转化为二进制运算过后再转化回来，在转化过程中自然会有损失了

    // 两个浮点数求和  
    function accAdd(num1,num2){  
       var r1,r2,m;  
       try{  
           r1 = num1.toString().split('.')[1].length;  
       }catch(e){  
           r1 = 0;  
       }  
       try{  
           r2=num2.toString().split(".")[1].length;  
       }catch(e){  
           r2=0;  
       }  
       m=Math.pow(10,Math.max(r1,r2));  
       // return (num1*m+num2*m)/m;  
       return Math.round(num1*m+num2*m)/m;  
    }  
      
    // 两个浮点数相减  
    function accSub(num1,num2){  
       var r1,r2,m;  
       try{  
           r1 = num1.toString().split('.')[1].length;  
       }catch(e){  
           r1 = 0;  
       }  
       try{  
           r2=num2.toString().split(".")[1].length;  
       }catch(e){  
           r2=0;  
       }  
       m=Math.pow(10,Math.max(r1,r2));  
       n=(r1>=r2)?r1:r2;  
       return (Math.round(num1*m-num2*m)/m).toFixed(n);  
    }  
    // 两数相除  
    function accDiv(num1,num2){  
       var t1,t2,r1,r2;  
       try{  
           t1 = num1.toString().split('.')[1].length;  
       }catch(e){  
           t1 = 0;  
       }  
       try{  
           t2=num2.toString().split(".")[1].length;  
       }catch(e){  
           t2=0;  
       }  
       r1=Number(num1.toString().replace(".",""));  
       r2=Number(num2.toString().replace(".",""));  
       return (r1/r2)*Math.pow(10,t2-t1);  
    }  
    // 两数相乘 
    function accMul(num1,num2){  
       var m=0,s1=num1.toString(),s2=num2.toString();   
    try{m+=s1.split(".")[1].length}catch(e){};  
    try{m+=s2.split(".")[1].length}catch(e){};  
    return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m);  
    }  
