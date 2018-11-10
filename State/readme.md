#状态模式（State）
```
当一个对象的内部状态发生改变时，会导致其行为的改变，这看起来像是改变了对象。
```
>应用场景：
  当一个对象有多种状态，而对应不同状态有不同的行为。此种情况使用if进行判断处理显然不合适。状态模式应运而生。

```
例子：
var MarryState = function() {
  // 内部状态的私有变量
  var _currentState = {},
      // 行为与状态的映射
      states = {
        jump: function() {
          console.log('jump')
        },
        run: function() {
          console.log('run')
        },
        shoot: function() {
          console.log('shoot')
        }
      };
  // 行为控制类
  var Action = {
    changeStates: function() {
      var arg = arguments;
      _currentState = {};
      if(arg.length) {
        // 遍历动作
        for(var i = 0; len = arg.length; i++) {
          _currentState[arg[i]] = true;
        }
      }
      return this;
    },

    excute: function() {
      for(var key in _currentState){
        states[key]&&states[key]();
      }
      return this;
    }
  }
}


状态类的整体结构分为三层：
  状态层： 状态映射行为
  管理层： 管理对象当前状态
  执行层： 执行状态对应动作

```

> 状态模式最终的目的是简化分支判断流程

