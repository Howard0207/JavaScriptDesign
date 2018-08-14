var book = {
  name: 'js book',
  alikeBook: ['css book','html book']
}

function inheritObject(o) {
  // 声明一个过渡函数对象
  function F() {}
  // 过渡对象的原型继承父对象
  F.prototype = o;
  // 返回过渡对象的一个实例，该实例的原型继承了父对象
  return new F();
}

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

var newBook = createBook(book);
newBook.alikeBook.push('xml book');
var otherBook = createBook(book);
otherBook.alikeBook.push('as book');

// console.log(book.alikeBook);
// console.log(newBook.alikeBook);
// console.log(otherBook.alikeBook);


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

var target = {};
var source = {
  name: 'xiaoming',
  book: ['js','css','html'],
  school: {
    name: '剑桥',
    class: '3',
    grade: '3'
  },
  getName() {
    console.log(this.school.name);
  }
};
extend(target,source);

target.book.push('设计模式');
target.school.name = '清华大学';
console.log(target);
console.log(source);
target.getName();