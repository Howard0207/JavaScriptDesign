function Publisher_introduce() {
  this.subscribers = [];
}

Publisher_introduce.prototype.deliver = function (data) {
  this.subscribers.forEach(function (fn) {
    fn(data);
  });
  return this;
}
// 订阅
Function.prototype.subscriber = function (publisher) {
  var that = this;
  var alreadyExists = publisher.subscribers.some(
    function (el) {
      return el === that;
    }
  );
  if (!alreadyExists) {
    publisher.subscribers.push(this);
  }
  return this;
};

// 退订
Function.prototype.unsubscribe = function (publisher) {
  var that = this;
  publisher.subscribers = publisher.subscribers.filter(function (el) {
    return el !== that;
  });
  return this;
}

// 订阅者在监听到某种一次性的事件之后会在回调阶段立即退订该事件。
var publisherObject = new Publisher_introduce();
var observerObject = function (data) {
  console.log(data);
  arguments.callee.unsubscribe(publisherObject);
};

observerObject.subscribe(publisherObject);
















