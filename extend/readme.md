#子类的原型对象--类式继承
---
```
  function SuperClass() {
    this.superValue = true;
  }
  // 为父类添加共有方法
  SuperClass.prototype.getSuperValue = function() {
    return this.superValue;
  }
  // 声明子类
  function SubClass() {
    this.subValue = false;
  }
  // 继承父类
  SubVlass.prototype = new SuperVlass();
  // 为子类添加共有方法
  SubClass.prototype.getSubValue = function() {
    return this.subValue;
  }
```
######instanceof是通过判断对象的prototype链来确定这个对象是否是某个类的实例，而不关心对象与类的自身结构
```
 var instance = new SubClass();
 console.log(instance instanceof SubClass)   // true
 console.log(instance instanceof SuperClass) // true
 console.log(SubClass instanceof SuperClass) // false
```
>类式继承的缺陷
  1、由于子类通过其原型prototype对父类实例化，继承了父类。所以说父类中的共有属性要是引用类型，就会在子类中被所有实例共用，因此一个子类的实例更改子类原型从父类构造函数中继承来的共有属性就会直接影响到其他子类。
  2、其二，由于子类实现的继承是靠其原型prototype对父类的实例化实现的，因此在创建父类实例的时候，是无法向父类传递参数的，因而在实例化父类的时候也无法对父类构造函数内的属性进行初始化。

# 创建即继承--构造函数继承
---
```
  // 构造函数是继承
  // 声明父类
  function SuperClass (id) {
    // 引用类型共有属性
    this.books = ['JavaScript','java','html','css'];
    this.id = id;
  }
  // 父类声明原型方法
  SuperClass.prototype.showBooks = function() {
    console.log(this.books);
  }
  // 声明子类
  function SubClass(id) {
    // 继承父类
    SuperClass.call(this,id);
  }
  // 创建第一个子类的实例
  var instance1 = new SubClass(10);
  // 创建第二个子类的实例
  var instance2 = new SubClass(11);

  instance1.books.push('设计模式');
  console.log(instance1.books); // ['JavaScript','java','html','css','设计模式']
  console.log(instance1.id); // 10
  console.log(instance2.books); // ['JavaScript','java','html','css]
  console.log(instance2.id); // 11
```

>注意： 
  由于这种类型的继承是没有涉及原型prototype，所以父类的原型方法自然不会被子类继承，而如果想要被子类继承就必须放到构造函数中，这样创建出来的每个实例都会单独拥有一份而不能共用，这样就违背了代码复用的原则。
  综合以上两种模式的优点，后来有了组合式继承

#将优点为我所用--组合式继承
---
```
  // 组合式继承
  // 声明父类
  function SuperClass(name) {
    // 值类型共有属性
    this.name = name;
    // 引用类型共有属性
    this.books = ['html','css','javascript'];
  }
  // 父类原型共有方法
  SuperClass.prototype.getName = function() {
    console.log(this.name);
  }
  // 声明子类
  function SubClass(name,time) {
    // 构造函数式继承父类name属性
    SuperClass.call(this,name);
    // 子类中新增共有属性
    this.time = time;
  }
  // 类式继承 子类原型继承父类
  SubClass.prototype = new SuperClass();
  // 子类原型方法
  SubClass.prototype.getTime = function() {
    console.log(this.time);
  }
```
>缺点
  在使用构造函数继承是执行了一遍父类的构造函数，而在实现子类原型的类式继承时又调用了一遍父类构造函数。因此构造函数调用了两遍。
#洁净的继承者
---
> 借助原型prototype可以根据已有的对象创建一个新的对象，同时不必创建新的自定义对象类型。
```
  // 原型式继承
  function inheritObject() {
    // 声明一个过渡函数对象
    function F() {}
    // 过渡对象的原型继承父对象
    F.prototype = o;
    // 返回过渡对象的一个实例，该实例的原型继承了父对象
    return new F();
  }


  var book = {
    name: 'js book',
    alikeBook: ['css book','html book']
  };
  var newBook = inheritObject(book);
  newBook.name = 'ajax book';
  newBook.alikeBook.push('xml book');

  var otherBook = inheritObject(book;
  otherBook.name = 'flash book';
  otherBook.alikeBook.push('as book');

  console.log(newBook.name); //ajax book;
  console.log(newBook.alikeBook); // ['css book','html book','xml book','as book'];

  console.log(otherBook.name); // flash book
  console.log(otherBook.alikeBook); // ['css book','html book','xml book',as book'];

  console.log(book.name);// js book
  console.log(book.alikeBook); // ['css book','html book','xml book',as book'];
```

