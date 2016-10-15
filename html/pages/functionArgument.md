##ECMAScript中所有函数的参数都是按值传递的
作者：*李梦仪*       
时间：*2016-10-14 16:35*

ECMAScript中所有函数的参数都是**按值传递**的。也就是说把函数外部的值复制给函数内部的参数(内部参数的值的修改不影响实参的值)。

**基本类型变量**的复制：
>基本类型变量的复制，仅仅是值复制，num1和num2的5是完全独立的。：
>``` javascript
>var num1 = 5;
>var num2 = num1;
>```

基本类型值(Undefined,Null,String,Number,Boolean)的传递如同基本类型变量的复制一样：
``` javascript
	function addTen(num){
		num += 10;
		return num;
	}
	var count = 20;
	var result = addTen(count);
	console.log(count); // 20,没有变化
	console.log(result);	// 30
```

**引用类型变量**的复制：
>引用类型变量的复制，复制的值其实是一个**指针**，而这个指针指向存储在堆中的一个变量，所以复制后obj1和obj2指向同一个堆中的变量。
>``` javascript
>var obj1 = new Object();
>var obj2 = obj1;
>obj1.name = "limengyi";
>console.log(obj2.name);	//"limengyi"
>```

引用类型值(Undefined,Null,String,Number,Boolean)的传递如同引用类型变量的复制一样：
``` javascript
	function setName(obj){
		obj.name= "limengyi";
	}
	var person = new Object();
	setName(person);
	console.log(person.name); // "limengyi"
```
在这个函数内部，obj和person引用的是同一个对象。
**有很多开发人员错误地认为：在局部作用域中修改的对象会在全局作用域中反应出来，就说明参数是按引用传递的。**
下面的例子可以证明对象是按值传递的：
``` javascript
1	function setName(obj){
2		obj.name= "limengyi";
3		obj = new Object();
4		obj.name = "lee";
5	}
6	var person = new Object();
7	setName(person);
8	console.log(person.name); // "limengyi" 而不是"lee"
```
实际上，当在函数内部重写obj时，这个变量(obj)引用的就是一个局部对象了。
（假设第6行的变量person和第2行的变量obj引用的是堆中的对象A，那第3行开始的变量obj引用的就是堆中的对象B了。）

-------------------
**更深一层**
对象变量之间的赋值是**传址赋值**，例：
``` javascript
	var student1={"name":"张三"};
	var student2=student1;		//传！址！赋！值！ student1和student2指向同一个对象
	student2.name="李四";
	console.log(student1.name);	//"李四"  不再是"张三"
	console.log(student2.name);	//"李四"
```
而在ES6中新增的一个关键字const(用于声明常量，类似于关键字var),它声明的变量值**不可变**，例：
``` javascript
	var Name = "张三";
	Name = "李四";	//报错，企图修改常量Name
```
而如果常量是一个对象的情况：
``` javascript
	const Student = {"name":"张三"};
	Student.name = "李四";
	Student.age = 21;
	console.log(Student);	//{name:"李四",age:21}  变！了！
```
这其实和上面的引用类型值的传递很像，在这里**不可修改的是对象在内存中的地址，而不是对象本身。**

综合引用类型值的传递和关键字const声明的对象变量的情况，可以说在很多情况下，能够帮助我们判断与对象相关的问题的是对象的地址的值，而不是对象的属性的值。


