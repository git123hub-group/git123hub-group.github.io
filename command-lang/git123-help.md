# 帮助信息


## 命令
```
break              断点
nextf              下一帧动画
terminate          终止

call               子程序调用
call:abs           绝对调用 (从上到下)
call:abs-last      绝对调用 (从下到上)
call:rel           相对调用
call:ret           从调用返回

cflag              先比较, 再把条件标志位设置为比较结果.
cflag:clear        条件标志位设置为 0
cflag:compl        条件标志位取反
cflag:pop          条件标志位出栈
cflag:push         条件标志位入栈
cflag:set          条件标志位设置为 1

execf              运行命令

goto               转移
goto:abs           绝对转移 (从上到下)
goto:abs-last      绝对转移 (从下到上)
goto:rel           相对转移

if                 条件执行 (数字)
if_flag            条件执行 (标志位)
if_str             条件执行 (字符串)
confirm            提示框执行
else               其他的条件执行

loop               递减后条件转移
loop:inc           递增后条件转移
loop:dec           递减后条件转移
loop:call          循环调用

rem                单行注释 (同 `#`)

set                设置变量
set:f              格式设置变量
set:a              设置变量 (评估表达式)
set:af             格式设置变量 (评估表达式)
set:p              设置变量 (输入)
set:pf             格式设置变量 (输入)
set:ln             设置变量 (代码行)
set:del            删除变量
set:push           变量值存储
set:pop            变量值取出

write              输出
write:var          输出变量值
write:readln       读取后输出
write:format       格式输出
write:multi        多行字符串 (无换行)
writeln            输出并换行
writeln:readln     读取后输出并换行
writeln:format     格式输出并换行
writeln:multi      多行字符串 (带换行)
alert              警告框
clear              清除屏幕
```

## 前缀符号
```
:        标记
#        单行注释
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
$~tline$         代码总行数
$$               $ 符号
```

## 内置函数
```
$~expr$          评估表达式
$~randr:a,b$     返回一个指定范围内的随机整数 (a - b)
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
:hex             10 进制转换到 16 进制
:fhex            16 进制转换到 10 进制
:chr             Unicode 值转换到字符
:ord             字符转换到 Unicode 值
:upper           转换到大写
:lower           转换到小写
:var             变量值
:fmt             变量的格式
```

# hello world
```
writeln hello world
```

# while 循环
```
if[_str] var1 op var2 loop:call tag1  (while)
goto tag2
:tag1
   code
   call:ret
:tag2
```

# do ... while 循环
```
:tag  (do)
   code
if[_str] var1 op var2 goto tag  (while)
```

# repeat ... until 循环
```
:tag  (repeat)
   code
if[_str]:not var1 op var2 goto tag  (until)
```
