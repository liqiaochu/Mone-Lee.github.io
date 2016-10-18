##JavaScript创建对象的6种方式
作者：*李梦仪*       
时间：*2016-10-18 14:41*

JavaScript创建对象简单的说，无非就是使用内置对象（Object）或各种自定义对象，当然还可以用JSON，但写法有很多种，也能混合使用。

**1、对象字面量的方式**

`person = {name : 'limengyi' , age = 21 };`

**2、用function来模仿无参构造函数**

```javascript
	function Person(){};

	//定义了一个function，如果使用new“实例化”，该function可以看作一个class
    var person = new Person();

    person.name = 'limengyi';
    person.age = 21;
    person.sayInfo = function(){
        alert("我叫 "+person.name+","+person.age+"岁");
    }

    person.sayInfo();
	
```

**3、用function来模拟有参构造函数**（用this关键字定义构造的上下文属性）

```javascript
	function Person(name,age){
        this.name=name;		//this作用域：当前对象
        this.age=age;
        this.sayInfo=function(){
            alert("我叫 "+this.name+","+this.age+"岁")
        }
    }

    var person = new Person('limengyi',21);

    person.sayInfo();
	
```

**4、用工厂方式来创建**（使用内置对象Object）

```javascript
	var person = new Object();

    person.name='limengyi';
    person.age=21;
    person.sayInfo=function(){
        alert("我叫 "+person.name+","+person.age+"岁")
    }

    person.sayInfo();
	
```

**5、用原型方法创建**

```javascript
	function Person(){};

    Person.prototype.name='limengyi';
    Person.prototype.age=21;
    Person.prototype.sayInfo=function(){
         alert("我叫 "+this.name+","+this.age+"岁")
    }
       
	var person = new Person();

    person.sayInfo();
	
```

**6、用混合方式（有参构造函数 + 原型方法）创建**

用有参构造函数设置每个实例特有的属性和方法
用原型方法设置所有实例共享的属性和方法

```javascript
	function Person(name,age){
        this.name=name;
        this.age = age;
    }

    Person.prototype.sayInfo=function(){
        alert("我叫 "+this.name+","+this.age+"岁")
    }
   
	var person1 = new Person('limengyi',21);
	var person2 = new Person('lee',12);

    person1.sayInfo();	//"我叫 limengyi,21岁"
    person2.sayInfo();	//"我叫 lee,12岁"
	
```
