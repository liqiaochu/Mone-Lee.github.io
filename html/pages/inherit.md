##JavaScript实现继承的4种方法
作者：*李梦仪*       
时间：*2016-10-22 9:15*

JavaScript实现继承有4中：

1、构造继承 2、原型继承 3、实例继承  4、拷贝继承

假设现在有一个构造函数“Animal”：
```javascript
	function Animal(){ this.species = "动物";  }
```
还有一个构造函数“Cat”：
```javascript
	function Cat(name,color){ 
		this.name = name;
		this.color = color;
	}
```
要使“Cat”继承“Animal”

**1、构造继承（使用call或apply方法）**

将父对象的构造函数绑定到子对象上，即在子对象的构造函数中加一行：
```javascript
	function Cat(name,color){ 

		Animal.apply(this,argument);

		this.name = name;
		this.color = color;
	}
	var cat1= new Cat("mimi","白");
	alert(cat1.species); //"动物"
```
其中**`Animal.apply(this,argument);`**的意思是使用Animal对象代替this对象。所以Cat中就有了Animal的所欲属性和方法，Cat对象就能够直接调用Animal的属性和方法了`cat1.species`。

**2、原型继承（prototype）**

**2.1、原型与原型链**

在实现继承之前，先来了解一下原型和原型链。

每个对象都会在其内部初始化一个属性，就是prototype（原型），当我们访问一个对象的属性时，如果这个对象内部不存在这个属性，那么他就会去prototype里找这个属性，这个prototype又会有自己的prototype，于是就这样一直找下去，也就是我们平时所说的**原型链**的概念。

关系：`instance.constructor.prototypt = instance._proto_;`

当我们需要一个需要一个属性时，JavaScript引擎会先看当前对象中是否有这个属性，如果没有的话，就会查找它的Prototype对象是否有这个属性，如此递推下去，一直检索到Object内建对象。

（其实和作用域链很相似，在当前作用域中没有找到某一属性或方法时，就会上溯到上一层作用域查找，直至全局变量。）

**2.2 使用prototype模式实现继承**

实现的本质是重写子类型的原型对象，代之以一个父类型的实例：
`SubType.prototype = new SuperType();`

```javascript
1	Cat.prototype = new Animal(); //实现继承，相当于完全删除了Cat的prototype对象原来的值
2   Cat.prototype.constructor = Cat;

3   var cat1 = new Cat("mimi","白");
4	alert(cat1.species); //"动物")
```

恩？既然在第一行就已经实现了继承，为什么要加第二行那行代码？

原因是：
任何一个prototype对象都有一个constructor属性，指向它的构造函数。

如果没有第一行的代码，Cat.prototype.constructor是指向Cat的；

但是有了第一行代码后，指向的就从Cat变成Animal(`alert(Cat.prototype.constructor == Animal); //true`);

而每一个实例也有一个constructor属性，默认调用prototype对象的constructor,即`cat1.constructor == Cat.prototype.constructor == Animal`;

但cat1明明是用构造函数Cat生成的（第三行代码），这说明发生了继承链紊乱，所以需要手动纠正，这才需要第二行代码。

**如果替换了prototype对象（o.prototype = {};），则一定要为新的prototype的constructor属性指回原来的构造函数（o.prototype.constructor = o;）**

**3、实例继承**

首先要改变一下父类型Animal，把不变的属性直接写入Animal.prototype，变成：
```javascript
	function Animal(){}
	Animal.prototype.species = "动物";
```
然后，使用空对象作为中介。
```javascript
	var F = function(){}；
	F.prototype = Animal.prototype;
	Cat.prototype = new F();
	Cat.prototype.constructor = Cat;
```

注意：如果不利用空对象F而直接`Cat.prototype = Animal.prototype;`则Cat.prototype和Animal.prototype都指向同一个对象，那**任何Cat.prototype的修改都会反映到Animal.prototype**，如最后一行（`Cat.prototype.constructor = Cat;`）就使得Animal.prototype.constructor == Cat！！！！

**4、拷贝继承**

将父对象的prototype对象中的属性，一一拷贝给子对象的prototype对象：
```javascript
	function extend(Child,Parent){
		var p = Parent.prototype;
		var c = Child.prototype;
		for( var i in p ){
			c[i] = p[i];
		}
		//意思是为子对象设一个uber属性，这个属性直接指向父对象的prototype属性。这等于在子对象上打开一条通道，可以直接调用父对象的方法。纯属备用性质。
		c.uber = p;	
	}
```
其中，`c.uber = p;`意思是为子对象设一个uber属性，这个属性直接指向父对象的prototype属性。这等于在子对象上打开一条通道，可以直接调用父对象的方法。纯属备用性质。


-------

原型prototype机制或apply和call方法去实现比较简单，建议使用构造函数与原型混合方式（**构造函数模式用于定义实例属性，而原型模式用于定义方法和共享的属性**）：
```javascript
	function Parent(){
		this.name = "limengyi";
	}
	function Child(){
		this.age = 21;
	}

	Child.prototype = new Parent(); //通过原型继承
	var demo = new Child();
	alert(demo.age);	//21
	alert(demo.name);

```





