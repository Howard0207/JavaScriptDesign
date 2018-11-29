#策略模式
>将定义的一组算法封装起来，使其相互之间可以替换。封装的算法具有一定独立性，不会随客户端变化而变化。

```
// 价格策略对象
var PriceStrategy = function() {
  // 内部对象算法
  var strategy = {

    // 100 返 30
    return30: function(price) {
      // parseInt可通过~~、|等运算符替换，要注意此时price要在[-2147483648,2147483647]之间
      // +price 转化为数字类型
      return +price + parseInt(price / 100) * 30;
    },

    // 100 返 50
    return50: function(price) {
      return +price + parseInt(price / 100) * 30;
    },

    // 9 折
    percent90: function(price) {
      // Javascript 在处理小鼠乘除法有bug，故运算前转化为整数。
      return price * 100 * 90 / 10000;
    }
  }
  // 策略算法调用接口
  return function(algorithm, price) {
    // 如果算法存在，则调用算法，否则返回false
    return strategy[algorithm]&&strategy[algorithm](price);
  }
}();

```

>策略模式从结构上看，与状态模式很像，也是在内部封装一个对象，然后通过返回的接口对象实现对内部对象的调用，不同的是，策略模式不需要管理状态、状态之间没有依赖关系、策略之间可以相互替换、在策略对象内部保存的是相互独立的算法。