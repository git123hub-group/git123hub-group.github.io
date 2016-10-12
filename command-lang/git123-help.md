# 帮助信息

## 命令
```
break            断点
terminate        终止

call             子程序调用
call:abs         绝对调用 (从上到下)
call:abs-last    绝对调用 (从下到上)
call:rel         相对调用
call:ret         从调用返回

execf            运行命令

goto             转移
goto:abs         绝对转移 (从上到下)
goto:abs-last    绝对转移 (从下到上)
goto:rel         相对转移

if               条件执行 (数字)
if_str           条件执行 (字符串)

loop             递减后条件转移
loop:inc         递增后条件转移
loop:dec         递减后条件转移

nextf            下一帧动画

set              设置变量
set:f            格式设置变量
set:a            设置变量 (评估表达式)
set:af           格式设置变量 (评估表达式)
set:p            设置变量 (输入)
set:pf           格式设置变量 (输入)
set:del          删除变量

write            输出
write:var        输出变量值
write:format     格式输出
writeln          输出并换行
writeln:format   格式输出并换行
clear            清除屏幕
```

## 内置变量
```
$~date$          当前日期
$~line$          换行符
$~random$        随机数
$~rdate$         主程序的运行时间 (单位: 毫秒)
$~space$         空格
$~tab$           制表符
$~time$          当前时间
$$               $ 符号
```

## 内置函数
```
$~expr$          评估表达式
```

## 变量替换
```
:str1=str2       字符串替换
:num1[,num2]     子字符串
:rev[erse]       字符串反转
:len[gth]        字符串长度
:bin             10 进制转换到  2 进制
:fbin             2 进制转换到 10 进制
:oct             10 进制转换到  8 进制
:foct             8 进制转换到 10 进制
:hex             10 进制转换到 10 进制
:fhex            16 进制转换到 10 进制
```
