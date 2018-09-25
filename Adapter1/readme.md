#Adapter
>适配器模式:讲一个类(对象)的借口给(方法或者属性)转化成另一个接口，以满足用户需求，使类(对象)之间接口的不兼容问题通过适配器得以解决。

```
// 参数适配器
function doSomeThing(name,title,age,color,size,prize) {}
// 记住这些参数的顺序是很难的，所以经常以一个参数对象方式传入。
function doSomeThing(obj) {}
// 然而当调用它的时候又不知道传递的参数是否完整，如有一些必须参数没有传入，一些参数是有默认值的等等，此时我们通常使用适配器来适配传入的这个参数对象。

function doSomeThing(obj) {
  var _adapter = {
    name: 'mike',
    title: 'javaScript Design',
    color: 'pink',
    age: 24,
    size: 100
  };
  for(var i in obj) {
    _adapter[i] = obj[i] || _adapter[i];
  }

  // do things
}