>优缺点
  这种方式由于F过渡类的构造函数中无内容，所以开销较小，使用起来也比较方便。
  缺点同样明显， 跟类式继承一样，父类对象book中的值类型的属性被复制，引用类型的属性被共用，亦会被更改。
#如虎添翼--寄生式继承
---
```
  // 寄生式继承
  // 声明基对象
  var book = {
    name: 'js book',
    alikeBook: ['css book','html book']
  };
  function createBook(obj) {
    // 通过原型继承方式创建新对象
    var o = new inheritObject(obj);
    // 拓展新对象
    o.getName = function() {
      console.log(name);
    };
    // 返回拓展后的新对象
    return o;
  }
```
> 其实，寄生式继承就是对原型继承的二次封装，并且在这第二次封装过程中对继承的对象进行了拓展，这样新创建的对象不仅仅有父类中的属性和方法而且还添加新的属性和方法。

#终极继承者--寄生组合式继承
```
  /*
  * 寄生式继承 继承原型
  * 传递参数 subClass 子类
  * 传递参数 superClass 父类
  */

  function inheritPrototype(subClass, superClass) {
    // 复制一份父类的原型副本保存在变量中
    var p = inheritObject(superClass.prototype);
    // 修正因为重写子类原型导致子类的constructor属性被修改
    p.constructor = subClass；
    // 设置子类的原型
    subClass.prototype = p;
  }

  // test case 
  // 定义父类
  function SuperClass(name) {
    this.name = name;
    this.colors = ['red','blue','green'];
  }

  // 定义父类原型方法
  SuperClass.prototype.getName = function() {
    console.log(this.name);
  }

  // 定义子类
  function SubClass(name,time) {
    SuperClass.call(this,name);
    this.time = time;
  }

  // 寄生式继承父类原型
  inheritPrototype(SubClass,SuperClass);
  
  // 子类新增原型方法
  SubClass.prototype.getTime = function() {
    console.log(this.time);
  }

  // 创建两个测试方法
  var instance1 = new SubClass('js book',2014);
  var instance2 = new SubClass('css book',2013);

  instance1.colors.push('black');

  console.log(instance1.colors); // ['red','blue','green','black']
  console.log(instance2.colors); // ['red','blue','green']
  instance2.getName(); // css book
  instance2.getTime(); // 2013

```

#多继承
---
```
// 单继承 属性复制
var extend = function(target, source) {
  //遍历源对象中的属性
  for(var property in source) {
    // 将源对象中的属性复制到目标对象中
    target[property] = source[property];
  }
  // 返回目标对象
  return target;
}
```
>注意：
 这个extend方法是一个浅复制过程，他只能复制值类型的属性，对于引用类型的属性它无能为力。

 ```
// 多继承 属性复制
var mix = function() {
  var i = 1,
    len = arguments.length,
    target = arguments[0],
    arg;
  // 遍历被继承的对象
  for (;i<len;i++) {
    // 缓存当前对象
    arg = arguments[i];
    for (var property in arg) {
      // 将被继承对象中的属性复制到目标对象中
      target[property] = arg[property];
    }
  }
  // 返回目标对象
  return target;
}
 ```
>以上代码均为浅拷贝，深拷贝代码如下，原理是将object类型转换成字符串这种值类型数据，通过JSON.parse转换成json对象。这是一种取巧的方式。
```
var extend = function(target,source) {
  for(var property in source) {
    if(typeof source[property] == 'object') {
      target[property] = JSON.parse(JSON.stringify(source[property]));
    } else {
      target[property] = source[property];
    }
  }
  return target;
}
```