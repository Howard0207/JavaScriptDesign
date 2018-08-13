var Car = (function () {
  var Car = function (model, year, miles) {
    this.model = model;
    this.year = year;
    this.miles = miles;
  };
  return function (model, year, miles) {
    return new Car(model, year, miles);
  };
})();

var tom = new Car("Tom", 2009, 20000);
var dudu = Car("dudu", 2009, 20000);
dudu.age = 18;
console.log(tom)
console.log(dudu)