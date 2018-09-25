#外观模式
>外观模式为一组复杂的子系统接口提供一个更高级的统一接口，通过这个接口使得对子接口的访问更加容易。在JavaScript中有时也会用于对底层结构兼容性做统一封装来简化用户使用。
```
// 外观模式实现
function addEvent(dom,type,fn) {
  // 对于支持DOM2级事件处理程序 addEventListener 方法的浏览器
  if(dom.addEventListener) {
    dom.addEventListener(type,fn,false);
  } else if( dom.attachEvent ) {
    // 对于不支持addEventListener方法但支持attachEvent方法的浏览器
    dom.attachEvent('on' + type, fn);
  } else {
    // 对于以上两种方法都不支持但支持 'on' + '事件名' 的浏览器
    dom['on'+type] = fn;
  }
}

// 使用外观模式解决IE低版本浏览器中不兼容e.preventDefault() 和 e.target。

// 获取事件对象
var getEvent = function() {
  // 标准浏览器返回event，IE 下 window.event
  return event.target || event.srcElement;
}

// 阻止默认行为
var preventDefault = function(event) {
  var event = getEvent(event);
  if(event.preventDefault) {
    // 标准浏览器
    event.preventDefault();
  } else {
  // IE 浏览器
    event.returnValue = false;
  }
}