#抽象工厂模式
---

>通过对类的工厂抽象使其业务用于对产品类簇的创建，而不负责创建某一类产品的实例
```
// 汽车抽象类，当使用其实例对象的方法时会抛出错误
var Car = function() {};
Car.prototype = {
  getPrice : function() {
    return new Error('抽象方法不能调用');
  },
  getSpeed : function() {
    return new Error('抽象方法不能调用');
  }
}

这个Car类什么都不能做，创建时没有任何属性，原型上的方法也不能使用，但是在继承上确实很有用的，因为定义了一种类，并定义了该类所必备的方法，如果在子类中没有重写这些方法，
那么当调用时能找到这些方法，便会报错。

抽象类的作用就是当继承该类的时候如果没有重写继承的方法，当调用这些方法的时候会有一个很好的提示。

```


>抽象工厂模式

```
// 抽象工厂方法
var VehicleFactory = function(subType, superType) {
  // 判断抽象工厂中是否有该抽象类
  if(typeof VehicleFactory[superType] === 'function') {
    //缓存类
    function F() {};
    // 继承父类属性和方法
    F.prototype = new VehicleFactory[superType]();
    // 将子类constructor指向子类
    subType.constructor = subType;
    // 子类原型继承"父类"
    subType.prototype = new F();
  } else {
    // 不存在该抽象类抛出错误
    throw new Error('未创建该抽象类');
  }
}
 
// 小汽车抽象类
VehicleFactory.Car = function() {
  this.type = 'car';
}
VehicleFactory.Car.prototype = {
  getPrice: function() {
    return new Error('抽象方法不能调用');
  }
  getSpeed: function() {
    return new Error('抽象方法不能调用');
  }
}

VehicleFactory.Bus = function() {
  this.type = 'bus';
}
VehicleFactory.Bus.prototype = {
  getPrice: function() {
    return new Error('抽象方法不能调用');
  }
  
  getSpeed: function() {
    return new Error('抽象方法不能调用');
  }
}


抽象工厂其实是一个实现子类继承父类的方法，在这个方法中我们需要通过传递子类以及要继承父类（抽象类）的名称，并且在抽象工厂方法中又增加了一次对抽象类存
在性的一次判断，如果存在，则将子类继承父类的方法。然后子类通过寄生式继承。

注意： 过渡类不是继承父类的原型，而是通过new关键字复制父类的一个实例，因为过度类不应仅仅继承父类的原型方法，还要继承父类的对象属性。
```

>抽象与实现

```
// 宝马汽车子类
var BMW = function(price,speed) {
  this.price = price;
  this.speed = speed;
}
// 抽象工厂实现对Car抽象类的继承
VehicleFactory(BMW,'Car');
BMW.prototype.getPrice = function() {
  return this.price;
}
BMW.prototype.getSpeed = function() {
  return this.speed;
}
