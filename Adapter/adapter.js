var Duck = function(name){
  this.name = name;
};
Duck.prototype.fly = function(){
  throw new Error("该方法必须被重写!");
};
Duck.prototype.quack = function(){
  throw new Error("该方法必须被重写!");
}

var MallardDuck = function (name) {
  // Duck.apply(this,['docky']);
  this.name = name;
};
MallardDuck.prototype = new Duck(); //原型是Duck
MallardDuck.prototype.fly = function () {
  console.log(this.name)
  console.log("可以飞翔很长的距离!");
};
MallardDuck.prototype.quack = function () {
  console.log("嘎嘎！嘎嘎！");
};

var oMallardDuck = new MallardDuck("monkey");
console.log(oMallardDuck)
oMallardDuck.quack();
oMallardDuck.fly();
console.log(oMallardDuck.name)